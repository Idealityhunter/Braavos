/**
 *
 * Created by zephyre on 10/20/15.
 */

BraavosCore.IntlData.zh = {
  locales: ['zh-CN'],
  messages: {
    welcome: '欢迎来到商家管理系统',
    dialog: {
      ok: "确定",
      cancel: "取消"
    },
    mainLayout: {
      leftSideBar: {
        homepage: '首页',
        commodities: '商品管理',
        orders: '订单管理',
        finance: '财务管理',
        accountInfo: '账户信息',
        message: '消息',
        platformActivities: '平台活动',
        'activities-column': '专区管理',
        'activities-column-add': '专区添加',
        'activities-column-edit': '专区编辑',
        'activities-article': '文章管理',
        'activities-banner': 'Banner区管理'
      }
    },
    login: {
      login: '登录',
      logout: '注销',
      userName: 'Email/手机号码',
      password: '密码',
      forgetPassword: '忘记密码',
      loginFailure: "用户名或密码不正确 :-("
    },
    accountInfo: {
      // START: tab strings
      basic: '基本信息',
      finance: '财务设置',
      security: '安全设置',
      // END: tab strings

      // 基本信息的tab
      basicTab: {
        nickname: '昵称',
        avatar: '头像',
        changeAvatar: "修改头像",
        sellerName: '商户名称',
        sellerDesc: '商户介绍',
        realName: '真实姓名',
        tel: '联系电话',
        email: 'Email',
        lang: '服务语言',
        shop: '店铺名称',
        zone: '所在地',
        address: '详细地址',

        // START: 输入框的placeholder
        input: {
          nickname: '请输入您的昵称',
          sellerName: '请输入商户名称',
          realName: '请输入您的真实姓名',
          tel: '请输入您的联系电话',
          email: '请输入您的Email',
          lang: '服务语言',
          shop: '请输入您的店铺名称',
          zone: '请输入您的所在地',
          address: '请输入您的详细地址'
        }
      }
    },
    commodities: {
      btn: {
        addCommodity: '添加商品',
        query: '查询',
        reset: '重置'
      },
      label: {
        number: '序号',
        sellerId: '商家编号',
        sellerName: '商家名称',
        commodityId: '商品编号',
        createdDate: '创建时间',
        status: '状态',
        commodityCover: '商品主图',
        commodityTitle: '商品名',
        desc: '介绍',
        price: '价格',
        stock: '存量',
        salesVolume: '总销量',
        action: '操作'
      },
      modify: {
        basic: '基本信息',
        introduction: '商品介绍',
        instruction: '购买须知',
        traffic: '交通',
        book: '预定和退改',
        basicTab: {
          commodityImages: '商品图片',
          basicInfo: '基本信息',
          commodityName: '商品名称',
          addressInfo: '目的地',
          commodityCategories: '商品分类',
          timeCost: '游玩时长',
          weightBoost: '商品权重',
          hour: '小时',
          gallery: {
            cropUploadImage: '裁剪上传图片'
          }
        },
      }
    },
    orders: {
      label: {
        search: '搜索',
        createdDate: '下单时间',
        orderId: '订单号',
        commodity: '商品',
        purchaseQuantity: '购买数量',
        orderTotalPrice: '订单总价',
        tradeStatus: '交易状态',
        //purchaser: '买家',
        contact: '联系人信息',
        action: '操作'
      },
      btn:{
        query: '查询',
        reset: '重置'
      }
    }
  }
};
