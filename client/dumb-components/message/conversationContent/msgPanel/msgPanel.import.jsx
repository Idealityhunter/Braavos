// 消息展板
import {TimeBlock} from '/client/dumb-components/message/conversationContent/msgPanel/timeBlock';
import {MsgBlock} from '/client/dumb-components/message/conversationContent/msgPanel/msgBlock';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const MsgPanel = React.createClass({
  mixins: [IntlMixin],

  // 存储当前DOM的总高度(包括由于滚动原因未展示部分)
  curScrollHeight: null,

  propTypes: {
    // 消息列表
    msgs: React.PropTypes.array,

    // 订阅消息的总数
    messageLimit: React.PropTypes.number,

    // 会话Id
    conversationId: React.PropTypes.string,

    // 修改MessageLimit的方法
    onChangeMessageLimit: React.PropTypes.func,

    // TODO: 优化
    // 是否可以添加conversationLimit
    changeConversation: React.PropTypes.bool,

    // TODO: 优化
    changeConversationState: React.PropTypes.func
  },

  componentDidMount(){
    const node = this.getDOMNode();
    const scrollEle = $(node).children();

    // 进入页面时滚动条在底部
    scrollEle[0].scrollTop = scrollEle[0].scrollHeight - scrollEle[0].offsetHeight;
  },

  componentWillUpdate() {
    const node = this.getDOMNode();
    const scrollEle = $(node).children();

    // 存储当前总高度
    this.curScrollHeight = scrollEle[0].scrollHeight;
  },

  componentDidUpdate() {
    // container元素
    const node = this.getDOMNode();

    // 滚动条所在的元素
    const scrollEle = $(node).children();

    // 当前高度控制
    scrollEle[0].scrollTop += (scrollEle[0].scrollHeight - this.curScrollHeight);

    // 假如是切换了conversation引发的更新,那么scrollEle[0]要改变
    if (this.props.changeConversation){
      scrollEle[0].scrollTop = scrollEle[0].scrollHeight - scrollEle[0].offsetHeight;
      this.props.changeConversationState();
    };
  },

  // 滚轮的监测事件
  _handleScroll(e){
    if (e.target.scrollTop < 50){
      this.props.onChangeMessageLimit(this.props.conversationId, this.props.limit + 10);
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
      <div style={this.styles.container}>
        <div style={this.styles.wrap} onScroll={this._handleScroll}>
          {/*为了获取消息占的总高度*/}
          <div>
            {/**<TimeBlock timestamp={1437106632058} />**/}
            {this.props.msgs.map(msg => <MsgBlock {...msg}/>)}
          </div>
        </div>
      </div>
    )
  }
});
