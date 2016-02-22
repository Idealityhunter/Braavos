/**
 * 消息页面主容器
 *
 * Created by lyn on 2/17/16.
 */

// 第三方引用
import {
  createStore, combineReducers, compose, Provider, connect, applyMiddleware, thunkMiddleware
} from '/lib/redux'
import { fromJS } from '/lib/immutable'
import {ButtonToolbar, Button, Tabs, Tab, Input} from "/lib/react-bootstrap";

// redux相关组件引用
import { messageReducer } from '/client/dumb-components/message/redux/reducer'
import { setInputValue, resetInputValue, setConversationLimit, setActiveConversation, setMessageLimit, postMessage, setMessageStatus } from '/client/dumb-components/message/redux/action'

// 普通组件引用
import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {SystemMessagesList} from '/client/dumb-components/message/systemMessage/systemMessagesList';
import {ConversationViewList} from '/client/dumb-components/message/conversationView/conversationViewList';
import {ConversationContent} from '/client/dumb-components/message/conversationContent/conversationContent';

const reducer = combineReducers({messageReducer: messageReducer});
const store = createStore(reducer, compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

const mapStateToProps = (state) => state

const mapDispatchToProps = (dispatch) => {
  return {
    handlers: {
      // 系统通知部分相关的事件回调
      systemMessages: {

      },

      // 聊天部分相关的事件回调
      chatMessages: {
        // 修改输入框的内容
        onChangeInputValue: value => dispatch(setInputValue(value)),

        // 清除输入框的内容
        onClearInputValue: () => dispatch(setInputValue('')),

        // 修改订阅的conversationView的limit限制
        onChangeConversationLimit: limit => dispatch(setConversationLimit(limit)),

        // 切换激活的会话
        onChangeActiveConversation: conversationId =>  dispatch(setActiveConversation(conversationId)),

        // 修改会话订阅的消息的数目上限
        onChangeMessageLimit: (conversationId, limit) => dispatch(setMessageLimit(conversationId, limit)),

        // 发送消息的回调函数
        onPostMessage: (msg, conversationId) =>  dispatch(postMessage(msg, conversationId)),

        // 消息发送成功的回调函数(注: 当订阅到该消息时才算成功)
        onSuccessMessage: (msgId, conversationId) => dispatch(setMessageStatus(msgId, conversationId, 'success')),

        // 消息发送失败的回调函数
        onFailedMessage: (msgId, conversationId) => dispatch(setMessageStatus(msgId, conversationId, 'failed'))
      }
    }
  }
};

const Container = connect(mapStateToProps, mapDispatchToProps)(
  React.createClass({
    propTypes: {
      // store中存储的states
      messageReducer: React.PropTypes.object,

      // 各种回调函数
      handlers: React.PropTypes.object
    },

    render() {
      return (
        <div className="message-mngm-wrap">
          <BraavosBreadcrumb />
          <MessageContent
            inputValue = {this.props.messageReducer.get('inputValue')}
            conversationLimit = {this.props.messageReducer.get('conversationLimit')}
            activeConversation = {this.props.messageReducer.get('activeConversation')}
            messageLimits = {this.props.messageReducer.get('messageLimits')}
            postedMessages = {this.props.messageReducer.get('postedMessages')}
            pendingMessages = {this.props.messageReducer.get('pendingMessages')}
            failedMessages = {this.props.messageReducer.get('failedMessages')}

            handlers={this.props.handlers}/>
        </div>
      );
    }
  })
);

export const Message = () => <Provider store={store}><Container /></Provider>;

const MessageContent = React.createClass({
  mixins: [ReactMeteorData],

  getDefaultProps: () => {
    return {
      // 默认订阅的会话数
      defaultConversationLimit: 10 + 2,//后者为disbledUser的长度

      // 默认不展示在聊天中的会话
      disabledUser: [0, 10004],

      // 会话默认订阅的消息数
      defaultMessageLimit: 10,

      // 默认头像(TODO: 区分个人默认头像和群组默认头像)
      defaultAvatar: 'http://taozi-uploads.qiniudn.com/avt_10000_1438680785981.jpg'
    }
  },
  propTypes: {
    // 是否可以添加conversationLimit
    changeConversation: React.PropTypes.bool,

    // 输入框中的消息内容
    inputValue: React.PropTypes.string,

    // 订阅会话的数目上限
    conversationLimit: React.PropTypes.number,

    // 当前激活会话的Id
    activeConversation: React.PropTypes.string,

    // 订阅消息的数目上限
    messageLimits: React.PropTypes.object,

    // 发送消息的缓存
    postedMessages: React.PropTypes.object,

    // 发送未成功消息的缓存
    pendingMessages: React.PropTypes.object,

    // 发送已失败消息的缓存
    failedMessages: React.PropTypes.object,

    // 各种回调函数
    handlers: React.PropTypes.object

  },

  getInitialState(){
    return {
      activeStatus: 'message',
      //activeStatus: 'conversation', // 当前展示的是系统消息(message)还是对话(conversation)
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
    console.log(this.props);

    const userId = parseInt(Meteor.userId());

    // 获取自己的信息
    const selfInfo = BraavosCore.SubsManager.account.ready() ? BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId}) : {};

    // 订阅conversationView
    BraavosCore.SubsManagerStubs.conversation.push(BraavosCore.SubsManager.conversation.subscribe("conversationViews", this.props.conversationLimit || this.props.defaultConversationLimit));
    this._clearPreviousSub();

    // 获取会话信息
    //const conversationViews = BraavosCore.SubsManager.conversation.ready() ? BraavosCore.Database.Hedy.ConversationView.find({'userId': userId}).fetch() : [];
    const conversationViews = BraavosCore.Database.Hedy.ConversationView.find({'userId': userId}, {sort: {updateTime: -1}}).fetch() || [];

    // 添加key
    conversationViews.map(conversationView => _.extend(conversationView, {key: conversationView._id._str}));

    // 获取会话的头像 conversationView(conversationId) => conversation(userId) => userInfo(avatar)
    //const conversationViewAvatars = conversationViews.map((conversationView) => {
    //
    //})

    // 查找conversationView对应的conversation
    const conversationIds = conversationViews.map(conversationView => conversationView.conversationId);

    // 订阅conversationView对应的conversation
    Meteor.subscribe('conversations', conversationIds);

    // 查找conversation对应的userId
    const conversations = BraavosCore.Database.Hedy.Conversation.find({'_id': {$in: conversationIds}}).fetch();
    const conversationUsers = conversations.map(conversation => parseInt(_.without(conversation.fingerprint && conversation.fingerprint.split('.') || [], selfInfo.userId.toString())[0]));

    // 订阅conversationView对应的userInfo信息(TODO: 目前只考虑单聊的情况)
    Meteor.subscribe('userInfos', conversationUsers);

    // 记录activeConversation的nickName
    let activeConversationName = this.props.activeConversation;
    const self = this;

    // 目前只考虑单聊的情况
    conversationViews.map(conversationView => {
      // 获取会话相关用户
      const conversation = BraavosCore.Database.Hedy.Conversation.findOne({'_id': conversationView.conversationId}) || {};
      const conversationUserId = parseInt(_.without(conversation.fingerprint && conversation.fingerprint.split('.') || [], selfInfo.userId.toString())[0]);

      // 筛选部分对话(订单消息 / 好友通知)
      if (_.includes([0, 10002], conversationUserId)) return _.extend(conversationView, {disabled: true});

      // 获取头像
      const conversationUser = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: conversationUserId}) || {};
      const conversationAvatar = conversationUser.avatar && conversationUser.avatar.url || conversationUser.avatar || this.props.defaultAvatar;

      // 个人的昵称/群组的群号
      const conversationName = conversationUser.nickName || `${conversation.fingerprint}群`;

      _.extend(conversationView, {avatar: conversationAvatar, nickName: conversationName});

      if (conversationView.conversationId._str == self.props.activeConversation)
        activeConversationName = conversationName;
    });

    // 删除指定对话(订单消息 / 好友通知)
    _.remove(conversationViews, conversationView => conversationView.disabled);

    // 订阅msg
    const activeConversation = this.props.activeConversation;
    Meteor.subscribe('messages', activeConversation, this.props.messageLimits.get(activeConversation, this.props.defaultMessageLimit));

    // 获取消息
    const msgs = BraavosCore.Database.Hedy.Message.find({conversation: new Meteor.Collection.ObjectID(this.props.activeConversation)}, {sort: {timestamp: 1}}).fetch() || [];
    msgs.map((
      msg => {
        const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: msg.senderId}) || {};

        // 个人: 获取用户信息! / 群组: 使用默认图片(logo)
        const avatar = userInfo.avatar && userInfo.avatar.url || userInfo.avatar ||this.props.defaultAvatar;

        return _.extend(msg, {
          key: msg._id._str,
          avatar:  avatar
        })
      }
    ));

    // 筛选出订单消息
    const orderMsgs = BraavosCore.Database.Hedy.Message.find({msgType: 20}, {sort: {timestamp: -1}}).fetch() || [];
    orderMsgs.map((
      msg => _.extend(msg, {
        key: msg._id._str,
      })
    ));

    // 获取当前会话对应的pendingMsgs
    const allPendingMsgs = this.props.pendingMessages.toJS();
    let pendingMsgs = allPendingMsgs[this.props.activeConversation] || [];

    // 遍历pendingMsgs,找出已收到的msg
    let receivedMsgs = [];//记录已收到的pending消息
    for (let i = 0;i < pendingMsgs.length;i++)
      if (BraavosCore.Database.Hedy.Message.findOne({_id: new Meteor.Collection.ObjectID(pendingMsgs[i])}))
        receivedMsgs.push(i);

    // 从pendingMsgs中过滤掉已收到的msg
    for(let i = receivedMsgs.length - 1;i >= 0;i--){
      // 更新已收到的msg的状态
      this.props.handlers.chatMessages.onSuccessMessage(receivedMsgs[i], this.props.activeConversation);
      pendingMsgs.splice(receivedMsgs[i], 1);
    };

    // TODO: 待测试 (按timestamp插入pending消息) => 优化
    let i = 0, j = 0;
    const postedMessages = this.props.postedMessages.toJS();
    while (i < msgs.length && j < pendingMsgs.length){
      if (msgs[i].timestamp > postedMessages[pendingMsgs[j]].timestamp){
        msgs.splice(i, 0, _.extend(postedMessages[pendingMsgs[j]], {status: 'pending', avatar: selfInfo.avatar && selfInfo.avatar.url || selfInfo.avatar}));
        j += 1;
      }else{
        i += 1;
      }
    };
    while (j < pendingMsgs.length){
      msgs.splice(i, 0, _.extend(postedMessages[pendingMsgs[j]], {status: 'pending', avatar: selfInfo.avatar && selfInfo.avatar.url || selfInfo.avatar}));
      j += 1;
    };

    // TODO: 待测试 (按timestamp插入failed消息)
    i = 0;j = 0;
    const failedMsgs = this.props.failedMessages.toJS()[this.props.activeConversation] || [];
    while (i < msgs.length && j < failedMsgs.length){
      if (msgs[i].timestamp > postedMessages[failedMsgs[j]].timestamp){
        msgs.splice(i, 0, _.extend(postedMessages[failedMsgs[j]], {status: 'failed', avatar: selfInfo.avatar && selfInfo.avatar.url || selfInfo.avatar}));
        j += 1;
      }else{
        i += 1;
      }
    };
    while (j < failedMsgs.length){
      msgs.splice(i, 0, _.extend(postedMessages[failedMsgs[j]], {status: 'failed', avatar: selfInfo.avatar && selfInfo.avatar.url || selfInfo.avatar}));
      j += 1;
    };

    return {
      // 用户信息
      selfInfo: selfInfo,//avatar, userId, nickName

      // 会话列表
      conversationViews: conversationViews,//包括avatar

      // TODO: userInfo: userAvatar&userId&avatar 群组聊天中用到

      // 订单消息(消息中心使用)
      orderMsgs: orderMsgs,

      // 聊天消息(聊天中心使用)
      msgs: msgs,

      // activeConversation的nickName
      activeConversationName: activeConversationName
    };
  },

  // 点击切换会话的触发事件
  _handleSetActiveConversation(conversationId){
    if (this.props.activeConversation != conversationId){
      this.props.handlers.chatMessages.onChangeActiveConversation(conversationId);

      // TODO to store => 优化
      this.setState({
        changeConversation: true
      });
    };
  },

  // 滚动条已达底部,修改state状态
  _changeConversationState(){
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
              onChangeConversationLimit={this.props.handlers.chatMessages.onChangeConversationLimit}
              onChangeConversation={this._handleSetActiveConversation}
              conversationLimit={this.props.conversationLimit || this.props.defaultConversationLimit}
            />
            <ConversationContent
              msgs={this.data.msgs}
              conversationId={this.props.activeConversation}
              conversationName={this.data.activeConversationName}
              messageLimit={this.props.messageLimits.get(this.props.activeConversation, this.props.defaultMessageLimit)}
              onChangeMessageLimit={this.props.handlers.chatMessages.onChangeMessageLimit}
              changeConversation={this.state.changeConversation}
              changeConversationState={this._changeConversationState}
              onPostMessage={this.props.handlers.chatMessages.onPostMessage}
              onFailedMessage={this.props.handlers.chatMessages.onFailedMessage}

              onChangeInputValue={this.props.handlers.chatMessages.onChangeInputValue}
              onClearInputValue={this.props.handlers.chatMessages.onClearInputValue}
              inputValue={this.props.inputValue}
            />
          </div>
        </div>;

    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          {tabHeadList}
          {tabBody}
        </div>
      </div>
    );
  }
});

