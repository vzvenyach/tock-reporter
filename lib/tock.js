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
  var j = request.jar();
  var oauthproxy = process.env.OAUTHPROXY;
  var cookie = request.cookie('_oauthproxy=' + oauthproxy);
  var employee = this.employee;
  var url = 'https://tock.18f.gov/api/project_timeline.csv?user=' + employee;
  var date = this.date;
  j.setCookie(cookie, url);

  var results = [];

  var parser = csv({columns: true,newline: '\r\n',objectMode: true})
    .on('readable', function (){
      // TODO: Handle error if the data is not a csv
      while (p = parser.read()) {
        results.push(p);
      }
    })
    .on('end', function (){
      var x = results.filter(function (d){
        return d.start_date >= date;
      });
      console.log(isBillable(employee, x));
    })

  // Actually handle the request, using the magic of streams.
  request
    .get({url: url, jar:j})
    .pipe(parser);
};

var isBillable = function(employee, d) {
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
    
  return employee + ", " + Math.round(b/(n+b) * 100);
}

module.exports = Tock;