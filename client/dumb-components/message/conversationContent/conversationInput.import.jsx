// 对话输入容器
import {Button} from "/lib/react-bootstrap";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationInput = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    // 会话Id
    conversationId: React.PropTypes.string,

    // 发送消息的句柄
    onPostMessage: React.PropTypes.func,

    // 发送消息失败的处理
    onFailedMessage: React.PropTypes.func,

    // 修改输入框的消息内容
    onChangeInputValue: React.PropTypes.func,

    // 清除输入框的消息内容
    onClearInputValue: React.PropTypes.func,

    // 输入框中的消息内容
    inputValue: React.PropTypes.string
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

  // TODO 暂时会有bug,用shift+enter发送会多一个回车符
  // keydown的事件处理
  _handleKeydown(e){
    if (e.which == 13 || e.keyCode == 13) {
      if (e.shiftKey) this._sendMsg();
    };
  },

  // 文本内容改变时
  _handleChange(e){
    this.props.onChangeInputValue(e.target.value);
  },

  // 发送消息
  _sendMsg(){
    // 获取消息构成部分
    // TODO 获取 msgType
    const conversationId = this.props.conversationId;
    const contents = this.props.inputValue;
    const sendType = 2;
    const objectId = new Meteor.Collection.ObjectID();

    // 清空输入框
    this.props.onClearInputValue();

    // TODO emoji处理
    //var str1 = self._escapeRegExp('<img src="/images/emoji/ee_');
    //var str2 = self._escapeRegExp('.png" alt="" class="emoji-container">');
    //var regexp = new RegExp(str1+ '((\\d)*)' + str2, 'g');
    //contents = contents.replace(regexp, function($1, $2, $3, $4, $5){
    //  return emojiArray[$2 - 1].str;
    //});

    // 添加pending消息
    this.props.onPostMessage({
      msgType: 0,
      chatType: 'single',
      contents: contents,
      conversation: new Meteor.Collection.ObjectID(conversationId),
      timestamp: Date.now(),
      senderId: parseInt(Meteor.userId()),
      _id: objectId
    }, conversationId);

    // 调用后台发送消息
    const self = this;
    Meteor.call('talk.sendMsg', sendType, conversationId, contents, objectId._str, (err, res) => {
      // 假如发送失败,则显示发送失败,并将pending消息变成failed消息
      if (err || !res){
        self.props.onFailedMessage(objectId._str, conversationId);
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

    // 发送框
    const textArea =
      <div>
        <textarea
          style={this.styles.textArea}
          placeholder="请输入要发送的消息"
          value={this.props.inputValue}
          onKeyDown={this._handleKeydown}
          onChange={this._handleChange}
        />
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