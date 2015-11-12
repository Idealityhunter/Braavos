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

