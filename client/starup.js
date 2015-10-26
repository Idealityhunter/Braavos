/**
 * 客户端的启动
 *
 * Created by zephyre on 10/23/15.
 */
Meteor.startup(()=> {
  const Schema = BraavosCore.Schema;

  BraavosCore.Database.Braavos = {};
  const Braavos = BraavosCore.Database.Braavos;
  Braavos.RegisterToken = new Mongo.Collection("RegisterToken");
  Braavos.RegisterToken.attachSchema(Schema.RegisterToken);
  Braavos.SellerInfo = new Mongo.Collection("SellerInfo");
  Braavos.SellerInfo.attachSchema(Schema.SellerInfo);

  BraavosCore.Database.Yunkai = {};
  const Yunkai = BraavosCore.Database.Yunkai;
  Yunkai.UserInfo = new Mongo.Collection("UserInfo");
  Yunkai.UserInfo.attachSchema(Schema.UserInfo);
});

