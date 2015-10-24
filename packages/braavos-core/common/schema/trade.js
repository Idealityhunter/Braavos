/**
 *
 * Created by zephyre on 10/21/15.
 */

var Schema = BraavosCore.Schema;

// 银行账户
var BankAccount = new SimpleSchema({
  // 银行的SWIFT代码
  swift: {
    type: String,
    min: 8,
    max: 11
  },
  // 银行账户的账号, 境外银行需要提供IBAN代码
  accountNumber: {
    type: String,
    max: 34
  },
  // 银行名称
  bankName: {
    type: String,
    max: 512
  },
  // 支行/分行信息
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
});

// 电话号码
var PhoneNumber = new SimpleSchema({
  number: {
    type: String,
    regEx: /^[\d]{1,64}$/,
  },
  dialCode: {
    type: Number,
    defaultValue: 86
  }
});

Schema.Saler = new SimpleSchema({
  // 用户ID
  userId: {
    type: Number,
    min: 1
  },
  // 服务语言(只支持英语,中文和当地语言)
  lang: {
    type: [String],
    regEx: /^(en|zh|local)$/,
    minCount: 1
  },
  // 服务区域(可能是国家,也可能是城市)
  serviceZone: {
    type: [Schema.GeoEntity]
  },
  // 银行账户信息
  bankAccounts: {
    type: [BankAccount],
    optional: true
  },
  // 店铺名称
  shopTitle: {
    type: String,
    min: 1,
    max: 128
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  tel: {
    type: PhoneNumber,
    optional: true
  }
});


