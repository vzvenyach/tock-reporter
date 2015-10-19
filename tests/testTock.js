var tape = require('tape');
var Tock = require('../lib/tock');

tape('testing Tock', function (t){
  var timecard = new Tock('vladlen.zvenyach','2015-10-01');
  t.equal(timecard.employee, 'vladlen.zvenyach','Timecard created');
  t.ok(timecard.getHours());
  t.end();
})