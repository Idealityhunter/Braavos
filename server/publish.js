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
  return coll.find({userId: userId}, {fields: {nickName: 1, userId: 1, signature: 1, avatar: 1, gender: 1, tel: 1, roles: 1}});
});

/**
 * 发布商户信息
 */
Meteor.publish("sellerInfo", function () {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database.Braavos.Seller;
  const allowedFields = ["sellerId", "desc", "images", "lang", "serviceZone", "services","name", "address", "email", "phone"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});
  return coll.find({sellerId: userId}, {fields: fields});
});

/**
 * 发布商品列表信息
 * options: {
 *  isAdmin: boolean, 决定获取所有数据还是seller.sellerId: Meteor.userId()
 *  createTime:
 *  status:
 *  seller.sellerId:
 *  commodityId:
 * }
 */
Meteor.publish("commodities", function (options) {
  const userId = parseInt(this.userId);
  const commodityColl = BraavosCore.Database.Braavos.Commodity;

  // fields获取
  const allowedFields = ["commodityId", "title", "seller", "cover", "createTime", "status", "price", "plans"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  // 时间条件格式化
  if (options && options.createTime){
    options.createTime['$lte'] && (options.createTime['$lte'] = new Date(options.createTime['$lte']));
    options.createTime['$gte'] && (options.createTime['$gte'] = new Date(options.createTime['$gte']));
  };

  // 假如带有admin标志
  if (options.isAdmin) {
    options = _.omit(options, 'isAdmin');
    const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId});
    if (userInfo.roles && _.indexOf(userInfo.roles, 10) !== -1){
      return commodityColl.find(options, {fields: fields});
    };
  };

  return commodityColl.find(_.extend({'seller.sellerId': userId}, options), {fields: fields});
});


/**
 * 发布商品信息
 */
Meteor.publish("commodityInfo", function (commodityId) {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database.Braavos.Commodity;
  const allowedFields = ["commodityId", "title", "seller", "country", "address", "category", "price", "marketPrice", "plans", "cover", "images", "notice", "refundPolicy", "trafficInfo", "desc", "weightBoost"];
  const fields = _.reduce(allowedFields, (memo, f) => {
      memo[f] = 1;
  return memo;
}, {});
  return coll.find({commodityId: commodityId, 'seller.sellerId': userId}, {fields: fields});
});


/**
 * 发布国家列表信息
 */
Meteor.publish("countries", function () {
  const coll = BraavosCore.Database.Braavos.Country;
  const allowedFields = ["zhName", "enName", "pinyin", "code", "dialCode"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});
  return coll.find({}, {fields: fields, sort: {pinyin: 1}});
});

/**
 * 发布城市列表信息
 */
Meteor.publish("localities", function (country) {
  const coll = BraavosCore.Database.Braavos.Locality;
  const allowedFields = ["zhName", "country", "enName"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});
  return coll.find({'country.zhName': country}, {fields: fields, sort: {enName: 1}});
});


/**
 * 发布订单列表信息
 * options: {
 //*  isAdmin: boolean, 决定获取所有数据还是seller.sellerId: Meteor.userId()
 *  createTime:
 *  status:
 *  contact.sellerId:
 *  contact.tel:
      // 哪个国家
      countryCode: {
        type: String,
        regEx: /^[A-Z]{2}$/i,
        defaultValue: "CN"
      },
      // 国家代码
      dialCode: {
        type: Number,
        min: 1,
        defaultValue: 86
      },
      // 国内代码
      number: {
        type: Number,
        min: 1
      }:
 *  orderId:
 * }
 */
Meteor.publish("orders", function (options, isAdmin=false) {
  const userId = parseInt(this.userId);
  const orderColl = BraavosCore.Database.Braavos.Order;
  let notAdmin = true; // 记录检测结果

  // fields获取
  const allowedFields = ["orderId", "commodity", "consumerId", "quantity", "paymentInfo", "createTime", "updateTime", "expireDate", "status", "contact", "activities", "discount", "totalPrice"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  // 时间条件格式化
  if (options && options.createTime){
    options.createTime['$lte'] && (options.createTime['$lte'] = new Date(options.createTime['$lte']));
    options.createTime['$gte'] && (options.createTime['$gte'] = new Date(options.createTime['$gte']));
  };

  if (options && options.updateTime){
    options.updateTime['$lte'] && (options.updateTime['$lte'] = new Date(options.updateTime['$lte']));
    options.updateTime['$gte'] && (options.updateTime['$gte'] = new Date(options.updateTime['$gte']));
  };

  // 假如带有admin标志
  if (isAdmin) {
    const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId});
    if (userInfo.roles && _.indexOf(userInfo.roles, 10) !== -1){
      notAdmin = false;
    };
  };

  // 假如不是管理员,则只发布自己的订单
  if (notAdmin) _.extend(options, {'commodity.seller.sellerId': userId});

  // 手机号或者订单号的条件判断
  if (options.searchId) {
    const searchId = options.searchId;
    options = _.omit(options, 'searchId');
    return orderColl.find({
      $or: [_.extend({orderId: parseInt(searchId)}, options), _.extend({'contact.tel.number': parseInt(searchId)}, options), _.extend({'commodity.commodityId': parseInt(searchId)}, options)]
    }, {fields: fields});
  };

  return orderColl.find(options, {fields: fields});
});

/**
 * 发布订单信息
 */
Meteor.publish("orderInfo", function (orderId, isAdmin=false) {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database.Braavos.Order;
  const allowedFields = ["orderId", "commodity", "consumerId", "contact", "rendezvousTime", "expireDate", "quantity", "totalPrice", "comment", "planId", "discount", "paymentInfo", "status", "travellers", "activities"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  // 假如带有admin标志
  if (isAdmin) {
    const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId});
    if (userInfo.roles && _.indexOf(userInfo.roles, 10) !== -1){
      return coll.find({orderId: parseInt(orderId)}, {fields: fields});
    };
  };

  //return coll.find({orderId: parseInt(orderId)}, {fields: fields});

  // 只发布自己的订单
  return coll.find({orderId: parseInt(orderId), 'commodity.seller.sellerId': userId}, {fields: fields});
});

/**
 * 发布指定的用户信息
 * userIds: [userId]
 */
Meteor.publish("userInfos", function (userIds) {
  const coll = BraavosCore.Database.Yunkai.UserInfo;
  const allowedFields = ['nickName', 'gender', 'alias', 'userId', 'avatar'];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});

  return coll.find({userId: {$in: userIds}}, {fields: fields});
});

