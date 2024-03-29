import {MainLayout} from '/client/main-layout';
import {Index} from '/client/dumb-components/index';
import {Register} from '/client/dumb-components/common/register';
import {RegistrationLayout} from "/client/common/registration"
import {Account} from '/client/dumb-components/account/account';
import {Commodity} from '/client/dumb-components/commodity/commodity';
import {Commodities} from '/client/components/commodities/overview/commodities'
import {CommodityModify} from '/client/dumb-components/commodity/commodityModify';
import {Order} from '/client/dumb-components/order/order';
import {OrderInfo} from '/client/dumb-components/order/orderInfo';
import {OrderDeliver} from '/client/dumb-components/order/orderDeliver';
import {OrderRefundCancel} from '/client/dumb-components/order/orderRefundCancel';
import {OrderRefundPaid} from '/client/dumb-components/order/orderRefundPaid';
import {OrderRefundCommitted} from '/client/dumb-components/order/orderRefundCommitted';
import {Finance} from '/client/components/finance/finance';
import {Message} from '/client/dumb-components/message/message';
import {Columns} from '/client/components/activities/column/column';
import {ColumnEdit} from '/client/components/activities/column/column-edit';
import {Articles} from '/client/components/activities/article/article';
import {ArticleEdit} from '/client/components/activities/article/article-edit';


import {Page404} from '/client/dumb-components/page404';

import {StepsDemo} from "/client/components/steps/steps"

import { Login } from '/client/components/login/login'

// 初始化Sub Manager
BraavosCore.SubsManager = {
  geo: new SubsManager(),
  account: new SubsManager(),
  conversation: new SubsManager(),
  systemMessage: new SubsManager()
};

BraavosCore.SubsManagerStubs = {};
BraavosCore.SubsManagerStubs.conversation = [];
BraavosCore.SubsManagerStubs.systemMessage = [];

BraavosCore.SubsManager.geo.subscribe("countries");


// 检查是否登录
function loginCheck(context, redirect, stop) {
  if (!Meteor.userId()) {
    redirect('login');
  }
  BraavosCore.SubsManager.account.subscribe('basicUserInfo');
  BraavosCore.SubsManager.account.subscribe('sellerInfo');

  // 存储conversationView的subscribe记录
  BraavosCore.SubsManagerStubs.conversation.push(BraavosCore.SubsManager.conversation.subscribe("conversationViews"));
  BraavosCore.SubsManagerStubs.systemMessage.push(BraavosCore.SubsManager.systemMessage.subscribe("systemMessages"));
}

// 检查是否为管理员
function adminCheck(context, redirect, stop) {
  // TODO 此处可能会有错, 因为在 startup.js 未加载时, User 表还没有定义, 因此在使用 BraavosCore.Utils.account.isAdmin 时会报错
  if (! BraavosCore.Utils.account.isAdmin()){
     ReactLayout.render(MainLayout, _.extend({content: <Page404 {...intlData} />}, intlData, {documentTitle: "404页面"}));
     stop();
  }

  return true;
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
    ReactLayout.render(Login);
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

//// 商品管理 - 列表
//FlowRouter.route('/commodities', {
//  name: 'commodities',
//  title: lsbMessages['commodities'],
//  parent: 'home',
//  triggersEnter: [loginCheck],
//  action() {
//    ReactLayout.render(MainLayout, _.extend({content: <Commodity {...intlData} />}, intlData, {documentTitle: "商品管理"}));
//  }
//});

// 商品管理 - 列表
FlowRouter.route('/commodities', {
  name: 'commodities',
  title: lsbMessages['commodities'],
  parent: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Commodities />}, intlData, {documentTitle: "商品管理"}));
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

        // 注意!!! 修改了所有的price信息
        ret.commodityInfo = _.extend(ret.commodityInfo, {
          // 对所有的price进行换算处理
          price: ret.commodityInfo.price / 100,
          marketPrice: ret.commodityInfo.marketPrice / 100,
          plan: ret.commodityInfo.plans.map(plan => _.extend(plan, {
            price: plan.price / 100,
            marketPrice: plan.marketPrice / 100,
            pricing: plan.pricing.map(pricing => _.extend(pricing, {
              price: pricing.price / 100
            }))
          }))
        });

        ReactLayout.render(MainLayout, _.extend({
          content: <CommodityModify {...intlData} commodityInfo={ret.commodityInfo} isAdmin={isAdmin == 'true'}/>
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

// 订单详情
FlowRouter.route('/orders/:orderId', {
  name: 'order',
  title: '订单详情',
  parent: 'orders',
  triggersEnter: [loginCheck],
  action(param) {
    ReactLayout.render(MainLayout, _.extend({
      content: <OrderInfo {...intlData} orderId={param.orderId}/>
    }, intlData, {documentTitle: "订单管理-订单详情"}));
  }
});

// 订单管理 -> 发货页面
FlowRouter.route('/orders/:orderId/deliver', {
  name: 'deliver',
  title: '发货',
  parent: 'orders',
  triggersEnter: [loginCheck],
  action(param) {
    // TODO 先loading,然后获取数据再进去!然后判断status状态是否是paid状态
    ReactLayout.render(MainLayout, _.extend({
      content: <OrderDeliver {...intlData} orderId={param.orderId}/>
    }, intlData, {documentTitle: "订单管理-发货"}));
  }
});

// 订单管理 -> 退款页面
FlowRouter.route('/orders/:orderId/refund/:refundStatus', {
  name: 'refund',
  title: param => {
    switch (param.refundStatus) {
      case 'cancel':
        return '缺货退款'
      case 'paid':
        return '退款'
      case 'committed':
        return '退款处理'
      default:
        return '退款'
    }
  },
  parent: 'orders',
  triggersEnter: [loginCheck],
  action(param) {
    const orderId = param.orderId;
    // TODO 先loading,然后获取数据再进去!然后判断status状态是否是...状态

    switch (param.refundStatus) {
      // 主动退款
      case 'cancel':
        ReactLayout.render(MainLayout, _.extend({
          content: <OrderRefundCancel {...intlData} orderId={orderId}/>
        }, intlData, {documentTitle: "订单管理-缺货退款"}));
        return;
      // 已支付状态下转入的申请退款状态
      case 'paid':
        ReactLayout.render(MainLayout, _.extend({
          content: <OrderRefundPaid {...intlData} orderId={orderId}/>
        }, intlData, {documentTitle: "订单管理-退款"}));
        return;
      // 已发货状态下转入的申请退款状态
      case 'committed':
        ReactLayout.render(MainLayout, _.extend({
          content: <OrderRefundCommitted {...intlData} orderId={orderId}/>
        }, intlData, {documentTitle: "订单管理-退款处理"}));
      default:
        // TODO default处理? 何时做
        return;
    }
  }
});

//// 财务管理
//FlowRouter.route('/finance', {
//  name: 'finance',
//  title: lsbMessages['finance'],
//  parent: 'home',
//  triggersEnter: [loginCheck],
//  action() {
//    ReactLayout.render(MainLayout, _.extend({content: <Finance {...intlData} />}, intlData, {documentTitle: "财务管理"}));
//  }
//});

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

// 消息页面
FlowRouter.route('/message', {
  name: 'message',
  title: lsbMessages['message'],
  parent: 'home',
  triggersEnter: [loginCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Message {...intlData} />}, intlData, {documentTitle: "消息"}));
  }
});

