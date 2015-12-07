Meteor.methods({
  // 修改商品狀態
  'commodity.status.update': function (commodityId, status) {
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    return collCommodity.update({'commodityId': commodityId}, {$set: {'status': status}});
  }
});