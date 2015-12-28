Meteor.methods({
  // 尚未支付, 关闭订单
  "order.close": (orderId, reason) => {
    // TODO 乐观锁,检测当前状态

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家关闭订单的理由以及activies
    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId}, {
      $set: {status: 'canceled', updateTime: updateTime},
      $push: {
        'activities': {
          timestamp: updateTime,
          action: 'cancel',
          data: {
            userId: parseInt(Meteor.userId()),
            memo: reason
          }
        }
      }
    });
  },

  // 订单发货
  "order.commit": (orderId) => {
    // TODO 乐观锁,检测当前状态

    // What's wrong?
    //const userId = parseInt(this.userId);
    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId}, {
      $set: {status: 'committed', updateTime: updateTime},
      $push: {
        activities: {
          timestamp: updateTime,
          action: 'commit',
          data: {
            userId: parseInt(Meteor.userId())
          }
        }
      }
    });
  },

  // 缺货退款, 取消订单
  "order.cancel": (orderId, reason) => {
    // TODO 乐观锁,检测当前状态

    // TODO 退款操作

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家取消订单的理由以及activies
    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId}, {
      $set: {status: 'canceled', updateTime: updateTime},
      $push: {
        activities: {
          timestamp: updateTime,
          action: 'cancel',
          data: {
            userId: parseInt(Meteor.userId()),
            memo: reason
          }
        }
      }
    });
  },

  // 同意退款
  "order.refunded": (orderId, amount) => {
    // TODO 乐观锁,检测当前状态

    // TODO 退款操作

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家同意退款的备注以及activies
    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId}, {
      $set: {status: 'refunded', updateTime: updateTime},
      $push: {
        activities: {
          timestamp: updateTime,
          action: 'refund',
          data: {
            type: 'accept',
            userId: parseInt(Meteor.userId()),
            amount: amount
          }
        }
      }
    });
  },

  // 拒绝退款
  "order.reject": (orderId, reason) => {
    // TODO 乐观锁,检测当前状态

    const userId = parseInt(Meteor.userId());
    const coll = BraavosCore.Database.Braavos.Order;
    const updateTime = new Date();

    // 存储商家拒绝退款的备注以及activies
    return coll.update({'orderId': parseInt(orderId), 'commodity.seller.sellerId': userId}, {
      $set: {status: 'committed', updateTime: updateTime},
      $push: {
        activities: {
          timestamp: updateTime,
          action: 'refund',
          data: {
            type: 'reject',
            userId: parseInt(Meteor.userId()),
            memo: reason
          }
        }
      }
    });
  }
});