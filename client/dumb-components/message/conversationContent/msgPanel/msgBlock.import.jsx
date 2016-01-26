// '消息展板'中的 单个消息内容块
import {Modal} from "/lib/react-bootstrap"

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;


export const MsgBlock = React.createClass({
  mixins: [IntlMixin],
  getInitialState(){
    return {
      showModal: false,
      imageSrc: ''
    }
  },
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
      margin: 0,
      wordWrap: 'break-word'
    },
    contents:{
      image: {
        width: 80,
        height: 80
      },
      textContents: {
        display: 'inline-block',
        width: 230,
        marginLeft: 10,
        verticalAlign: 'middle'
      }
    },
    image:{
      maxWidth: 330,
      height: 'auto'
    },
    singleLine:{
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    modal: {
      wrap: {
        margin: 10
      },
      image: {
        maxWidth: '100%',
        height: 'auto',
        margin: '0 auto',
        display: 'block'
      }
    }
  },

  // 全屏展示图片
  showImage(){
    const self = this;
    this.setState({
      showModal: true,
      imageSrc: JSON.parse(self.props.contents).full
    });
    return ;
  },

  onClose(){
    this.setState({
      showModal: false
    })
  },

  showCommodityInfo(){
    //TODO 跳转到商品详情页面
  },

  render(){
    let msgContents;
    switch (this.props.msgType) {
      // 纯文本消息
      case 0:
        msgContents =
          <div>
            <div>msgType:{this.props.msgType}</div>
            <p style={this.styles.text}>{this.props.contents}</p>
          </div>
        break;

      // 图片消息
      case 2:
        msgContents =
          <div>
            <div>msgType:{this.props.msgType}</div>
            <img style={this.styles.image} src={JSON.parse(this.props.contents).thumb} onClick={this.showImage}/>
            <Modal show={this.state.showModal} onHide={this.onClose} bsSize="lg">
              <Modal.Header closeButton />
              <div style={this.styles.modal.wrap}>
                <img ref="image" src={this.state.imageSrc} style={this.styles.modal.image}/>
              </div>
            </Modal>
          </div>
        break;

      // 商品消息
      case 19:
        const msg = JSON.parse(this.props.contents);
        msgContents =
          <div onClick={this.showCommodityInfo}>
            <div>msgType:{this.props.msgType}</div>
            <img src={msg.image} alt="商品图片" style={this.styles.contents.image}/>
            <div style={this.styles.contents.textContents}>
              <h3 style={this.styles.singleLine}>商品｜{msg.title}</h3>
              <p>¥ {msg.price} 起</p>
              <p>商品编号: {msg.commodityId}</p>
            </div>
          </div>
        break;
      default:
        //msgContents =
        //  <div>
        //    <div>msgType:{this.props.msgType}</div>
        //    <p style={this.styles.text}>暂不支持该类格式的消息!</p>
        //  </div>
        msgContents =
          <div>
            <div>msgType:{this.props.msgType}</div>
            <p style={this.styles.text}>{this.props.contents}</p>
          </div>
        break;
    }

    const body = (this.props.senderId == 100068)
      ? <div style={this.styles.leftContainer}>
          <img style={this.styles.avatar} src={this.props.avatar}/>
          <div style={this.styles.bubble}>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleAL)}>◆</span>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleBL)}>◆</span>
            {msgContents}
          </div>
        </div>
      : <div style={this.styles.rightContainer}>
          <div style={this.styles.bubble}>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleAR)}>◆</span>
            <span style={_.extend({}, this.styles.triangle, this.styles.triangleBR)}>◆</span>
            {msgContents}
          </div>
          <img style={this.styles.avatar} src={this.props.avatar}/>
        </div>;

    return body;
  }
});
