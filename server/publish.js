/**
 * Codes about server-side publishing
 *
 * Created by zephyre on 10/24/15.
 */

/**
 * 基本的用户信息, 包括昵称, userId, 头像等.
 */
Meteor.publish('basicUserInfo', function() {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database['Yunkai']['UserInfo'];
  return coll.find({userId: userId});
});