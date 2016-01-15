/**
 * 消息相关的
 *
 * Created by lyn on 11/19/15.
 */

Meteor.methods({
  /**
   *
   * @param consumerId {String} 买家Id
   * @param orderId {String} 订单Id
   * @param commodityName {String} 商品名称
   * @param activity {String} 动作
   * @param memo {String} 备注(关闭订单)
   * @returns {*}
   */
  'msg.send.order': (consumerId, orderId, commodityName, activity, memo) => {
    // TODO 交易消息分配的账号 => 写到配置中
    const orderAccountId = 10002;
    const userId = orderAccountId;

    // 获取服务
    const services = Object.keys(BraavosCore.RootConf.backends['hedy']).map(key => {
      const {host, port} = BraavosCore.RootConf.backends['hedy'][key];
      return `${host}:${port}`;
    });
    const url = `http://${services[0]}/chats`;

    // 交易消息定义
    const contentComponents = {
      commit: {
        title: "卖家已确认订单",
        text: "卖家已确认订单，订单可使用，请于预约的出行时间前往消费。"
      },
      close: {
        title: "卖家已取消订单",
        text: `卖家已取消订单，如有疑问，请与卖家联系。\n\n卖家: ${memo}`
      },
      refundDeny: {
        title: "卖家已拒绝退款申请",
        text: `卖家已拒绝退款申请，订单可使用，请于预约的出行时间前往消费。如有疑问，请与卖家联系。${memo ? `\n\n卖家: ${memo}` : ''}`
      }
    };

    // 拼装msg内容
    const contentJson = {
      title: contentComponents[activity].title,
      text: contentComponents[activity].text,
      commodityName: commodityName,
      orderId: orderId
    };

    // 填充数据
    const options = {
      data: {
        sender: userId,
        chatType: "single",
        receiver: consumerId,
        msgType: 20,
        contents: JSON.stringify(contentJson)
      }
    };

    // 发送请求
    try {
      const result = HTTP.post(url, options);
      console.log(result);
      return result;
    }catch(e){
      console.log('发送消息失败! 错误为: ');
      console.log(e);
    }
  }
});
