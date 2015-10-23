import {MainLayout} from 'client/main-layout';
import {Test} from 'client/dumb-components/test';
import {Register} from 'client/dumb-components/common/register';
import {Login} from 'client/dumb-components/common/login';
import {Account} from 'client/dumb-components/account/account';
import {Commodity} from 'client/dumb-components/commodity/commodity';
import {CommodityModify} from 'client/dumb-components/commodity/commodityModify';
import {Finance} from 'client/dumb-components/finance/finance';

// 检查是否登录
function loginCheck(context, redirect, stop) {
  if (!Meteor.userId()) {
    redirect('login');
  }
}

function func() {
  const userId = parseInt(Meteor.userId());
  if (userId) {
    Meteor.subscribe('basicUserInfo', userId);
  }
}

// 主页
FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, {
      content: <Test />
    });
  },
  subscriptions: function() {
    this.register('home', Meteor.subscribe('basicUserInfo', parseInt(Meteor.userId())));
  }
});

// 登录
FlowRouter.route('/login', {
  name: 'login',
  action() {
    let intlData = BraavosCore.IntlData.zh;
    ReactLayout.render(Login, {...intlData});
  }
});

// 注销
FlowRouter.route('/logout', {
  name: 'logout',
  triggersEnter: [(context, redirect, stop) =>{
    console.log('Log out!');
    Meteor.logout(() => {
      redirect('login');
    });
    stop();
  }]

});

// 注册
FlowRouter.route('/register', {
  action(param, queryParam) {
    const token = queryParam.token;
    // 检查token是否有效
    Meteor.call('account.register.checkToken', token, (err, ret)=> {
      const isValid = (!err && ret.valid);
      if (isValid) {
        ReactLayout.render(Register);
      } else {
        FlowRouter.go('login');
      }
    });
  }
});

// 商品管理 - 列表
FlowRouter.route('/commodities', {
  name: 'commodities',
  triggersEnter: [loginCheck],
  action() {
    var intlData = BraavosCore.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Commodity {...intlData} />
    });
  },
  subscriptions: function() {
    this.register('commodities', Meteor.subscribe('basicUserInfo', parseInt(Meteor.userId())));
  }
});

// 商品管理 - 修改
FlowRouter.route('/commodities/editor', {
  name: 'commodityEditor',
  triggersEnter: [loginCheck],
  action() {
    var intlData = BraavosCore.IntlData.zh;

    ReactLayout.render(MainLayout, {
      content: <CommodityModify {...intlData} />
    });
  },
  subscriptions: function() {
    this.register('commodityEditor', Meteor.subscribe('basicUserInfo', parseInt(Meteor.userId())));
  }
});

// 订单管理
FlowRouter.route('/orders', {
  name: 'orders',
  triggersEnter: [loginCheck],
  action() {
    var intlData = BraavosCore.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Test {...intlData} />
    });
  },
  subscriptions: function() {
    this.register('orders', Meteor.subscribe('basicUserInfo', parseInt(Meteor.userId())));
  }
});

// 财务管理
FlowRouter.route('/finance', {
  name: 'finance',
  triggersEnter: [loginCheck],
  action() {
    var intlData = BraavosCore.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Finance {...intlData} />
    });
  },
  subscriptions: function() {
    this.register('finance', Meteor.subscribe('basicUserInfo', parseInt(Meteor.userId())));
  }
});

// 账户信息
FlowRouter.route('/account', {
  name: 'account',
  triggersEnter: [loginCheck],
  action() {
    var intlData = BraavosCore.IntlData.fr;

    ReactLayout.render(MainLayout, {
      content: <Account {...intlData} />
    });
  },
  subscriptions: function() {
    this.register('account', Meteor.subscribe('basicUserInfo', parseInt(Meteor.userId())));
  }
});
