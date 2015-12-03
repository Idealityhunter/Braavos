/**
 * 商品相关的
 *
 * Created by lyn on 11/15/15.
 */

Meteor.methods({
    /**
     * 检查commodity是否为当前用户所有
     * @param commodityId
     */
    'commodity.editor.checkCommodityId': (commodityId) => {
      const userId = parseInt(Meteor.userId());
      const ret = BraavosCore.Database.Braavos.Commodity.findOne({
        commodityId: parseInt(commodityId),
        'seller.sellerId': userId
      });
      return {
        valid: Boolean(ret),
        commodityInfo: ret
      };
    },

  // 生成commodityId
  'commodity.insert.generateCommodityId': () => {
    const client = BraavosCore.Thrift.IdGen.client;
    try {
      const int64_commodityId = client.generate('commodity');
      return int64_commodityId.toNumber()
    } catch(err) {
      console.log(`Generate commodityId failed!`);
      console.log(err);
      return undefined;
    };
  },


  // 添加商品
  'commodity.insert': (userId, doc) => {
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    const uid = parseInt(userId);
    if (isNaN(uid)) return;

    // TODO 获取 seller信息
    const collSeller = BraavosCore.Database.Braavos.Seller;
    const collUserInfo = BraavosCore.Database.Yunkai.UserInfo;

    const commodityId = Meteor.call('commodity.insert.generateCommodityId');
    const userInfo = _.pick(collUserInfo.findOne({'userId': uid}), 'nickName', 'userId', 'avatar');
    if (_.isString(userInfo.avatar)){
      userInfo.avatar = {
        url: userInfo.avatar
      }
    };
    _.extend(doc, {
      commodityId: commodityId,
      seller: _.pick(_.extend(collSeller.findOne({'sellerId': uid}), {
        'userInfo': userInfo
      }), 'sellerId', 'name', 'userInfo') || {},
      status: 'review',
      createTime: new Date()
    });
    return collCommodity.insert(doc);
  }
});