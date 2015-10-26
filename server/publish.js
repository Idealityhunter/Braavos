/**
 * Codes about server-side publishing
 *
 * Created by zephyre on 10/24/15.
 */

/**
 * 基本的用户信息, 包括昵称, userId, 头像等.
 */
Meteor.publish('basicUserInfo', function () {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database['Yunkai']['UserInfo'];
  return coll.find({userId: userId}, {nickName: 1, userId: 1, signature: 1, avatar: 1, gender: 1, tel: 1});
});

/**
 * 发布商户信息
 */
Meteor.publish("sellerInfo", function () {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database.Braavos.SellerInfo;
  const allowedFields = ["userId", "lang", "serviceZone", "shopTitle", "contact", "address", "email"];
  const fields = _.reduce(allowedFields, (memo, f)=> {
    memo[f] = 1;
    return memo;
  }, {});
  return coll.find({userId: userId}, fields);
});