const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const db = require("./config/keys").mongoURI;

const app = express();
app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
require("./config/passport")(passport);

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`connected to ${db}`);
  })
  .catch((err) => console.log(`Unable to connect to db ${err}`));

app.use("/api/", require("./routes/auth/auth"));
app.use("/api/admin", require("./routes/admin/admin.router"));

// app.get('*', (req , res) =>{
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`server listening ${port}`);
