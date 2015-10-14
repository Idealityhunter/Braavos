import {MainLayout} from 'client/main-layout';

FlowRouter.route('/', {
  action() {
    ReactLayout.render(MainLayout, {
      content: <p />
    });
  }
});