Meteor.methods({
  // 尚未支付, 关闭订单
  "order.close": (orderId, reason) => {
    // TODO 乐观锁,检测当前状态

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家关闭订单的理由以及activities
    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, status: 'pending'}, {
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
  },

  // 订单发货 / 拒绝退款申请,并且退款
  "order.commit": (orderId) => {
    // TODO 乐观锁,检测当前状态

    // What's wrong?
    //const userId = parseInt(this.userId);
    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTimeA = new Date();
    const updateTimeB = new Date(updateTimeA.getTime() + 1);//主动+1区分两个时间

    // 当前是否是申请退款状态
    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, status: 'paid'}, {
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
    }) || coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, status: 'refundApplied'}, {
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
  },

  // 主动退款(已支付时)
  "order.cancelRefund": (orderId, amount, memo) => {
    // TODO 乐观锁,检测当前状态

    // TODO 退款操作

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家取消订单的理由以及activities
    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, status: 'paid'}, {
      $set: {status: 'refunded', updateTime: updateTime},
      $push: {
        activities: {
          timestamp: updateTime,
          action: 'refundApprove',
          prevStatus: 'paid',
          data: {
            userId: parseInt(Meteor.userId()),
            amount: amount,
            memo: memo
          }
        }
      }
    });
  },

  // 同意退款
  "order.refundApprove": (orderId, amount, curStatus, memo) => {
    // TODO 乐观锁,检测当前状态

    // TODO 退款操作

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家同意退款的备注以及activities
    //return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, 'status': {$in: ['refundApplied', 'paid']}}, {
    //return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, 'status': curStatus}, {
    return coll.update({'orderId': parseInt(orderId), 'status': curStatus}, {
      $set: {status: 'refunded', updateTime: updateTime},
      $push: {
        activities: {
          timestamp: updateTime,
          action: 'refundApprove',
          prevStatus: curStatus,
          data: {
            userId: parseInt(Meteor.userId()),
            amount: amount,
            memo: memo
          }
        }
      }
    });
  },

  // 拒绝退款
  "order.refundDeny": (orderId, memo) => {
    // TODO 乐观锁,检测当前状态

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家拒绝退款的备注以及activities
    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId, 'status': 'refundApplied'}, {
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
  }
});