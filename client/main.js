'use strict';

if (Meteor.isClient) {
  FlowRouter.wait();
}
System.import('./lib/router').then(() => {
  if (Meteor.isClient) {
    FlowRouter.initialize();
  }
});
