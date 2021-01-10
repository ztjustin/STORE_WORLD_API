require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const app = express();
const i18n = require("i18n");
const initMongo = require("./config/mongo");
const cookieParser = require("cookie-parser");
const path = require("path");

// Setup express server port from ENV, default: 3000
app.set("port", process.env.PORT || 3000);

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// var allowedOrigins = [
//   "http://localhost:3000",
//   "https://nextjs-auto-cr-app.vercel.app",
//   "https://nextjs-auto-cr-app-git-main.ztjustin.vercel.app",
//   "https://nextjs-auto-cr-app.ztjustin.vercel.app",
// ];

// Redis cache enabled by env variable
if (process.env.USE_REDIS === "true") {
  const getExpeditiousCache = require("express-expeditious");
  const cache = getExpeditiousCache({
    namespace: "expresscache",
    defaultTtl: "1 minute",
    engine: require("expeditious-engine-redis")({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  });
  app.use(cache);
}

// for parsing json
app.use(
  bodyParser.json({
    limit: "20mb",
  })
);
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
  })
);

// i18n
i18n.configure({
  locales: ["en", "es"],
  directory: `${__dirname}/locales`,
  defaultLocale: "en",
  objectNotation: true,
});
app.use(i18n.init);

// Init all other stuff
app.use("/images", express.static(path.join("/public/images")));
app.use(express.json({ extented: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
app.use(compression());
app.use(helmet());
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.use(require("./app/routes"));
app.listen(app.get("port"));

// Init MongoDB
initMongo();

module.exports = app; // for testing
