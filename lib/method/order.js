Meteor.methods({
  // 关闭订单
  "order.close": (orderId, reason) => {
    // TODO 乐观锁,检测当前状态

    // TODO 存储商家关闭订单的理由!

    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {'status': 'cancelled'}});
  },

  // 订单发货
  "order.commit": (orderId) => {
    // TODO 乐观锁,检测当前状态

    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {'status': 'committed'}});
  },

  // 曲线订单
  "order.cancel": (orderId) => {
    // TODO 乐观锁,检测当前状态

    // TODO 存储商家取消订单的理由

    // TODO 退款操作

    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {'status': 'cancelled'}});
  },
})