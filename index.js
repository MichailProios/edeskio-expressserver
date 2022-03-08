const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const https = require("https");
const compression = require("compression");
const helmet = require("helmet");
const session = require("cookie-session");

app.use(
  compression({
    filter: function () {
      return true;
    },
  })
);

app.enable("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// app.use(function (req, res, next) {
//   if (!req.secure) {
//     res.redirect("https://" + req.headers.host + req.url);
//   } else {
//     next();
//   }
// });

app.use(cors());

// app.use(
//   session({
//     secret: "test5511",
//     httpOnly: true, // Don't let browser javascript access cookies.
//     secure: true, // Only use cookies over https.
//   })
// );

const root = require("path").join(__dirname, "build");
app.use(express.static(root));

app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

const httpsOptions = {
  key: fs.readFileSync("./security/key.pem"),
  cert: fs.readFileSync("./security/cert.pem"),
  // passphrase: "test",
};

const serverHttps = https.createServer(httpsOptions, app).listen(443, () => {
  console.log("HTTPS server listening on port " + 443);
});

// const serverHttp = http.createServer(app).listen(80, function () {
//   console.log("HTTP server listening on port " + 80);
// });
