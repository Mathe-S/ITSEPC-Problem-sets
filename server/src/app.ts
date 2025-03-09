import express, { Express } from "express";
import attendanceRoutes from "./routes/attendanceRoutes";
import quizRoutes from "./routes/quizRoutes";
import path from "path";

const app: Express = express();
const port = 8000;

// Add middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/turtle", (req, res) => {
  res.sendFile(path.join(__dirname, "../../PS0/output.html"));
});

// Routes
app.use("/attendance", attendanceRoutes);
app.use("/quiz", quizRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
