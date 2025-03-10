import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";
import { Request, Response } from "express";
import { AttendanceController } from "../../controllers/attendanceController";
import attendanceService from "../../services/attendanceService";

describe("AttendanceController", async () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};
  let responseStatusCode: number;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: function (code: number) {
        responseStatusCode = code;
        return mockResponse as Response;
      },
      json: function (result: any) {
        responseObject = result;
        return mockResponse as Response;
      },
    };
  });

  await describe("markAttendance", async () => {
    it("should return 400 if name is missing", async () => {
      mockRequest.query = { surname: "Doe" };

      await AttendanceController.markAttendance(
        mockRequest as Request,
        mockResponse as Response
      );

      assert.equal(responseStatusCode, 400);
      assert.equal(responseObject.error, "Name and surname are required");
    });

    it("should return 400 if surname is missing", async () => {
      mockRequest.query = { name: "John" };

      await AttendanceController.markAttendance(
        mockRequest as Request,
        mockResponse as Response
      );

      assert.equal(responseStatusCode, 400);
      assert.equal(responseObject.error, "Name and surname are required");
    });

    it("should return 200 and attendance record when successful", async () => {
      mockRequest.query = { name: "John", surname: "Doe" };
      const expectedResult = {
        message: "Attendance recorded",
        student: { name: "John", surname: "Doe" },
        timestamp: "mock-timestamp",
        file: "mock-file",
      };

      mock.method(
        attendanceService,
        "recordAttendance",
        async () => expectedResult
      );

      await AttendanceController.markAttendance(
        mockRequest as Request,
        mockResponse as Response
      );

      assert.deepEqual(responseObject, expectedResult);
    });
  });

  await describe("viewAttendance", async () => {
    it("should return 400 if date is missing", async () => {
      mockRequest.params = {};

      await AttendanceController.viewAttendance(
        mockRequest as Request,
        mockResponse as Response
      );

      assert.equal(responseStatusCode, 400);
      assert.equal(responseObject.error, "Date is required");
    });

    it("should return attendance records for given date", async () => {
      mockRequest.params = { date: "2023-11-14" };
      const expectedAttendance = {
        date: "2023-11-14",
        attendance: ["2023-11-14T10:00:00.000Z - John Doe"],
      };

      mock.method(
        attendanceService,
        "getAttendanceByDate",
        async () => expectedAttendance
      );

      await AttendanceController.viewAttendance(
        mockRequest as Request,
        mockResponse as Response
      );

      assert.deepEqual(responseObject, expectedAttendance);
    });
  });
});
