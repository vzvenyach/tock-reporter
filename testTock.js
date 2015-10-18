var tape = require('tape');
var Tock = require('./tock');

tape('testing Tock', function (t){
  var timecard = new Tock('vladlen.zvenyach','2015-10-01');
  t.equal(timecard.employee, 'vladlen.zvenyach','Timecard created');
  timecard.getHours().then(function (body){
    t.ok(body, 'getHours function runs');
  })
  timecard.billable(function (x){
    t.ok(x, 'billable function runs');
  });
  t.end();
})