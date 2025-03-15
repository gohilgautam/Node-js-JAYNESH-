const express = require("express");
const path = require("path");

const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => 
  res.render("index")
);
app.get("/charts/chartjs", (req, res) =>
   res.render("pages/chartjs")
);
app.get("/forms/basic_elements", (req, res) =>
  res.render("pages/basic_elements")
);
app.get("/icons/font-awesome", (req, res) =>
  res.render("pages/font-awesome")
);
app.get("/samples/blank-page", (req, res) =>
  res.render("pages/blank-page")
);
app.get("/samples/error-404", (req, res) =>
  res.render("pages/error-404")
);
app.get("/samples/error-500", (req, res) =>
  res.render("pages/error-500")
);
app.get("/samples/login", (req, res) => res.render("pages/samples/login"));
app.get("/samples/register", (req, res) =>
  res.render("pages/register")
);
app.get("/tables/basic-table", (req, res) =>
  res.render("pages/basic-table")
);
app.get("/ui-features/buttons", (req, res) =>
  res.render("pageui-features/buttons")
);
app.get("/ui-features/dropdowns", (req, res) =>
  res.render("pages/dropdowns")
);
app.get("/ui-features/typography", (req, res) =>
  res.render("pages/typography")
);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
