/**
 * 财务相关schema
 * Created by zephyre on 11/3/15.
 */

CoreModel.Finance = {
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
    // 银行的SWIFT代码
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
    // 账单地址
    billingAddress: {
      type: String,
      min: 1,
      max: 1024,
      optional: true
    }
  })
};
