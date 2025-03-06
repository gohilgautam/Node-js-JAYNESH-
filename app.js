const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// In-memory storage for tasks (for simplicity)
let tasks = [];
let completedTasks = [];

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/tasks", (req, res) => {
  res.render("tasks", { tasks, completedTasks });
});

app.post("/add-task", (req, res) => {
  const { title, description } = req.body;
  tasks.push({ id: Date.now(), title, description, completed: false });
  res.redirect("/tasks");
});

app.post("/complete-task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const completedTask = tasks.splice(taskIndex, 1)[0];
    completedTask.completed = true;
    completedTasks.push(completedTask);
  }
  res.redirect("/tasks");
});

app.post("/delete-task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  res.redirect("/tasks");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
