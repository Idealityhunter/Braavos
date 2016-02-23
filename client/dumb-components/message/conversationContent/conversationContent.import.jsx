// 右侧的 Conversation 内容

import {MsgPanel} from '/client/dumb-components/message/conversationContent/msgPanel/msgPanel';
import {ConversationInput} from '/client/dumb-components/message/conversationContent/conversationInput';
import {ConversationSide} from '/client/dumb-components/message/conversationContent/conversationSide/conversationSide';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationContent = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    // 消息列表
    msgs: React.PropTypes.array,

    // 修改当前会话的msg的数量限制的方法
    onChangeMessageLimit: React.PropTypes.func,

    // TODO 优化
    // 是否可以添加conversationLimit
    changeConversation: React.PropTypes.bool,

    // TODO 优化
    changeConversationState: React.PropTypes.func,

    // 订阅的消息总数
    messageLimit: React.PropTypes.number,

    // 会话Id和名称
    conversationId: React.PropTypes.string,
    conversationName: React.PropTypes.string,

    // 发送消息的句柄(发消息时使用)
    onPostMessage: React.PropTypes.func,

    // 发送消息失败的处理
    onFailedMessage: React.PropTypes.func,

    // 修改输入框的消息内容的回调
    onChangeInputValue: React.PropTypes.func,

    // 清除输入框的消息内容的回调
    onClearInputValue: React.PropTypes.func,

    // 输入框中的消息内容
    inputValue: React.PropTypes.string
  },
  styles: {
    noSelected: {
      // 额外的样式
      padding: '250px 330px',
      color: '#d1d1d2',
      fontSize: 14
    },
    container: {
      display: 'inline-block',
      width: 748,
      height: 600,
      verticalAlign: 'top',
      boxSizing: 'border-box'
    },
    head: {
      height: 35,
      lineHeight: '35px',
      textAlign: 'center',
      borderBottom: '1px solid #ccc'
    },
    center: {
      display: 'inline-block',
      width: 498,
      height: 563,
      boxSizing: 'border-box'
    }
  },
  render(){
    if (! this.props.conversationId) {
      return(
        <div style={_.extend({}, this.styles.noSelected, this.styles.container)}>
          未选择聊天
        </div>
      )
    };

    return (
      <div style={this.styles.container}>

        {/* head */}
        <div style={this.styles.head}>
          {this.props.conversationName}
        </div>

        {/* body */}
        <div>
          {/* center */}
          <div style={this.styles.center}>
            <MsgPanel
              msgs={this.props.msgs}
              messageLimit={this.props.messageLimit}
              conversationId={this.props.conversationId}
              onChangeMessageLimit={this.props.onChangeMessageLimit}
              changeConversation={this.props.changeConversation}
              changeConversationState={this.props.changeConversationState}
            />
            <ConversationInput
              conversationId={this.props.conversationId}
              onPostMessage={this.props.onPostMessage}
              onFailedMessage={this.props.onFailedMessage}

              onChangeInputValue={this.props.onChangeInputValue}
              onClearInputValue={this.props.onClearInputValue}
              inputValue={this.props.inputValue}
            />
          </div>

          {/*TODO 右侧的内容可缩回?*/}
          <ConversationSide />
        </div>
      </div>
    )
  }
});
