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
  triggersEnter: [function() {
    console.log('route: entered');
    let code = FlowRouter.current().queryParams['code'];
    // TODO validate code
    if (code !== '12345') {
      console.log('invalid code, redirect to /login');
      FlowRouter.go('/login');
    }
  }],
  action() {
    console.log('route: rendering');
    ReactLayout.render(Register);
  }
});
