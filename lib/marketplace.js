/**
 * 定义marketplace类的数据模型
 *
 * Created by zephyre on 11/3/15.
 */

CoreModel.Marketplace = {
  Seller: new SimpleSchema({
    // 商家对应的用户的userId
    _id: {
      type: Number,
      min: 1
    },
    // 商家店铺的名称
    shopTitle: {
      type: String,
      min: 1,
      max: 128
    },
    // 商家支持那些语言
    lang: {
      type: [String],
      allowedValue: ["en", "zh", "local"],
      maxCount: 3,
      optional: true
    },
    // 商家支持那些服务区域
    serviceZones: {
      type: [CoreModel.Geo.GeoEntity],
      maxCount: 1024,
      optional: true
    },
    // 银行账户
    bankAccounts: {
      type: [CoreModel.Finance.BankAccount],
      maxCount: 64,
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
      type: [CoreModel.Misc.PhoneNumber],
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
    }
  }),
  // 定价
  Pricing: new SimpleSchema({
    // 价格
    price: {
      type: Number,
      decimal: true,
      min: 0
    },
    // 价格在哪个时间区间内有效([start, end], 左开右闭区间)
    timeRange: {
      type: [Date],
      minCount: 2,
      maxCount: 2,
      optional: true
    }
  }),
  // 库存信息
  StockInfo: new SimpleSchema({
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
  }),
  // 套餐信息
  CommodityPlan: new SimpleSchema({
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
      type: [CoreModel.Marketplace.Pricing],
      minCount: 1
    },
    // 市场价格
    marketPrice: {
      type: Number,
      decimal: true,
      min: 0,
      optional: true
    },
    // 完整的定价信息
    price: {
      type: Number,
      decimal: true,
      min: 0,
      optional: true
    },
    // 库存信息
    stockInfo: {
      type: [CoreModel.Marketplace.StockInfo],
      minCount: 1,
      optional: true
    },
    // 套餐的有效期区间
    timeRange: {
      type: [Date],
      minCount: 2,
      maxCount: 2,
      optional: true
    }
  }),
  // 商品
  Commodity: new SimpleSchema({
    // 商品编号
    _id: {
      type: Number,
      min: 1
    },
    // 商家
    seller: {
      type: CoreModel.Marketplace.Seller
    },
    // 商品标题
    title: {
      type: String,
      min: 1,
      max: 1024
    },
    // 商品描述
    desc: {
      type: String,
      max: 65535,
      optional: true
    },
    plans: {
      type: [CoreModel.Marketplace.CommodityPlan],
      minCount: 1
    }
  })
};
