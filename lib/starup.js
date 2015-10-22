/**
 *
 * Created by zephyre on 10/21/15.
 */

Meteor.startup(function () {
  if (Meteor.isServer) {
    console.log('Server startup');
  } else {
    console.log('Client startup');
  }
});
