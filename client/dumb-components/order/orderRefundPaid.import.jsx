// 未发货的商家在用户'申请退款'后, 选择退款的页面

import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Modal, Button} from "/lib/react-bootstrap";
import {OrderRefundModal} from '/client/dumb-components/order/orderRefundModal';
import {NumberInput} from '/client/common/numberInput';
import {PageLoading} from '/client/common/pageLoading';
import {OrderMixin} from '/client/dumb-components/order/orderMixins';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderRefundPaid = React.createClass({
  mixins: [IntlMixin, OrderMixin, ReactMeteorData],

  getInitialState(){
    return {
      showRefundModal: false
    }
  },

  getMeteorData(){
    return this.getOrderInfo();
  },

  // 取消操作
  _handleCancel(e){
    FlowRouter.go('orders');
  },

  // 关闭退款弹层
  _handleRefundModalClose(e){
    this.setState({
      showRefundModal: false
    })
  },

  // 输入密码并且退款操作
  _handleRefundModalSubmit(password){
    const self = this;
    Meteor.call('account.verifyCredential', password, (err, res) => {
      this._handleRefundModalClose();

      if (err){
        // 密码验证失败处理
        swal('验证', '', 'error');
        return ;
      };

      if (!res) {
        // 密码错误处理
        swal('密码错误', '', 'error');
        return ;
      }

      // 密码正确, 进行退款
      const amount = $('.refund-amount').children('input').val();
      const memo = $('textarea').val();
      Meteor.call('marketplace.order.refundApi', self.data.orderInfo.orderId, self.data.orderInfo.commodity.seller.sellerId, parseInt(amount * 100), memo, (err, res) => {
        if (err || !res) {
          // 退款失败处理
          swal('退款失败', '', 'error');
        } else{
          // 取消订单成功
          swal({
            title: "退款成功!",
            text: `退款金额${amount}元`,
            timer: 1500
          }, () => FlowRouter.go("orders"));
          Meteor.setTimeout(() => {
            swal.close();
            FlowRouter.go("orders");
          }, 2000);
        }
      })
    })
  },

  // 检查退款金额
  _checkRefundAmount(amount){
    return amount > 0 && amount <= this.data.orderInfo.totalPrice;
  },

  // 打开退款弹层
  _handleSubmitRefund(e){
    const amount = $('.refund-amount').children('input').val();
    if (this._checkRefundAmount(amount)){
      this.setState({
        amount: amount,
        showRefundModal: true
      });
    } else {
      // 不能少于0,不能多于支付金额
      swal('请输入正确的退款金额','','warning');
    }
  },

  styles: {
    countDown: {
      marginLeft: 30,
      backgroundColor: 'coral',
      padding: '5px 10px'
    },
    asterisk: {
      color: 'coral',
      verticalAlign: 'text-top',
      paddingRight: 5,
      fontsize: 18
    },
    ol: {
      marginLeft: 0,
      paddingLeft: 20,
      lineHeight: 2.5
    },
    hr: {
      marginTop: 30,
      marginBottom: 30,
      borderStyle: 'dashed'
    },
    totalPrice: {
      width: 70,
      textAlign: 'right'
    },
    marginRight: {
      marginRight: 15,
    },
    label: {
      marginRight: 40,
      marginTop: 15,
      marginBottom: 20
    },
    textarea: {
      display: 'block',
      marginTop: 15,
      marginBottom: 30,
      padding: 10,
      width: '100%',
      height: 100
    },
    buttonGroup: {
      textAlign: 'right',
    },
    cancelBtn: {
      marginRight: 20,
      marginLeft: 20,
      verticalAlign: 'top'
    }
  },

  render() {
    let content =
      <PageLoading show={true} labelText='加载中...' showShadow={false} />;

    if (this.data.orderInfo.status) {
      const activityArray = _.filter(this.data.orderInfo.activities, activity => activity.action == 'refundApply');
      const orderRefundActivity = (activityArray.length > 0) ? activityArray[activityArray.length - 1] : {};
      const orderRefundList = this._getActivityStatement(orderRefundActivity);

      content =
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox-content" style={{padding: 30}}>
            <div>
              <h3 className="inline">请处理退款</h3>
              <span style={this.styles.countDown}>倒计时: {this._getCountDown('refundApply', 72)}</span>
            </div>

            <ol style={this.styles.ol}>
              <li>买家已经付款, 你对订单还未做任何处理, 买家申请了退款。</li>
              <li>如果您在买家申退后48小时内未做处理, 系统将自动退款给买家。</li>
              <li>如果您拒绝退款, 您可以选择 <a href={`/orders/${this.data.orderInfo.orderId}/deliver`}>发货</a>。</li>
            </ol>

            <hr style={this.styles.hr}/>
            <label style={this.styles.marginRight}>买家:</label>
            <span style={this.styles.marginRight}>{this.data.orderInfo.contact && (`${this.data.orderInfo.contact.surname} ${this.data.orderInfo.contact.givenName}`) || '-'}</span>
            <label style={this.styles.marginRight}>实付金额:</label>
            <span>¥ {this.data.orderInfo.totalPrice || '-'}</span>

            <div className='refund-amount'>
              <label style={this.styles.label}>退款金额</label>
              <NumberInput numberType='float' decimalDigits={2} value={this.data.orderInfo.totalPrice} style={this.styles.totalPrice} autoComplete="off"/> 元
            </div>

            <span style={this.styles.asterisk}>*</span>备注
            <textarea style={this.styles.textarea}></textarea>

            {orderRefundList}

            <div style={this.styles.buttonGroup}>
              <Button bsStyle="primary" onClick={this._handleSubmitRefund}>退款</Button>
              <Button onClick={this._handleCancel} style={this.styles.cancelBtn}>取消</Button>
            </div>
          </div>
        </div>;
    };
    return (
      <div className='order-refund-lack-wrap'>
        <BraavosBreadcrumb />
        {content}
        {this.state.showRefundModal
          ? <OrderRefundModal
          showModal={this.state.showRefundModal}
          handleClose={this._handleRefundModalClose}
          handleSubmit={this._handleRefundModalSubmit}
          amount={this.state.amount}
          />
          : <div />
        }

      </div>
    )
  }
})

export const OrderRefundPaid = orderRefundPaid;