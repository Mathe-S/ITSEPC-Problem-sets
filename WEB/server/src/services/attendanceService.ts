import fs from "fs";
import path from "path";
import { ATTENDANCE_DIR } from "../config/constants";
import { getCurrentDate } from "../utils/dateUtils";

export class AttendanceService {
  static async recordAttendance(name: string, surname: string) {
    const today = getCurrentDate();
    const attendanceFile = path.join(ATTENDANCE_DIR, `attendance_${today}.txt`);

    let existingAttendance: string[] = [];
    if (fs.existsSync(attendanceFile)) {
      existingAttendance = fs
        .readFileSync(attendanceFile, "utf8")
        .split("\n")
        .filter((line) => line.trim() !== "");
    }

    const studentFound = existingAttendance.some((record) => {
      const [, studentInfo] = record.split(" - ");
      return studentInfo?.toLowerCase() === `${name} ${surname}`.toLowerCase();
    });

    if (studentFound) {
      throw {
        code: "ALREADY_MARKED",
        data: {
          error: "Attendance already taken for today",
          student: { name, surname },
          date: today,
        },
      };
    }

    const timestamp = new Date().toISOString();
    const attendanceRecord = `${timestamp} - ${name} ${surname}\n`;
    fs.appendFileSync(attendanceFile, attendanceRecord);

    return {
      message: "Attendance recorded",
      student: { name, surname },
      timestamp,
      file: `attendance_${today}.txt`,
    };
  }

  static async getAttendanceByDate(date: string) {
    const attendanceFile = path.join(ATTENDANCE_DIR, `attendance_${date}.txt`);

    if (!fs.existsSync(attendanceFile)) {
      throw {
        code: "NOT_FOUND",
      };
    }

    const attendance = fs.readFileSync(attendanceFile, "utf8");
    return {
      date,
      attendance: attendance.split("\n").filter((line) => line.trim() !== ""),
    };
  }
}

export default AttendanceService;
