// 系统消息中心

import {SystemMessage} from '/client/dumb-components/message/systemMessage/systemMessage';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const SystemMessagesList = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    // 消息
    messages: React.PropTypes.array,

    // systemMessage 的订阅上限
    systemMessageLimit: React.PropTypes.number,

    // 修改 systemMessage 订阅数的回调
    onChangeSystemMessageLimit: React.PropTypes.func
  },

  // 滚轮的监测事件
  _handleScroll(e){
    // 获取滚动列表元素和列表中的所有子元素
    const $scrollEle = $(e.target);
    const $messageViewEle = $(e.target).children();

    // 当滚到倒数第二条时,添加订阅量 => 判断条件为: 滚动列表元素的总高度 > 单个子元素高度 * (订阅数量 - 1)
    if ( $scrollEle.scrollTop() + $scrollEle.height() > $($messageViewEle[0]).height() * (this.props.systemMessageLimit - 1) ) {
      console.log(this.props.systemMessageLimit);
      this.props.onChangeSystemMessageLimit(this.props.systemMessageLimit + 4);
    }
  },

  styles:{
    container: {
      borderRight: '1px solid #ccc',
      display: 'inline-block',
      width: 600,
      height: 598,
      boxSizing: 'border-box'
    },
    listWrap: {
      width: 596,
      height: 594,
      marginTop: 2,
      overflowY: 'auto',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }
  },
  render(){
    return (
      <div style={this.styles.container}>
        <div style={this.styles.listWrap} onScroll={this._handleScroll}>
          {this.props.messages.map(message =>
            <SystemMessage message={message} key={message._id._str}/>
          )}
        </div>
      </div>
    );
  }
});
