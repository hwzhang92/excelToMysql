node_xj = require("xls-to-json");
  node_xj({
    input: "excel/sample.xls",  // input xls 
    output: null // output json 
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });