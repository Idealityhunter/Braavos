/**
 * 搜索(Elastic Search)相关的
 *
 * Created by lyn on 3/7/16.
 */

Meteor.methods({
  /**
   * 搜索contents中与word相关的message
   * @param word
   */
  'search.message.match.contents': (word) => {
    const userId = parseInt(Meteor.userId());

    // 获取服务
    const services = Object.keys(BraavosCore.RootConf.backends['elasticsearch']).map(key => {
      const {host, port} = BraavosCore.RootConf.backends['elasticsearch'][key];
      return `${host}:${port}`;
    });

    // 构造搜索条件
    const options = {
      data: {
        "query":{
          "filtered":{
            "filter":{
              "bool":{
                "should":[
                  {
                    "term": {
                      "senderId": userId
                    }
                  },
                  {
                    "term":{
                      "receiverId": userId
                    }
                  }
                ]
              }
            },
            "query":{
              "match": {
                "contents": word
              }
            }
          }
        },
        "highlight": {
          "fields": {
            "contents":{}
          }
        }
      }
    };

    // 拼接搜索地址
    const url = `http://${services[0]}/hedy/message/_search`;

    // 发送请求
    try {
      const result = HTTP.post(url, options);
      return result.data;
    }catch(e){
      BraavosCore.logger.debug(`搜索contents为"${word}" ,用户为${userId}的消息失败! 错误为: `);
      BraavosCore.logger.debug(e);
    }
  }
})