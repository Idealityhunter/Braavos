Meteor.methods({
  'addCommodity': function (userId, doc) {
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    const uid = parseInt(userId);
    if (isNaN(uid)) return;

    // TODO 获取 seller信息
    const collSeller = BraavosCore.Database.Braavos.Seller;

    _.extend(doc, {
      _id: Math.floor(Math.random() * 1000000000),// 先取随机大数字
      seller: collSeller.findOne({'_id': uid}) || {},
      status: 'review',
      createTime: new Date()
    });

    return collCommodity.insert(doc);
  }
});