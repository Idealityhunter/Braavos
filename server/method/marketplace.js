/**
 * 交易相关的
 *
 * Created by zephyre on 11/25/15.
 */

Meteor.methods({
  // 添加一个卖家
  "marketplace.createSeller": function (seller) {
    const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: seller.sellerId},
      {nickName: 1, avatar: 1, userId: 1});
    if (userInfo) {
      // Yunkai返回的userInfo需要做转换
      const u = _.pick(userInfo, "nickName", "userId");
      if (userInfo.avatar)
        u.avatar = {url: userInfo.avatar};
      const sellerInfo = {
        sellerId: seller.sellerId,
        userInfo: u,
        name: seller.name,
        createTime: new Date()
      };
      BraavosCore.Database.Braavos.Seller.insert(sellerInfo);
      return sellerInfo;
    }
  }
});
