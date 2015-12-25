import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Button, Table} from "/lib/react-bootstrap";
import {PageLoading} from '/client/common/pageLoading';
import {OrderCloseModal} from '/client/dumb-components/order/orderCloseModal';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderInfo = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      submitting: false,
      showCloseModal: false
    }
  },

  componentWillUnmount: function() {
    Meteor.clearInterval(this.interval);
  },

  // TODO 可复用
  getMeteorData() {
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

      // TODO 待测试
      const activity = _.find(orderInfo.activities, activity => activity.action == 'refund' && activity.data && activity.data.type == 'accept');
      if (activity && activity.data && activity.data.amount)
        activity.data.amount = activity.data.amount / 100;
    };

    return {
      orderInfo: orderInfo || {}
    };
  },

  // 点击'关闭交易'
  _handleCloseOrder(){
    this.setState({
      showCloseModal: true
    });
  },

  // 关闭closeModal
  _handleCloseOrderModalClose(){
    this.setState({
      showCloseModal: false
    })
  },

  // 提交关闭操作
  _handleCloseOrderModalSubmit(reason){
    const self = this;
    swal({
      title: "确认关闭该交易?",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "确认关闭",
    }, () => {
      // 获取关闭交易的理由reason,并提交
      self._handleCloseOrderModalClose();
      Meteor.call('order.close', self.data.orderInfo.orderId, reason, (err, res) => {
        if (err){
          // 错误处理
          swal('关闭交易失败', '', 'warning');
        } else{
          // TODO 关闭交易成功
        }
      });
    });
  },

  // 获取身份证/护照号码
  _getIdentityCode(traveller){
    // 暂时把number给读取
    const identity = _.find(traveller.identities, identity => identity.idType == 'passport');
    return (identity) ? identity.code || identity.number : '';
  },

  // 根据不同的action获取相应的activity
  _getActivity(activities, status){
    let activity;
    switch (status) {
      case 'create':
        activity = _.find(activities, activity => activity.action == status);
        return activity
          ? <p>订单创建时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : '';
      case 'pay':
        activity = _.find(activities, activity => activity.action == status);
        return activity
          ? <p>订单支付时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : '';
      case 'commit':
        activity = _.find(activities, activity => activity.action == status);
        return activity
          ? <p>订单发货时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : '';
      case 'cancel':
        activity = _.find(activities, activity => activity.action == 'cancel');
        return activity
          ? (activity.data && activity.data.memo && activity.data.memo.length > 0)
            ? [
              <p>取消订单时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
              <p>取消订单理由: {activity.data.memo}</p>
            ]
            : <p>取消订单时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : '';
      case 'finish':
        activity = _.find(activities, activity => activity.action == status);
        return activity
          ? <p>订单完成时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : '';
      // 暂时没有超时状态
      case 'expire':
        return;
      case 'refundApply':
        // 多次申请,只展示最后一次!
        const activityArray = _.filter(activities, activity => activity.action == 'refund' && activity.data.type == 'apply');
        if (activityArray.length > 0)
          activity = activityArray[activityArray.length - 1];
        return activity
          ? (activity.data && activity.data.memo && activity.data.memo.length > 0)
            ? [
              <p>申请退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
              <p>申请退款理由: {activity.data.memo}</p>
            ]
            : <p>申请退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : '';
      case 'refundAccept':
        activity = _.find(activities, activity => activity.action == 'refund' && activity.data.type == 'accept');
        return activity
          ? <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : '';
      case 'refundReject':
        activity = _.find(activities, activity => activity.action == 'refund' && activity.data.type == 'reject');
        return activity
          ? (activity.data && activity.data.memo && activity.data.memo.length > 0)
            ? [
              <p>拒绝退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
              <p>拒绝退款理由: {activity.data.memo}</p>
            ]
            : <p>拒绝退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : '';
        break;
      default :
        return ;
    }
    return ;
  },

  // 获取退款数额
  _getRefundAmount(order){
    const activity = _.find(order.activities, activity => activity.action == 'refund' && activity.data && activity.data.type == 'accept');
    return activity && activity.data && activity.data.amount || order.totalPrice;
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
        // 多次申请,只展示最后一次!
        const activityArray = _.filter(activities, activity => activity.action == 'refund' && activity.data.type == 'apply');
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
      default: return 0;
    }
  },

  // 获取与订单状态相关的组件
  _getComponentByStatus(order){
    const orderBtnSet = [
      <Button bsStyle="primary" style={this.styles.button} onClick={this._handleCloseOrder}>关闭交易</Button>,
      <Button bsStyle="primary" style={this.styles.button} onClick={() => {FlowRouter.go(`/orders/${order.orderId}/deliver`)}}>发货</Button>,
      <Button bsStyle="primary" style={this.styles.button} onClick={() => {FlowRouter.go(`/orders/${order.orderId}/refund/cancel`)}}>缺货退款</Button>,
      <Button bsStyle="primary" style={this.styles.button} onClick={() => {FlowRouter.go(`/orders/${order.orderId}/refund/paid`)}}>退款</Button>,
      <Button bsStyle="primary" style={this.styles.button} onClick={() => {FlowRouter.go(`/orders/${order.orderId}/refund/committed`)}}>退款处理</Button>
    ];

    // TODO 按照时间顺序排序
    switch (order.status) {
      case 'pending':
        return {
          statusLabel: '等待买家付款',
          btnGroup: [orderBtnSet[0]],
          dateList: [
            this._getActivity(order.activities, 'create')
          ]
        }
      case 'paid':
        return {
          statusLabel: '待发货(买家已付款)',
          btnGroup: [orderBtnSet[1], orderBtnSet[2]],
          countdown: <span style={this.styles.countDown}>倒计时: {this._getCountDown('paid')}</span>,
          dateList: [
            this._getActivity(order.activities, 'create'),
            this._getActivity(order.activities, 'pay')
          ]
        }
      case 'committed':
        return {
          statusLabel: '已发货',
          dateList: [
            // 该情况下可能有两次commit => !!!拒绝退款的时候,转入commit!(要不这一步就不commit了!) => 可行?
            this._getActivity(order.activities, 'create'),
            this._getActivity(order.activities, 'pay'),
            this._getActivity(order.activities, 'commit'),
            this._getActivity(order.activities, 'refundApply'),
            this._getActivity(order.activities, 'refundReject')
          ]
        }
      case 'finished':
        return {
          statusLabel: '已成功的订单',
          dateList: [
            this._getActivity(order.activities, 'create'),
            this._getActivity(order.activities, 'pay'),
            this._getActivity(order.activities, 'commit'),
            this._getActivity(order.activities, 'refundApply'),
            this._getActivity(order.activities, 'refundReject')
          ]
        }
      case 'refundApplied':
        // 是否已发货
        return (_.findIndex(order.activities, (activity) => activity.action == 'commit') == -1)
          ? {
            statusLabel: '待退款(买家已付款)',
            btnGroup: [orderBtnSet[3], orderBtnSet[1]],
            //countdown: <span style={this.styles.countDown}>倒计时: {this._getCountDown( this._getActivityTime(order.activities, 'refundApply') )}</span>,
            countdown: <span style={this.styles.countDown}>倒计时: {this._getCountDown('refundApply')}</span>,
            dateList: [
              this._getActivity(order.activities, 'create'),
              this._getActivity(order.activities, 'pay'),
              this._getActivity(order.activities, 'refundApply'),
              this._getActivity(order.activities, 'refundReject')
            ]
          }
          : {
            statusLabel: '待退款(卖家已发货)',
            btnGroup: [orderBtnSet[4]],
            countdown: <span style={this.styles.countDown}>倒计时: {this._getCountDown('refundApply')}</span>,
            dateList: [
              this._getActivity(order.activities, 'create'),
              this._getActivity(order.activities, 'pay'),
              this._getActivity(order.activities, 'commit'),
              this._getActivity(order.activities, 'refundApply'),
              this._getActivity(order.activities, 'refundReject')
            ]
          }
      case 'canceled':
        // 是否已支付
        return (_.findIndex(order.activities, (activity) => activity.action == 'pay') == -1)
          ? {
            statusLabel: '已关闭(交易取消)',
            dateList: [
              this._getActivity(order.activities, 'create'),
              this._getActivity(order.activities, 'cancel')
            ]
          }
          : {
            statusLabel: `已关闭(退款${order.totalPrice}元)`,
            dateList: [
              this._getActivity(order.activities, 'create'),
              this._getActivity(order.activities, 'cancel')
            ]
          }
      case 'expired':
        // 是否已支付
        return (_.findIndex(order.activities, (activity) => activity.action == 'pay') == -1)
          ? {
            statusLabel: '已关闭(买家支付过期)',
            dateList: [
              this._getActivity(order.activities, 'create')
            ]
          }
          : {
            statusLabel: `已关闭(已退款${order.totalPrice}元)`,
            dateList: [
              this._getActivity(order.activities, 'create')
            ]
          }
      case 'refunded':
        return {
          statusLabel: `已关闭(已退款${this._getRefundAmount(order)}元)`,
          dateList: [
            // 该情况可能会有拒绝退款的机会吗 ?好奇怪
            this._getActivity(order.activities, 'create'),
            this._getActivity(order.activities, 'pay'),
            this._getActivity(order.activities, 'commit'),
            this._getActivity(order.activities, 'refundApply'),
            this._getActivity(order.activities, 'refundReject'),
            this._getActivity(order.activities, 'refundAccept')
          ]
        }
      default:
        return {}
    };
  },

  styles: {
    table: {
      marginTop: 30
    },
    td: {
      textAlign: 'center'
    },
    traveller: {
      marginBottom: 30
    },
    tel: {
      marginRight: 50
    },
    label: {
      fontSize: 16,
      marginRight: 10,
      marginBottom: 10
    },
    countDown: {
      marginLeft: 30,
      backgroundColor: 'coral',
      padding: '5px 10px'
    },
    btnGroup: {
      marginLeft: 30,
      verticalAlign: 'top'
    },
    button: {
      marginRight: 15,
      width: 80,
      textAlign: 'center'
    }
  },

  render() {
    //console.log(new Date());
    let content =
      <PageLoading show={true} labelText='加载中...' showShadow={false} />;

    if (this.data.orderInfo.status) {
      const orderInfo = this.data.orderInfo;
      const orderPlanTitle = orderInfo.planId && orderInfo.commodity && _.reduce(this.data.orderInfo.commodity.plans, (memo, f) => {
          return (this.data.orderInfo.planId == f.planId) ? f.title : memo
        }, '-');

      const orderStatusComponent = this._getComponentByStatus(orderInfo);

      const orderHead =
        <div>
          <h2 className='inline'>当前订单状态: {orderStatusComponent.statusLabel || ''}</h2>
          <div className='inline btn-group' style={this.styles.btnGroup}>{orderStatusComponent.btnGroup || ''}</div>
          <a href="">派消息</a>
          {orderStatusComponent.countdown || ''}
        </div>;

      const orderTable =
        <Table bordered condensed responsive style={this.styles.table}>
          <thead>
            <tr>
              <th>订单号</th>
              <th>商品</th>
              <th>套餐</th>
              <th>购买数量</th>
              <th>预支付总价</th>
              <th>使用时间</th>
              <th>联系人</th>
              <th>留言</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={this.styles.td}>{orderInfo.orderId}</td>
              <td style={this.styles.td}>
                <p>{orderInfo.commodity.title}</p>
                <p>商品编号: {orderInfo.commodity.commodityId}</p>
              </td>
              <td style={this.styles.td}>{orderPlanTitle}</td>
              <td style={this.styles.td}>{orderInfo.quantity}</td>
              <td style={this.styles.td}>{orderInfo.totalPrice}</td>
              <td style={this.styles.td}>{moment(orderInfo.rendezvousTime).format('YYYY-MM-DD')}</td>
              <td style={this.styles.td}>
                <p>{`${orderInfo.contact.surname}${orderInfo.contact.givenName}`}</p>
                <p>{`手机: ${orderInfo.contact.tel.dialCode} ${orderInfo.contact.tel.number}`}</p>
              </td>
              <td style={this.styles.td}>{orderInfo.comment ? orderInfo.comment : '-'}</td>
            </tr>
          </tbody>
        </Table>;

      let index = 0;
      const orderTravellers = _.map(orderInfo.travellers, (traveller) => {
        return (
          <div style={this.styles.traveller}>
            <label style={this.styles.label}>旅客{++index}</label><span>{traveller.surname} {traveller.givenName}</span>
            <div>
              <span style={this.styles.tel}>电话: {traveller.tel.dialCode} {traveller.tel.number}</span>
              <span>证件: 护照 {this._getIdentityCode(traveller)}</span>
            </div>
          </div>
        )
      });

      content =
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox-content" style={{padding: 30}}>
            {orderHead}
            {orderTable}
            {orderTravellers}
            {orderStatusComponent.dateList || ''}
          </div>
          <OrderCloseModal
            showModal={this.state.showCloseModal}
            handleClose={this._handleCloseOrderModalClose}
            handleSubmit={this._handleCloseOrderModalSubmit}
            />
        </div>;
    };

    return (
      <div className='order-deliver-wrap'>
        <BraavosBreadcrumb />
        {content}
      </div>
    )
  }
})

export const OrderInfo = orderInfo;