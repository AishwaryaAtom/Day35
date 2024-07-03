import express from "express";
import connectToDb from "./db-utils/mongodb-connection.js";
import { mentorRouter } from "./routes/mentor.js";
import { studentRouter } from "./routes/student.js";

const server = express();

await connectToDb();

server.use(express.json());
server.use("/mentor", mentorRouter);
server.use("/student", studentRouter);

const port = 8000;

server.listen(port, () => {
  console.log("listening on port", port);
});
