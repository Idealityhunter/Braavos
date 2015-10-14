export default ReactRedux = AppDeps.reactRedux;

/* 使用如下代码生成下面的 export
 let out = '';
 for (let c in ReactRedux) {
 out += `export const ${c} = ReactRedux['${c}']; \n`;
 }
 console.log(out);
 */


export const Provider = ReactRedux['Provider'];
export const connect = ReactRedux['connect'];