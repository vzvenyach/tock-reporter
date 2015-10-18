var csv = require('csv');
var request = require('request');

if (!process.env.OAUTHPROXY) {
  process.stdout.write("oauthproxy token not defined as environmental variable");
  process.exit(1);
}

var Tock = function (employee, date) {
  this.employee = employee;
  this.date = date;
  this.getHours().then(function (body){
    this.data = body;
  });
};

Tock.prototype.getHours = function () {
  var j = request.jar();
  var oauthproxy = process.env.OAUTHPROXY;
  var cookie = request.cookie('_oauthproxy=' + oauthproxy);

  var url = 'https://tock.18f.gov/api/project_timeline.csv?user=' + this.employee;
  var date = this.date;
  j.setCookie(cookie, url);

  return new Promise(
    function(resolve, reject) {
      request.get({url: url, jar: j}, function (err, resp, body){
        if (err) {reject (err);}
        csv.parse(body, {columns:true}, function (err, data){
          if (err) {reject (err);}
          var x = data.filter(function (d){
            return d.start_date >= date;
          });
          resolve(x);
        });
      });
    }
  );
};

Tock.prototype.billable = function (callback) {
  var employee = this.employee;
  this.getHours().then(function (d){
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
    
    callback(employee + ", " + Math.round(b/(n+b) * 100));
  });
}

module.exports = Tock;