/**
 * 初始化Redux Store
 *
 * Store layout:
 *
 * {
 *   core: {    // 和组件无关的一些数据(比如: 当前订阅了哪些用户? 等等)
 *     user: {}
 *   },
 *   components: {    // 和组件UI相关的state
 *     login: {},
 *     register: {},
 *     ...
 *   },
 * }
 *
 * Created by zephyre on 2/27/16.
 */

import {userReducer} from '/client/redux/core/user/reducers'
import {setCurrentUserId} from '/client/redux/core/user/action'
import {loginReducer} from '/client/redux/components/login/reducers'
import {Immutable, combineReducers} from '/lib/immutable'
import {createStore, compose, thunkMiddleware, applyMiddleware, createLogger} from '/lib/redux'

const coreReducer = combineReducers({user: userReducer});

const componentsReducer = combineReducers({login: loginReducer});

const subsManagersReducer = (state = Immutable.fromJS({})) => state;

const rootReducer = combineReducers({
  core: coreReducer,
  components: componentsReducer,
  subsManagers: subsManagersReducer
});

console.debug('Initializing Redux store...');

const s = createStore(
  rootReducer,
  Immutable.fromJS({
    core: {user: {}},
    components: {login: {}}
  }),
  compose(
    applyMiddleware(thunkMiddleware, createLogger()),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

// 处理关于store的订阅
let currentState = Immutable.Map();
s.subscribe(() => {
  const previousState = currentState;
  currentState = s.getState();

  const previousUsers = previousState.getIn(['core', 'user'], Immutable.Map());
  const currentUsers = currentState.getIn(['core', 'user'], Immutable.Map());

  if (previousUsers != currentUsers) {
    // 需要重新订阅
    const userSubsManager = BraavosCore.SubsManager.users;
    const sellerSubsManager = BraavosCore.SubsManager.sellers;

    // 当前用户
    const currentUserId = currentUsers.get('currentUserId');
    // 其它用户
    const subscribedUsers = currentUsers.get('subscribedUserIds', Immutable.Set());
    // 订阅的商家
    const subscribedSellers = currentUsers.get('subscribedSellerIds', Immutable.Set());

    const userIdList = subscribedUsers.add(currentUserId).filter(v => _.isNumber(v) && !_.isNaN(v)).sort().toJS();
    userSubsManager.subscribe('userInfo', userIdList);

    const sellerIdList = subscribedSellers.add(currentUserId).filter(v => _.isNumber(v) && !_.isNaN(v)).sort().toJS();
    sellerSubsManager.subscribe('sellerInfo', sellerIdList);
  }
});

// Meteor.userId()发生变化时, 需要修改store
Tracker.autorun(() => {
  const currentUserId = parseInt(Meteor.userId());
  if (_.isNumber(currentUserId) && !_.isNaN(currentUserId)) {
    s.dispatch(setCurrentUserId(currentUserId));
  }
});

export const store = s;
