/**
 * 消息相关的
 *
 * Created by lyn on 1/13/16.
 */

function sendTask(task, body){
  // 获取服务
  const services = Object.keys(BraavosCore.RootConf.backends['viae']).map(key => {
    const {host, port} = BraavosCore.RootConf.backends['viae'][key];
    return `${host}:${port}`;
  });

  const options = {
    data: body
  };
  const url = `http://${services[0]}/tasks`;

  // 发送请求
  try {
    const result = HTTP.post(url, options);
    console.log(result);
    return result;
  }catch(e){
    console.log(`添加消息 ${task} 失败! 错误为: `);
    console.log(e);
  }
}

Meteor.methods({
  // 新建商品,添加消息
  'viae.marketplace.onCreateCommodity': (commodityId) => {
    // 填充数据
    const task = "viae.event.marketplace.onCreateCommodity";
    const body = {
      task: task,
      kwargs: {
        commodityId: commodityId
      }
    };

    sendTask(task, body);
  },

  // 更新商品信息,添加消息
  'viae.marketplace.onUpdateCommodity': (commodityId) => {
    // 填充数据
    const task = "viae.event.marketplace.onUpdateCommodity";
    const body = {
      task: task,
      kwargs: {
        commodityId: commodityId
      }
    };

    sendTask(task, body);
  },

  // 添加商家,添加消息
  'viae.marketplace.onCreateSeller': (sellerId) => {
    // 填充数据
    const task = "viae.event.marketplace.onCreateSeller";
    const body = {
      task: task,
      kwargs: {
        sellerId: sellerId
      }
    };

    sendTask(task, body);
  },

  // 更新商家信息,添加消息
  'viae.marketplace.onUpdateSeller': (sellerId) => {
    // 填充数据
    const task = "viae.event.marketplace.onUpdateSeller";
    const body = {
      task: task,
      kwargs: {
        sellerId: sellerId
      }
    };

    sendTask(task, body);
  },

  // 确认发货,添加消息
  'viae.marketplace.onCommitOrder': (order) => {
    // 取出需要的订单信息
    const simpleOrder = {
      orderId: order.orderId,
      consumerId: order.consumerId
    };

    // 填充数据
    const task = "viae.event.marketplace.onCommitOrder";
    const body = {
      task: task,
      kwargs: {
        order: simpleOrder
      }
    };

    sendTask(task, body);
  },

  // 取消订单,添加消息
  'viae.marketplace.onCancelOrder': (order, reason) => {
    // 取出需要的订单信息
    const simpleOrder = {
      orderId: order.orderId,
      consumerId: order.consumerId
    };

    // 填充数据
    const task = "viae.event.marketplace.onCancelOrder";
    const body = {
      task: task,
      kwargs: {
        order: simpleOrder,
        is_seller: true,
        reason: reason
      }
    };

    sendTask(task, body);
  },

  // 拒绝退款,添加消息
  'viae.marketplace.onRefundDeny': (order, memo = '') => {
    // 取出需要的订单信息
    const simpleOrder = {
      orderId: order.orderId,
      consumerId: order.consumerId
    };

    // 填充数据
    const task = "viae.event.marketplace.onRefundDeny";
    const body = {
      task: task,
      kwargs: {
        order: simpleOrder,
        reason: memo
      }
    };

    sendTask(task, body);
  },
});