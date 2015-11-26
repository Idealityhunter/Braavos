/**
 * 处理和账户相关的Meteor method
 *
 * Created by zephyre on 10/25/15.
 */
Meteor.methods({
  /**
   * 更新基础账号信息
   *
   * @param userId
   * @param doc
   */
  "account.basicInfo.update": function (userId, doc) {
    const coll = BraavosCore.Database.Yunkai.UserInfo;
    const uid = parseInt(userId);
    if (isNaN(uid)) return;

    const allowedFields = ["nickName", "signature", "avatar"];
    const ops = {$set: _.pick(doc, allowedFields)};
    try{
      coll.update({userId: uid}, ops);
    } catch (err) {
      // 如果不是由于未通过schema validation引起的错误, 则重新抛出, 不要捕获
      if (!err.validationContext) {
        throw err;
      }
    }
  },

  /**
   * 更新商户信息
   * @param userId
   * @param doc
   */
  "account.sellerInfo.update": function (userId, doc) {
    const coll = BraavosCore.Database.Braavos.Seller;
    const uid = parseInt(userId);
    if (isNaN(uid)) return;

    coll.update({sellerId: uid}, {$set: doc});
  }
});

