// 消息展板
import {TimeBlock} from '/client/dumb-components/message/conversationContent/msgPanel/timeBlock';
import {MsgBlock} from '/client/dumb-components/message/conversationContent/msgPanel/msgBlock';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const MsgPanel = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    msgs: React.PropTypes.array,
    setMsgLimit: React.PropTypes.func,
    changeConversation: React.PropTypes.bool,
    changeCoversationState: React.PropTypes.func
  },

  componentDidMount(){
    const node = this.getDOMNode();
    const scrollEle = $(node).children();

    // 进入页面时滚动条在底部
    scrollEle[0].scrollTop = scrollEle[0].scrollHeight - scrollEle[0].offsetHeight;
  },

  // 滚轮的监测事件
  _handleScroll(e){
    if (e.target.scrollTop < 50){
      this.props.setMsgLimit(this.props.limit + 10);
    }
  },

  componentWillUpdate() {
    const node = this.getDOMNode();
    const scrollEle = $(node).children();

    // 存储当前总高度
    this.preScrollHeight = scrollEle[0].scrollHeight;
  },

  componentDidUpdate() {
    const node = this.getDOMNode();
    const scrollEle = $(node).children();

    // 当前高度控制
    scrollEle[0].scrollTop += (scrollEle[0].scrollHeight - this.preScrollHeight);

    if (this.props.changeConversation){
      scrollEle[0].scrollTop = scrollEle[0].scrollHeight - scrollEle[0].offsetHeight;
      this.props.changeCoversationState();
    };
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
