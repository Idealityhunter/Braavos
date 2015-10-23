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
    const RegisterToken = BraavosCore.Database.Braavos.Collections.RegisterToken;
    RegisterToken.attachSchema(BraavosCore.Schema.RegisterToken);

    const uuid = Meteor.uuid();
    console.log(`UUID generated: ${uuid}`);

    const timestamp = new Date();
    // 默认情况下有效期为7天
    const expire = new Date(timestamp.getTime() + 7 * 24 * 3600 * 1000);
    RegisterToken.insert({token: uuid, timestamp: timestamp, expire: expire});

    return uuid;
  },

  /**
   * 检查一个token是否有效
   * @param token
   */
  'account.register.checkToken': (token) => {
    // TODO 魔术token
    if (token == 'lxp0601') {
      return {valid: true};
    }

    const ret = BraavosCore.Database.Braavos.RegisterToken.findOne(
      {token: token, valid: true, expire: {'$gt': new Date()}});
    return {valid: Boolean(ret)};
  }
});
