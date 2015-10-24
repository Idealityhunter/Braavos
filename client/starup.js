/**
 * 客户端的启动
 *
 * Created by zephyre on 10/23/15.
 */

Meteor.startup(()=> {
  BraavosCore.Database.Braavos = {};
  BraavosCore.Database.Yunkai = {};

  const Yunkai = BraavosCore.Database.Yunkai;
  Yunkai.UserInfo = new Mongo.Collection('UserInfo');


});

