const express = require("express");
const route = express.Router();

route.use("/restaurant", require("./restaurantRoute"));
route.use("/menu", require("./menuRoute"));
route.use("/order", require("./orderRoutes"));
route.use("/auth", require("./adminRoutes"));

module.exports = route;