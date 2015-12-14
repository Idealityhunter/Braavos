// 已发货的商家在用户'申请退款'后, 选择退款的页面

import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Modal, Button, Input} from "/lib/react-bootstrap";
import {OrderRefundModal} from '/client/dumb-components/order/orderRefundModal';
import {NumberInput} from '/client/common/numberInput';
import {PageLoading} from '/client/common/pageLoading';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderRefundCommitted = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      submitting: false,
      showRefundModal: false,
      agreeRefund: true,
      // TODO 控制退款金额的变化,以便于modal中使用
      //refundMoney: ''
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

      // 密码正确, 进行退款
      const amount = $('.refund-amount').children('input').val();
      Meteor.call('order.refunded', self.data.orderInfo.orderId, amount, (err, res) => {
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

  // 打开退款弹层
  _handleSubmitRefund(e){
    this.setState({
      showRefundModal: true
    });
  },

  // 拒绝退款
  _handleSubmitReject(e){
    this.setState({
      submitting: true
    });

    const reason = $('textarea').val();
    Meteor.call('order.reject', this.data.orderInfo.orderId, reason, (err, res) => {
      if (err || !res) {
        swal('拒绝失败', '', 'error');
      } else{
        swal({
          title: "退款已拒绝",
          text: `拒绝原因: ${reason}`,
          timer: 1500,
          showConfirmButton: false
        }, () => FlowRouter.go("orders"));
        Meteor.setTimeout(() => {
          swal.close();
          FlowRouter.go("orders");
        }, 2000);
      }
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


  // TODO 重复的函数
  // 获取倒计时字段
  _getCountDown(status){
    const self = this;
    if (!this.interval){
      const startTime = this._getActivityTime(this.data.orderInfo.activities, status);
      // TODO 应该是startTime + 2days, 暂时是10days
      console.log(startTime);
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

  render() {
    let content =
      <PageLoading show={true} labelText='加载中...' showShadow={false} />;

    if (this.data.orderInfo.status) {
      content =
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox-content" style={{padding: 30}}>
            <div>
              <h3 className="inline">请处理退款</h3>
              <span style={this.styles.countDown}>倒计时: {this._getCountDown('refundApply')}</span>
            </div>

            <ol style={this.styles.ol}>
              <li>您已经发货, 买家申请了退款。</li>
              <li>如果您同意退款, 系统审核后, 将钱款退还给买家。</li>
              <li>如果您拒绝退款, 请输入拒绝原因, 避免与买家发生交易冲突。</li>
              <li>如果您在买家申退后48小时内未做处理, 系统将自动退款给买家。</li>
            </ol>

            <hr style={this.styles.hr}/>

            <div>
              <Button bsStyle={this.state.agreeRefund ? 'primary' : 'default'} onClick={() => this.setState({agreeRefund: true})} style={this.styles.submitBtn}>同意退款申请</Button>
              <Button bsStyle={this.state.agreeRefund ? 'default' : 'primary'} onClick={() => this.setState({agreeRefund: false})}>拒绝退款申请</Button>
            </div>

            <label style={this.styles.marginRight}>买家:</label>
            <span style={this.styles.marginRight}>{this.data.orderInfo.contact && (`${this.data.orderInfo.contact.surname} ${this.data.orderInfo.contact.givenName}`) || '-'}</span>
            <label style={this.styles.marginRight}>实付金额:</label>

            <span>¥ {this.data.orderInfo.totalPrice || '-'}</span>

            {(this.state.agreeRefund)
              ? <div className='refund-amount'>
              <label style={this.styles.label}>退款金额</label>
              <NumberInput value={this.data.orderInfo.totalPrice} style={this.styles.totalPrice} autoComplete="off"/> 元
            </div>
              : <div><br/></div>//留一行空白
            }


            <span style={this.styles.asterisk}>*</span>备注
            <textarea style={this.styles.textarea}></textarea>

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
          />
          : <div />
        }

      </div>
    )
  }
})

export const OrderRefundCommitted = orderRefundCommitted;