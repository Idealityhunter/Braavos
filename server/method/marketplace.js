/**
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
  },

  // 调用退款API
  "marketplace.order.refundApi": (orderId, userId, amount, memo) => {
    // TODO 检测是否为本人(管理员也不能帮助退款!!!)

    const apiHost = 'http://api-dev.lvxingpai.com/';
    const url = `${apiHost}app/marketplace/orders/${orderId}/refund`;
    const options = {
      headers: {
        UserId: userId
      },
      data: {
        refundFee: amount / 100,
        memo: memo
      }
    };

    try{
      const result = HTTP.post(url, options);
      return result;
    }catch(e){
      console.log('退款失败! 错误信息: ');
      console.log(e);
    }
  },
});
