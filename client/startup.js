/**
 * 客户端的启动
 *
 * Created by zephyre on 10/23/15.
 */
Meteor.startup(()=> {
  // 初始化winston
  {
    const levelList = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
    const func = (level, logger) => (message => {
      const levelId = _.indexOf(levelList, level);
      const minLevelId = _.indexOf(levelList, logger.level);
      if (levelId != -1 && levelId >= minLevelId) {
        // silly, debug和verbose这三种日志级别, 都是用console.debug来处理
        if (level in ['silly', 'debug', 'verbose']) {
          level = 'debug';
        }
        console[level](message);
      }
    });
    const logger = {
      // 默认的level
      level: ((Meteor.settings.public || {}).logging || {}).level || 'info'
    };

    BraavosCore.logger = _.reduce(levelList, (obj, level) => {
      obj[level] = func(level, obj);
      return obj;
    }, logger);
  }

  // 定义客户端的schema
  const schema = BraavosCore.Schema;
  BraavosCore.Database.Braavos = {};
  const db = BraavosCore.Database.Braavos;

  db.Token = new Mongo.Collection("Token");
  db.Token.attachSchema(schema.Account.Token);
  db.Seller = new Mongo.Collection("Seller");
  db.Seller.attachSchema(schema.Marketplace.Seller);
  db.TransactionLog = new Mongo.Collection('TransactionLog');
  db.TransactionLog.attachSchema(schema.Finance.TransactionLog);
  db.Commodity = new Mongo.Collection("Commodity");
  db.Commodity.attachSchema(schema.Marketplace.Commodity);
  db.Order = new Mongo.Collection("Order");
  db.Order.attachSchema(schema.Marketplace.Order);
  db.CommoditySnapshot = new Mongo.Collection("CommoditySnapshot");
  db.CommoditySnapshot.attachSchema(schema.Marketplace.Commodity);
  db.Country = new Mongo.Collection("Country");
  db.Country.attachSchema(schema.Geo.Country);
  db.Locality = new Mongo.Collection("Locality");
  db.Locality.attachSchema(schema.Geo.Locality);
  db.Column = new Mongo.Collection("Column");
  db.Column.attachSchema(schema.Activity.Column);

  BraavosCore.Database.Yunkai = {};
  const yunkai = BraavosCore.Database.Yunkai;
  yunkai.UserInfo = new Mongo.Collection("UserInfo");
  yunkai.UserInfo.attachSchema(schema.Account.UserInfo);

  BraavosCore.Database.Hedy = {};
  const hedy = BraavosCore.Database.Hedy;
  hedy.ConversationView = new Mongo.Collection("ConversationView");
  hedy.ConversationView.attachSchema(schema.Talk.ConversationView);
  hedy.Message = new Mongo.Collection("Message");
  hedy.Message.attachSchema(schema.Talk.Message);
  hedy.Conversation = new Mongo.Collection("Conversation");
});
