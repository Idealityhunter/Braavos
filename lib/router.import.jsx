import {MainLayout} from 'client/main-layout';
import {Test} from 'client/dumb-components/test';

FlowRouter.route('/', {
  action() {
    ReactLayout.render(MainLayout, {
      content: <Test />
    });
  }
});