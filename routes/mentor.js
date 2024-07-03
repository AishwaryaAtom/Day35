import express from "express";
import { db } from "../db-utils/mongodb-connection.js";

const mentorRouter = express.Router();

// Create a Mentor
mentorRouter.post("/", async (req, res) => {
  try {
    let payload = req.body;
    await db.collection("mentor").insertOne({
      ...payload,
      id: Date.now().toString(),
    });
    res.status(201).send({ msg: "Mentor created successfully" });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

// Assign multiple students to a mentor
mentorRouter.post("/assign-students", async (req, res) => {
  try {
    const { mentorId, studentIds } = req.body;
    await db
      .collection("student")
      .updateMany({ id: { $in: studentIds } }, { $set: { mentorId } });
    res.status(200).send({ msg: "Students assigned to mentor successfully" });
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

// Get students without a mentor
mentorRouter.get("/students-without-mentor", async (req, res) => {
  try {
    const students = await db
      .collection("student")
      .find({ mentorId: null })
      .toArray();
    res.status(200).send(students);
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});

// Get all students for a particular mentor
mentorRouter.get("/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await db
      .collection("student")
      .find({ mentorId }, { projection: { _id: 0 } })
      .toArray();
    res.status(200).send(students);
  } catch (e) {
    res.status(500).send({ msg: "Server error" });
  }
});
export { mentorRouter };