// 404页面
FlowRouter.notFound = {
  subscriptions: function () {

  },
  action: function () {
    ReactLayout.render(MainLayout, _.extend({content: <Page404 {...intlData} />}, intlData, {documentTitle: "404页面"}));
  }
};

// 专区活动列表页面
FlowRouter.route('/activities/columns', {
  name: 'activities-column',
  title: lsbMessages['activities-column'],
  parent: 'home',
  triggersEnter: [loginCheck, adminCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Columns {...intlData} />}, intlData, {documentTitle: "商品专区管理"}));
  }
});

// 专区活动添加页面
FlowRouter.route('/activities/columns/add', {
  name: 'activities-column-add',
  title: lsbMessages['activities-column-add'],
  parent: 'activities-column',
  triggersEnter: [loginCheck, adminCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <ColumnEdit {...intlData} />}, intlData, {documentTitle: "专区添加"}));
  }
});

// 专区活动编辑页面
FlowRouter.route('/activities/columns/edit/:columnId', {
  name: 'activities-column-edit',
  title: lsbMessages['activities-column-edit'],
  parent: 'activities-column',
  triggersEnter: [loginCheck, adminCheck],
  action(param, queryParam) {
    const columnId = param.columnId;

    // 检查token是否是当前用户的商品
    Meteor.call('activity.column.getColumnInfo', columnId, (err, ret) => {
      const isValid = (!err && ret.valid);
      if (isValid) {
        ReactLayout.render(MainLayout, _.extend({
          content: <ColumnEdit {...intlData} {...ret.columnInfo}/>
        }, intlData, {documentTitle: "专区编辑"}));
      } else {
        FlowRouter.go('home');
      }
    });
  }
});


// 城市文章列表页面
FlowRouter.route('/activities/articles', {
  name: 'activities-article',
  title: lsbMessages['activities-article'],
  parent: 'home',
  triggersEnter: [loginCheck, adminCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <Articles {...intlData} />}, intlData, {documentTitle: "城市文章管理"}));
  }
});

// 城市文章添加页面
FlowRouter.route('/activities/articles/add', {
  name: 'activities-article-add',
  title: lsbMessages['activities-article-add'],
  parent: 'activities-article',
  triggersEnter: [loginCheck, adminCheck],
  action() {
    ReactLayout.render(MainLayout, _.extend({content: <ArticleEdit {...intlData} />}, intlData, {documentTitle: "城市文章添加"}));
  }
});

// 城市文章编辑页面
FlowRouter.route('/activities/articles/edit/:articleId', {
  name: 'activities-article-edit',
  title: lsbMessages['activities-article-edit'],
  parent: 'activities-article',
  triggersEnter: [loginCheck, adminCheck],
  action(param, queryParam) {
    const articleId = param.articleId;

    // 检查token是否是当前用户的商品
    Meteor.call('activity.article.getArticleInfo', articleId, (err, ret) => {
      const isValid = (!err && ret.valid);
      if (isValid) {
        ReactLayout.render(MainLayout, _.extend({
          content: <ArticleEdit {...intlData} {...ret.articleInfo}/>
        }, intlData, {documentTitle: "城市文章编辑"}));
      } else {
        FlowRouter.go('home');
      }
    });
  }
});

// TODO Banner活动页面
FlowRouter.route('/activities/banners', {
  name: 'activities-banner',
  title: lsbMessages['activities-banner'],
  parent: 'home',
  //triggersEnter: [loginCheck, adminCheck],
  action() {
    //ReactLayout.render(MainLayout, _.extend({content: <Message {...intlData} />}, intlData, {documentTitle: "banner区管理"}));
    FlowRouter.go('home');
  }
});
