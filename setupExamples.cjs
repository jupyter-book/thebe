const fs = require("fs");
const ncp = require("ncp").ncp;
fs.mkdirSync("examples/_static/lib", { recursive: true });
ncp("lib/", "examples/_static/lib", function (err) {
  if (err) return console.error(err);
  console.log("lib/ folder copied to examples/_static/lib.");
});
