/**
 * 在Server端处理和account有关的操作
 *
 * Created by zephyre on 10/23/15.
 */

/**
 * 自定义登录
 */
Accounts.registerLoginHandler('password', function (loginRequest) {
  const user = loginRequest.user;
  const password = loginRequest.password;
  const client = BraavosCore.Thrift.Yunkai.client;

  try {
    const userInfo = client.login(user, password, 'braavos');
    const userId = userInfo.userId.toString();

    //creating the token and adding to the user
    var stampedToken = Accounts._generateStampedLoginToken();
    //hashing is something added with Meteor 0.7.x,
    //you don't need to do hashing in previous versions
    var hashStampedToken = Accounts._hashStampedToken(stampedToken);

    Meteor.users.update(userId,
      {$push: {'services.resume.loginTokens': hashStampedToken}}, {upsert: true}
    );

    //sending token along with the userId
    return {
      userId: userId,
      token: stampedToken.token
    };
  } catch (err) {
    console.log(`Login failed: user=${user}`);
    return undefined;
    //return {error: err.toString()};
  }
});
