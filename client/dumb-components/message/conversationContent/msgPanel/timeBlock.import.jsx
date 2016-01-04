// '消息展板'中的'时间块'

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const TimeBlock = React.createClass({
  mixins: [IntlMixin],
  styles: {
    container: {
      margin: 5,
      color: '#bbb',
      fontSize: 12,
      textAlign: 'center'
    }
  },
  // TODO: 展示方式
  //   12月17日 11:41
  //   星期三 16:11(上周三,今天是星期二)
  //   昨天 11:46
  //   11:22
  render(){
    return (
      <div style={this.styles.container}>
        {moment(this.props.timestamp).format('YYYY-MM-DD hh-mm')}
      </div>
    )
  }
});
