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
    appendPendingMsg: React.PropTypes.func,

    // 发送消息失败的处理
    failInSendingMsg: React.PropTypes.func
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

  // keydown的事件处理
  _handleKeydown(e){
    if (e.which == 13 || e.keyCode == 13) {
      if (e.shiftKey) this._sendMsg();
    };
  },

  // 发送消息
  _sendMsg(){
    // 获取消息构成部分
    // TODO 获取 msgType
    const conversationId = this.props.curConversation;
    const contents = $('textarea').val();
    const sendType = 2;
    const objectId = new Meteor.Collection.ObjectID();
    $('textarea').val('');

    // TODO emoji处理
    //var str1 = self._escapeRegExp('<img src="/images/emoji/ee_');
    //var str2 = self._escapeRegExp('.png" alt="" class="emoji-container">');
    //var regexp = new RegExp(str1+ '((\\d)*)' + str2, 'g');
    //contents = contents.replace(regexp, function($1, $2, $3, $4, $5){
    //  return emojiArray[$2 - 1].str;
    //});

    // 添加pending消息
    this.props.appendPendingMsg({
      status: 'pending',
      msgType: 0,
      chatType: 'single',

      contents: contents,
      conversation: new Meteor.Collection.ObjectID(conversationId),
      timestamp: Date.now(),
      senderId: parseInt(Meteor.userId()),
      _id: objectId
    });

    // 调用后台发送消息
    const self = this;
    Meteor.call('talk.sendMsg', sendType, conversationId, contents, objectId._str, (err, res) => {
      // 假如发送失败,则显示发送失败,并且保留pending数据
      if (err || !res){
        self.props.failInSendingMsg(objectId._str);
        console.log(err);
        console.log(res);
        return false;
      }

      return true;
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
        <textarea style={this.styles.textArea} placeholder="请输入要发送的消息" onKeyDown={this._handleKeydown}/>
      </div>;

    // 包括发送按钮等
    const foot =
      <div style={this.styles.foot}>
        <p className="inline" style={this.styles.comment}>按下Shift+Enter发送</p>
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