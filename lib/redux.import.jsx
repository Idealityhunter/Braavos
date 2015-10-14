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