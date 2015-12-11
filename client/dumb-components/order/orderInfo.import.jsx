import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Button} from "/lib/react-bootstrap";
import {PageLoading} from '/client/common/pageLoading';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderInfo = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      submitting: false
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
      orderInfo: orderInfo
    };
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
    }
  },

  render() {
    const planTitle = this.data.orderInfo.planId && this.data.orderInfo.commodity && _.reduce(this.data.orderInfo.commodity.plans, (memo, f) => {
        return (this.data.orderInfo.planId == f.planId) ? f.title : memo
      }, '-');

    const content = (this.data.orderInfo.status)
      ? <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox-content" style={{padding: 30}}>
            <h2>当前订单状态:</h2>
            <h4>商品订单信息</h4>

            <div className="gray-bg" style={this.styles.orderContent}>
              <p>
                <label style={this.styles.label}>商品名:</label>
                {this.data.orderInfo.commodity && this.data.orderInfo.commodity.title || '-'}
              </p>
              <p>
                <label style={this.styles.label}>所选套餐:</label>
                {planTitle}
              </p>
              <p>
                <label style={this.styles.label}>购买数量:</label>
                {this.data.orderInfo.quantity || '-'}
              </p>
              <p>
                <label style={this.styles.label}>支付总价:</label>
                {/*
                 this.data.orderInfo.totalPrice || '-'
                 this.data.orderInfo.paymentInfo || '-'
                 this.data.orderInfo.totalPrice * this.data.orderInfo.discount || '-'
                 */}
              </p>
              <p>
                <label style={this.styles.label}>订单号:</label>
                {this.data.orderInfo.orderId || '-'}
              </p>
            </div>

            <h4>买家信息</h4>

            <div className="gray-bg" style={this.styles.orderContent}>
              <p>
                <label style={this.styles.label}>买家姓名:</label>
                {this.data.orderInfo.contact && (`${this.data.orderInfo.contact.surname} ${this.data.orderInfo.contact.givenName}`) || '-'}
              </p>
              <p>
                <label style={this.styles.label}>联系方式:</label>
                {this.data.orderInfo.contact && (`+${this.data.orderInfo.contact.tel.dialCode} ${this.data.orderInfo.contact.tel.number}`) || '-'}
              </p>
              <p>
                <label style={this.styles.label}>买家备注:</label>
                {this.data.orderInfo.comment || '-'}
              </p>
              <p>
                <label style={this.styles.label}>使用日期:</label>
                {this.data.orderInfo.rendezvousTime && moment(this.data.orderInfo.rendezvousTime).format('YYYY-MM-DD') || '-'}
              </p>
            </div>

            <Button bsStyle="primary" onClick={this._handleSubmit} className={this.state.submitting ? 'hidden' : ''}>确认发货</Button>
            <div className={this.state.submitting ? 'la-ball-fall' : 'la-ball-fall hidden'} style={this.styles.submitLoading}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      : <PageLoading show={true} labelText='加载中...' showShadow={false} />

    return (
      <div className='order-deliver-wrap'>
        <BraavosBreadcrumb />
        {content}
      </div>
    )
  }
})

export const OrderInfo = orderInfo;