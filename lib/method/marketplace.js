/**
 *
 * Created by zephyre on 11/13/15.
 */

Meteor.methods({
  /**
   * 更新商户信息
   * @param sellerId
   * @param doc
   */
  "marketplace.seller.update": function (sellerId, doc) {
    const coll = BraavosCore.Database.Braavos.Seller;
    const uid = parseInt(sellerId);
    if (isNaN(uid)) return;

    const allowedFields = ["name"];
    //const ops = {$set: _.pick(doc, allowedFields)};
    const ops = {$set: doc};
    try {
      coll.update({sellerId: uid}, ops);
    } catch (err) {
      // 如果不是由于未通过schema validation引起的错误, 则重新抛出, 不要捕获
      if (!err.validationContext) {
        throw err;
      }
    }
  },

  /**
   * 更新商户的语言设置
   * @param sellerId
   * @param action add/remove
   * @param lang en/zh/local
   */
  //"marketplace.seller.updateLang": function (sellerId, action, lang) {
  //  const coll = BraavosCore.Database.Braavos.Seller;
  //  const uid = parseInt(sellerId);
  //  if (isNaN(uid)) return;
  //
  //  if (action == "add") {
  //    coll.update({sellerId: uid}, {$addToSet: {lang: lang}});
  //  }
  //  if (action == "remove") {
  //    if (Meteor.isServer) {
  //      coll.update({sellerId: uid}, {$pull: {lang: {$in: [lang]}}});
  //    } else {
  //      // 在client端的minimongo中, $in不被支持
  //      const oldLang = (coll.findOne({sellerId: uid}, {lang: 1}) || {}).lang || [];
  //      const newLang = _.without(oldLang, lang);
  //      coll.update({sellerId: uid}, {$set: {lang: newLang}});
  //    }
  //  }
  //},


  /**
   * 更新商户的附加服务
   * @param sellerId
   * @param action add/remove
   * @param service language/plan/consult
   */
  //"marketplace.seller.updateServices": function (sellerId, action, service) {
  //  const coll = BraavosCore.Database.Braavos.Seller;
  //  const uid = parseInt(sellerId);
  //  if (isNaN(uid)) return;
  //
  //  if (action == "add") {
  //    coll.update({sellerId: uid}, {$addToSet: {services: service}});
  //  }
  //  if (action == "remove") {
  //    if (Meteor.isServer) {
  //      coll.update({sellerId: uid}, {$pull: {services: {$in: [service]}}});
  //    } else {
  //      // 在client端的minimongo中, $in不被支持
  //      const oldService = (coll.findOne({sellerId: uid}, {services: 1}) || {}).services || [];
  //      const newService = _.without(oldService, service);
  //      coll.update({sellerId: uid}, {$set: {services: newService}});
  //    }
  //  }
  //},

  /**
   * 更新商户的 附加服务/语言
   * @param sellerId
   * @param action add/remove
   * @param arrayName 要更新的数组字段名
   * @param value 添加/删除的value
   */
  "marketplace.seller.updateArray": function (sellerId, action, arrayName, value) {
    const coll = BraavosCore.Database.Braavos.Seller;
    const uid = parseInt(sellerId);
    if (isNaN(uid)) return;

    let options = {};

    if (action == "add") {
      options[arrayName] = value;
      coll.update({sellerId: uid}, {$addToSet: options});
    }

    if (action == "remove") {
      if (Meteor.isServer) {
        options[arrayName] = {$in: [value]};
        coll.update({sellerId: uid}, {$pull: options});
      } else {
        // 在client端的minimongo中, $in不被支持
        let field = {};
        field[arrayName] = 1;

        const oldArray = (coll.findOne({sellerId: uid}, field) || {})[arrayName] || [];
        const newArray = _.without(oldArray, value);

        options[arrayName] = newArray;
        coll.update({sellerId: uid}, {$set: options});
      }
    }
  }
});
