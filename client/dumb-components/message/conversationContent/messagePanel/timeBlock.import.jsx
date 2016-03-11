// '消息展板'中的'时间块'

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const TimeBlock = React.createClass({
  mixins: [IntlMixin],
  //propTypes: {
  //  align: React.PropTypes.string,
  //  timestamp: React.PropTypes.number//可以为其它格式的时间(对象/字符串)
  //},
  getDefaultProps() {
    return {
      align: 'center'
    }
  },
  styles: {
    container: {
      margin: '5px 5px 0',
      color: '#bbb',
      fontSize: 12,
      //textAlign: 'center'
    }
  },
  // TODO: 展示方式
  //   12月17日 11:41
  //   星期三 16:11(上周三,今天是星期二)
  //   昨天 11:46
  //   11:22
  render(){
    return (
      <div style={_.extend({}, this.styles.container, {textAlign: this.props.align})}>
        {moment(this.props.timestamp).format('YYYY-MM-DD HH:mm')}
      </div>
    )
  }
});
