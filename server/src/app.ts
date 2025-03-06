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

    // Create attendance record
    const timestamp = new Date().toISOString();
    const attendanceRecord = `${timestamp} - ${name} ${surname}\n`;

    // Append to file (creates file if it doesn't exist)
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
