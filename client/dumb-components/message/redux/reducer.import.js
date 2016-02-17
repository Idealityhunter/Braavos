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

import { fromJS, Map, List, Set } from '/lib/immutable'

export const messageReducer = (state = fromJS({
    messageLimits:{},
    postedMessages: {},
    pendingMessages: {},
    failedMessages: {}
  }), action) => {
    switch (action.type) {
      // 输入框内容改动
      case 'SET_INPUT_VALUE':
        return state.set('inputValue', action.content || '');
      case 'RESET_INPUT_VALUE':
        return state.set('inputValue', '');

      // 设置会话的数目限制
      case 'SET_CONVERSATION_LIMIT':
        return state.set('conversationLimit', action.limit || null);

      // 设置当前回话
      case 'SET_ACTIVE_CONVERSATION':
        return state.set('activeConversationId', action.conversationId);

      // 设置会话的消息的数目限制
      case 'SET_MESSAGE_LIMIT':
        return state.set('messageLimits', state.get('messageLimits').set(action.conversationId, action.limit));

      // 发送消息: 添加新消息,并加入pending集合
      case 'POST_MESSAGE':
        const msgId = action.msg._id._str;

        // 插入 postedMessage
        const tempState = state.set('postedMessages', state.get('postedMessages').set(msgId, fromJS(action.msg)));

        // 插入 pendingMessage
        const pendingMessages = tempState.getIn(['pendingMessages', action.conversationId], Set);
        return tempState.setIn(['pendingMessages', action.conversationId], pendingMessages.add(msgId));

      // 改变发送消息的状态
      case 'SET_MESSAGE_STATUS':
        // 发送消息成功
        if (action.status == 'success') {
          // 删除 pendingMessage
          const tempState = state.setIn(['pendingMessages', action.conversationId], state.getIn(['pendingMessages', action.conversationId]).delete(action.msgId));

          // 删除 postedMessage
          return tempState.set('postedMessages', tempState.get('postedMessages').delete(action.msgId));
        }

        // 发送消息失败
        if (action.status == 'fail') {
          // 插入 failedMessage
          const failedMessages = state.getIn(['failedMessages', action.conversationId], Set);
          const tempState = state.setIn(['failedMessages', action.conversationId], failedMessages.add(action.msgId));

          // 删除 pendingMessage
          return tempState.setIn(['pendingMessages', action.conversationId], tempState.getIn(['pendingMessages', action.conversationId]).delete(action.msgId));
        }

        return state;

      default:
        return state;
  };
};