var fs = require("fs");
/*
 * GET home page.
 */

exports.index = function(req, res){
  fs.createReadStream(__dirname + "/../public/html/index.html").pipe(res);
};