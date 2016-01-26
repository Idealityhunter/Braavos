// 左侧的 Conversation View 列表

import {ConversationView} from '/client/dumb-components/message/conversationView/conversationView';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationViewList = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    conversations: React.PropTypes.array,
    setConversationLimit: React.PropTypes.func,
    changeConversation: React.PropTypes.func,
    limit: React.PropTypes.number
  },

  // 滚轮的监测事件
  _handleScroll(e){
    const $scrollEle = $(e.target);
    const $conversationViewEle = $(e.target).children();
    if ( $scrollEle.scrollTop() + $scrollEle.height() > $($conversationViewEle[0]).height() * (this.props.limit - 1) ) {
      this.props.setConversationLimit(this.props.limit + 10);
    }
  },

  styles:{
    container: {
      borderRight: '1px solid #ccc',
      display: 'inline-block',
      width: 250,
      height: 598,
      boxSizing: 'border-box'
    },
    listWrap: {
      width: 249,
      height: 594,
      marginTop: 2,
      overflow: 'auto',
      boxSizing: 'border-box'
    },
    //暂时废弃,loading逻辑不容易实现
    //spinner:{
    //  margin: '15px auto',
    //  width: 25,
    //  height: 25
    //}
  },
  render(){
    return (
      <div style={this.styles.container}>
        <div style={this.styles.listWrap} onScroll={this._handleScroll}>
          {this.props.conversations.map(conversation =>
            <ConversationView {... conversation} changeConversation={this.props.changeConversation}/>
          )}
        </div>
      </div>
    );
  }
});
