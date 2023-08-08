const express = require("express");
const app = express();
const cors = require("cors");
//env config
require('dotenv').config();

//db import
const dbConfig = require("./config/dbConfig");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoute");
const localadminRoute = require('./routes/localadminRoute')

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/localadmin", localadminRoute)


app.listen(5000, () => {
  console.log("Listening on port 5000");
});
