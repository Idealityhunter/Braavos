/**
 * 账号相关的
 *
 * Created by zephyre on 10/22/15.
 */

const Int64 = Meteor.npmRequire('node-int64');

Meteor.methods({
  /**
   * 生成一个注册token
   */
  'account.register.genToken': (tokenType) => {
    const Token = BraavosCore.Database.Braavos.Token;

    const uuid = Meteor.uuid();
    console.log(`UUID generated: ${uuid}`);

    const timestamp = new Date();
    // 默认情况下有效期为7天
    const expire = new Date(timestamp.getTime() + 7 * 24 * 3600 * 1000);
    Token.insert({token: uuid, tokenType: tokenType, timestamp: timestamp, expire: expire});

    return uuid;
  },

  /**
   * 检查一个token是否有效
   * @param token
   */
  'account.register.checkToken': (token) => {
    const ret = BraavosCore.Database.Braavos.Token.findOne(
      {token: token, valid: true, expire: {'$gt': new Date()}});
    return {valid: Boolean(ret)};
  },

  // 模拟登录
  "account.login": (user, password) => {
    const client = BraavosCore.Thrift.Yunkai.client;
    try {
      const userInfo = client.login(user, password, 'braavos');
      const userId = parseInt(userInfo.userId.toString());
      const sellerInfo = userInfo ? BraavosCore.Database.Braavos.Seller.findOne({sellerId: userId}) : undefined;
      return {user: {userId: userId, nickname: userInfo.nickName, avatar: userInfo.avatar}, seller: sellerInfo}
    } catch (err) {
      console.log(`Login failed: user=${user}, err=${err}`);
      throw err;
    }
  },

  // 新建用户
  "account.createUser": (email, password) => {
    const client = BraavosCore.Thrift.Yunkai.client;
    try {
      const user = client.createUserPoly("email", email, password, null);
      user.userId = parseInt(user.userId.toString());
      return user;
    } catch (err) {
      console.log(`Failed to create user: ${err}`);
      throw err;
    }
  },

  // 更改密码
  "account.changePassword": (oldPassword, newPassword) => {
    const client = BraavosCore.Thrift.Yunkai.client;
    const userId = parseInt(Meteor.userId());
    if (userId && !isNaN(userId)) {
      console.log(userId);
      client.resetPassword(new Int64(userId), oldPassword, newPassword);
    }
  }
});
