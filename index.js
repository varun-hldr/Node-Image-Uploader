const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const HOME_URL = "https://my-image.herokuapp.com/";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    // origin: "https://agribazzar.herokuapp.com", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

// static path
app.use(express.static(__dirname + "/public/images"));

app.get("/", (req, res) => {
  res.send("Health OK");
});

app.post("/upload", (req, res) => {
  // To generate Random Name
  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const imageName = makeid(5);

  const imagefile = req.files.image;
  if (
    imagefile.mimetype === "image/jpeg" ||
    imagefile.mimetype === "image/png"
  ) {
    imagefile.mv(
      `${__dirname}/public/images/${imageName + imagefile.name}`,
      async (err, data) => {
        if (err) throw err;
        res.send({ url: HOME_URL + imageName + imagefile.name, message: null });
      }
    );
  } else {
    res.send({ message: "Please upload only .jpg and .png files only" });
  }
});

// Listen to the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server Running on " + PORT));
