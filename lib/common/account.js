/**
 * 和账号相关的公共函数
 *
 * Created by zephyre on 2/1/16.
 */

BraavosCore.Utils.account.isAdmin = (userId) => {
  userId = userId || parseInt(Meteor.userId());
  const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: userId}, {fields: {roles: 1}}) || {};
  const adminRole = 10;
  return userInfo.roles && _.indexOf(userInfo.roles, adminRole) != -1;
};
