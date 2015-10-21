/**
 *
 * Created by zephyre on 10/21/15.
 */

Meteor.startup(function() {
  // 处理好全局名字空间
  //_.extend(BraavosCore, Meteor.BraavosCore);
  //delete Meteor.BraavosCore;

  if (Meteor.isServer) {
    console.log('Server startup');
  } else {
    console.log('Client startup');
  }
});
