// '消息展板'中的 单个消息内容块

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const MsgBlock = React.createClass({
  mixins: [IntlMixin],
  styles: {
    leftContainer: {
      textAlign: 'left'
    },
    rightContainer: {
      textAlign: 'right'
    },
    avatar: {
      display: 'inline-block',
      width: 40,
      height: 40,
      borderRadius: 20,
      margin: '10px 15px',
      verticalAlign: 'top'
    },
    bubble: {
      display: 'inline-block',
      border: '1px solid #ccc',
      padding: 10,
      position: 'relative',
      background: '#fff',
      borderRadius: 8,
      marginTop: 15,
      maxWidth: 345,
      textAlign: 'left',
      verticalAlign: 'top'
    },
    triangle: {
      position: 'absolute',
      top: 0,
      fontSize: 19
    },
    triangleAL: {
      zIndex: 1,
      color: '#ccc',
      left: -10
    },
    triangleBL: {
      zIndex: 3,
      color: '#fff',
      left: -9
    },
    triangleAR: {
      zIndex: 1,
      color: '#ccc',
      right: -10
    },
    triangleBR: {
      zIndex: 3,
      color: '#fff',
      right: -9
    },
    text: {
      margin: 0
    }
  },

  render(){
    const body = (this.props.senderId == 100068)
      ? <div style={this.styles.leftContainer}>
          <img style={this.styles.avatar} src={this.props.avatar}/>
          <div style={this.styles.bubble}>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleAL)}>◆</span>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleBL)}>◆</span>
            <p style={this.styles.text}>{this.props.contents}</p>
          </div>
        </div>
      : <div style={this.styles.rightContainer}>
          <div style={this.styles.bubble}>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleAR)}>◆</span>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleBR)}>◆</span>
            <p style={this.styles.text}>{this.props.contents}</p>
          </div>
          <img style={this.styles.avatar} src={this.props.avatar}/>
        </div>;

    return body;
  }
});
