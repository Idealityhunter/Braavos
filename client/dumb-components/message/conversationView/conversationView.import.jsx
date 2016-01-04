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
  render(){
    return(
      <div style={this.styles.container}>
        <img src={this.props.avatar} style={this.styles.avatar}/>
        <div style={this.styles.summary}>
          <div>
            {/*长度未限制,因此可能会有bug*/
              this.props.nickName
            }
            <span style={this.styles.time}>{this.props.time}</span>
          </div>
          <p style={this.styles.digest}>{this.props.summary}</p>
        </div>
      </div>
    );
  }
});
