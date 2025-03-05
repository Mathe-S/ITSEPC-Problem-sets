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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
