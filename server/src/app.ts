import express, { Express, Request, Response } from "express";
import path from "path";
import fs from "fs";

const app: Express = express();
const port = 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/output", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../PS0/output.html"));
});

const ATTENDANCE_DIR = path.join(__dirname, "../../attendance");
if (!fs.existsSync(ATTENDANCE_DIR)) {
  fs.mkdirSync(ATTENDANCE_DIR, { recursive: true });
}

app.get("/attendance", (req: Request, res: Response) => {
  const { name, surname } = req.query;

  if (!name || !surname) {
    res.status(400).json({
      error: "Name and surname are required",
    });
    return;
  }

  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    const attendanceFile = path.join(ATTENDANCE_DIR, `attendance_${today}.txt`);

    // Check if file exists and read it
    let existingAttendance: string[] = [];
    if (fs.existsSync(attendanceFile)) {
      existingAttendance = fs
        .readFileSync(attendanceFile, "utf8")
        .split("\n")
        .filter((line) => line.trim() !== "");
    }

    // Check if student already marked attendance today
    const studentFound = existingAttendance.some((record) => {
      const [, studentInfo] = record.split(" - ");
      return studentInfo?.toLowerCase() === `${name} ${surname}`.toLowerCase();
    });

    if (studentFound) {
      res.status(400).json({
        error: "Attendance already taken for today",
        student: {
          name: name,
          surname: surname,
        },
        date: today,
      });
      return;
    }

    // If not found, add new attendance record
    const timestamp = new Date().toISOString();
    const attendanceRecord = `${timestamp} - ${name} ${surname}\n`;
    fs.appendFileSync(attendanceFile, attendanceRecord);

    res.json({
      message: "Attendance recorded",
      student: {
        name: name,
        surname: surname,
      },
      timestamp: timestamp,
      file: `attendance_${today}.txt`,
    });
    return;
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).json({
      error: "Failed to record attendance",
    });
    return;
  }
});

// View attendance for a specific date
app.get("/view-attendance/:date", (req: Request, res: Response) => {
  const { date } = req.params;
  const attendanceFile = path.join(ATTENDANCE_DIR, `attendance_${date}.txt`);

  try {
    if (!fs.existsSync(attendanceFile)) {
      res.status(404).json({
        error: "No attendance records found for this date",
      });
      return;
    }

    const attendance = fs.readFileSync(attendanceFile, "utf8");
    res.json({
      date: date,
      attendance: attendance.split("\n").filter((line) => line.trim() !== ""),
    });
    return;
  } catch (error) {
    console.error("Error reading attendance:", error);
    res.status(500).json({
      error: "Failed to read attendance records",
    });
    return;
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
