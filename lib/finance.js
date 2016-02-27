/**
 * 财务相关schema
 * Created by zephyre on 11/3/15.
 */

CoreModel.Finance = {
  // 账户资金流水
  TransactionLog: new SimpleSchema({
    // 属于哪个商家
    sellerId: {
      type: Number,
      min: 1
    },
    // 时间戳
    timestamp: {
      type: Date
    },
    // 该笔交易的金额
    amount: {
      type: Number
    },
    // 备注
    memo: {
      type: String,
      optional: true
    },
    // 交易的类型
    type: {
      type: String,
      allowedValues: [
        'orderIncome',  // 订单收入
        'orderRedeem',  // 订单退款
        'withdrawal', // 提现
        'misc' // 公司奖励
      ]
    },
    // 交易细节
    details: {
      type: Object,
      optional: true
    },
    // 该笔交易完成后的账户余额
    balance: {
      type: Number
    }
  }),
  BankAccount: new SimpleSchema({
    // 是否为国内的银行账户
    domestic: {
      type: Boolean
    },
    // 银行账户的代码。国内银行直接填写账户号码，境外银行填写IBAN代码
    accountNumber: {
      type: String,
      max: 34
    },
    // 银行的SWIFT代码. 对于境外账户, 这是必填项
    swift: {
      type: String,
      min: 8,
      max: 11,
      optional: true
    },
    // 银行名称
    bankName: {
      type: String,
      max: 512,
      optional: true
    },
    // 支行/分行名称
    branchName: {
      type: String,
      max: 512,
      optional: true
    },
    // 持卡人姓名
    cardHolder: {
      type: String,
      min: 1,
      max: 256
    },
    // 账单地址, 境外必填
    billingAddress: {
      type: String,
      min: 1,
      max: 1024,
      optional: true
    }
  })
};
