// 对话输入容器
import {Button} from "/lib/react-bootstrap";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationInput = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    // 当前所在conversation的conversationId
    curConversation: React.PropTypes.string,

    // 添加pending消息的句柄(发消息时使用)
    appendPendingMsg: React.PropTypes.func
  },
  styles: {
    container: {
      width: 498,
      height: 211,
      boxSizing: 'border-box'
    },
    textArea: {
      width: 498,
      height: 134,
      overflow: 'auto',
      border: 'none',
      padding: '5px 10px',
      borderTop: '1px solid #ccc'
    },
    foot: {
      textAlign: 'right',
      paddingRight: 10
    },
    comment: {
      color: '#aaa',
      marginRight: 10
    },

    // ToolBar
    toolBar: {
      width: 498,
      height: 35,
      padding: '6px 10px'
    },
    toolImage: {
      display: 'inline-block',
      width: 23,
      height: 23,
      marginRight: 10,
      cursor: 'pointer'
    },
    face: {
      background: 'url(/images/message/emoji.png) no-repeat'
    },
    file: {
      background: 'url(/images/message/file.png) no-repeat'
    },
    plan: {
      background: 'url(/images/message/plan_selected.png) no-repeat',
      marginRight: 6,
      backgroundSize: 'contain'
    },
    search: {
      background: 'url(/images/message/search_selected.png) no-repeat',
      backgroundSize: 'contain'
    }
  },

  // 发送消息
  _sendMsg(e){
    // TODO 获取 msgType
    const conversationId = this.props.curConversation;
    const contents = $('textarea').val();
    const sendType = 2;

    // TODO 先添加fake消息
    this.props.appendPendingMsg({
      contents: contents,
      msgType: 0,
      timestamp: Date.now(),
      senderId: 100012
    });

    Meteor.call('talk.sendMsg', sendType, conversationId, contents, (err, res) => {
      console.log(err);
      console.log(res);
      // TODO 假如发送失败,则显示发送失败,并且保留fake数据
      // TODO 假如发送成功,则fake消息删除
    });
  },

  render(){
    // 添加其它消息类型
    const toolBar =
      <div style={this.styles.toolBar}>
        <a href="javascript:;" style={_.extend({},this.styles.toolImage, this.styles.face)} title="表情" />
        <a href="javascript:;" style={_.extend({},this.styles.toolImage, this.styles.file)} title="图片" />
        <a href="javascript:;" style={_.extend({},this.styles.toolImage, this.styles.plan)} title="我的攻略" />
        <a href="javascript:;" style={_.extend({},this.styles.toolImage, this.styles.search)} title="搜索" />
      </div>;

    //<textarea style={this.styles.textArea} placeholder="请输入要发送的消息"></textarea>
    //<Input style={this.styles.textArea} type="textarea" placeholder="textarea" />

    // 发送框
    const textArea =
      <div>
        <textarea style={this.styles.textArea} placeholder="请输入要发送的消息"></textarea>
      </div>;

    // 包括发送按钮等
    const foot =
      <div style={this.styles.foot}>
        <p className="inline" style={this.styles.comment}>按下Cmd+Enter发送</p>
        <Button className="inline" bsStyle='info' onClick={this._sendMsg}>发送</Button>
      </div>;

    return (
      <div style={this.styles.container}>
        {toolBar}
        {textArea}
        {foot}
      </div>
    )
  }
});