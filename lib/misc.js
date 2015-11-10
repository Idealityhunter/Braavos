/**
 * 其它schema
 * Created by zephyre on 11/3/15.
 */

CoreModel.Misc = {};

const Misc = CoreModel.Misc;

// 电话号码
Misc.PhoneNumber = new SimpleSchema({
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
});

Misc.CropHint = new SimpleSchema({
  top: {
    type: Number,
    min: 0
  },
  left: {
    type: Number,
    min: 0
  },
  bottom: {
    type: Number,
    min: 0
  },
  right: {
    type: Number,
    min: 0
  }
});

// 图像
Misc.Images = new SimpleSchema({
  // 有url的时候, 优先使用url
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  bucket: {
    type: String,
    optional: true
  },
  key: {
    type: String,
    optional: true
  },
  cropHint: {
    type: CoreModel.Misc.CropHint,
    optional: true
  }
});
