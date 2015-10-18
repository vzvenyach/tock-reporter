var Tock = require('./lib/tock');
var fs = require('fs');
var timecards = JSON.parse(fs.readFileSync('employees.json','utf-8'));
var date = process.argv[2]

console.log('name,utilization_rate');
timecards.forEach(function (d) {
  t = new Tock(d,date);
  t.billable(function (x){
    console.log(x);
  });
});
