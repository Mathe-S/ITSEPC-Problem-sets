import { Request, Response } from "express";
import attendanceService from "../services/attendanceService";

/**
 * Controller for handling attendance-related HTTP requests
 */
export class AttendanceController {
  /**
   * Marks attendance for a student
   * @param req Express request containing name and surname as query parameters
   * @param res Express response
   * @returns JSON response with attendance record or error
   * @throws 400 if name/surname missing or attendance already marked
   * @throws 500 for server errors
   */
  static async markAttendance(req: Request, res: Response) {
    const { name, surname } = req.query;

    if (!name || !surname) {
      return res.status(400).json({
        error: "Name and surname are required",
      });
    }

    try {
      const result = await attendanceService.recordAttendance(
        name.toString(),
        surname.toString()
      );
      return res.json(result);
    } catch (error: any) {
      if (error.code === "ALREADY_MARKED") {
        return res.status(400).json(error.data);
      }
      return res.status(500).json({
        error: "Failed to record attendance",
      });
    }
  }

  /**
   * Retrieves attendance records for a specific date
   * @param req Express request containing date as route parameter
   * @param res Express response
   * @returns JSON response with attendance records or error
   * @throws 400 if date is missing
   * @throws 404 if no records found
   * @throws 500 for server errors
   */
  static async viewAttendance(req: Request, res: Response) {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        error: "Date is required",
      });
    }
    try {
      const attendance = await attendanceService.getAttendanceByDate(date);
      return res.json(attendance);
    } catch (error: any) {
      if (error.code === "NOT_FOUND") {
        return res.status(404).json({
          error: "No attendance records found for this date",
        });
      }
      return res.status(500).json({
        error: "Failed to read attendance records",
      });
    }
  }
}
