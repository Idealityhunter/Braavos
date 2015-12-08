Meteor.methods({
  // 关闭订单
  "order.close": (orderId) => {
    const coll = BraavosCore.Database.Braavos.Order;
    return coll.update({'orderId': parseInt(orderId)}, {$set: {'status': 'cancelled'}});
  }
})