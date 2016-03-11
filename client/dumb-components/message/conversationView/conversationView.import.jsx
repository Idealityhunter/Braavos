// 左侧的 Conversation View 的单个列表项

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationView = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    // 会话Id
    conversationId: React.PropTypes.object,

    // 会话对象的头像(个人则为个人头像,群组则为默认头像或者固定头像)
    avatar: React.PropTypes.string,

    // 会话对象的昵称(个人默认为用户名,群组默认为群组号)
    nickName: React.PropTypes.string,

    // 会话的最近消息的发送时间
    updateTime: React.PropTypes.object,

    // 会话的最近消息的摘要
    lastMessage: React.PropTypes.string,

    // 修改当前会话
    onChangeConversation: React.PropTypes.func,

    // 当前激活会话的Id
    activeConversation: React.PropTypes.string
  },

  styles: {
    container: {
      borderBottom: '1px solid #ccc'
    },
    activeContainer: {
      backgroundColor: 'honeydew',
      borderBottom: '1px solid #ccc'
    },
    avatar: {
      width: 60,
      height: 60,
      display: 'inline-block',
      margin: 5,
      padding: 5,
      borderRadius: 10
    },
    summary: {
      width: 160,
      display: 'inline-block',
      padding: '12px 0 5px',
      overflow: 'hidden',
      verticalAlign: 'middle'
    },
    name: {
      display: 'inline-block',
      width: 125,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    time: {
      color: '#aaa',
      float: 'right'
    },
    digest: {
      marginTop: 5,
      width: 150,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  },

  // 点击组件的触发函数,将当前会话改为本组件对应的会话
  _handleClickContainer(e){
    this.props.onChangeConversation(this.props.conversationId._str);
  },

  render(){
    return(
      <div style={(this.props.activeConversation == this.props.conversationId._str) ? this.styles.activeContainer : this.styles.container} onClick={this._handleClickContainer}>
        <img src={this.props.avatar} style={this.styles.avatar}/>
        <div style={this.styles.summary}>
          <div>
            <div style={this.styles.name} title={this.props.nickName}>
              {/*长度未限制,因此可能会有bug*/
                this.props.nickName
              }
            </div>
            <span style={this.styles.time}>
              {
                // TODO 更进一步 => 判断是否今天的消息,然后选择是否展示确切的日期
                moment(this.props.updateTime).format('hh:mm')
              }
            </span>
          </div>
          <p style={this.styles.digest}>{this.props.lastMessage}</p>
        </div>
      </div>
    );
  }
});
