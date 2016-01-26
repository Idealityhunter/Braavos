// 左侧的 Conversation View 的单个列表项

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const ConversationView = React.createClass({
  mixins: [IntlMixin],
  styles: {
    container:{
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
      padding: '15px 5px 10px',
      overflow: 'hidden',
      verticalAlign: 'top'
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

  _handleClickContainer(e){
    this.props.changeConversation(this.props.conversationId._str);
  },

  render(){
    return(
      <div style={this.styles.container} onClick={this._handleClickContainer}>
        <img src={this.props.avatar || 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80'} style={this.styles.avatar}/>
        <div style={this.styles.summary}>
          <div>
            {/*长度未限制,因此可能会有bug*/
              //this.props.nickName
              this.props.conversationId._str
            }
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
