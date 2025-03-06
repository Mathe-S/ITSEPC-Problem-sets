import express, { Express, Request, Response } from "express";
import path from "path";

const app: Express = express();
const port = 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/output", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../PS0/output.html"));
});

app.get("/attendance", (req: Request, res: Response) => {
  const { name, surname } = req.query;

  if (!name || !surname) {
    return res.status(400).json({
      error: "Name and surname are required",
    });
  }

  // Here we will typically save this to a database
  // For now, we'll just send back a confirmation
  return res.json({
    message: "Attendance recorded",
    student: {
      name: name,
      surname: surname,
    },
    timestamp: new Date(),
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
