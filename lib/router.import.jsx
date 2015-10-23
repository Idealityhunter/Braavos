import {MainLayout} from 'client/main-layout';
import {Test} from 'client/dumb-components/test';
import {Register} from 'client/dumb-components/common/register';
import {Login} from 'client/dumb-components/common/login';
import {Account} from 'client/dumb-components/account/account';
import {Commodity} from 'client/dumb-components/commodity/commodity';
import {CommodityModify} from 'client/dumb-components/commodity/commodityModify';
import {UdTest} from 'client/dumb-components/udTest';

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
    let intlData = BraavosCore.IntlData.zh;
    ReactLayout.render(Login, {...intlData});
  }
});

FlowRouter.route('/register', {
  action() {
    const token = FlowRouter.getQueryParam('token');
    // 检查token是否有效
    Meteor.call('account.register.checkToken', token, (err, ret)=> {
      const isValid = (!err && ret.valid);
      if (isValid) {
        ReactLayout.render(Register);
      } else {
        FlowRouter.go('/login');
      }
    });
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
      content: <Test {...intlData} />
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

FlowRouter.route('/ud-test', {
  action() {
    ReactLayout.render(MainLayout, {
      content: <UdTest />
    });
  }
});


