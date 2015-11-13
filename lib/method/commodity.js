Meteor.methods({
  // 添加商品
  'commodity.insert': function (userId, doc) {
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    const uid = parseInt(userId);
    if (isNaN(uid)) return;

    // TODO 获取 seller信息
    const collSeller = BraavosCore.Database.Braavos.Seller;
    const collUserInfo = BraavosCore.Database.Yunkai.UserInfo;

    _.extend(doc, {
      commodityId: Math.floor(Math.random() * 1000000000),// 先取随机大数字
      seller: _.extend(collSeller.findOne({'sellerId': uid}), {
        'userInfo': collUserInfo.findOne({'userId': uid})
      }) || {},
      status: 'review',
      createTime: new Date()
    });

    return collCommodity.insert(doc);
  },

  // 修改商品狀態
  'commodity.status.update': function (commodityId, status) {
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    return collCommodity.update({'commodityId': commodityId}, {$set: {'status': status}});
  }
});