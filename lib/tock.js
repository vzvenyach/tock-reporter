var csv = require('csv-streamify');
var request = require('request');

if (!process.env.OAUTHPROXY) {
  process.stdout.write("oauthproxy token not defined as environmental variable");
  process.exit(1);
}

var Tock = function (employee, date) {
  this.employee = employee;
  this.date = date;
};

Tock.prototype.getHours = function () {
  var self = this;
  var j = request.jar();
  var oauthproxy = process.env.OAUTHPROXY;
  var cookie = request.cookie('_oauthproxy=' + oauthproxy);

  var url = 'https://tock.18f.gov/api/project_timeline.csv?user=' + self.employee;
  j.setCookie(cookie, url);

  var results = [];

  var parser = csv({columns: true,newline: '\r\n',objectMode: true})

  // Actually handle the request, using the magic of streams.
  request
    .get({url: url, jar:j})
    .pipe(parser)
    .on('data', function (data){
      if (data.start_date >= self.date) {
        results.push(data);      
      }
    })
    .on('end', function (data){
      process.stdout.write(self.isBillable(results) + "\n");
    })
};

Tock.prototype.isBillable = function(d) {
  var b = d.filter(function (x) {
    return x.billable == 'True'
  }).reduce(function (x, y){
    return x + parseFloat(y.hours_spent);
  }, 0);

  var n = d.filter(function (x) {
    return x.billable == 'False'
  }).reduce(function (x, y){
    return x + parseFloat(y.hours_spent);
  }, 0);
    
  return this.employee + ", " + Math.round(b/(n+b) * 100);
}

module.exports = Tock;