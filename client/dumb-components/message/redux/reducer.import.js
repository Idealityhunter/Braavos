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
 * - pendingMessages: {conversationId: {pendingMsgList}} Pending消息
 * - failedMessages: {conversationId: {failedMsgList}} Failed消息
 * - inputValue 用户输入的消息
 *
 * Created by lyn on 2/15/16.
 */

import { fromJS, Map, List } from '/lib/immutable'

/**
 * 和文本框相关的reducer
 */
export const inputReducer = (state = fromJS({}), action) => {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      // 输入框内容改动
      return action.content ? fromJS({}).set('inputValue', action.content) : fromJS({});
    case 'RESET_INPUT_VALUE':
      return fromJS({});
    default:
      return state;
  }
};

/**
 * 和会话相关的reducer
 */
const defaultConversationLimit = 10;
export const conversationReducer = (state = fromJS({conversationLimit: defaultConversationLimit}), action) => {
  switch (action.type) {
    // 设置会话的数目限制
    case 'SET_CONVERSATION_LIMIT':
      return action.limit ? state.set('conversationLimit', action.limit) : state.set('conversationLimit', defaultConversationLimit);
    case 'RESET_CONVERSATION_LIMIT':
      return state.set('conversationLimit', defaultConversationLimit);

    // 设置当前回话
    case 'SET_ACTIVE_CONVERSATION':
      return action.conversationId ? state.set('activeConversationId', action.conversationId) : state.set('conversationId', null);
    case 'RESET_ACTIVE_CONVERSATION':
      return state.set('conversationId', null);

    default:
      return state;
  }
};

/**
 * 和消息相关的reducer
 */

//TODO 初始值应该在模板里有吧? 是根据当前conversationLimit得到的MsgLimit的key

const defaultMessageLimit = 10;
export const messageReducer = (state = fromJS({pendingMessages: {}}), action) => {
  switch (action.type) {
    // 设置会话的消息的数目限制
    case 'SET_MESSAGE_LIMIT':
      return action.limit && action.conversationId ? state.set('messageLimits', state.get('messageLimits').set(action.conversationId, action.limit)) : state;
    case 'RESET_MESSAGE_LIMIT':
      return action.conversationId ? state.set('messageLimits', state.get('messageLimits').set(action.conversationId, defaultMessageLimit)) : state;

    // 添加pending消息
    case 'POST_MESSAGE':
      if (!action.conversationId || !state.get('pendingMessages').get(action.conversationId)){
        const tempState = state.set('pendingMessages', state.get('pendingMessages').set(action.conversationId, fromJS({})))
        return action.msg ? tempState.set('pendingMessages', tempState.get('pendingMessages').get(action.conversationId).set(action.msg._id._str, fromJS(action.msg))) : tempState;
      }

      // 比较两者的区别
      // 前者的话更严谨,但是合并的时候是否也会有麻烦 => 可以使用toJS()
      //return action.msg ? state.set('pendingMessages', state.get('pendingMessages').get(action.conversationId).push(action.msg)) : state;
      return action.msg ? state.set('pendingMessages', state.get('pendingMessages').get(action.conversationId).set(action.msg._id._str, fromJS(action.msg))) : state;

    // 改变发送消息的状态
    case 'SET_MESSAGE_STATUS':
      switch (action.status) {
        case 'success':
          // TODO try ... catch更合适吧?
          return action.msg && action.conversationId? state.set('pendingMessages', state.get('pendingMessages').get(action.conversationId).delete(action.msg._id._str)) : state;
        case 'failed':
          const tempState = action.msg && action.conversationId? state.set('pendingMessages', state.get('pendingMessages').get(action.conversationId).delete(action.msg._id._str)) : state;

          if (!action.conversationId || !state.get('failedMessages').get(action.conversationId)){
            const newTempState = tempState.set('pendingMessages', tempState.get('pendingMessages').set(action.conversationId, fromJS({})));
            return action.msg ? newTempState.set('pendingMessages', newTempState.get('pendingMessages').get(action.conversationId).set(action.msg._id._str, fromJS(action.msg))) : newTempState;
          }
          return action.msg ? tempState.set('pendingMessages', tempState.get('pendingMessages').get(action.conversationId).set(action.msg._id._str, fromJS(action.msg))) : tempState;
        default:
          return state;
      }
    default:
      return state;
  }
};