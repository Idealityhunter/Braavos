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
  const coll = BraavosCore.Database.Braavos.Seller;
  const allowedFields = ["sellerId", "desc", "images", "lang", "serviceZone", "shopTitle", "contact", "address", "email"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});
  return coll.find({sellerId: userId}, fields);
});


/**
 * 发布商品列表信息
 */
Meteor.publish("commodities", function (options) {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database.Braavos.Commodity;
  const allowedFields = ["commodityId", "title", "desc", "seller"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});
  if (options && options.createTime){
    // 转化成Date对象
    options.createTime['$lte'] && (options.createTime['$lte'] = new Date(options.createTime['$lte']));
    options.createTime['$gte'] && (options.createTime['$gte'] = new Date(options.createTime['$gte']));
  }
  return coll.find(_.extend({'seller.sellerId': userId}, options), fields);
});


/**
 * 发布商品信息
 */
Meteor.publish("commodityInfo", function (commodityId) {
  const userId = parseInt(this.userId);
  const coll = BraavosCore.Database.Braavos.Commodity;
  const allowedFields = ["commodityId", "title", "seller", "country", "address", "category", "price", "marketPrice", "plans", "cover", "images", "notice", "refundPolicy", "trafficInfo", "desc"];
  const fields = _.reduce(allowedFields, (memo, f) => {
      memo[f] = 1;
  return memo;
}, {});
  return coll.find({commodityId: commodityId, 'seller.sellerId': userId}, fields);
})


/**
 * 发布国家列表信息
 */
Meteor.publish("countries", function () {
  const coll = BraavosCore.Database.Braavos.Country;
  const allowedFields = ["zhName", "pinyin", "code"];
  const fields = _.reduce(allowedFields, (memo, f) => {
    memo[f] = 1;
    return memo;
  }, {});
  return coll.find({}, fields, {sort: {'pinyin': 1}});
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
  return coll.find({'country.zhName': country}, fields, {sort: {'enName': 1}});
});