// 已发货的商家在用户'申请退款'后, 选择退款的页面

import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Modal, Button, Input} from "/lib/react-bootstrap";
import {OrderRefundModal} from '/client/dumb-components/order/orderRefundModal';
import {NumberInput} from '/client/common/numberInput';
import {PageLoading} from '/client/common/pageLoading';
import {OrderMixin} from '/client/dumb-components/order/orderMixins';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderRefundCommitted = React.createClass({
  mixins: [IntlMixin, OrderMixin, ReactMeteorData],

  getInitialState(){
    return {
      submitting: false,
      showRefundModal: false,
      agreeRefund: true,

      // TODO 控制退款金额的变化,以便于modal中使用
      //refundMoney: ''

      // 存储备注信息
      agreeMemo: '',
      rejectMemo: ''
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
          // 退款成功
          swal({
            title: "退款成功!",
            text: `退款金额${amount}元`,
            timer: 1500,
            showConfirmButton: false
          });
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
    if (! this._checkRefundAmount(amount)){
      // 不能少于0,不能多于支付金额
      swal('请输入正确的退款金额','','warning');
      return false;
    };

    if ($('textarea').val().trim() == '') {
      swal('请填写退款备注', '', 'error');
      return false;
    };

    this.setState({
      amount: amount,
      showRefundModal: true
    });
  },

  // 拒绝退款
  _handleSubmitReject(e){
    if ($('textarea').val().trim() == '') {
      swal('请填写拒绝退款的原因', '', 'error');
      return false;
    };

    this.setState({
      submitting: true
    });

    const memo = $('textarea').val();
    Meteor.call('order.refundDeny', this.data.orderInfo.orderId, this.data.orderInfo.consumerId, this.data.orderInfo.commodity.title, memo, this.data.orderInfo, (err, res) => {
      if (err || !res) {
        swal('拒绝失败', '', 'error');
      } else{
        swal({
          title: "退款已拒绝",
          text: `拒绝原因: ${memo}`,
          timer: 1500,
          showConfirmButton: false
        }, () => FlowRouter.go("orders"));
        Meteor.setTimeout(() => {
          swal.close();
          FlowRouter.go("orders");
        }, 2000);
      };

      this.setState({
        submitting: false
      });
    });
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
    submitBtn: {
      marginRight: 15,
      marginBottom: 30,
      verticalAlign: 'top'
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
      padding: '8px 0px',
      backgroundColor: '#1ab394',
      borderRadius: 3,
      boxSizing: 'content-box',
      cursor: 'pointer'
    }
  },

  // 选择同意还是拒绝
  _changeRefundStatus(refundStatus){
    if (refundStatus ^ this.state.agreeRefund){
      this.setState({
        agreeRefund: refundStatus
      })
    };
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
              <li>您已经发货, 买家申请了退款。</li>
              <li>如果您同意退款, 系统审核后, 将钱款退还给买家。</li>
              <li>如果您拒绝退款, 请输入拒绝原因, 避免与买家发生交易冲突。</li>
              <li>如果您在买家申退后48小时内未做处理, 系统将自动退款给买家。</li>
            </ol>

            <hr style={this.styles.hr}/>

            <div>
              <Button bsStyle={this.state.agreeRefund ? 'primary' : 'default'} onClick={() => this._changeRefundStatus(true)} style={this.styles.submitBtn}>同意退款申请</Button>
              <Button bsStyle={this.state.agreeRefund ? 'default' : 'primary'} onClick={() => this._changeRefundStatus(false)}>拒绝退款申请</Button>
            </div>

            <label style={this.styles.marginRight}>买家:</label>
            <span style={this.styles.marginRight}>{this.data.orderInfo.contact && (`${this.data.orderInfo.contact.surname} ${this.data.orderInfo.contact.givenName}`) || '-'}</span>
            <label style={this.styles.marginRight}>实付金额:</label>

            <span>¥ {this.data.orderInfo.totalPrice || '-'}</span>

            {(this.state.agreeRefund)
              ? <div className='refund-amount'>
                  <label style={this.styles.label}>退款金额</label>
                  <NumberInput numberType='float' decimalDigits={2} value={this.data.orderInfo.totalPrice} style={this.styles.totalPrice} autoComplete="off"/> 元
                </div>
              : <div><br/></div>//留一行空白
            }

            <span style={this.styles.asterisk}>*</span>备注

            {(this.state.agreeRefund)
              ? <textarea style={this.styles.textarea} value={this.state.agreeMemo} onChange={(e) => this.setState({agreeMemo: e.target.value})}></textarea>
              : <textarea style={this.styles.textarea} value={this.state.rejectMemo} onChange={(e) => this.setState({rejectMemo: e.target.value})}></textarea>
            }

            {orderRefundList}

            <div style={this.styles.buttonGroup}>
              {(this.state.agreeRefund)
                ? <Button bsStyle="primary" onClick={this._handleSubmitRefund}>退款</Button>
                : [
                  <Button bsStyle="primary" onClick={this._handleSubmitReject} className={this.state.submitting ? 'hidden' : ''}>确定</Button>,
                  <div className={this.state.submitting ? 'la-ball-fall inline' : 'la-ball-fall hidden'} style={this.styles.submitLoading}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ]
              }
              <Button onClick={this._handleCancel} style={this.styles.cancelBtn}>取消</Button>
            </div>
          </div>
        </div>
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

export const OrderRefundCommitted = orderRefundCommitted;