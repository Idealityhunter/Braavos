

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
    let orderInfo;
    if (handleOrder.ready()) {
      orderInfo = BraavosCore.Database.Braavos.Order.findOne({orderId: parseInt(this.props.orderId)});
      if (orderInfo.totalPrice)
        orderInfo.totalPrice = orderInfo.totalPrice / 100;
    }

    return {
      orderInfo: orderInfo || {},
    };
  },

  // 获取退款数额
  _getRefundAmount(order){
    const activity = _.find(order.activities, activity => activity.action == 'refundApprove');
    return activity && activity.data && activity.data.amount || order.totalPrice;
  },

  // 获取activity的操作者
  _getActivityOperator(activities, action){
    const activity = _.find(activities, activity => activity.action == action);
    return activity && activity.data && activity.data.userId || -1//当没有操作者的时候应该返回-1
  },


  /** 倒计时相关 **/
  // 获取倒计时字段
  _getCountDown(status){
    const self = this;
    if (!this.interval){
      const startTime = this._getActivityTime(this.data.orderInfo.activities, status);
      // TODO 应该是startTime + 2days, 暂时是10days
      this.remainingSeconds = (moment(startTime).add(10, 'd').valueOf() - Date.now()) / 1000;
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
      case 'refundApply':
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
};