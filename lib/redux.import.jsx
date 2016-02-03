export default Redux = AppDeps.redux;

/* 使用如下代码生成下面的 export
 let out = '';
 for (let c in Redux) {
 out += `export const ${c} = Redux['${c}']; \n`;
 }
 console.log(out);
 */

export const createStore = Redux['createStore'];
export const combineReducers = Redux['combineReducers'];
export const bindActionCreators = Redux['bindActionCreators'];
export const applyMiddleware = Redux['applyMiddleware'];
export const compose = Redux['compose'];

export const ReactRedux = AppDeps.reactRedux;
export const thunkMiddleware = AppDeps.thunkMiddleware;
export const createLogger = AppDeps.reduxLogger;

/* 使用如下代码生成下面的 export
 let out = '';
 for (let c in ReactRedux) {
 out += `export const ${c} = ReactRedux['${c}']; \n`;
 }
 console.log(out);
 */


export const Provider = ReactRedux['Provider'];
export const connect = ReactRedux['connect'];