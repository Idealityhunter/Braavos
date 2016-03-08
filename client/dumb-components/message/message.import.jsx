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
import { setInputValue, resetInputValue, setConversationLimit, setActiveTab, setActiveConversation, setMessageLimit, postMessage, setMessageStatus, setSearchWord, setSearchResult} from '/client/dumb-components/message/redux/action'

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
        // TODO 瀑布流展示
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
    // 展示的tab项
    activeTab: React.PropTypes.string,

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

    // 各种回调函数
    handlers: React.PropTypes.object

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

    // 预处理
    selfInfo.avatar = selfInfo.avatar ? selfInfo.avatar.url : selfInfo.avatar;

    // 订阅conversationView
    BraavosCore.SubsManagerStubs.conversation.push(BraavosCore.SubsManager.conversation.subscribe("conversationViews", this.props.conversationLimit || this.props.defaultConversationLimit));
    this._clearPreviousSub();

    // 获取会话信息
    //const conversationViews = BraavosCore.SubsManager.conversation.ready() ? BraavosCore.Database.Hedy.ConversationView.find({'userId': userId}).fetch() : [];
    const conversationViews = BraavosCore.Database.Hedy.ConversationView.find({'userId': userId}, {sort: {updateTime: -1}}).fetch() || [];

    // 添加key
    conversationViews.map(conversationView => _.extend(conversationView, {key: conversationView._id._str}));

    // 查找conversationView对应的conversation
    const conversationIds = conversationViews.map(conversationView => conversationView.conversationId);

    // 订阅conversationView对应的conversation
    Meteor.subscribe('conversations', conversationIds);

    // 查找conversation对应的userId(TODO: 目前只考虑单聊的情况)
    const conversations = BraavosCore.Database.Hedy.Conversation.find({'_id': {$in: conversationIds}}).fetch();
    const conversationUsers = conversations.map(conversation => parseInt(_.without(conversation.fingerprint && conversation.fingerprint.split('.') || [], userId.toString())[0]));

    // 订阅conversationView对应的userInfo信息
    Meteor.subscribe('userInfos', conversationUsers);

    // 记录activeConversation的nickName
    let activeConversationName = this.props.activeConversation;
    const self = this;

    // 添加头像/昵称(目前只考虑单聊的情况)
    conversationViews.map(conversationView => {
      // 获取会话相关用户
      const conversation = BraavosCore.Database.Hedy.Conversation.findOne({'_id': conversationView.conversationId}) || {};
      const conversationUserId = parseInt(_.without(conversation.fingerprint && conversation.fingerprint.split('.') || [], userId.toString())[0]);

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

    // TODO: 优化
    // 按timestamp插入pending消息
    let i = 0, j = 0;
    const postedMessages = this.props.postedMessages.toJS();
    while (i < msgs.length && j < pendingMsgs.length){
      if (msgs[i].timestamp > postedMessages[pendingMsgs[j]].timestamp){
        msgs.splice(i, 0, _.extend(postedMessages[pendingMsgs[j]], {status: 'pending', avatar: selfInfo.avatar}));
        j += 1;
      }else{
        i += 1;
      }
    };
    while (j < pendingMsgs.length){
      msgs.splice(i, 0, _.extend(postedMessages[pendingMsgs[j]], {status: 'pending', avatar: selfInfo.avatar}));
      j += 1;
    };

    // 按timestamp插入failed消息
    i = 0;j = 0;
    const failedMsgs = this.props.failedMessages.toJS()[this.props.activeConversation] || [];
    while (i < msgs.length && j < failedMsgs.length){
      if (msgs[i].timestamp > postedMessages[failedMsgs[j]].timestamp){
        msgs.splice(i, 0, _.extend(postedMessages[failedMsgs[j]], {status: 'failed', avatar: selfInfo.avatar}));
        j += 1;
      }else{
        i += 1;
      }
    };
    while (j < failedMsgs.length){
      msgs.splice(i, 0, _.extend(postedMessages[failedMsgs[j]], {status: 'failed', avatar: selfInfo.avatar}));
      j += 1;
    };

    return {
      // 用户信息 => 合并到userInfo中吧
      //selfInfo: selfInfo,//avatar, userId, nickName

      // TODO: userInfo: userAvatar&userId&avatar 群组聊天中用到

      // 会话列表
      conversationViews: conversationViews,//包括avatar

      // 订单消息(消息中心使用)
      orderMsgs: orderMsgs,

      // 聊天消息(聊天中心使用)
      msgs: msgs,

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
            <SystemMessagesList msgs={this.data.orderMsgs}/>
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
              msgs={this.data.msgs}
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

const SearchBox = React.createClass({
  getDefaultProps: () => {
    return {

    }
  },

  propTypes: {
    // 修改搜索词的回调函数
    onChangeSearchWord: React.PropTypes.func,

    // 返回搜索结果的回调函数
    onChangeSearchResult: React.PropTypes.func,

    // 搜索词
    searchWord: React.PropTypes.string,

    // 搜索结果
    matchedMessages: React.PropTypes.object
  },

  styles: {
    container: {
      width: 250,
      height: 35,
      borderBottom: '1px solid #ccc'
    },
    search: {
      input: {
        margin: '5px 20px',
        padding: '1px 4px',
        width: 210,
        height: 25,
        borderRadius: 2,
        border: '1px solid #ddd'
      },
      result: {
        backgroundColor: 'rgba(255,255,255,1)',
        position: 'relative',
        border: '1px solid #aaa',
        width: 210,
        left: 20,
        top: -5,
        padding: 5,
        borderTop: 'none',
        maxHeight: 300
      },
      scrollWrap: {
        overflow: 'auto',
        width: 200,
        maxHeight: 290
      },
      highlight: {
        color: 'red',
        margin: '0px 1px'
      },
      ul: {
        listStyle: 'none',
        padding: 0,
        margin: 0
      },
      conversationName: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        margin: 2
      },
      conversationMessages: {
        margin: 0,
        paddingLeft: 20,
        cursor: 'pointer'
      }
    }
  },

  // 获取搜索到的匹配的消息列表
  getMatchedMessageList(searchWord){
    const self = this;
    Meteor.call('search.message.match.contents', searchWord, (err , res) => {
      // TODO: 搜索失败或者数据为空(没查到该数据...)
      if (err || !res){
        BraavosCore.logger.debug('搜索消息失败');
        BraavosCore.logger.debug(err);
      };

      // 成功的搜索
      this.props.onChangeSearchResult(res.hits.hits);
    });
  },

  // 用户修改搜索词的处理动作
  _handleChangeSearchWord(e){
    // 修改搜索词
    this.props.onChangeSearchWord(e.target.value);

    // 获取搜索引擎的数据
    //if (!this.throttled)
    //  this.throttled = _.throttle(this.getMatchedMessageList, 2000);
    //this.throttled(e.target.value);
    if (!this.debounced)
      this.debounced = _.debounce(this.getMatchedMessageList, 500);
    this.debounced(e.target.value);
  },

  // 建立message和conversation的映射关系
  mapMessagesToConversations(messages){
    // 另外一种方式 => 假如不需要name的话可以使用
    //return _.groupBy(messages, message => message._source.conversation);
    return _.reduce(messages, (memo, message) => {
      if (memo[message._source.conversation])
        memo[message._source.conversation].messages.push(message)
      else
        memo[message._source.conversation] = {
          name: message._source.conversation, // TODO 换成nickName
          messages: [message]
        }
      return memo;
    }, {})
  },

  // 根据em分割contents
  splitContentByEm(contents){
    return contents.split(/\<\/?\e\m\>/)
  },

  // 将contents分割成'非highlight部分'和'highlight部分',并区别展示
  getSplitContents(contents){
    contents = this.splitContentByEm(contents)
    const htmlContents = [];

    // 奇数项为'highlight部分',需要着重展示
    for (let i=0;i < contents.length;i++){
      htmlContents.push(
        (i % 2)
          ? <span style={this.styles.search.highlight}>{contents[i]}</span>
          : contents[i]
      )
    };

    return htmlContents;
  },

  render() {
    const matchedMessages = this.props.matchedMessages && !this.props.matchedMessages.isEmpty() ? this.props.matchedMessages.toJS() : [];
    const conversationMessages = this.mapMessagesToConversations(matchedMessages);
    return(
      <div style={this.styles.container}>
        <input type="text" placeholder="搜索聊天记录"
               value={this.props.searchWord}
               style={this.styles.search.input}
               onChange={this._handleChangeSearchWord}/>
        <div style={this.styles.search.result} className={(this.props.searchWord && this.props.searchWord != '') ? '' : 'hidden'}>
          <div style={this.styles.search.scrollWrap}>
            {(matchedMessages.length > 0)
              ? <ul style={this.styles.search.ul}>
                  {_.map(conversationMessages, conversation => (
                    <li>
                      <h3 style={this.styles.search.conversationName} title={conversation.name}>{conversation.name}</h3>
                      {conversation.messages.map(message =>
                        <p style={this.styles.search.conversationMessages} className="hover-gainsboro">
                          {this.getSplitContents(message.highlight.contents[0])}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              : <div>未搜索到与'{this.props.searchWord}'相关的消息</div>
            }
          </div>
        </div>
      </div>
    )
  }
});
