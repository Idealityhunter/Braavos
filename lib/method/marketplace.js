/**
 *
 * Created by zephyre on 11/13/15.
 */

Meteor.methods({
  // 添加一个卖家
  "marketplace.createSeller": function (seller) {
    const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: seller.sellerId},
      {nickName: 1, avatar: 1, userId: 1});
    if (userInfo) {
      const sellerInfo = {
        sellerId: seller.sellerId,
        userInfo: _.pick(userInfo, "nickName", "avatar", "userId"),
        name: seller.name,
        createTime: new Date()
      };
      BraavosCore.Database.Braavos.Seller.insert(sellerInfo);
    }
  }
});
