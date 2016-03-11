// 左侧的 Conversation View 列表

import {ConversationView} from '/client/dumb-components/message/conversationView/conversationView';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationViewList = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    // 会话列表
    conversations: React.PropTypes.array,

    // 修改会话订阅数目的方法
    onChangeConversationLimit: React.PropTypes.func,

    // 订阅会话的数目
    conversationLimit: React.PropTypes.number,

    // 修改当前会话
    onChangeConversation: React.PropTypes.func,

    // 当前激活会话的Id
    activeConversation: React.PropTypes.string,
  },

  // 滚轮的监测事件
  _handleScroll(e){
    const $scrollEle = $(e.target);
    const $conversationViewEle = $(e.target).children();
    if ( $scrollEle.scrollTop() + $scrollEle.height() > $($conversationViewEle[0]).height() * (this.props.conversationLimit - 1) ) {
      this.props.onChangeConversationLimit(this.props.conversationLimit + 10);
    }
  },

  styles:{
    container: {
      display: 'inline-block',
      width: 249,
      height: 563,
      boxSizing: 'border-box'
    },
    listWrap: {
      width: 249,
      height: 559,
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
    // (废弃,增大defaultLimit即可)由于部分对话不展示,导致会话数量不够滚动
    //if (this.props.conversations.length < 9 && this.props.conversationLimit < 29) this.props.onChangeConversationLimit(this.props.conversationLimit + 10);

    return (
      <div style={this.styles.container}>
        <div style={this.styles.listWrap} onScroll={this._handleScroll}>
          {this.props.conversations.map(conversation =>
            <ConversationView {... conversation}
              onChangeConversation={this.props.onChangeConversation}
              activeConversation={this.props.activeConversation}
            />
          )}
        </div>
      </div>
    );
  }
});
