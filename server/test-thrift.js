Meteor.startup(function () {
  var client = ThriftHelper.createClient(SmsCenter, '192.168.100.2', 9090, ['_ping', 'sendSms'], {
    transport:'framed'
  });
  console.log(client._ping());
  // console.log(client.sendSms('测试一下如何发送短信', ['15313380327']));
});
