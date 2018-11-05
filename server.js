const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const customers = require("./routes/api/customers");
const projects = require("./routes/api/projects");
const projectlocations = require("./routes/api/projectlocations");
const employees = require("./routes/api/employees");
const schedule = require("./routes/api/schedule");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDb
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/customers", customers);
app.use("/api/projects", projects);
app.use("/api/projectlocations", projectlocations);
app.use("/api/employees", employees);
app.use("/api/schedule", schedule);

app.get("/", function(req, res) {
  res.send("hello! This is a test page!");
});

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
