/**
 * 处理和账户相关的Meteor methor
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

    if (Meteor.isServer) {
      const allowedFields = ["nickName", "signature"];
      const ops = {$set: _.pick(doc, allowedFields)};
      coll.update({userId: uid}, ops);
    } else {
      coll.update({userId: uid}, {$set: doc});
    }
  },

  /**
   * 更新商户信息
   * @param userId
   * @param doc
   */
  "account.sellerInfo.update": function (userId, doc) {
    const coll = BraavosCore.Database.Braavos.SellerInfo;
    const uid = parseInt(userId);
    if (isNaN(uid)) return;

    coll.update({userId: uid}, {$set: doc});
  }
});

