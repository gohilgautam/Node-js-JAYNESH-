const express = require("express");
const route = express.Router();

route.use("/restaurant", require("./restaurant.Routes"));
route.use("/menu", require("./menu.Routes"));
route.use("/order", require("./order.Routes"));
route.use("/admin", require("./admin.Routes"));

module.exports = route;