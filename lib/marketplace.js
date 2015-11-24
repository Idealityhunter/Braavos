/**
 * 定义marketplace类的数据模型
 *
 * Created by zephyre on 11/3/15.
 */

CoreModel.Marketplace = {};
const Marketplace = CoreModel.Marketplace;
const Misc = CoreModel.Misc;

Marketplace.Seller = new SimpleSchema({
  // 商家的主键
  sellerId: {
    type: Number,
    min: 1
  },
  // 商家对应的UserInfo
  userInfo: {
    type: CoreModel.Account.UserInfo,
    blackbox: true
  },
  // 商家店铺的名称
  name: {
    type: String,
    min: 1,
    max: 128
  },
  // 商家介绍
  desc: {
    type: Misc.RichText,
    optional: true
  },
  // 商家图集
  images: {
    type: [Misc.Image],
    optional: true
  },
  // 商家评分
  rating: {
    type: Number,
    decimal: true,
    optional: true,
    min: 0,
    max: 1
  },
  // 商家支持那些语言
  lang: {
    type: [String],
    allowedValues: ["en", "zh", "local"],
    maxCount: 3,
    optional: true
  },
  // 商家资质
  qualifications: {
    type: [String],
    allowedValues: [],
    optional: true
  },
  // 商家支持那些服务区域
  serviceZones: {
    type: [CoreModel.Geo.GeoEntity],
    maxCount: 1024,
    optional: true
  },
  // 服务标签
  services: {
    type: [String],
    optional: true
  },
  // 银行账户
  bankAccounts: {
    type: [CoreModel.Finance.BankAccount],
    maxCount: 64,
    optional: true
  },
  // 商家的实名信息
  identity: {
    type: CoreModel.Account.RealNameInfo,
    blackbox: true,
    optional: true
  },
  // 电子邮件
  email: {
    type: [String],
    maxCount: 4,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  // 联系电话
  phone: {
    type: [Misc.PhoneNumber],
    maxCount: 4,
    optional: true
  },
  // 地址
  address: {
    type: String,
    max: 1024,
    optional: true
  },
  // 商家被多少人关注
  favorCnt: {
    type: Number,
    min: 0,
    optional: true
  },
  // 开店时间
  createTime: {
    type: Date
  }
});

// 定价
Marketplace.Pricing = new SimpleSchema({
  // 价格
  price: {
    type: Number,
    decimal: true,
    min: 0
  },
  // 价格在哪个时间区间内有效([start, end], 左开右闭区间)
  // [start, null)表示从start到今后, price都有效
  // [null, end)表示在end之前, price都有效
  // 如果timeRange为null, 则在所有时间段, price都有效
  timeRange: {
    type: [Date],
    minCount: 2,
    maxCount: 2,
    optional: true
  }
});

// 库存信息
Marketplace.StockInfo = new SimpleSchema({
  // 库存状态。可选值：empty, nonempty, plenty。如果为nonempty，后面的quantity字段将生效
  status: {
    type: String,
    regEx: /^(empty|nonempty|plenty)$/
  },
  // 库存数量
  quantity: {
    type: Number,
    min: 0,
    optional: true
  },
  // 该库存状态说明所对应的时间区间。格式：[start, end]
  timeRange: {
    type: [Date],
    minCount: 2,
    maxCount: 2,
    optional: true
  }
});

// 套餐信息
Marketplace.CommodityPlan = new SimpleSchema({
  // 套餐的标识
  planId: {
    type: String,
    min: 1,
    max: 64
  },
  // 套餐标题
  title: {
    type: String,
    min: 1,
    max: 64
  },
  // 套餐描述
  desc: {
    type: String,
    min: 1,
    max: 65535,
    optional: true
  },
  // 价格信息
  pricing: {
    type: [Marketplace.Pricing],
    minCount: 1
  },
  // 市场价格
  marketPrice: {
    type: Number,
    decimal: true,
    optional: true,
    min: 0
  },
  // 商品售价
  price: {
    type: Number,
    decimal: true,
    min: 0
  },
  // 库存信息
  stockInfo: {
    type: [Marketplace.StockInfo],
    minCount: 1,
    optional: true
  },
  // 购买该商品是否需要确定时间
  timeRequired: {
    type: Boolean
  }
});

// 商品
Marketplace.Commodity = new SimpleSchema({
  // 商品编号
  commodityId: {
    type: Number,
    min: 1
  },
  // 商家
  seller: {
    type: Marketplace.Seller,
    blackbox: true
  },
  // 商品标题
  title: {
    type: String,
    min: 1,
    max: 1024
  },
  // 商品描述
  desc: {
    type: Misc.RichText,
    optional: true
  },
  // 市场价格
  marketPrice: {
    type: Number,
    decimal: true,
    optional: true,
    min: 0
  },
  // 商品售价
  price: {
    type: Number,
    decimal: true,
    min: 0
  },
  // 套餐信息
  plans: {
    type: [Marketplace.CommodityPlan],
    minCount: 1
  },
  // 商品销量
  salesVolume: {
    type: Number,
    min: 0,
    optional: true
  },
  // 商品类别
  category: {
    type: [String],
    minCount: 1,
    maxCount: 1
  },
  // 商品的详细消费地址
  address: {
    max: 1024,
    type: String,
    optional: true
  },
  // 服务时长
  timeCost: {
    type: String,
    max: 1024,
    optional: true
  },
  // 购买须知
  notice: {
    type: [Misc.RichText],
    optional: true
  },
  // 退改规定
  refundPolicy: {
    type: [Misc.RichText],
    optional: true
  },
  // 交通信息
  trafficInfo: {
    type: [Misc.RichText],
    optional: true
  },
  // 商品封面图
  cover: {
    type: Misc.Image,
    optional: true
  },
  // 商品图集
  images: {
    type: [Misc.Image],
    optional: true
  },
  // 商品评分
  rating: {
    type: Number,
    decimal: true,
    optional: true,
    min: 0,
    max: 1
  },
  // 商品状态
  status: {
    type: String,
    // 审核中 / 已发布 / 已下架
    allowedValues: ["review", "pub", "disabled"]
  },
  // 商品的国家信息
  country: {
    type: CoreModel.Geo.Country,
    optional: true,
    blackbox: true
  },
  // 商品的目的地属性
  locality: {
    type: CoreModel.Geo.Locality,
    optional: true,
    blackbox: true
  },
  // 商品的创建时间
  createTime: {
    type: Date
  },
  // 商品修改时间
  updateTime: {
    type: Date,
    optional: true
  }
});

// 支付信息
Marketplace.Prepay = new SimpleSchema({
  // 支付渠道
  provider: {
    type: String,
    allowedValues: ["alipay", "wechat"]
  },
  // 预支付ID
  prepayId: {
    type: String
  },
  // 支付金额
  amount: {
    type: Number,
    decimal: true,
    min: 0
  }
});

// 订单
Marketplace.Order = new SimpleSchema({
  // 订单编号
  orderId: {
    type: Number,
    min: 1
  },
  // 消费者的用户名
  consumerId: {
    type: Number,
    min: 1
  },
  // 对应的商品
  commodity: {
    type: Marketplace.Commodity,
    blackbox: true
  },
  // 选择的套餐
  planId: {
    type: String
  },
  // 旅客信息
  travellers: {
    type: [Misc.RealNameInfo],
    optional: true
  },
  // 订单联系人
  contact: {
    type: Misc.RealNameInfo,
    optional: true
  },
  // 预约时间
  rendezvousTime: {
    type: Date,
    optional: true
  },
  // 订单过期时间
  expireDate: {
    type: Date
  },
  // 订单总价
  totalPrice: {
    type: Number,
    decimal: true,
    min: 0
  },
  // 订单折扣
  discount: {
    type: Number,
    decimal: true,
    min: 0,
    optional: true
  },
  // 商品数量
  quantity: {
    type: Number,
    min: 1
  },
  // 支付信息 Map[String, Prepay]
  paymentInfo: {
    type: Object,
    optional: true
  },
  // 订单状态
  // 分别为: 待付款, 已付款, 商户已确认, 订单完成, 已取消, 订单过期, 退款申请中, 退款完成
  status: {
    type: String,
    allowedValues: ["pending", "paid", "committed", "finished", "cancelled", "expired", "refundApplied", "refunded"]
  },
  // 附言
  comment: {
    type: String,
    max: 65535,
    optional: true
  },
  // 创建时间
  createTime: {
    type: Date
  },
  // 更新时间
  updateTime: {
    type: Date,
    optional: true
  }
});

