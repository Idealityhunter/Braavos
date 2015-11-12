/**
 * 客户端的启动
 *
 * Created by zephyre on 10/23/15.
 */
Meteor.startup(()=> {
  // 定义客户端的schema
  const schema = BraavosCore.Schema;
  BraavosCore.Database.Braavos = {};
  const db = BraavosCore.Database.Braavos;

  db.Token = new Mongo.Collection("Token");
  db.Token.attachSchema(schema.Account.Token);
  db.Seller = new Mongo.Collection("Seller");
  db.Seller.attachSchema(schema.Marketplace.Seller);
  db.Commodity = new Mongo.Collection("Commodity");
  db.Commodity.attachSchema(schema.Marketplace.Commodity);

  BraavosCore.Database.Yunkai = {};
  const yunkai = BraavosCore.Database.Yunkai;
  yunkai.UserInfo = new Mongo.Collection("UserInfo");
  yunkai.UserInfo.attachSchema(schema.Account.UserInfo);
});
