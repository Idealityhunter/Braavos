/**
 * 定义marketplace类的数据模型
 *
 * Created by zephyre on 11/3/15.
 */

CoreModel.Marketplace = {

  // 定价
  Pricing: new SimpleSchema({
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
    // 价格
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
    // 购买该商品是否需要确定时间
    timeRequired: {
      type: Boolean
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
      type: CoreModel.Account.Seller
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
