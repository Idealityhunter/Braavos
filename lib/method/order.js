Meteor.methods({
  // 关闭订单
  "order.close": (orderId, reason) => {
    // TODO 乐观锁,检测当前状态

    // TODO 存储商家关闭订单的理由以及activies

    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {status: 'canceled', updateTime: new Date()}});
  },

  // 订单发货
  "order.commit": (orderId) => {
    // TODO 乐观锁,检测当前状态

    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {status: 'committed', updateTime: new Date()}});
  },

  // 取消订单
  "order.cancel": (orderId) => {
    // TODO 乐观锁,检测当前状态

    // TODO 存储商家取消订单的理由以及activies

    // TODO 退款操作

    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {status: 'canceled', updateTime: new Date()}});
  },

  // 同意退款
  "order.refunded": (orderId) => {
    // TODO 乐观锁,检测当前状态

    // TODO 存储商家同意退款的备注以及activies

    // TODO 退款操作

    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {status: 'refunded', updateTime: new Date()}});
  },

  // 拒绝退款
  "order.reject": (orderId) => {
    // TODO 乐观锁,检测当前状态

    // TODO 存储商家拒绝退款的备注以及activies

    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {status: 'committed', updateTime: new Date()}});
  },
});