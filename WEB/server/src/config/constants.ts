import path from "path";
import fs from "fs";

export const ATTENDANCE_DIR = path.join(__dirname, "../../../attendance");

// Create attendance directory if it doesn't exist
if (!fs.existsSync(ATTENDANCE_DIR)) {
  fs.mkdirSync(ATTENDANCE_DIR, { recursive: true });
}
