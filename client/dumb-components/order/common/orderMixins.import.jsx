

export const OrderMixin = {
  // 订阅及获取订单数据
  getOrderInfo() {
    const userId = parseInt(Meteor.userId());
    let isAdmin = false;

    // 获取用户权限
    if (BraavosCore.SubsManager.account.ready()) {
      const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId});
      const adminRole = 10;
      isAdmin = (_.indexOf(userInfo.roles, adminRole) != -1);
    };

    // 获取商品信息
    const handleOrder = Meteor.subscribe('orderInfo', this.props.orderId, isAdmin);
    let orderInfo = {};
    if (handleOrder.ready()) {
      orderInfo = BraavosCore.Database.Braavos.Order.findOne({orderId: parseInt(this.props.orderId)}) || {};

      // 钱款单位转换(分 => 元)
      //if (orderInfo){
      //  if (orderInfo.totalPrice)
      //    orderInfo.totalPrice = orderInfo.totalPrice / 100;
      //  if (orderInfo.discount){
      //    orderInfo.paidAmount = (orderInfo.totalPrice * 100 - orderInfo.discount) / 100;
      //  }
      //}
    }

    return {
      orderInfo
    };
  },

  // 获取退款数额
  _getRefundAmount(order){
    const activity = _.find(order.activities, activity => activity.action == 'refundApprove');
    return activity && activity.data && activity.data.amount / 100 || (order.totalPrice || (order.discount || 0))/ 100;
  },

  // 获取activity的操作者
  _getActivityOperator(activities, action){
    const activity = _.find(activities, activity => activity.action == action);
    return activity && activity.data && activity.data.userId || -1//当没有操作者的时候应该返回-1
  },


  /** 倒计时相关 **/
  // 获取倒计时字段
  _getCountDown(status, hours){
    const self = this;
    if (!this.interval){
      const startTime = this._getActivityTime(this.data.orderInfo.activities, status);
      this.remainingSeconds = (moment(startTime).add(hours, 'h').valueOf() - Date.now()) / 1000;
      this.interval = Meteor.setInterval(() => {
        self.remainingSeconds = self.remainingSeconds - 1;
        self.forceUpdate();
      }, 1000);
    };

    const timeArray = this._getDividedTime(this.remainingSeconds);
    return `${this._getSpecifiedLengthTime(timeArray[0])}天${this._getSpecifiedLengthTime(timeArray[1])}小时${this._getSpecifiedLengthTime(timeArray[2])}分${this._getSpecifiedLengthTime(timeArray[3])}秒`;
  },

  // 获取行为的时间戳
  _getActivityTime(activities, status){
    let activity;
    switch (status) {
      case 'refundAppied':
        // 多次申请,只获取最后一次!
        const activityArray = _.filter(activities, activity => activity.action == 'refundApply');
        if (activityArray.length > 0)
          activity = activityArray[activityArray.length - 1];

        return activity
          ? activity.timestamp
          : 0;

      case 'paid':
        activity = _.find(activities, activity => activity.action == 'pay');

        return activity
          ? activity.timestamp
          : 0;

      default:
        return 0;
    }
  },

  // 将时间按照时间单位分割
  _getDividedTime(t) {
    return _.reduce([86400, 3600, 60, 1], function({components, remainder}, divider) {
      const newRemainder = remainder % divider;
      return {components: Array.prototype.concat(components, [parseInt(remainder / divider)]), remainder: newRemainder};
    }, {components: [], remainder: t}).components;
  },

  // 获取指定长度的时间数字
  _getSpecifiedLengthTime(str, length = 2){
    let tempStr = str + '';
    while (tempStr.length < length){
      tempStr = '0' + tempStr;
    };
    return tempStr;
  },

  // 根据订单是否已支付,返回number
  _getEncodedNumber(order, number){
    if (this._hasPaid(order))
      return number;
    else
      return this._encodeNumber(number);
  },

  // 判断订单是否已支付
  _hasPaid(order){
    return (_.findIndex(order.activities, (activity) => activity.action == 'pay') != -1)
  },

  // 将number部分用*代替(仅保留前两位,后三位)
  _encodeNumber(number){
    if (number != null) number = number.toString();
    const centerString = number.substring(2, number.length - 3).replace(/\w/ig, '*');
    return number.substring(0, Math.min(2, number.length - 3)) + centerString + number.substring(Math.max(2, number.length - 3))
  },


  // 根据不同的action获取相应展示的activity语句(用于info和refundCommit/refundPay页面)
  _getActivityStatement(activity){
    switch (activity.action) {
      case 'create':
        return <p>订单创建时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>;
      case 'pay':
        return <p>订单支付时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>;
      case 'commit':
        return <p>订单发货时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>;
      case 'cancel':
        return (activity.data && activity.data.reason && activity.data.reason.length > 0)
          ? [
          <p>取消订单时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>,
          <p>取消订单理由: {activity.data.reason}</p>
        ]
          : <p>取消订单时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>;
      case 'finish':
        return <p>订单完成时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>;
      case 'expire':
        return (activity.prevStatus == 'paid' || activity.prevStatus == 'refundApplied')
          ? (activity.data && activity.data.memo && activity.data.memo.length > 0)
            ? [
              <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>,
              <p>卖家退款说明: {activity.data.memo}</p>
            ]
            : <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>
          : (activity.prevStatus == 'pending')
            // 买家支付超时
            ? [/**/]
            : [];
      case 'refundApply':
        return (activity.data && activity.data.reason && activity.data.reason.length > 0)
          ? (activity.data.memo && activity.data.memo.length > 0)
          ? [
          <p>申请退款时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>,
          <p>申请退款理由: {activity.data.reason}</p>,
          <p>申请退款留言: {activity.data.memo}</p>
        ]
          : [
          <p>申请退款时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>,
          <p>申请退款理由: {activity.data.reason}</p>
        ]
          : <p>申请退款时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>;
      case 'refundApprove':
        return (activity.data && activity.data.memo && activity.data.memo.length > 0)
          ? [
          <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>,
          <p>卖家退款说明: {activity.data.memo}</p>
        ]
          : <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>
      case 'refundDeny':
        return (activity.data && activity.data.memo && activity.data.memo.length > 0)
          ? [
          <p>拒绝退款时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>,
          <p>拒绝退款理由: {activity.data.memo}</p>
        ]
          : <p>拒绝退款时间: {moment(activity.timestamp).format('YYYY-MM-DD HH:mm')}</p>;
        break;
      default:
        return ;
    }
  }
};