/**
 * 用户账户相关的reducer
 *
 * Created by zephyre on 2/27/16.
 */

import { fromJS, Set } from '/lib/immutable.import'

/**
 * 设置当前登录的用户ID
 *
 * @param state
 * @param userId
 */
const setCurrentUserId = (state, userId) => state.set('currentUserId', userId);

/**
 * 更新订阅用户的列表
 *
 * @param state
 * @param type 是订阅(sub), 还是取消订阅(unsub)?
 * @param users 用户的ID. 可以是数组, 也可以是数字
 */
const updateSubscribedUsers = (state, type, users) => {
  const subscribed = state.get('subscribedUserIds', Set());

  let userIdList = [];
  if (_.isNumber(users)) {
    userIdList = [users];
  } else if (_.isArray(users)) {
    userIdList = users;
  }

  if (!_.isEmpty(userIdList)) {
    if (type === 'sub') {
      return state.set('subscribedUserIds', subscribed.union(userIdList));
    } else if (type === 'unsub') {
      return state.set('subscribedUserIds', subscribed.substract(userIdList));
    }
  }

  return state;
};

export const userReducer = (state = fromJS({}), action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER_ID':
      return setCurrentUserId(state, action.userId);
    case 'SUBSCRIBE_USERS':
      return updateSubscribedUsers(state, 'sub', action.userIds);
    case 'UNSUBSCRIBE_USERS':
      return updateSubscribedUsers(state, 'unsub', action.userIds);
    default:
      return state;
  }
};

