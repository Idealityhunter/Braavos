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
import { setSystemMessageLimit, setInputValue, resetInputValue, setConversationLimit, setActiveTab, setActiveConversation, setMessageLimit, postMessage, setMessageStatus, setSearchWord, setSearchResult} from '/client/dumb-components/message/redux/action'

// 普通组件引用
import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {SystemMessagesList} from '/client/dumb-components/message/systemMessage/systemMessagesList';
import {ConversationViewList} from '/client/dumb-components/message/conversationView/conversationViewList';
import {ConversationContent} from '/client/dumb-components/message/conversationContent/conversationContent';
import {SearchBox} from '/client/dumb-components/message/search/search';

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
        // TODO 瀑布流展示
        // 修改订阅的 systemMessage 的limit限制
        onChangeSystemMessageLimit: limit => dispatch(setSystemMessageLimit(limit)),

        // TODO 已读/未读展示
        // TODO 新消息提示
      },

      // 聊天部分相关的事件回调
      chatMessages: {
        // 修改输入框的内容
        onChangeInputValue: value => dispatch(setInputValue(value)),

        // 清除输入框的内容
        onClearInputValue: () => dispatch(setInputValue('')),

        // 修改订阅的conversationView的limit限制
        onChangeConversationLimit: limit => dispatch(setConversationLimit(limit)),

        // 切换tab
        onChangeActiveTab: tabItem => dispatch(setActiveTab(tabItem)),

        // 切换激活的会话
        onChangeActiveConversation: conversationId => dispatch(setActiveConversation(conversationId)),

        // 修改会话订阅的消息的数目上限
        onChangeMessageLimit: (conversationId, limit) => dispatch(setMessageLimit(conversationId, limit)),

        // 发送消息的回调函数
        onPostMessage: (msg, conversationId) =>  dispatch(postMessage(msg, conversationId)),

        // 消息发送成功的回调函数(注: 当订阅到该消息时才算成功)
        onSuccessMessage: (msgId, conversationId) => dispatch(setMessageStatus(msgId, conversationId, 'success')),

        // 消息发送失败的回调函数
        onFailedMessage: (msgId, conversationId) => dispatch(setMessageStatus(msgId, conversationId, 'failed')),

        // 修改搜索框的搜索词
        onChangeSearchWord: value => dispatch(setSearchWord(value)),

        // 修改搜索结果
        onChangeSearchResult: msgs => dispatch(setSearchResult(msgs))
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
            systemMessageLimit = {this.props.messageReducer.get('systemMessageLimit')}
            activeTab = {this.props.messageReducer.get('activeTab')}
            inputValue = {this.props.messageReducer.get('inputValue')}
            conversationLimit = {this.props.messageReducer.get('conversationLimit')}
            activeConversation = {this.props.messageReducer.get('activeConversation')}
            messageLimits = {this.props.messageReducer.get('messageLimits')}
            postedMessages = {this.props.messageReducer.get('postedMessages')}
            pendingMessages = {this.props.messageReducer.get('pendingMessages')}
            failedMessages = {this.props.messageReducer.get('failedMessages')}
            searchWord = {this.props.messageReducer.get('searchWord')}
            matchedMessages = {this.props.messageReducer.get('matchedMessages')}

            handlers = {this.props.handlers}/>
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
      // 默认系统消息的会话数
      defaultSystemMessageLimit: 6,

      // 默认订阅的会话数
      defaultConversationLimit: 9 + 2,//后者为disbledUser的长度

      // 默认不展示在聊天中的会话
      disabledUser: [0, 10004],

      // 会话默认订阅的消息数
      defaultMessageLimit: 10,

      // 默认头像(TODO: 区分个人默认头像和群组默认头像)
      defaultAvatar: 'http://taozi-uploads.qiniudn.com/avt_10000_1438680785981.jpg'
    }
  },

  propTypes: {
    // 展示的tab项
    activeTab: React.PropTypes.string,

    // 订阅系统消息的数目上限
    systemMessageLimit: React.PropTypes.object,

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

    // 搜索框的搜索词
    searchWord: React.PropTypes.string,

    // 根据搜索词匹配的消息
    matchedMessages: React.PropTypes.object,

    // 各种回调函数: 分为 systemMessages 和 chatMessages 两种
    handlers: React.PropTypes.object
  },

  // 清除其它的订阅(每次只保留一条sub)
  _clearPreviousSub(subscribeName){
    if (BraavosCore.SubsManager[subscribeName]._cacheList.length > 1){
      BraavosCore.SubsManager[subscribeName].unsubscribe(BraavosCore.SubsManagerStubs[subscribeName][0].key);
    };
    BraavosCore.SubsManagerStubs[subscribeName] = [BraavosCore.SubsManagerStubs[subscribeName][1]];
  },

  // 获取个人信息
  getUserInfo(userId){
    const userInfo = BraavosCore.SubsManager.account.ready() ? BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId}) : {};

    // 头像预处理
    userInfo.avatar = userInfo.avatar && userInfo.avatar.url || userInfo.avatar || this.props.defaultAvatar;

    return userInfo;
  },

  // 过滤非聊天对话
  filterConversation(conversationViews){
    // 删除指定对话(订单消息 / 好友通知)
    return _.remove(conversationViews, conversationView => conversationView.disabled);
  },

  // 根据用户 userId 获取会话列表(包括avatar,nickName)
  getConversationViews(userId){
    const conversationViews = BraavosCore.Database.Hedy.ConversationView.find({'userId': userId}, {sort: {updateTime: -1}}).fetch() || [];

    // 添加key
    conversationViews.map(conversationView => _.extend(conversationView, {key: conversationView._id._str}));

    return conversationViews;
  },

  // 订阅 systemMessage
  subSystemMessages(){
    // 订阅 systemMessage,并清除上一条订阅
    BraavosCore.SubsManagerStubs.systemMessage.push(BraavosCore.SubsManager.systemMessage.subscribe("systemMessages", this.props.systemMessageLimit || this.props.defaultSystemMessageLimit));

    // TODO: 这里需要清除上一次的 systemMessage 的订阅, 然而这里加上就会有加载的问题
    this._clearPreviousSub('systemMessage');
  },

  // 订阅 conversationView
  subConversationViews(){
    // 订阅 conversationView ,并清除上一条订阅
    BraavosCore.SubsManagerStubs.conversation.push(BraavosCore.SubsManager.conversation.subscribe("conversationViews", this.props.conversationLimit || this.props.defaultConversationLimit));
    this._clearPreviousSub('conversation');
  },

  // 订阅 conversation
  subConversations(conversationViews){
    // 查找 conversationView 对应的 conversation
    const conversationIds = conversationViews.map(conversationView => conversationView.conversationId);

    // 订阅 conversationView 对应的 conversation
    Meteor.subscribe('conversations', conversationIds);
  },

  // 获取 conversationViews 对应的 conversations
  getConversations(conversationViews){
    const conversationIds = conversationViews.map(conversationView => conversationView.conversationId);
    const conversations = BraavosCore.Database.Hedy.Conversation.find({'_id': {$in: conversationIds}}).fetch();

    return conversations;
  },

  // 订阅conversation 对应的 users
  subConversationUserInfo(conversations){
    const conversationUsers = _.reduce(conversations, (tempConversations, conversation) => {
      // 仅考虑单聊的情况下
      const users = conversation.fingerprint && conversation.fingerprint.split('.') || [];

      // 群聊的情况下
      //const users = conversation.fingerprint.participants || [];

      users.map(user => tempConversations.add(parseInt(user)));
      return tempConversations;
    }, new Set());

    Meteor.subscribe('userInfos', Array.from(conversationUsers));
  },

  // 根据 conversationId 获取 nickName 和 avatar
  getConversationMiscInfo(conversationId){
    const conversation = BraavosCore.Database.Hedy.Conversation.findOne({'_id': new Meteor.Collection.ObjectID(conversationId)}) || {};
    const fingerprintUsers = conversation.fingerprint && conversation.fingerprint.split('.') || [];

    // 获取会话相关用户(只获取第一个, 作为会话的 avatar 以及 nickName 来源)
    const conversationUserId = parseInt(_.without(fingerprintUsers, Meteor.userId())[0]);

    // fingerprintUsers为1时, 只代表群组号
    const conversationUser = (fingerprintUsers.length > 1) && BraavosCore.Database.Yunkai.UserInfo.findOne({userId: conversationUserId}) || {};

    // 获取 avatar (个人头像/默认头像)
    const conversationAvatar = conversationUser.avatar && conversationUser.avatar.url || conversationUser.avatar || this.props.defaultAvatar;

    // 获取 nickName (个人的昵称/群组的群号)
    const conversationName = conversationUser.nickName || `${conversation.fingerprint}群`;

    return {
      conversationUserId: conversationUserId,
      conversationAvatar: conversationAvatar,
      conversationName: conversationName
    }
  },

  // 向 conversationView 中添加 avatar,nickName 等 misc 信息
  addMiscInfo(conversationView){
    const miscInfo = this.getConversationMiscInfo(conversationView.conversationId._str);

    // 筛选部分对话(订单消息 / 好友通知)
    if (_.includes([0, 10002], miscInfo.conversationUserId)) return _.extend(conversationView, {disabled: true});

    return _.extend(conversationView, {avatar: miscInfo.conversationAvatar, nickName: miscInfo.conversationName});
  },

  // 获取 conversation 信息
  getConversationInfo(conversationViews, conversationId){
    return _.find(conversationViews, conversationView => conversationView.conversationId._str == conversationId) || {}
  },

  // 根据 conversationId 订阅消息
  subMessages(conversationId){
    Meteor.subscribe('messages', conversationId, this.props.messageLimits.get(conversationId, this.props.defaultMessageLimit));
  },

  // 获取订单相关的消息
  getOrderMessages(){
    const orderMessages = BraavosCore.Database.Hedy.Message.find({msgType: 20}, {sort: {timestamp: -1}}).fetch() || [];
    orderMessages.map((
      msg => _.extend(msg, {
        key: msg._id._str
      })
    ));

    return orderMessages;
  },

  // 根据 conversationId 获取 messages
  getConversationMessages(conversationId, selfInfo, conversationInfo){
    const messages = BraavosCore.Database.Hedy.Message.find({conversation: new Meteor.Collection.ObjectID(conversationId)}, {sort: {timestamp: 1}}).fetch() || [];
    messages.map((
      message => {
        // TODO 适配群聊
        // const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({userId: message.senderId}) || {};

        // 当前只考虑单聊情况,其它人全部使用默认头像
        const userInfo = (message.senderId == selfInfo.userId) ? selfInfo : _.extend({nickName: message.senderId}, conversationInfo);

        return _.extend(message, {
          key: message._id._str,
          // 个人: 获取用户信息! / 群组: 使用默认图片(logo)
          avatar: userInfo.avatar && userInfo.avatar.url || userInfo.avatar || this.props.defaultAvatar,
          nickName: userInfo.nickName
        })
      }
    ));

    return messages;
  },

  // 过滤 curPendingMessages 中已经发送成功( Mongo 中有)的 successMessages
  // 备注: 这里的 curPendingMessages 和 successMessages 都只是 ObjectID(字符串形式) 的集合
  filterSuccessMessages(curPendingMessages){
    // 遍历 curPendingMessages 找出 successMessages 的下标
    const successMessages = _.reduce(curPendingMessages, (memo, message) => {
      return (BraavosCore.Database.Hedy.Message.findOne({_id: new Meteor.Collection.ObjectID(message)}))
        ? _.extend(memo, {
            index: memo.index + 1,
            successMessages: _.concat(memo.successMessages, {
              index: memo.index,
              messageId: message
            })
          })
        : _.extend(memo, {index: memo.index + 1});
    }, {index: 0, successMessages: []}).successMessages;

    // 从 curPendingMessages 中过滤掉 successMessages,并修改 store 相应的 postedMessage 的状态
    const filteredPendingMessages = _.reduce(successMessages, (curPendingMessages, successMessage) => {
      this.props.handlers.chatMessages.onSuccessMessage(successMessage.messageId, this.props.activeConversation);
      return curPendingMessages.splice(successMessage.index, 1);
    }, curPendingMessages);

    return filteredPendingMessages;
  },

  // 将 messageIndexes 中的 messages 按照时间顺序依次插入 messages 中, 并插入 status(failed / pending) 作为标识
  mergeIntoMessages(messages, messageIndexes, status, selfInfo){
    const postedMessages = this.props.postedMessages.toJS();

    let i = 0, j = 0;
    while (i < messages.length && j < messageIndexes.length){
      if (messages[i].timestamp > postedMessages[messageIndexes[j]].timestamp){
        messages.splice(i, 0, _.extend(postedMessages[messageIndexes[j]], {status: status, avatar: selfInfo.avatar}));
        j += 1;
      }else{
        i += 1;
      }
    };
    while (j < messageIndexes.length){
      messages.splice(i, 0, _.extend(postedMessages[messageIndexes[j]], {status: status, avatar: selfInfo.avatar}));
      j += 1;
    };

    return messages;
  },

  getMeteorData() {
    const userId = parseInt(Meteor.userId());

    // 获取 selfInfo => TODO: It could be merged in userInfo list
    const selfInfo = this.getUserInfo(userId);

    // 订阅 systemMessages
    this.subSystemMessages();

    // 订阅 conversationView
    this.subConversationViews();

    // 获取 conversationViews
    const conversationViews = this.getConversationViews(userId);

    // 订阅 conversationViews 对应的 conversations
    this.subConversations(conversationViews);

    // 获取 conversationViews 对应的 conversations
    const conversations = this.getConversations(conversationViews);

    // 订阅 conversationView 对应的 userInfo 信息
    this.subConversationUserInfo(conversations);

    // 获取 conversation 的头像/昵称
    conversationViews.map(conversationView => this.addMiscInfo(conversationView));

    // 根据 disabled 字段过滤部分 conversation
    this.filterConversation(conversationViews);

    // 根据 activeConversation 订阅聊天相关的 message
    this.subMessages(this.props.activeConversation);

    // TODO(add): 修改订单消息的订阅

    // 获取 activeConversation 对应的 info
    const activeConversationInfo = this.getConversationInfo(conversationViews, this.props.activeConversation);
    const activeConversationName = activeConversationInfo.nickName || this.props.activeConversation;

    // 获取 activeConversation 对应的 messages
    const messages = this.getConversationMessages(this.props.activeConversation, selfInfo, activeConversationInfo);

    // 筛选出订单消息
    const orderMessages = this.getOrderMessages();

    // TODO: 将pendingMessages和failedMessages加入到messages中
    // TODO: pendingMessages过滤;

    // 过滤 this.props.pendingMessages 中的 successMessages
    const pendingMessages = this.filterSuccessMessages(this.props.pendingMessages.toJS()[this.props.activeConversation] || []);

    // 获取 failedMessages
    const failedMessages = this.props.failedMessages.toJS()[this.props.activeConversation] || [];

    // merge pendingMessages & failedMessages into messages
    const mergedMessages = _.reduce([{
      messages: pendingMessages,
      status: 'pending'
    }, {
      messages: failedMessages,
      status: 'failed'
    }], (messages, messageIndexes) => this.mergeIntoMessages(messages, messageIndexes.messages, messageIndexes.status, selfInfo), messages);

    // TODO 获取activeConversation对应的userInfo
    //const activeUserInfo =

    return {
      // 用户信息 => 合并到userInfo中吧
      //selfInfo: selfInfo,//avatar, userId, nickName

      // TODO: userInfo: userAvatar&userId&avatar 群组聊天中用到

      // 会话列表
      conversationViews: conversationViews,//包括avatar

      // 订单消息(消息中心使用)
      orderMessages: orderMessages,

      // 聊天消息(聊天中心使用)
      messages: mergedMessages,

      // activeConversation的名称
      activeConversationName: activeConversationName
    };
  },

  // 点击切换会话的触发事件
  _handleSetActiveConversation(conversationId){
    if (this.props.activeConversation != conversationId){
      this.props.handlers.chatMessages.onChangeActiveConversation(conversationId);
    };
  },

  // 路由跳转前的动作
  componentWillUnmount(){
    // 替换回router中的订阅
    this._clearPreviousSub('conversation');
    this._clearPreviousSub('systemMessage')
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
    },
    leftBar: {
      display: 'inline-block',
      borderRight: '1px solid #ccc',
      height: 598,
      width: 250
    }
  },

  render() {
    const prefix = 'message.';

    // tab首部
    const tabHeadList =
      <ul style={this.styles.tabHeadList}>
        <li onClick={() => this.props.handlers.chatMessages.onChangeActiveTab('message')}
            style={(this.props.activeTab == 'message') ? _.extend({}, this.styles.tabHeadListItem, this.styles.tabHeadListItemActive) : this.styles.tabHeadListItem}>
          消息中心
        </li>
        <li onClick={() => this.props.handlers.chatMessages.onChangeActiveTab('conversation')}
            style={(this.props.activeTab == 'conversation') ? _.extend({}, this.styles.tabHeadListItem, this.styles.tabHeadListItemActive) : this.styles.tabHeadListItem}>
          聊天中心
        </li>
      </ul>;

    // tab主体
    const tabBody = (this.props.activeTab == 'message')
      ? <div className="col-lg-12 fadeIn">
          <div className="ibox" style={_.extend({}, this.styles.ibox, {width: 600})}>
            <SystemMessagesList
              messages={this.data.orderMessages}
              systemMessageLimit={this.props.systemMessageLimit || this.props.defaultSystemMessageLimit}
              onChangeSystemMessageLimit={this.props.handlers.systemMessages.onChangeSystemMessageLimit}
            />
          </div>
        </div>
      : <div className="col-lg-12 fadeIn">
          <div className="ibox" style={this.styles.ibox}>
            <div className="left-bar" style={this.styles.leftBar}>
              <SearchBox
                onChangeSearchWord={this.props.handlers.chatMessages.onChangeSearchWord}
                onChangeSearchResult={this.props.handlers.chatMessages.onChangeSearchResult}
                matchedMessages={this.props.matchedMessages}
                searchWord={this.props.searchWord}
              />
              <ConversationViewList
                conversations={this.data.conversationViews}
                onChangeConversationLimit={this.props.handlers.chatMessages.onChangeConversationLimit}
                onChangeConversation={this._handleSetActiveConversation}
                conversationLimit={this.props.conversationLimit || this.props.defaultConversationLimit}
                activeConversation={this.props.activeConversation}
              />
            </div>
            <ConversationContent
              messages={this.data.messages}
              conversationId={this.props.activeConversation}
              conversationName={this.data.activeConversationName}
              messageLimit={this.props.messageLimits.get(this.props.activeConversation, this.props.defaultMessageLimit)}
              onChangeMessageLimit={this.props.handlers.chatMessages.onChangeMessageLimit}
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
