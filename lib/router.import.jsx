import {MainLayout} from 'client/main-layout';
import {Test} from 'client/dumb-components/test';
import {Register} from 'client/dumb-components/common/register';
import {Login} from 'client/dumb-components/common/login';
import {Account} from 'client/dumb-components/account/account';
import {Commodity} from 'client/dumb-components/commodity/commodity';
import {CommodityModify} from 'client/dumb-components/commodity/commodityModify';
import {Finance} from 'client/dumb-components/finance/finance';

FlowRouter.route('/', {
  name: 'index',
  action() {
    ReactLayout.render(MainLayout, {
      content: <Test />
    });
  }
});

FlowRouter.route('/login', {
  action() {
    let intlData=BraavosCore.IntlData.zh;
    ReactLayout.render(Login, {...intlData});
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

FlowRouter.route('/commodity-mgmt', {
  name: 'commodityManagement',
  title: 'hahah',
  parent: 'gaagga',
  action() {
    var intlData = BraavosCore.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Commodity {...intlData} />
    });
  }
});

FlowRouter.route('/commodity-mgmt/modify', {
  action() {
    var intlData = BraavosCore.IntlData.zh;

    ReactLayout.render(MainLayout, {
      content: <CommodityModify {...intlData} />
    });
  }
});

FlowRouter.route('/order-mgmt', {
  action() {
    var intlData = BraavosCore.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Test {...intlData} />
    });
  }
});
FlowRouter.route('/finance-mgmt', {
  action() {
    var intlData = BraavosCore.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Finance {...intlData} />
    });
  }
});
FlowRouter.route('/account-info', {
  action() {
    var intlData = BraavosCore.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Account {...intlData} />
    });
  }
});
