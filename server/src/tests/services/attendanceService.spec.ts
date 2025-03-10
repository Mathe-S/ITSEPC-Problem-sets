// attendanceService.spec.ts
import { describe, it, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { AttendanceService } from "../../services/attendanceService";
import { ATTENDANCE_DIR } from "../../config/constants";
import * as utils from "../../utils/dateUtils";

describe("AttendanceService - Black Box Tests", async () => {
  const testDate = "2023-11-15";
  const testTimesampDateTime = "2023-11-15T14:30:00.000Z";
  const testAttendanceFile = path.join(
    ATTENDANCE_DIR,
    `attendance_${testDate}.txt`
  );

  // Mock getCurrentDate to return a consistent date for testing
  beforeEach(() => {
    mock.method(fs, "appendFileSync", () => {});
    mock.method(fs, "readFileSync", () => {
      return "";
    });
    mock.method(utils, "getCurrentDate", () => testDate);
    mock.method(Date.prototype, "toISOString", () => testTimesampDateTime);

    mock.method(fs, "existsSync", () => false);
  });

  afterEach(() => {
    mock.reset();
  });

  await describe("recordAttendance", async () => {
    it("should record attendance for a new student", async () => {
      const name = "John";
      const surname = "Doe";
      const expected = {
        message: "Attendance recorded",
        student: { name, surname },
        timestamp: testTimesampDateTime,
        file: `attendance_${testDate}.txt`,
      };

      mock.method(fs, "appendFileSync", () => {});
      mock.method(fs, "readFileSync", () => "");
      const result = await AttendanceService.recordAttendance(name, surname);
      assert.deepStrictEqual(
        result,
        expected,
        "Attendance record should match expected output"
      );
    });

    it("should throw ALREADY_MARKED if attendance already taken", async () => {
      const name = "John";
      const surname = "Doe";

      mock.method(fs, "existsSync", () => true);
      mock.method(
        fs,
        "readFileSync",
        () => "2023-11-15T10:00:00.000Z - John Doe\n"
      );
      // Wrap the async call in an async function for assert.rejects
      await assert.rejects(
        async () => {
          await AttendanceService.recordAttendance(name, surname);
        },
        {
          code: "ALREADY_MARKED",
          data: {
            error: "Attendance already taken for today",
            student: { name, surname },
            date: testDate,
          },
        },
        "Should throw ALREADY_MARKED error"
      );
    });
  });

  await describe("getAttendanceByDate", async () => {
    it("should return attendance records for a given date", async () => {
      const mockRecords =
        "2023-11-15T10:00:00.000Z - John Doe\n2023-11-15T11:00:00.000Z - Jane Smith\n";
      mock.method(fs, "existsSync", () => true);
      mock.method(fs, "readFileSync", () => mockRecords);
      const expected = {
        date: testDate,
        attendance: [
          "2023-11-15T10:00:00.000Z - John Doe",
          "2023-11-15T11:00:00.000Z - Jane Smith",
        ],
      };

      const result = await AttendanceService.getAttendanceByDate(testDate);
      assert.deepStrictEqual(
        result,
        expected,
        "Attendance records should match expected output"
      );
    });

    it("should throw NOT_FOUND if no records exist for the date", async () => {
      mock.method(fs, "existsSync", () => false);

      await assert.rejects(
        async () => {
          await AttendanceService.getAttendanceByDate(testDate);
        },
        { code: "NOT_FOUND" },
        "Should throw NOT_FOUND error"
      );
    });

    it("should return an empty array if file is empty", async () => {
      mock.method(fs, "existsSync", () => true);
      mock.method(fs, "readFileSync", () => ""); // Return empty string.
      const expected = {
        date: testDate,
        attendance: [], //<--- important!  Empty array, not an error.
      };

      const result = await AttendanceService.getAttendanceByDate(testDate);
      assert.deepStrictEqual(
        result,
        expected,
        "Attendance records should be empty array"
      );
    });
  });

  describe("edge cases", () => {
    it("should record attendance with special characters in names", async () => {
      const name = "O'Brian";
      const surname = "test-test";
      const expected = {
        message: "Attendance recorded",
        student: { name, surname },
        timestamp: testTimesampDateTime, // From our fixed mock Date
        file: `attendance_${testDate}.txt`,
      };

      mock.method(fs, "appendFileSync", () => {});
      mock.method(fs, "readFileSync", () => "");
      const result = await AttendanceService.recordAttendance(name, surname);
      assert.deepStrictEqual(
        result,
        expected,
        "Attendance record should match expected output"
      );
    });
  });
});
