/**
 * 消息相关的
 *
 * Created by lyn on 11/19/15.
 */

Meteor.methods({
  /**
   *
   * @param receiverId {String} 接收者Id/接收GroupId
   * @param contents {Object} 消息内容
   * @param type {Object} key有 msgType(消息类型) 和 chatType(对话类型)
   */
  'talk.sendMsg': (receiverId, contents, type = {msgType: 1, chatType: 'single'}) => {
    const userId = parseInt(Meteor.userId());
    if (!type.msgType) type.msgType = 1;
    if (!type.chatType || type.chatType == 'single'){
      // 发送单聊消息

      // 获取服务
      const services = Object.keys(BraavosCore.RootConf.backends['hedy']).map(key => {
        const {host, port} = BraavosCore.RootConf.backends['hedy'][key];
        return `${host}:${port}`;
      });
      const url = `http://${services[0]}/chats`;

      // 填充数据
      const options = {
        data: {
          sender: userId,
          chatType: "single",
          receiver: receiverId,
          msgType: type.msgType,
          contents: contents
        }
      };

      // 发送请求
      try {
        const result = HTTP.post(url, options);
        console.log(result);
        return result;
      }catch(e){
        console.log('发送消息失败! 错误为: ');
        console.log(e);
      }
    }
  }
});
