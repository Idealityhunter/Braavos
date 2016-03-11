// 系统消息中心

import {SystemMessage} from '/client/dumb-components/message/systemMessage/systemMessage';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const SystemMessagesList = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    // 消息
    messages: React.PropTypes.array

    // 修改 orderMessages 订阅数的回调
    //setOrderMessagesLimit: React.PropTypes.func
  },

  // 滚轮的监测事件
  //_handleScroll(e){
  //  const $scrollEle = $(e.target);
  //  const $conversationViewEle = $(e.target).children();
  //  if ( $scrollEle.scrollTop() + $scrollEle.height() > $($conversationViewEle[0]).height() * (this.props.limit - 1) ) {
  //    this.props.setConversationLimit(this.props.limit + 10);
  //  }
  //},

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
