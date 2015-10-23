/**
 * 账户相关的Schema
 * Created by zephyre on 10/22/15.
 */


var Schema = BraavosCore.Schema;

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
