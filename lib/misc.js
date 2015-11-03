/**
 * 其它schema
 * Created by zephyre on 11/3/15.
 */

CoreModel.Misc = {
  // 电话号码
  PhoneNumber: new SimpleSchema({
    // 国家代码
    dialCode: {
      type: Number,
      min: 1,
      defaultValue: 86
    },
    // 国内代码
    number: {
      type: Number,
      min: 1
    }
  })
};
