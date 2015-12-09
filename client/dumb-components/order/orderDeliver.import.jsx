import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {Modal, Button} from "/lib/react-bootstrap";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderDeliver = React.createClass({
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
      orderInfo: orderInfo,
    };
  },

  _handleSubmit(e){
    // TODO 确认发货
    this.setState({
      submitting: true
    });

    Meteor.call('order.commit', this.data.orderInfo.orderId, (err, res) => {
      if (err){
        // TODO 错误处理
        this.setState({
          submitting: false
        })
      } else{
        // TODO 发货确认成功
        swal({
          title: "确认发货成功!",
          text: "2s后跳转到订单管理页面",
          timer: 2000,
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
    const self = this;
    const planTitle = this.data.orderInfo.planId && this.data.orderInfo.commodity && _.reduce(self.data.orderInfo.commodity.plans, (memo, f) => {
        return (self.data.orderInfo.planId == f.planId) ? f.title : memo
      }, '');

    return (
      <div className='order-deliver-wrap'>
        <BraavosBreadcrumb />

        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="ibox-content" style={{padding: 30}}>
            <h4>收货人信息</h4>

            <div className="gray-bg" style={this.styles.orderContent}>
              <p>
                <label style={this.styles.label}>所选套餐:</label>
                {planTitle}
              </p>
              <p>
                <label style={this.styles.label}>使用日期:</label>
                {this.data.orderInfo.rendezvousTime && moment(this.data.orderInfo.rendezvousTime).format('YYYY-MM-DD') || ''}
              </p>
              <p>
                <label style={this.styles.label}>买家备注:</label>
                {this.data.orderInfo.comment}
              </p>
              <p>
                <label style={this.styles.label}>联系方式:</label>
                {this.data.orderInfo.contact && (`${this.data.orderInfo.contact.surname} ${this.data.orderInfo.contact.givenName}, ${this.data.orderInfo.contact.tel.dialCode} ${this.data.orderInfo.contact.tel.number}`)}
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