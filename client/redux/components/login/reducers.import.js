/**
 * 和用户登录页面相关的state
 *
 * Created by zephyre on 2/27/16.
 */

export const loginReducer = (state = fromJS({}), action) => {
  switch (action.type) {
    case 'SET_USER_NAME_INPUT':
      return state.set('userName', action.value);
    case 'SET_PASSWORD_INPUT':
      return state.set('password', action.value);
    case 'SET_LOGIN_FAILED_ALERT':
      return state.set('loginFailed', action.value);
    default:
      return state;
  }
};
