// 消息页面主容器

import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {ButtonToolbar, Button, Tabs, Tab, Input} from "/lib/react-bootstrap";

import {SystemMessagesList} from '/client/dumb-components/message/systemMessage/systemMessagesList';
import {ConversationViewList} from '/client/dumb-components/message/conversationView/conversationViewList';
import {ConversationContent} from '/client/dumb-components/message/conversationContent/conversationContent';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const message = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      conversationLimit: 15,
      activeStatus: 'message',
      //activeStatus: 'conversation', // 当前展示的是系统消息(message)还是对话(conversation)
      curUser: '瓜西', // 当前对话的用户
      //curUser: undefined
      curConversation: '', // 当前的对话id
      msgSubOptions: {} // 暂时只有limit
    }
  },

  // 清除其它的订阅(每次只保留一条sub)
  _clearPreviousSub(){
    if (BraavosCore.SubsManager.conversation._cacheList.length > 1){
      console.log(BraavosCore.SubsManager.conversation._cacheList.length);
      BraavosCore.SubsManager.conversation.unsubscribe(BraavosCore.SubsManagerStubs.conversation[0].key);
    };
    BraavosCore.SubsManagerStubs.conversation = [BraavosCore.SubsManagerStubs.conversation[1]];
  },

  getMeteorData() {
    const userId = parseInt(Meteor.userId());

    // 获取自己的信息
    const selfInfo = BraavosCore.SubsManager.account.ready() ? BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId}) : {};

    // 订阅conversationView
    BraavosCore.SubsManagerStubs.conversation.push(BraavosCore.SubsManager.conversation.subscribe("conversationViews", this.state.conversationLimit));
    this._clearPreviousSub();

    // 获取会话信息
    //const conversationViews = BraavosCore.SubsManager.conversation.ready() ? BraavosCore.Database.Hedy.ConversationView.find({'userId': userId}).fetch() : [];
    const conversationViews = BraavosCore.Database.Hedy.ConversationView.find({}).fetch() || [];
    conversationViews.map((
      conversationView => _.extend(conversationView, {key: conversationView._id._str})
    ));


    // 订阅msg
    const msgSubOptions = this.state.msgSubOptions;
    for (let key in msgSubOptions){
      Meteor.subscribe('messages', key, msgSubOptions[key].limit);
    };

    // 获取消息
    const msgs = BraavosCore.Database.Hedy.Message.find({conversation: new Meteor.Collection.ObjectID(this.state.curConversation)}, {sort: {updateTime: -1}}).fetch() || [];
    msgs.map((
      msg => _.extend(msg, {
        key: msg._id._str,

        // TODO 暂用
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80'
      })
    ));

    // TODO 伪造两个conversationId
    //if (conversationViews.length > 1){
    //  conversationViews[0].conversationId = new Meteor.Collection.ObjectID('558a3cc924aa9a0001f6d6d5');
    //  conversationViews[1].conversationId = new Meteor.Collection.ObjectID('55af6698e21b840001f57026');
    //};

    const orderMsgs = BraavosCore.Database.Hedy.Message.find({msgType: 20}, {sort: {timestamp: -1}}).fetch() || [];
    orderMsgs.map((
      msg => _.extend(msg, {
        // TODO 暂时加20, 以区分正常聊天中的交易消息 => 当正常聊天中不展示以后,这里就可以删除了
        //key: msg._id._str + '20',
        key: msg._id._str,
      })
    ));

    return {
      selfInfo: selfInfo,//avatar, userId, nickName
      conversationViews: conversationViews,
      orderMsgs: orderMsgs,
      msgs: msgs.push({
        "className" : "models.Message",
        "msgId" : 1,
        "senderId" : 201372,
        "receiverId" : 210962,
        "chatType" : "single",
        "contents" : "{\n  \"title\" : \"巴厘岛婚纱摄影\",\n  \"commodityId\" : 100714,\n  \"price\" : 300,\n  \"image\" : \"http:\\/\\/7sbm17.com1.z0.glb.clouddn.com\\/commodity\\/images\\/79e2dc7a0c45f2ee063dfb8c7786fd4e\"\n}",
        "msgType" : 19,
        "timestamp" : 1453091845655,
        "targets" : [
          210962,
          201372
        ]
      }) && msgs
    };
  },

  _setMsgLimit(limit){
    const msgSubOptions = this.state.msgSubOptions;
    _.extend(msgSubOptions[this.state.curConversation], {limit: limit});
    this.setState({
      msgSubOptions: msgSubOptions
    })
  },

  // 修改订阅的conversationView的limit限制
  _setConversationLimit(limit){
    this.setState({
      conversationLimit: limit
    });
  },

  // 点击切换会话的触发事件
  _changeConversation(conversationId){
    if (!this.state.msgSubOptions[conversationId]){
      this.state.msgSubOptions[conversationId] = {limit: 10};
    };

    if (this.state.curConversation != conversationId){
      this.setState({
        curConversation: conversationId,
        changeConversation: true
      });
    };
  },

  // 已达底部,修改状态
  _changeCoversationState(){
    this.setState({
      changeConversation: false
    });
  },

  // 响应statusTab的点击事件
  _handleTabChange(status){
    this.setState({
      activeStatus: status
    })
  },

  // 路由跳转前的动作
  componentWillUnmount(){
    // 替换回router中的订阅
    this._clearPreviousSub()
  },

  styles: {
    tabHeadList: {
      display: 'inline-block',
      margin: '0 15px',
      padding: 0,
      cursor: 'pointer'
    },
    tabHeadListItem: {
      border: '1px solid #aaa',
      borderBottom: 'none',
      display: 'inline-block',
      padding: '10px 20px'
    },
    tabHeadListItemActive: {
      //border: '1px solid #1ab394',
      border: '1px solid #18a689',
      borderBottom: 'none',
      //backgroundColor: '#1ab394',
      backgroundColor: '#18a689',
      color: 'white'
    },
    ibox: {
      //border: '1px solid #1ab394'
      border: '1px solid #18a689',
      backgroundColor: '#ffffff',
      width: 1000,
      height: 600
    }
  },

  render() {
    const prefix = 'message.';

    // Fake Data
    //let conversations = [];
    //const conversation = {
    //  // TODO 更进一步 => 判断是否今天的消息,然后选择是否展示确切的日期
    //  time: moment().format('hh:mm'),
    //  avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80',
    //  nickName: '瓜西',
    //  summary: '阿卡家连锁店返利卡公司付款拉高速'
    //};
    //
    //for (let i = 0;i < 100;i++) {
    //  conversations.push(conversation);
    //}

    // tab首部
    const tabHeadList =
      <ul style={this.styles.tabHeadList}>
        <li onClick={this._handleTabChange.bind(this, 'message')}
            style={(this.state.activeStatus == 'message') ? _.extend({}, this.styles.tabHeadListItem, this.styles.tabHeadListItemActive) : this.styles.tabHeadListItem}>
          消息中心
        </li>
        <li onClick={this._handleTabChange.bind(this, 'conversation')}
            style={(this.state.activeStatus == 'conversation') ? _.extend({}, this.styles.tabHeadListItem, this.styles.tabHeadListItemActive) : this.styles.tabHeadListItem}>
          聊天中心
        </li>
      </ul>;

    // tab主体
    const tabBody = (this.state.activeStatus == 'message')
      ? <div className="col-lg-12 fadeIn">
          <div className="ibox" style={_.extend({}, this.styles.ibox, {width: 600})}>
            <SystemMessagesList msgs={this.data.orderMsgs}/>
          </div>
        </div>
      : <div className="col-lg-12 fadeIn">
          <div className="ibox" style={this.styles.ibox}>
            <ConversationViewList
              conversations={this.data.conversationViews}
              setConversationLimit={this._setConversationLimit}
              changeConversation={this._changeConversation}
              limit={this.state.conversationLimit}
            />
            <ConversationContent
              user={this.state.curUser}
              msgs={this.data.msgs}
              setMsgLimit={this._setMsgLimit}
              changeConversation={this.state.changeConversation}
              changeCoversationState={this._changeCoversationState}
            />
          </div>
        </div>;

    return (
      <div className="message-mngm-wrap">
        <BraavosBreadcrumb />

        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            {tabHeadList}
            {tabBody}
          </div>
        </div>
      </div>
    );
  }
});

export const Message = message;
