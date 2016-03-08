/**
 * 消息相关的
 *
 * Created by lyn on 11/19/15.
 */

Meteor.methods({
  /**
   * 发送消息
   * @param sendType {Number} 0/1/2分别代表发送给receiver/Group/Conversation
   * @param receiver {String} 接收者Id/接收GroupId/接收的conversation
   * @param contents {Object} 消息内容
   * @param type {Object} key有 msgType(消息类型) 和 chatType(对话类型)
   * @returns {*}
   */
  'talk.sendMsg': (sendType, receiver, contents, objectId, type = {msgType: 0, chatType: 'single'}) => {
    // TODO 可以不需要chatType => 使用conversation的时候

    const userId = parseInt(Meteor.userId());
    if (!type.msgType) type.msgType = 0;
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
          msgType: type.msgType,
          contents: contents,
          id: objectId
        }
      };

      switch (sendType){
        case 0:
          options.data.receiver = receiver;
          break;
        case 1:
          options.data.receiverGroup = receiver;
          break;
        case 2:
          options.data.conversation = receiver;
          break;
        default:
          console.log('错误调用talk.sendMsg!');
          return false;
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
