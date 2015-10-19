Meteor.startup(function () {
  var service = Npm.require('smscenter');
  var SmsCenter = service.SmsCenter;

  var client = ThriftHelper.createClient(SmsCenter, 'localhost', 9090, ['_ping', 'sendSms'], {
    transport:'framed'
  });
  console.log(client._ping());
});
