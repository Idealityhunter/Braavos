/**
 * 账户相关的schema
 *
 * Created by zephyre on 11/5/15.
 */

CoreModel.Account = {};
const Account = CoreModel.Account;

Account.Seller = new SimpleSchema({
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
    allowedValues: ["en", "zh", "local"],
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
});

// 普通用户的schema
Account.UserInfo = new SimpleSchema({
  // 用户Id
  userId: {
    type: Number,
    min: 1
  },
  // 昵称
  nickName: {
    type: String,
    min: 2,
    max: 32
  },
  // 头像
  avatar: {
    type: String,
    optional: true
  },
  // 个性签名
  signature: {
    type: String,
    min: 1,
    max: 512,
    optional: true
  },
  // 性别
  gender: {
    type: String,
    regEx: /^(m|f|s)$/,
    optional: true
  },
  tel: {
    type: String,
    optional: true
  },
  // 用户角色
  roles: {
    type: [Number]
  }
});
