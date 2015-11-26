/**
 * 账户相关的schema
 *
 * Created by zephyre on 11/5/15.
 */

CoreModel.Account = {};
const Account = CoreModel.Account;

// 某些特殊操作所需要的token
Account.Token = new SimpleSchema({
  /**
   * Token本身是一个8字符到128字符不等的字符串
   */
  token: {
    type: String,
    min: 8,
    max: 128,
    unique: true
  },

  /**
   * token的类型:
   *
   * 1: 注册时所用的token
   * 10: 邮箱验证时的token
   * 20: 修改密码时的token
   */
  tokenType: {
    type: Number,
    min: 1,
    max: 100
  },

  /**
   * Token的生成时间
   */
  timestamp: {
    type: Date
  },

  /**
   * 过期时间
   */
  expire: {
    type: Date
  },

  /**
   * 是否还有效
   */
  valid: {
    type: Boolean,
    defaultValue: true
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
    regEx: /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,32}$/
  },
  // 头像
  avatar: {
    type: CoreModel.Misc.Image,
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
    regEx: /^(m|f|s)$/i,
    optional: true
  },
  tel: {
    type: String,
    optional: true
  },
  // 用户角色
  roles: {
    type: [Number],
    optional: true
  }
});

// 身份证件
Account.IdProof = new SimpleSchema({
  // 证件类型
  idType: {
    type: String,
    // 分别表示: 护照/中国大陆身份证
    allowedValues: ["passport", "cnid"]
  },
  // 国家代码
  nation: {
    type: String,
    regEx: /[A-Z]{2}/,
    // 当idType为cnid时, 可以不提供nation信息
    optional: true
  },
  // 证件编号
  code: {
    type: String,
    min: 8,
    max: 64
  }
});

// 实名信息
Account.RealNameInfo = new SimpleSchema({
  // 姓
  surname: {
    type: String,
    min: 1,
    max: 64
  },
  // 名
  givenName: {
    type: String,
    min: 1,
    max: 256
  },
  // 性别
  gender: {
    type: String,
    allowedValues: ["m", "f"],
    optional: true
  },
  // 生日
  birthday: {
    type: Date,
    optional: true
  },
  // 身份信息
  identities: {
    type: [Account.IdProof],
    optional: true
  },
  // 电话号码
  tel: {
    type: CoreModel.Misc.PhoneNumber,
    optional: true
  },
  // 电子邮件
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  }
});

