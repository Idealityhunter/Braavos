import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Modal, Button} from "/lib/react-bootstrap";
import {OrderRefundModal} from '/client/dumb-components/order/orderRefundModal';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderRefundLack = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      showRefundModal: false
    }
  },

  getMeteorData() {
    // 获取商品信息
    const handleOrder = Meteor.subscribe('orderInfo', this.props.orderId);
    let orderInfo = {};
    if (handleOrder.ready()) {
      orderInfo = BraavosCore.Database.Braavos.Order.findOne({orderId: parseInt(this.props.orderId)});
    }

    return {
      orderInfo: orderInfo,
    };
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
      Meteor.call('order.cancel', self.data.orderInfo.orderId, (err, res) => {
        if (err || !res) {
          // 密码验证失败处理
          swal('退款失败', '', 'error');
        } else{
          // 取消订单成功
          swal({
            title: "退款成功!",
            text: "2s后跳转到订单管理页面",
            timer: 1500,
            showConfirmButton: false
          });
          Meteor.setTimeout(() => FlowRouter.go("orders"), 2000);
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
    content: {
      backgroundColor: 'white',
      border: '1px solid #ccc',
      padding: 10,
      margin: 10
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
    },
    submitLoading: {
      padding: '8px 14px',
      backgroundColor: '#1ab394',
      borderRadius: 3,
      boxSizing: 'content-box',
      cursor: 'pointer'
    }
  },

  render() {
    return (
      <div className='order-refund-lack-wrap'>
        <BraavosBreadcrumb />

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
            <span style={this.styles.marginRight}>{this.data.orderInfo.contact && (`${this.data.orderInfo.contact.surname} ${this.data.orderInfo.contact.givenName}`) || '-'}</span>
            <label style={this.styles.marginRight}>实付金额:</label>
            <span>{/*
             this.data.orderInfo.totalPrice || '-'
             this.data.orderInfo.paymentInfo || '-'
             this.data.orderInfo.totalPrice * this.data.orderInfo.discount || '-'
             */} 元</span>

            <div>
              <label style={this.styles.label}>退款金额</label>
              <span>¥ {/*
               this.data.orderInfo.totalPrice || '-'
               this.data.orderInfo.paymentInfo || '-'
               this.data.orderInfo.totalPrice * this.data.orderInfo.discount || '-'
               */}</span>
            </div>

            <span style={this.styles.asterisk}>*</span>备注
            <textarea style={this.styles.textarea}></textarea>

            <div style={this.styles.buttonGroup}>
              <Button bsStyle="primary" onClick={this._handleSubmit}>退款</Button>
              <div className={this.state.submitting ? 'la-ball-fall' : 'la-ball-fall hidden'} style={this.styles.submitLoading}>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <Button onClick={this._handleCancel} style={this.styles.cancelBtn}>取消</Button>
            </div>
          </div>
        </div>

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

export const OrderRefundLack = orderRefundLack;