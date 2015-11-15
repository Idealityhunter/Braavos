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
});