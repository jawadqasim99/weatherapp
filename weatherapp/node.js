const http = require("http");
const request = require("request");
const fs = require("fs");
const homeFile = fs.readFileSync("index.html", "UTF-8");
const replaceVal = (tempVal, orgVal) => {
  let temrature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temrature = temrature.replace("{%tempmin%}", orgVal.main.temp_min);
  temrature = temrature.replace("{%tempmax%}", orgVal.main.temp_max);
  temrature = temrature.replace("{%loction%}", orgVal.name);
  temrature = temrature.replace("{%country%}", orgVal.sys.country);
  temrature = temrature.replace("{%condition%}", orgVal.weather[0].main);
  return temrature;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    request(
      "https://api.openweathermap.org/data/2.5/weather?lat=31.418715&lon=73.079109&appid=e20ce9df72dd15b441842cfaa4c638d3"
    )
      .on("data", (chunk) => {
        const obj = JSON.parse(chunk);
        const arrData = [obj];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log(err);
        res.end();
      });
  }
});
server.listen(8001, "127.0.0.1");
