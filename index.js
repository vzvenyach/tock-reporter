var Tock = require('./tock');
var fs = require('fs');
var timecards = JSON.parse(fs.readFileSync('employees.json','utf-8'));

console.log('name,utilization_rate');
timecards.forEach(function (d) {
  t = new Tock(d,'2015-07-01');
  t.billable(function (x){
    console.log(x);
  });
});
