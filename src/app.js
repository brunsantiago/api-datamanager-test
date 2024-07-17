const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const employeesRoutes = require("./routes/employees.routes.js");
const indexRoutes = require("./routes/index.routes.js");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Routes
app.use("/", indexRoutes);
app.use("/api", employeesRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

//export default app;
module.exports = app;
