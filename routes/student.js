import express from "express";
import { db } from "../db-utils/mongodb-connection.js";

const studentRouter = express.Router();

// Create a student
studentRouter.post("/", async (req, res) => {
  try {
    let payload = req.body;
    await db.collection("student").insertOne({
      ...payload,
      id: Date.now().toString(),
      mentorId: null,
    });
    res.status(201).send({ msg: "Student created successfully" });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

//Get All Student

studentRouter.get("/", async (req, res) => {
  try {
    const students = await db
      .collection("student")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    res.send({ msg: "Students List", students });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

//Get Single Student

studentRouter.get("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await db
      .collection("student")
      .findOne({ id: studentId }, { projection: { _id: 0 } });
    res.send({ msg: "Student Info" + studentId, student });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

// Assign or change mentor for a student
studentRouter.post("/assign-mentor", async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    await db
      .collection("student")
      .updateOne({ id: studentId }, { $set: { mentorId } });
    res.status(200).send({ msg: "Mentor assigned to student successfully" });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});
// Show previously assigned mentor for a student
studentRouter.get("/:studentId/previous-mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await db.collection("student").findOne({ id: studentId });
    if (!student || !student.previousMentorId) {
      return res.status(404).send({ msg: "No previous mentor found" });
    }
    const mentor = await db
      .collection("mentor")
      .findOne({ id: student.previousMentorId });
    res.status(200).send(mentor);
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

// Assign or change mentor for a student with previous mentor tracking
studentRouter.post("/assign-mentor", async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    const student = await db.collection("student").findOne({ id: studentId });
    if (!student) {
      return res.status(404).send({ msg: "Student not found" });
    }

    await db
      .collection("student")
      .updateOne(
        { id: studentId },
        { $set: { mentorId, previousMentorId: student.mentorId || null } }
      );
    res.status(200).send({ msg: "Mentor assigned to student successfully" });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});
export { studentRouter };
