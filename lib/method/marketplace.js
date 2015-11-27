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
  "marketplace.seller.updateLang": function (sellerId, action, lang) {
    const coll = BraavosCore.Database.Braavos.Seller;
    const uid = parseInt(sellerId);
    if (isNaN(uid)) return;

    if (action == "add") {
      coll.update({sellerId: uid}, {$addToSet: {lang: lang}});
    }
    if (action == "remove") {
      if (Meteor.isServer) {
        coll.update({sellerId: uid}, {$pull: {lang: {$in: [lang]}}});
      } else {
        // 在client端的minimongo中, $in不被支持
        const oldLang = (coll.findOne({sellerId: uid}, {lang: 1}) || {}).lang || [];
        const newLang = _.without(oldLang, lang);
        coll.update({sellerId: uid}, {$set: {lang: newLang}});
      }
    }
  }
});
