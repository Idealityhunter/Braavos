import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Button} from "/lib/react-bootstrap";
import {PageLoading} from '/client/common/pageLoading';
import {OrderMixin} from '/client/dumb-components/order/orderMixins';// 包括getMeteorData

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderDeliver = React.createClass({
  mixins: [IntlMixin, OrderMixin, ReactMeteorData],

  getInitialState(){
    return {
      submitting: false
    }
  },

  getMeteorData(){
    return this.getOrderInfo();
  },

  _handleSubmit(e){
    // 确认发货
    this.setState({
      submitting: true
    });

    Meteor.call('order.commit', this.data.orderInfo.orderId, (err, res) => {
      if (err || !res){
        // 错误处理
        swal({
          title: "确认发货失败!",
          timer: 1000
        });

        this.setState({
          submitting: false
        });
      } else{
        // 发货确认成功
        swal({
          title: "确认发货成功!",
          text: "2s后跳转到订单管理页面",
          timer: 1500,
          showConfirmButton: false
        });
        Meteor.setTimeout(() => FlowRouter.go("orders"), 2000);
      }
    });
  },

  styles: {
    content: {
      backgroundColor: 'white',
      border: '1px solid #ccc',
      padding: 10,
      margin: 10
    },
    orderContent: {
      borderRadius: 4,
      padding: 10,
      marginBottom: 30,
      marginTop: 20
    },
    label: {
      marginRight: 10,
      marginBottom: 0
    },
    span: {
      display: 'inline-block',
      width: 60,
      paddingRight: 5,
      textAlign: 'justify',
      textAlignLast: 'justify'
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
    // 获取套餐名
    const planTitle = this.data.orderInfo && (
      this.data.orderInfo.plan && this.data.orderInfo.title || this.data.orderInfo.planId && this.data.orderInfo.commodity && _.reduce(this.data.orderInfo.commodity.plans, (memo, f) => {
        return (this.data.orderInfo.planId == f.planId) ? f.title : memo
      }, '-')
    );

    let content =
      <PageLoading show={true} labelText='加载中...' showShadow={false} />;

    if (this.data.orderInfo.status) {
      content =
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox-content" style={{padding: 30}}>
            <h4>商品订单信息</h4>

            <div className="gray-bg" style={this.styles.orderContent}>
              <p>
                <label style={this.styles.label}>
                  <span style={this.styles.span}>商品名</span>:
                </label>
                {this.data.orderInfo.commodity && this.data.orderInfo.commodity.title || '-'}
              </p>
              <p>
                <label style={this.styles.label}>
                  <span style={this.styles.span}>所选套餐</span>:
                </label>
                {planTitle}
              </p>
              <p>
                <label style={this.styles.label}>
                  <span style={this.styles.span}>购买数量</span>:
                </label>
                {this.data.orderInfo.quantity || '-'}
              </p>
              <p>
                <label style={this.styles.label}>
                  <span style={this.styles.span}>订单总价</span>:
                </label>
                {this.data.orderInfo.totalPrice || '-'}
                {/*
                 this.data.orderInfo.paymentInfo || '-'
                 this.data.orderInfo.totalPrice * this.data.orderInfo.discount || '-'
                 */}
              </p>
              <p>
                <label style={this.styles.label}>
                  <span style={this.styles.span}>订单号</span>:
                </label>
                {this.data.orderInfo.orderId || '-'}
              </p>
            </div>

            <h4>买家信息</h4>

            <div className="gray-bg" style={this.styles.orderContent}>
              <p>
                <label style={this.styles.label}>
                  <span style={this.styles.span}>联系人</span>:
                </label>
                {this.data.orderInfo.contact && (`${this.data.orderInfo.contact.surname} ${this.data.orderInfo.contact.givenName}`) || '-'}
                {this.data.orderInfo.contact && (` , +${this.data.orderInfo.contact.tel.dialCode} ${this.data.orderInfo.contact.tel.number}`)}
              </p>
              <p>
                <label style={this.styles.label}>
                  <span style={this.styles.span}>买家备注</span>:
                </label>
                {this.data.orderInfo.comment || '-'}
              </p>
              <p>
                <label style={this.styles.label}>
                  <span style={this.styles.span}>使用日期</span>:
                </label>
                {this.data.orderInfo.rendezvousTime && moment(this.data.orderInfo.rendezvousTime).format('YYYY-MM-DD') || '-'}
              </p>
            </div>

            <Button bsStyle="primary" onClick={this._handleSubmit} className={this.state.submitting ? 'hidden' : ''}>确认发货</Button>
            <div className={this.state.submitting ? 'la-ball-fall' : 'la-ball-fall hidden'}
                 style={this.styles.submitLoading}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
    };

    return (
      <div className='order-deliver-wrap'>
        <BraavosBreadcrumb />
        {content}
      </div>
    )
  }
})

export const OrderDeliver = orderDeliver;