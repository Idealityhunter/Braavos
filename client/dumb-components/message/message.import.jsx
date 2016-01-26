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
      curUser: '', // 当前对话的用户
      //curUser: undefined
      curConversation: '', // 当前的对话id
      msgSubOptions: {}, // 暂时只有limit

      // 存储pending的消息(弃用)
      //pendingMsgs: {
      //  [conversationName]: []
      //},
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
    const conversationViews = BraavosCore.Database.Hedy.ConversationView.find({'userId': userId}, {sort: {updateTime: -1}}).fetch() || [];
    conversationViews.map((
      conversationView => _.extend(conversationView, {key: conversationView._id._str})
    ));

    // 订阅msg
    const msgSubOptions = this.state.msgSubOptions;
    for (let key in msgSubOptions){
      Meteor.subscribe('messages', key, msgSubOptions[key].limit);
    };

    // 获取消息
    const msgs = BraavosCore.Database.Hedy.Message.find({conversation: new Meteor.Collection.ObjectID(this.state.curConversation)}, {sort: {timestamp: 1}}).fetch() || [];
    msgs.map((
      msg => _.extend(msg, {
        key: msg._id._str,

        // TODO 暂用
        avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2467440505,410519858&fm=80'
      })
    ));

    const orderMsgs = BraavosCore.Database.Hedy.Message.find({msgType: 20}, {sort: {timestamp: -1}}).fetch() || [];
    orderMsgs.map((
      msg => _.extend(msg, {
        key: msg._id._str,
      })
    ));

    // 获取pendingMsgs
    const allPendingMsgs = Session.get('pendingMsgs');
    let pendingMsgs = allPendingMsgs[this.state.curConversation];
    if (!pendingMsgs || !pendingMsgs.length) pendingMsgs = [];

    // 遍历pendingMsgs,找出receivedMsg
    let receivedMsgs = [];//记录已收到的pending消息
    for (let i = 0;i < pendingMsgs.length;i++)
      if (BraavosCore.Database.Hedy.Message.findOne({_id: pendingMsgs[i]._id}))
        receivedMsgs.push(i);

    // 清除receivedMsgs
    for(let i = receivedMsgs.length - 1;i >= 0;i--)
      pendingMsgs.splice(receivedMsgs[i], 1);

    // 更新pendingMsgs
    allPendingMsgs[this.state.curConversation] = pendingMsgs;
    Session.set('pendingMsgs', allPendingMsgs);

    // TODO (待测试)按timestamp插入
    let i = 0, j = 0;
    while (i < msgs.length && j < pendingMsgs.length){
      if (msgs[i].timestamp > pendingMsgs[j].timestamp){
        msgs.splice(i, 0, pendingMsgs[j]);
        j += 1;
      }else{
        i += 1;
      }
    };

    while (j < pendingMsgs.length){
      msgs.splice(i++, 0, pendingMsgs[j]);
      j += 1;
    };

    return {
      selfInfo: selfInfo,//avatar, userId, nickName
      conversationViews: conversationViews,
      orderMsgs: orderMsgs,
      //msgs: msgs.concat(pendingMsgs)
      msgs: msgs
    };
  },

  // 添加pending消息
  _appendPendingMsg(msg){
    const pendingMsgs = Session.get('pendingMsgs');
    pendingMsgs[msg.conversation._str] = [].concat(pendingMsgs[msg.conversation._str], msg);
    Session.set('pendingMsgs', pendingMsgs);
  },

  // 修改对应pendingMsg的状态为fail
  _failPendingMsg(msg){
    const pendingMsgs = Session.get('pendingMsgs');
    const index = _.findIndex(pendingMsgs[msg.conversation._str], pendingMsg => pendingMsg._id == msg._id);
    index && (pendingMsgs[msg.conversation._str][index].status = 'fail');
    Session.set('pendingMsgs', pendingMsgs);
  },

  // 修改订阅msg的数量限制
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
  _changeConversation(conversationId, user){
    if (!this.state.msgSubOptions[conversationId]){
      this.state.msgSubOptions[conversationId] = {limit: 10};
    };

    if (this.state.curConversation != conversationId){
      this.setState({
        curUser: user,
        curConversation: conversationId,
        changeConversation: true
      });
    };
  },

  // 滚动条已达底部,修改state状态
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
              curConversation={this.state.curConversation}
              appendPendingMsg={this._appendPendingMsg}
              failInSendingMsg={this._failPendingMsg}
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
