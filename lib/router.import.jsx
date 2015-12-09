import {MainLayout} from '/client/main-layout';
import {Index} from '/client/dumb-components/index';
import {Register} from '/client/dumb-components/common/register';
import {RegistrationLayout} from "/client/common/registration"
import {Login} from '/client/dumb-components/common/login';
import {Account} from '/client/dumb-components/account/account';
import {Commodity} from '/client/dumb-components/commodity/commodity';
import {CommodityModify} from '/client/dumb-components/commodity/commodityModify';
import {Order} from '/client/dumb-components/order/order';
import {OrderDeliver} from '/client/dumb-components/order/orderDeliver';
import {OrderRefundLack} from '/client/dumb-components/order/orderRefundLack';
import {Finance} from '/client/dumb-components/finance/finance';

import {StepsDemo} from "/client/components/steps/steps"

// 初始化Sub Manager
BraavosCore.SubsManager = {
  geo: new SubsManager(),
  account: new SubsManager()
};
BraavosCore.SubsManager.geo.subscribe("countries");

// 检查是否登录
function loginCheck(context, redirect, stop) {
  if (!Meteor.userId()) {
    redirect('login');
  }
  BraavosCore.SubsManager.account.subscribe("basicUserInfo");
  BraavosCore.SubsManager.account.subscribe("sellerInfo");
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
    ReactLayout.render(MainLayout, _.extend({content: <Index {...intlData} />}, intlData, {documentTitle: "首页"}));
  }
});

FlowRouter.route('/test', {
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <StepsDemo />}, intlData));
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
    ReactLayout.render(MainLayout, _.extend({content: <Commodity {...intlData} />}, intlData, {documentTitle: "商品管理"}));
  }
});

// 商品管理 - 修改
FlowRouter.route('/commodities/add', {
  name: 'commodityAdd',
  parent: 'commodities',
  title: '添加',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({
      content: <CommodityModify {...intlData} />
    }, intlData, {documentTitle: "商品添加"}));
  }
});

FlowRouter.route('/commodities/editor/:commodityId', {
  name: 'commodityEditor',
  parent: 'commodities',
  title: '编辑',
  triggersEnter: [loginCheck],
  action(param, queryParam) {
    const commodityId = param.commodityId;
    const isAdmin = queryParam.isAdmin;
    // 检查token是否是当前用户的商品
    Meteor.call('commodity.editor.checkCommodityId', {commodityId: commodityId, isAdmin: isAdmin}, (err, ret) => {
      const isValid = (!err && ret.valid);
      if (isValid) {
        ReactLayout.render(MainLayout, _.extend({
          content: <CommodityModify {...intlData} {...ret.commodityInfo}/>
        }, intlData, {documentTitle: "商品修改"}));
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
    ReactLayout.render(MainLayout, _.extend({content: <Order {...intlData} />}, intlData, {documentTitle: "订单管理"}));
  }
});

// 订单管理 -> 发货页面
FlowRouter.route('/orders/:orderId/deliver', {
  name: 'deliver',
  title: '发货',
  parent: 'orders',
  triggersEnter: [loginCheck],
  action(param, queryParam) {
    // TODO 先loading,然后获取数据再进去!然后判断status状态是否是paid状态
    const orderId = param.orderId;
    ReactLayout.render(MainLayout, _.extend({content: <OrderDeliver {...intlData} orderId={orderId}/>}, intlData, {documentTitle: "订单管理-发货"}));
  }
});

// 订单管理 -> 退款页面
FlowRouter.route('/orders/:orderId/refund/:refundExcuse', {
  name: 'refund',
  title: '退款',
  parent: 'orders',
  triggersEnter: [loginCheck],
  action(param, queryParam) {
    const orderId = param.orderId;
    // TODO 先loading,然后获取数据再进去!然后判断status状态是否是...状态
    switch(param.refundExcuse){
      case 'lack':
        ReactLayout.render(MainLayout, _.extend({content: <OrderRefundLack {...intlData} orderId={orderId}/>}, intlData, {documentTitle: "订单管理-退款"}));
      //case 'lack':
      //  ReactLayout.render(MainLayout, _.extend({content: <OrderDeliver {...intlData} orderId={orderId}/>}, intlData, {documentTitle: "订单管理-退款"}));
      //case 'lack':
      //  ReactLayout.render(MainLayout, _.extend({content: <OrderDeliver {...intlData} orderId={orderId}/>}, intlData, {documentTitle: "订单管理-退款"}));
      default:
        // TODO default处理? 何时做
        return ;
    };

  }
});

// 财务管理
FlowRouter.route('/finance', {
  name: 'finance',
  title: lsbMessages['finance'],
  parent: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Finance {...intlData} />}, intlData, {documentTitle: "财务管理"}));
  }
});

// 账户信息
FlowRouter.route('/account', {
  name: 'account',
  title: lsbMessages['accountInfo'],
  parent: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Account {...intlData} />}, intlData, {documentTitle: "账户信息"}));
  }
});
