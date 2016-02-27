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
import {loginReducer} from '/client/redux/components/login/reducers'
import {Immutable, combineReducers} from '/lib/immutable'
import {createStore, compose, thunkMiddleware, applyMiddleware, createLogger} from '/lib/redux'

const coreReducer = combineReducers({user: userReducer});

const componentsReducer = combineReducers({login: loginReducer});

const rootReducer = combineReducers({core: coreReducer, components: componentsReducer});

console.debug('Initializing Redux store...');

export const store = createStore(
  rootReducer,
  Immutable.fromJS({core: {user: {}}, components: {login: {}}}),
  compose(
    applyMiddleware(thunkMiddleware, createLogger()),
    window.devToolsExtension ? window.devToolsExtension() : f => f)
);
