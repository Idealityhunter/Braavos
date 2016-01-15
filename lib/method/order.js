Meteor.methods({
  // 尚未支付, 关闭订单
  "order.close": (orderId, consumerId, commodityName, reason) => {
    // TODO 乐观锁,检测当前状态

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    const res = coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, status: 'pending'}, {
        $set: {status: 'canceled', updateTime: updateTime},
        $push: {
          'activities': {
            timestamp: updateTime,
            action: 'cancel',
            prevStatus: 'pending',
            data: {
              userId: parseInt(Meteor.userId()),
              reason: reason
            }
          }
        }
      });

    // 服务端需要发送交易消息的提示
    if (res && Meteor.isServer) Meteor.call('msg.send.order', consumerId, orderId, commodityName, 'close', reason);

    return res;
  },

  // 订单发货 / 拒绝退款申请
  "order.commit": (orderId, consumerId, commodityName, order) => {
    // TODO 乐观锁,检测当前状态

    // What's wrong?
    //const userId = parseInt(this.userId);
    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTimeA = new Date();
    const updateTimeB = new Date(updateTimeA.getTime() + 1);//主动+1区分两个时间

    // 订单发货
    const resCommit = coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, status: 'paid'}, {
      $set: {status: 'committed', updateTime: updateTimeA},
      $push: {
        activities: {
          timestamp: updateTimeA,
          action: 'commit',
          prevStatus: 'paid',
          data: {
            userId: parseInt(Meteor.userId())
          }
        }
      }
    });
    if (resCommit && Meteor.isServer){
      Meteor.call('msg.send.order', consumerId, orderId, commodityName, 'commit');
      Meteor.call('viae.marketplace.onCommitOrder', order);
    };
    if (resCommit) return resCommit;

    // 拒绝退款申请
    const resRefundDeny = coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, status: 'refundApplied'}, {
      $set: {status: 'committed', updateTime: updateTimeB},
      $push: {
        activities: {
          $each: [{
            timestamp: updateTimeA,
            action: 'refundDeny',
            prevStatus: 'refundApplied',
            data: {
              userId: parseInt(Meteor.userId())
            }
          }, {
            timestamp: updateTimeB,
            action: 'commit',
            prevStatus: 'paid',
            data: {
              userId: parseInt(Meteor.userId())
            }
          }]
        }
      }
    });
    if (resRefundDeny && Meteor.isServer){
      Meteor.call('msg.send.order', consumerId, orderId, commodityName, 'refundDeny');
      Meteor.call('msg.send.order', consumerId, orderId, commodityName, 'commit');
      Meteor.call('viae.marketplace.onCommitOrder', order);
    };
    return resRefundDeny;
  },

  // 拒绝退款
  "order.refundDeny": (orderId, consumerId, commodityName, memo) => {
    // TODO 乐观锁,检测当前状态

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家拒绝退款的备注以及activities
    const res = coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, 'status': 'refundApplied'}, {
      $set: {status: 'committed', updateTime: updateTime},
      $push: {
        activities: {
          timestamp: updateTime,
          prevStatus: 'refundApplied',
          action: 'refundDeny',
          data: {
            userId: parseInt(Meteor.userId()),
            memo: memo
          }
        }
      }
    });

    // 服务端需要发送交易消息的提示
    if (res && Meteor.isServer) Meteor.call('msg.send.order', consumerId, orderId, commodityName, 'refundDeny', memo);

    return res;
  }
});