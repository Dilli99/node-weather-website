const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./utils/geoCode");
const forecast = require("./utils/forecast");

const app = express();

//Define paths for Express Config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.static(publicDirectoryPath));

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/help", (req, res) => {
  res.render("help");
});
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMsg: "Help article not found"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address"
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        });
      });
    }
  );
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMsg: "Page not found"
  });
});

app.listen(3000, () => {
  console.log("Listning to port 3000");
});
