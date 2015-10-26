/**
 * 账户相关的Schema
 * Created by zephyre on 10/22/15.
 */

const Schema = BraavosCore.Schema;

Schema.RegisterToken = new SimpleSchema({
  /**
   * Token本身是一个uuid
   */
  token: {
    type: String,
    regEx: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    unique: true
  },

  /**
   * Token的生成
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

/**
 * 基础的用户信息
 *
 * @type {SimpleSchema}
 */
Schema.UserInfo = new SimpleSchema({
  /**
   * 用户ID
   */
  userId: {
    type: Number,
    min: 1,
    unique: true
  },

  /**
   * 用户昵称
   */
  nickName: {
    type: String,
    min: 1,
    max: 32
  },

  /**
   * 用户的个性签名
   */
  signature: {
    type: String,
    max: 512,
    optional: true
  },

  /**
   * 头像
   */
  avatar: {
    type: String,
    max: 1024,
    optional: true
  },

  /**
   * 性别。m: 男性, f: 女性, b: 跨性别者, s: 保密, u: 未知
   */
  gender: {
    type: String,
    regEx: /^(m|f|b|s|u)$/i,
    optional: true
  },

  /**
   * 电话号码
   */
  tel: {
    type: String,
    max: 32,
    unique: true
  }
});


const RealNameInfo = new SimpleSchema({
  // 姓
  surname: {
    type: String,
    max: 64,
    min: 1
  },

  // 名
  givenName: {
    type: String,
    max: 256,
    min: 1
  },

  // 国籍
  nationality: {
    type: Schema.Country,
    max: 10,
    optional: true
  },

  // 实名认证的状态
  veriStatus: {
    type: String,
    allowedValues: ["unverified", "applied", "verified", "declined"]
  }
});


/**
 * 商户信息
 *
 * @type {SimpleSchema}
 */
Schema.SellerInfo = new SimpleSchema({
  // 用户ID
  userId: {
    type: Number,
    min: 1,
    unique: true
  },

  //// 服务语言: 只允许英文, 中文和本地语言
  //lang: {
  //  type: [String],
  //  allowedValues: ["en", "zh", "local"],
  //  optional: true
  //},
  //
  //// 服务区域
  //serviceZone: {
  //  type: [Schema.GeoEntity],
  //  max: 512,
  //  optional: true
  //},
  //
  //// 实名信息
  //realNameInfo: {
  //  type: RealNameInfo,
  //  optional: true
  //},
  //
  //// 银行账户信息
  //
  //// 店铺名称
  //shopTitle: {
  //  type: String,
  //  min: 1,
  //  max: 128,
  //  optional: true
  //},

  // 电话号码
  contact: {
    type: Schema.PhoneNumber,
    optional: true
  },

  // 详细地址
  address: {
    type: String,
    min: 1,
    max: 1024,
    optional: true
  },

  // email
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  }
});