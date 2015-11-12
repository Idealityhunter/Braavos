/**
 * 和地理信息相关的schema
 *
 * Created by zephyre on 11/3/15.
 */

CoreModel.Geo = {
  // Locality和Country的抽象类
  GeoEntity: new SimpleSchema({
    // 标准的Morphia方案: "com.lvxingpai.model.geo.Country", 或者"com.lvxingpai.model.geo.Locality"
    // 参见: https://github.com/mongodb/morphia/wiki/AllAnnotations  (className的说明)
    className: {
      type: String
    },
    zhName: {
      type: String
    },
    enName: {
      type: String
    }
  }),

  // 国家信息
  Country: new SimpleSchema({
    // 标准的Morphia方案: "com.lvxingpai.model.geo.Country", 或者"com.lvxingpai.model.geo.Locality"
    // 参见: https://github.com/mongodb/morphia/wiki/AllAnnotations  (className的说明)
    className: {
      type: String
    },
    zhName: {
      type: String
    },
    enName: {
      type: String
    }
  })
};
