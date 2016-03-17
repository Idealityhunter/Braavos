/**
 * 和消息页相关的reducer
 *
 * 有下列remote states需要保存(这部分状态, 使用Meteor本身的机制来管理):
 * - conversationList 当前会话列表
 * - [msgList] 会话的消息列表
 *
 * 有下列local states需要保存(使用redux来管理):
 * - activeConversation 当前会话ID
 * - conversationLimit 会话列表的Limit
 * - messageLimits: {conversationId: msgLimit} 会话的消息列表的Limit
 * - postedMessages: {msgId: msgContent} 发送的消息
 * - pendingMessages: {cId: [msgId]} Pending消息
 * - failedMessages: {cId: [msgId]} Failed消息
 * - inputValue 用户输入的消息
 *
 * Created by lyn on 2/15/16.
 */

import { fromJS, Immutable } from '/lib/immutable'

export const messageReducer = (state = fromJS({
    // 系统消息的订阅数
    systemMessageLimit: null,

    // 搜索词
    searchWord: null,

    // 消息发送框的内容
    inputValue: null,

    // 会话的订阅数
    conversationLimit: null,

    // 当前对话Id
    activeConversation: null,

    // 当前tab项
    activeTab: 'message',//'message' or 'conversation'

    // 每个对话的消息订阅数
    messageLimits:{},

    // 发送的消息存储列表
    postedMessages: {},

    // 未返回发送状态的消息的ID列表
    pendingMessages: {},

    // 发送失败的消息的ID列表
    failedMessages: {}
  }), action) => {
    switch (action.type) {
      // 设置系统消息的数目限制
      case 'SET_SYSTEM_MESSAGE_LIMIT':
        return state.set('systemMessageLimit', action.limit || null);

      // 设置搜索结果
      case 'SET_SEARCH_RESULT':
        return state.set('matchedMessages', fromJS(action.msgs));

      // 设置搜索词
      case 'SET_SEARCH_WORD':
        return state.set('searchWord', action.content || '');

      // 设置当前tab展示项
      case 'SET_ACTIVE_TAB':
        return state.set('activeTab', action.tabItem);

      // 输入框内容改动
      case 'SET_INPUT_VALUE':
        return state.set('inputValue', action.content || '');

      // 设置会话的数目限制
      case 'SET_CONVERSATION_LIMIT':
        return state.set('conversationLimit', action.limit || null);

      // 设置当前回话
      case 'SET_ACTIVE_CONVERSATION':
        return state.set('activeConversation', action.conversationId);

      // 设置会话的消息的数目限制
      case 'SET_MESSAGE_LIMIT':
        return state.set('messageLimits', state.get('messageLimits').set(action.conversationId, action.limit));

      // 发送消息: 添加新消息,并加入pending集合
      case 'POST_MESSAGE':
        const msgId = action.msg._id._str;

        // 插入 postedMessage
        const tempState = state.set('postedMessages', state.get('postedMessages').set(msgId, fromJS(action.msg)));

        // 插入 pendingMessage
        const pendingMessages = tempState.getIn(['pendingMessages', action.conversationId], Immutable.Set());
        return tempState.setIn(['pendingMessages', action.conversationId], pendingMessages.add(msgId));

      // 改变发送消息的状态
      case 'SET_MESSAGE_STATUS':
        // 发送消息成功
        if (action.status == 'success') {
          // 从 pendingMessages 中删除相应的 message
          const tempState = state.setIn(['pendingMessages', action.conversationId], state.getIn(['pendingMessages', action.conversationId]).delete(action.msgId));

          // 从 postedMessage 中删除相应的 message
          return tempState.set('postedMessages', tempState.get('postedMessages').delete(action.msgId));
        }

        // 发送消息失败
        if (action.status == 'failed') {
          // 将 message 插入到 failedMessages 中
          const failedMessages = state.getIn(['failedMessages', action.conversationId], Immutable.Set());
          const tempState = state.setIn(['failedMessages', action.conversationId], failedMessages.add(action.msgId));

          // 从 pendingMessages 中删除相应的 message
          return tempState.setIn(['pendingMessages', action.conversationId], tempState.getIn(['pendingMessages', action.conversationId]).delete(action.msgId));
        }
        return state;

      default:
        return state;
  };
};