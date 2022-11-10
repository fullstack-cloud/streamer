const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
  const range = req.headers.range;
  if (!range) {
    console.log("Range headers required.");
  }

  const videoPath = "song.mp4";
//   const videoSize = fs.statSync(videoPath).size();
  const videoSize = fs.statSync(videoPath)

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  
  res.writeHead(206,headers);

  const videoStream = fs.createReadStream(videoPath, {start,end});
  videoStream.pipe(res);
});

app.listen(8080, function () {
  console.log("Listening on 8080 PORT.");
});
