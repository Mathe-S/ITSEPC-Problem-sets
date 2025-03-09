import express, { Express } from "express";
import attendanceRoutes from "./routes/attendanceRoutes";
import path from "path";

const app: Express = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/turle", (req, res) => {
  res.sendFile(path.join(__dirname, "../../PS0/output.html"));
});

// Routes
app.use("/attendance", attendanceRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
