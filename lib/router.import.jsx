import {MainLayout} from 'client/main-layout';
import {Test} from 'client/dumb-components/test';
import {Register} from 'client/dumb-components/common/register';

FlowRouter.route('/', {
  action() {
    ReactLayout.render(MainLayout, {
      content: <Test />
    });
  }
});

FlowRouter.route('/login', {
  action() {
    console.log('login');
    //ReactLayout.render();
  }
});

FlowRouter.route('/register', {
  action() {
    console.log('register');
    ReactLayout.render(Register);
  }
});
