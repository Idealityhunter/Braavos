// 右侧的 Conversation 内容

import {MsgPanel} from '/client/dumb-components/message/conversationContent/msgPanel/msgPanel';
import {ConversationInput} from '/client/dumb-components/message/conversationContent/conversationInput';
import {ConversationSide} from '/client/dumb-components/message/conversationContent/conversationSide/conversationSide';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationContent = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    msgs: React.PropTypes.array,
    setMsgLimit: React.PropTypes.func,
    changeConversation: React.PropTypes.bool,
    changeCoversationState: React.PropTypes.func,
    curConversation: React.PropTypes.string,
    appendPendingMsg: React.PropTypes.func
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
    if (! this.props.user) {
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
          {this.props.user}
        </div>

        {/* body */}
        <div>
          {/* center */}
          <div style={this.styles.center}>
            <MsgPanel
              msgs={this.props.msgs}
              setMsgLimit={this.props.setMsgLimit}
              changeConversation={this.props.changeConversation}
              changeCoversationState={this.props.changeCoversationState}
            />
            <ConversationInput
              curConversation={this.props.curConversation}
              appendPendingMsg={this.props.appendPendingMsg}
            />
          </div>

          {/*TODO 右侧的内容可缩回?*/}
          <ConversationSide />
        </div>
      </div>
    )
  }
});
