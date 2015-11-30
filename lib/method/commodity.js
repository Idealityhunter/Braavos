Meteor.methods({
  // 编辑商品
  'commodity.update': function (userId, doc, commodityId) {
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    return collCommodity.update({commodityId: commodityId}, {$set: doc});
  },

  // 修改商品狀態
  'commodity.status.update': function (commodityId, status) {
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    return collCommodity.update({'commodityId': commodityId}, {$set: {'status': status}});
  },
});