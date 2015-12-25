import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Button} from "/lib/react-bootstrap";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderDeliver = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      submitting: false
    }
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
    }

    return {
      orderInfo: orderInfo || {},
    };
  },

  _handleSubmit(e){
    // 确认发货
    this.setState({
      submitting: true
    });

    Meteor.call('order.commit', this.data.orderInfo.orderId, (err, res) => {
      if (err){
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
    submitLoading: {
      padding: '8px 14px',
      backgroundColor: '#1ab394',
      borderRadius: 3,
      boxSizing: 'content-box',
      cursor: 'pointer'
    }
  },

  render() {
    const planTitle = this.data.orderInfo && this.data.orderInfo.planId && this.data.orderInfo.commodity && _.reduce(this.data.orderInfo.commodity.plans, (memo, f) => {
        return (this.data.orderInfo.planId == f.planId) ? f.title : memo
      }, '-');

    return (
      <div className='order-deliver-wrap'>
        <BraavosBreadcrumb />

        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox-content" style={{padding: 30}}>
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
                {this.data.orderInfo.totalPrice || '-'}
                {/*
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
      </div>
    )
  }
})

export const OrderDeliver = orderDeliver;