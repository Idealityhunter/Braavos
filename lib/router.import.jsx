import {MainLayout} from '/client/main-layout';
import {Test} from '/client/dumb-components/test';
import {Register} from '/client/dumb-components/common/register';
import {RegistrationLayout} from "/client/common/registration"
import {Login} from '/client/dumb-components/common/login';
import {Account} from '/client/dumb-components/account/account';
import {Commodity} from '/client/dumb-components/commodity/commodity';
import {CommodityModify} from '/client/dumb-components/commodity/commodityModify';
import {Finance} from '/client/dumb-components/finance/finance';

// 初始化Sub Manager
BraavosCore.SubsManager = new SubsManager();
const subsManager = BraavosCore.SubsManager;
subsManager.subscribe("countries");

// 检查是否登录
function loginCheck(context, redirect, stop) {
  if (!Meteor.userId()) {
    redirect('login');
  }
  subsManager.subscribe("basicUserInfo");
  subsManager.subscribe("sellerInfo");
}

const intlData = BraavosCore.IntlData.zh;
// 左侧边栏的i18n数据
const lsbMessages = intlData['messages']['mainLayout']['leftSideBar'];

// 主页
FlowRouter.route('/', {
  name: 'home',
  title: lsbMessages['homepage'],
  triggersEnter: [loginCheck],
  action() {
    //ReactLayout.render();
    ReactLayout.render(MainLayout, _.extend({content: <Test {...intlData} />}, intlData));
  }
});

// 登录
FlowRouter.route('/login', {
  name: 'login',
  action() {
    ReactLayout.render(Login, {...intlData});
  }
});

// 注销
FlowRouter.route('/logout', {
  name: 'logout',
  triggersEnter: [(context, redirect, stop) => {
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
        ReactLayout.render(RegistrationLayout, {...intlData});
      } else {
        FlowRouter.go('login');
      }
    });
  }
});

// 商品管理 - 列表
FlowRouter.route('/commodities', {
  name: 'commodities',
  title: lsbMessages['commodities'],
  parent: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Commodity {...intlData} />}, intlData));
  }
});

// 商品管理 - 修改
FlowRouter.route('/commodities/add', {
  name: 'commodityAdd',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <CommodityModify {...intlData} />}, intlData));
  }
});

FlowRouter.route('/commodities/editor', {
  name: 'commodityEditor',
  triggersEnter: [loginCheck],
  action(param, queryParam) {
    const commodityId = queryParam.commodityId;
    // 检查token是否是当前用户的商品
    Meteor.call('commodity.editor.checkCommodityId', commodityId, (err, ret) => {
      const isValid = (!err && ret.valid);
      if (isValid) {
        ReactLayout.render(MainLayout, _.extend({content: <CommodityModify {...intlData} {...ret.commodityInfo}/>}, intlData));
      } else {
        FlowRouter.go('home');
      }
    });
  }
});

// 订单管理
FlowRouter.route('/orders', {
  name: 'orders',
  title: lsbMessages['orders'],
  parent: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Test {...intlData} />}, intlData));
  }
});

// 财务管理
FlowRouter.route('/finance', {
  name: 'finance',
  title: lsbMessages['finance'],
  parent: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Finance {...intlData} />}, intlData));
  }
});

// 账户信息
FlowRouter.route('/account', {
  name: 'account',
  title: lsbMessages['accountInfo'],
  parent: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Account {...intlData} />}, intlData));
  }
});
