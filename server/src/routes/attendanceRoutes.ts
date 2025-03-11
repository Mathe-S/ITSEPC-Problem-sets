import express from "express";
import { AttendanceController } from "../controllers/attendanceController";

const router = express.Router();

router.get("/", AttendanceController.markAttendance);
router.get("/view/:date", AttendanceController.viewAttendance);

export default router;
