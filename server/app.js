const express = require("express");
const CLIENT_URL = "http://localhost:3000";
const cors = require("cors");
const path = require("path");
const app = express();
const port = 5000;
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/`);
  },
  filename: (req, file, cb) => {
    console.log(file);
    if (file.originalname == "resize") {
      cb(null, req.body.id + "_resize.png");
    } else cb(null, req.body.id + ".png");
  },
});
const upload = multer({ storage: storage });

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.post("/upload", upload.array("uploaded"), async (req, res) => {
  console.log(req.files);
  res.send("Hello World!");
});

app.get("/file/:id", upload.none(), async (req, res) => {
  const filePath = path.join(`uploads/${req.params.id}.png`);
  const stream = fs.createReadStream(filePath);
  const size = fs.statSync(filePath);
  res.setHeader("Content-Length", size.size);
  stream.on("open", () => {
    stream.pipe(res);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
