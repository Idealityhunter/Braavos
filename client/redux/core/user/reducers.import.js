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
 * @param keyName subscribedUserIds / subscribedSellerIds 该函数可以复用: 更新用户订阅, 以及更新商家订阅
 */
const updateSubscribedUsers = (state, type, users, keyName) => {
  const subscribed = state.get(keyName, Set());

  // 获得userId列表
  const userIdList = [];
  const pushId = (value) => {
    if (_.isNumber(value) && !_.isNaN(value)) {
      userIdList.push(value);
    }
  };
  if (_.isArray(users)) {
    for (let v of users) {
      pushId(v);
    }
  } else {
    pushId(users);
  }

  if (!_.isEmpty(userIdList)) {
    if (type === 'sub') {
      return state.set(keyName, subscribed.union(userIdList));
    } else if (type === 'unsub') {
      return state.set(keyName, subscribed.substract(userIdList));
    }
  }

  return state;
};

export const userReducer = (state = fromJS({}), action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER_ID':
      return setCurrentUserId(state, action.userId);
    case 'SUBSCRIBE_USERS':
      return updateSubscribedUsers(state, 'sub', action.userIds, 'subscribedUserIds');
    case 'UNSUBSCRIBE_USERS':
      return updateSubscribedUsers(state, 'unsub', action.userIds, 'subscribedUserIds');
    case 'SUBSCRIBE_SELLERS':
      return updateSubscribedUsers(state, 'sub', action.userIds, 'subscribedSellerIds');
    case 'UNSUBSCRIBE_SELLERS':
      return updateSubscribedUsers(state, 'unsub', action.userIds, 'subscribedSellerIds');
    default:
      return state;
  }
};

