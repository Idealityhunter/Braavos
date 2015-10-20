import {MainLayout} from 'client/main-layout';
import {Test} from 'client/dumb-components/test';
import {Register} from 'client/dumb-components/common/register';
import {Login} from 'client/dumb-components/common/login';
import {Account} from 'client/dumb-components/account/account';

FlowRouter.route('/', {
  action() {
    var intlData = AppDeps.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Test {...intlData} />
    });
  }
});

FlowRouter.route('/login', {
  action() {
    console.log('login');
    ReactLayout.render(Login);
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

FlowRouter.route('/product-info', {
  action() {
    var intlData = AppDeps.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Test {...intlData} />
    });
  }
});
FlowRouter.route('/order-info', {
  action() {
    var intlData = AppDeps.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Test {...intlData} />
    });
  }
});
FlowRouter.route('/finance-info', {
  action() {
    var intlData = AppDeps.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Test {...intlData} />
    });
  }
});
FlowRouter.route('/account-info', {
  action() {
    var intlData = AppDeps.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Account {...intlData} />
    });
  }
});
