/**
 * 账号相关的
 *
 * Created by zephyre on 10/22/15.
 */

Meteor.methods({
  /**
   * 生成一个注册token
   */
  'account.register.genToken': () => {
    const driver = new MongoInternals.RemoteCollectionDriver(BraavosCore.Database['braavos']['url']);
    const Tokens = new Mongo.Collection('RegisterToken', {_driver: driver});
    const RegisterToken = BraavosCore.Schema.RegisterToken;
    Tokens.attachSchema(RegisterToken);

    const uuid = Meteor.uuid();
    console.log(`UUID generated: ${uuid}`);

    const timestamp = new Date();
    // 默认情况下有效期为7天
    const expire = new Date(timestamp.getTime() + 7 * 24 * 3600 * 1000);
    Tokens.insert({token: uuid, timestamp: timestamp, expire: expire});

    return uuid;
  },

  /**
   * 检查一个token是否有效
   * @param token
   */
  'account.register.checkToken': (token) => {
  }
});
