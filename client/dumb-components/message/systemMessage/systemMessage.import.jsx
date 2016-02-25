// 系统消息中心

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const SystemMessage = React.createClass({
  mixins: [IntlMixin],

  showOrderInfo(){
    // TODO 交易消息置为已读
    FlowRouter.go(`/orders/${JSON.parse(this.props.msg.contents).orderId}`);
  },

  styles: {
    container: {
      borderRight: '1px solid #ccc',
      display: 'inline-block',
      width: 590,
      boxSizing: 'border-box',
      overflow: 'hidden',
      margin: 5,
      padding: 5,
      border: '1px solid #ccc',
      cursor: 'pointer'
    },
    hr: {
      margin: '10px 0'
    },
    text: {
      margin: '5px 0'
    }
  },
  render(){
    const contents = (() => {
      try {
        return JSON.parse(this.props.msg.contents);
      } catch (err) {
        BraavosCore.logger.debug(`Unable to parse the message body: ${this.props.msg.contents}`);
        return undefined;
      }
    })();

    if (contents) {
      return (
        <div style={this.styles.container} onClick={this.showOrderInfo}>
          <div>
            <h3>{contents.title}</h3>
            <p style={this.styles.text}>{contents.text}</p>
            <hr style={this.styles.hr}/>
            <p style={this.styles.text}>商品名称: {contents.commodityName}</p>
            <p style={this.styles.text}>订单编号: {contents.orderId}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }
});
