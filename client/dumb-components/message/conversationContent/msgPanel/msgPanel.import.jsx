// 消息展板
import {TimeBlock} from '/client/dumb-components/message/conversationContent/msgPanel/timeBlock';
import {MsgBlock} from '/client/dumb-components/message/conversationContent/msgPanel/msgBlock';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const MsgPanel = React.createClass({
  mixins: [IntlMixin],

  // 存储当前DOM的总高度(包括由于滚动原因未展示部分)
  tempScrollHeight: null || 0,

  propTypes: {
    // 消息列表
    msgs: React.PropTypes.array,

    // 订阅消息的总数
    messageLimit: React.PropTypes.number,

    // 会话Id
    conversationId: React.PropTypes.string,

    // 修改MessageLimit的方法
    onChangeMessageLimit: React.PropTypes.func
  },

  // 暂时弃用, 因为不需要, 当第一次加载时, 是activeConversation第一次确定时, 此时msg还没有准备好
  //componentDidMount(){
  //  // 获取滚动列表元素
  //  const scrollEle = ReactDOM.findDOMNode(this).childNodes[0];
  //  // 初始化时,将滚动条移到底部
  //  scrollEle.scrollTop = scrollEle.scrollHeight - scrollEle.offsetHeight;
  //},

  componentWillUpdate() {
    // 获取滚动列表元素
    const scrollEle = ReactDOM.findDOMNode(this).childNodes[0];

    // 存储当前滚动列表的总高度
    this.tempScrollHeight = scrollEle.scrollHeight;
  },

  componentDidUpdate(prevProps, prevState) {
    // 获取滚动列表元素
    const scrollEle = ReactDOM.findDOMNode(this).childNodes[0];

    // 获取当前滚动列表的总高度
    const curScrollHeight = scrollEle.scrollHeight;

    // 这里希望用prevProps和this.props的conversationId比较来判断是否changeConversation,可是第一次加载的时候因为这个
    //if (this.props.changeConversation){

    if (this.props.conversationId != prevProps.conversationId){
      // 假如是切换了conversation引发的更新,那么将滚动条移到底部
      // TODO Bug: 有图片时, 因为图片加载前高度为40px, 加载后为484px...
      scrollEle.scrollTop = curScrollHeight - scrollEle.offsetHeight;
    }else{
      // 将当前滚动条高度滚至新消息加载前看到的消息节点
      scrollEle.scrollTop += (curScrollHeight - this.tempScrollHeight);
    }
  },

  // 滚轮的监测事件 => throttle控制触发
  _handleScroll(e){
    if (e.target.scrollTop < 50){
      this.props.onChangeMessageLimit(this.props.conversationId, this.props.messageLimit + 10);
    }
  },

  styles: {
    container: {
      width: 498,
      height: 350,
      boxSizing: 'border-box',
      borderBottom: '1px solid #ccc'
    },
    wrap: {
      width: 498,
      height: 346,
      boxSizing: 'border-box',
      marginTop: 2, //对齐左侧
      marginBottom: 2,
      padding: '10px 0 20px',
      overflow: 'auto'
    }
  },
  render(){
    return (
      <div className="messages-container" style={this.styles.container}>
        <div className="scroll-wrap" style={this.styles.wrap} onScroll={_.throttle(this._handleScroll, 1000)}>
          {/*为了获取消息占的总高度*/}
          <div className="scroll-bar">
            {/**<TimeBlock timestamp={1437106632058} />**/}
            {this.props.msgs.map(msg => <MsgBlock {...msg}/>)}
          </div>
        </div>
      </div>
    )
  }
});
