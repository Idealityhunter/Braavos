/**
 * 其它一些支持类的schema
 * Created by zephyre on 10/26/15.
 */

const Schema = BraavosCore.Schema;

Schema.PhoneNumber = new SimpleSchema({
  // 国家代码
  dialCode: {
    type: Number,
    min: 1,
    optional: true
  },

  // 电话号码
  number: {
    type: String,
    regEx: /^[\d]{5,32}$/
  }
});
