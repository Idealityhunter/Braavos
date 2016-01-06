import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Button, Table} from "/lib/react-bootstrap";
import {PageLoading} from '/client/common/pageLoading';
import {OrderCloseModal} from '/client/dumb-components/order/orderCloseModal';
import {OrderMixin} from '/client/dumb-components/order/orderMixins';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderInfo = React.createClass({
  mixins: [IntlMixin, OrderMixin, ReactMeteorData],

  getInitialState(){
    return {
      submitting: false,
      showCloseModal: false
    }
  },

  getMeteorData(){
    return this.getOrderInfo();
  },

  componentWillUnmount: function() {
    Meteor.clearInterval(this.interval);
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

  // 根据不同的action获取相应展示的activity语句
  _getActivityStatement(activity){
    switch (activity.action) {
      case 'create':
        return <p>订单创建时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>;
      case 'pay':
        return <p>订单支付时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>;
      case 'commit':
        return <p>订单发货时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>;
      case 'cancel':
        return (activity.data && activity.data.reason && activity.data.reason.length > 0)
          ? [
            <p>取消订单时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
            <p>取消订单理由: {activity.data.reason}</p>
          ]
          : <p>取消订单时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>;
      case 'finish':
        return <p>订单完成时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>;
      case 'expire':
        return (activity.prevState == 'paid' || activity.prevState == 'refundApplied')
          ? (activity.data && activity.data.memo && activity.data.memo.length > 0)
            ? [
              <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
              <p>卖家退款说明: {activity.data.memo}</p>
            ]
            : <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
          : (activity.prevState == 'pending')
            // 买家支付超时
            ? [/**/]
            : [];
      case 'refundApply':
        return (activity.data && activity.data.reason && activity.data.reason.length > 0)
          ? (activity.data.memo && activity.data.memo.length > 0)
            ? [
              <p>申请退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
              <p>申请退款理由: {activity.data.reason}</p>,
              <p>申请退款留言: {activity.data.memo}</p>
            ]
            : [
              <p>申请退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
              <p>申请退款理由: {activity.data.reason}</p>
            ]
          : <p>申请退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>;
      case 'refundApprove':
        return (activity.data && activity.data.memo && activity.data.memo.length > 0)
          ? [
            <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
            <p>卖家退款说明: {activity.data.memo}</p>
          ]
          : <p>退款完成时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>
      case 'refundDeny':
        return (activity.data && activity.data.memo && activity.data.memo.length > 0)
          ? [
            <p>拒绝退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>,
            <p>拒绝退款理由: {activity.data.memo}</p>
          ]
          : <p>拒绝退款时间: {moment(activity.timestamp).format('YYYY-MM-DD hh:mm')}</p>;
        break;
      default:
        return ;
    }
  },

  // 获取与订单状态相关的组件
  _getComponentByStatus(order){
    const self = this;
    const orderBtnSet = [
      <Button bsStyle="primary" style={this.styles.button} onClick={this._handleCloseOrder}>关闭交易</Button>,
      <Button bsStyle="primary" style={this.styles.button} onClick={() => {FlowRouter.go(`/orders/${order.orderId}/deliver`)}}>发货</Button>,
      <Button bsStyle="primary" style={this.styles.button} onClick={() => {FlowRouter.go(`/orders/${order.orderId}/refund/cancel`)}}>缺货退款</Button>,
      <Button bsStyle="primary" style={this.styles.button} onClick={() => {FlowRouter.go(`/orders/${order.orderId}/refund/paid`)}}>退款</Button>,
      <Button bsStyle="primary" style={this.styles.button} onClick={() => {FlowRouter.go(`/orders/${order.orderId}/refund/committed`)}}>退款处理</Button>
    ];

    // 按照时间顺序排序
    switch (order.status) {
      case 'pending':
        return {
          statusLabel: '等待买家付款',
          btnGroup: [orderBtnSet[0]],
          dateList: order.activities.map(activity => self._getActivityStatement(activity))
        }
      case 'paid':
        return {
          statusLabel: '待发货(买家已付款)',
          btnGroup: [orderBtnSet[1], orderBtnSet[2]],
          countdown: <span style={this.styles.countDown}>倒计时: {this._getCountDown('paid')}</span>,
          dateList: order.activities.map(activity => self._getActivityStatement(activity))
        }
      case 'committed':
        return {
          statusLabel: '已发货',
          dateList: order.activities.map(activity => self._getActivityStatement(activity))
        }
      case 'refundApplied':
        // 是否已发货
        return (_.findIndex(order.activities, (activity) => activity.action == 'commit') == -1)
          ? {
            statusLabel: '待退款(买家已付款)',
            btnGroup: [orderBtnSet[3], orderBtnSet[1]],
            //countdown: <span style={this.styles.countDown}>倒计时: {this._getCountDown( this._getActivityTime(order.activities, 'refundApply') )}</span>,
            countdown: <span style={this.styles.countDown}>倒计时: {this._getCountDown('refundApply')}</span>,
            dateList: order.activities.map(activity => self._getActivityStatement(activity))
          }
          : {
            statusLabel: '待退款(卖家已发货)',
            btnGroup: [orderBtnSet[4]],
            countdown: <span style={this.styles.countDown}>倒计时: {this._getCountDown('refundApply')}</span>,
            dateList: order.activities.map(activity => self._getActivityStatement(activity))
          }
      case 'refunded':
        return {
          statusLabel: `已关闭(已退款${this._getRefundAmount(order)}元)`,
          dateList: order.activities.map(activity => self._getActivityStatement(activity))
        }
      case 'finished':
        return {
          statusLabel: '已成功的订单',
          dateList: order.activities.map(activity => self._getActivityStatement(activity))
        }
      case 'canceled':
        return (_.findIndex(order.activities, (activity) => activity.action == 'cancel') != -1)
          // 区分 超时自动取消 or 商家/买家主动取消
          ? (this._getActivityOperator(order.activities, 'cancel') == order.consumerId)
            // 区分商家/买家取消
            ? {
              statusLabel: '已关闭(买家取消交易)',
              dateList: order.activities.map(activity => self._getActivityStatement(activity))
            }
            : {
              statusLabel: '已关闭(商家取消交易)',
              dateList: order.activities.map(activity => self._getActivityStatement(activity))
            }
          : {
            statusLabel: `已关闭(买家支付过期)`,
            dateList: order.activities.map(activity => self._getActivityStatement(activity))
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
    let content =
      <PageLoading show={true} labelText='加载中...' showShadow={false} />;

    if (this.data.orderInfo.status) {
      const orderInfo = this.data.orderInfo;

      // 获取套餐名
      const orderPlanTitle = orderInfo.planId && orderInfo.commodity && _.reduce(this.data.orderInfo.commodity.plans, (memo, f) => {
          return (this.data.orderInfo.planId == f.planId) ? f.title : memo
        }, '-');

      // 获取订单状态的展示
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
              <th>支付总价</th>
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