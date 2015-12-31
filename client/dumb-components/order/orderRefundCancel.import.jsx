// 商家在用户'支付后', 因缺货等原因, 而选择退款的页面

import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Modal, Button} from "/lib/react-bootstrap";
import {OrderRefundModal} from '/client/dumb-components/order/orderRefundModal';
import {PageLoading} from '/client/common/pageLoading';
import {OrderMixin} from '/client/dumb-components/order/orderMixins';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderRefundCancel = React.createClass({
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

      // 密码正确, 取消订单
      const memo = $('textarea').val();
      Meteor.call('order.cancelRefund', self.data.orderInfo.orderId, parseInt(self.data.orderInfo.totalPrice * 100), memo, (err, res) => {
        if (err || !res) {
          // 密码验证失败处理
          swal('退款失败', '', 'error');
        } else{
          // 取消订单成功
          swal({
            title: "退款成功!",
            text: `退款金额${self.data.orderInfo.totalPrice}元`,
            timer: 1000
          }, () =>
            FlowRouter.go("orders")
          );
          Meteor.setTimeout(() => {
            swal.close();
            FlowRouter.go("orders");
          }, 2000);
        }
      })
    })
  },

  // 打开退款弹层
  _handleSubmit(e){
    this.setState({
      showRefundModal: true
    });
  },

  styles: {
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
      content =
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox-content" style={{padding: 30}}>
            <h3>缺货退款</h3>
            <ol style={this.styles.ol}>
              <li>买家已经付款, 你还未做任何处理。</li>
              <li>如果您想取消交易, 可以退款给买家。</li>
              <li>您还可以 <a href={`/orders/${this.data.orderInfo.orderId}/deliver`}>发货</a>。</li>
            </ol>

            <hr style={this.styles.hr}/>
            <label style={this.styles.marginRight}>买家:</label>
            <span
              style={this.styles.marginRight}>{this.data.orderInfo.contact && (`${this.data.orderInfo.contact.surname} ${this.data.orderInfo.contact.givenName}`) || '-'}</span>
            <label style={this.styles.marginRight}>实付金额:</label>
            <span>¥ {this.data.orderInfo.totalPrice || '-'}</span>

            <div>
              <label style={this.styles.label}>退款金额</label>
              <span>{this.data.orderInfo.totalPrice || '-'} 元</span>
            </div>

            <span style={this.styles.asterisk}>*</span>备注
            <textarea style={this.styles.textarea}></textarea>

            <div style={this.styles.buttonGroup}>
              <Button bsStyle="primary" onClick={this._handleSubmit}>退款</Button>
              <Button onClick={this._handleCancel} style={this.styles.cancelBtn}>取消</Button>
            </div>
          </div>
        </div>
    };

    return (
      <div className='order-refund-lack-wrap'>
        <BraavosBreadcrumb />

        {this.state.showRefundModal
          ? <OrderRefundModal
              showModal={this.state.showRefundModal}
              handleClose={this._handleRefundModalClose}
              handleSubmit={this._handleRefundModalSubmit}
            />
          : <div />
        }
      </div>
    )
  }
})

export const OrderRefundCancel = orderRefundCancel;