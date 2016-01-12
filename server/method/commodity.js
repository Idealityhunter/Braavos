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
    'commodity.editor.checkCommodityId': ({commodityId, isAdmin}) => {
      const userId = parseInt(Meteor.userId());
      const options = {commodityId: parseInt(commodityId)};
      if (!isAdmin) options['seller.sellerId'] = userId;

      const ret = BraavosCore.Database.Braavos.Commodity.findOne(options);
      return {
        valid: Boolean(ret),
        commodityInfo: ret
      };
    },

  // 生成commodityId
  'commodity.insert.generateCommodityId': () => {
    const client = BraavosCore.Thrift.IdGen.client;
    try {
      const result = client.generate('commodity');
      if (result.statusCode == 200 && result.data && result.data.id){
        return result.data.id
      }else{
        console.log(`Generate commodityId failed!`);
        console.log(result);
        return undefined;
      }
    } catch(err) {
      console.log(`Generate commodityId failed!`);
      console.log(err);
      return undefined;
    };
  },

  // 添加商品
  'commodity.insert': (doc) => {
    const userId = parseInt(Meteor.userId());
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    const collCommoditySnapshot = BraavosCore.Database.Braavos.CommoditySnapshot;

    // 获取 seller信息
    const collSeller = BraavosCore.Database.Braavos.Seller;
    const collUserInfo = BraavosCore.Database.Yunkai.UserInfo;

    const commodityId = Meteor.call('commodity.insert.generateCommodityId');
    const userInfo = _.pick(collUserInfo.findOne({'userId': userId}), 'nickName', 'userId', 'avatar');
    if (_.isString(userInfo.avatar)){
      userInfo.avatar = {
        url: userInfo.avatar
      }
    };

    const currentTime = new Date();
    _.extend(doc, {
      commodityId: commodityId,
      seller: _.pick(_.extend(collSeller.findOne({'sellerId': userId}), {
        'userInfo': userInfo
      }), 'sellerId', 'name', 'userInfo') || {},
      status: 'review',
      createTime: currentTime,
      updateTime: currentTime,
      version: currentTime.getTime()
    });

    return collCommoditySnapshot.insert(doc) && collCommodity.insert(doc);
  },

  // 编辑商品
  'commodity.update': function (modDoc, resetDoc) {
    // 暂时可以编辑他人的商品
    const collCommodity = BraavosCore.Database.Braavos.Commodity;
    const collCommoditySnapshot = BraavosCore.Database.Braavos.CommoditySnapshot;

    const currentTime = new Date();
    _.extend(modDoc, {
      updateTime: currentTime,
      version: currentTime.getTime()
    });
    return collCommoditySnapshot.insert(_.omit(_.extend(resetDoc, modDoc), '_id')) && collCommodity.update({commodityId: resetDoc.commodityId}, {$set: modDoc});

    // 只能编辑自己的商品
    //const userId = parseInt(Meteor.userId());
    //const collCommodity = BraavosCore.Database.Braavos.Commodity;
    //return collCommodity.update({'seller.sellerId': userId, commodityId: commodityId}, {$set: doc});
  }
});