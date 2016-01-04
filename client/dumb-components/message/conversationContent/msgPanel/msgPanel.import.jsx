// 消息展板
import {TimeBlock} from '/client/dumb-components/message/conversationContent/msgPanel/timeBlock';
import {MsgBlock} from '/client/dumb-components/message/conversationContent/msgPanel/msgBlock';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

export const MsgPanel = React.createClass({
  mixins: [IntlMixin],
  getInitialState(){
    return {
      msgs: [{
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100053,
        receiverId : 100068,
        chatType : "single",
        contents : "******test******",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }, {
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100068,
        receiverId : 100053,
        chatType : "single",
        contents : "******test******",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }, {
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100053,
        receiverId : 100068,
        chatType : "single",
        contents : "******test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1**********test**阿里山放假安徽省地方1****",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }, {
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100068,
        receiverId : 100053,
        chatType : "single",
        contents : "***阿里山放假安徽省地方1***test******",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }, {
        // TODO conversation为ObjectID,记得转化
        conversation : "558bd2dd24aa9a0001f6dc1b",
        msgId : 6,
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
        senderId : 100053,
        receiverId : 100068,
        chatType : "single",
        contents : "******test****阿里山放假安徽省地方1**",
        msgType : 0,
        timestamp : 1437106632058,
        targets : [100068, 100053]
      }]
    }
  },
  styles: {
    container: {
      width: 498,
      height: 350,
      boxSizing: 'border-box',
      borderBottom: '1px solid #ccc',
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
        <div style={this.styles.wrap}>
          <TimeBlock timestamp={1437106632058} />
          {this.state.msgs.map(msg => <MsgBlock {...msg}/>)}
        </div>
      </div>
    )
  }
});
