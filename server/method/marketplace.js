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
        createTime: new Date(),
        // 默认选择支持中文
        lang: ['zh']
      };
      BraavosCore.Database.Braavos.Seller.insert(sellerInfo);

      Meteor.call('viae.marketplace.onCreateSeller', seller.sellerId);
      return sellerInfo;
    }
  },

  // 调用退款API
  "marketplace.order.refundApi": (orderId, sellerId, amount, memo) => {
    // 检测是否为本人(管理员也不能帮助退款)
    if (Meteor.userId() != sellerId) {
      BraavosCore.logger.error(`Error in 'marketplace.order.refundApi': The user ${Meteor.userId()} is not the order ${orderId}'s seller(${sellerId})`);
      return false
    };

    // 获取hanse服务
    const services = Object.keys(BraavosCore.RootConf.backends['hanse']).map(key => {
      const {host, port} = BraavosCore.RootConf.backends['hanse'][key];
      return `${host}:${port}`;
    });
    const url = `http://${services[0]}/marketplace/orders/${orderId}/refund`;

    const options = {
      headers: {
        'X-Lvxingpai-Id': sellerId,
        'Token': Meteor.settings.token
      },
      data: {
        refundFee: amount / 100,
        memo: memo
      }
    };

    try {
      const result = HTTP.post(url, options);
      return result;
    } catch (e) {
      console.log('退款失败! 错误信息: ');
      console.log(e);
    }
  },
});
