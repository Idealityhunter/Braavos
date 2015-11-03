/**
 * 定义marketplace类的数据模型
 *
 * Created by zephyre on 11/3/15.
 */

CoreModel.Marketplace = {
  Seller: new SimpleSchema({
    // 商家对应的用户的userId
    id: {
      type: Number,
      min: 1
    },
    shopTitle: {
      type: String,
      min: 1,
      max: 128
    },
    lang: {
      type: [Number],
      allowedValue: ["en", "zh", "local"],
      maxCount: 3,
      optional: true
    },
    serviceZones: {
      type: [CoreModel.Geo.GeoEntity],
      maxCount: 1024,
      optional: true
    },
    bankAccounts: {
      type: [CoreModel.Finance.BankAccount],
      maxCount: 64,
      optional: true
    },
    email: {
      type: [String],
      maxCount: 4,
      regEx: SimpleSchema.RegEx.Email,
      optional: true
    },
    phone: {
      type: [CoreModel.Misc.PhoneNumber],
      maxCount: 4,
      optional: true
    },
    address: {
      type: String,
      max: 1024,
      optional: true
    },
    favorCnt: {
      type: Number,
      min: 0,
      optional: true
    }
  })
};
