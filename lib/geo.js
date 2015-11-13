/**
 * 和地理信息相关的schema
 *
 * Created by zephyre on 11/3/15.
 */

const basicGeo = {
  // 标准的Morphia方案: "com.lvxingpai.model.geo.Country", 或者"com.lvxingpai.model.geo.Locality"
  // 参见: https://github.com/mongodb/morphia/wiki/AllAnnotations  (className的说明)
  className: {
    type: String
  },
  zhName: {
    type: String
  },
  enName: {
    type: String,
    optional: true
  }
};

CoreModel.Geo = {
  // Locality和Country的抽象类
  GeoEntity: new SimpleSchema(basicGeo),

  // 国家信息
  Country: new SimpleSchema(basicGeo),

  // 目的地信息
  Locality: new SimpleSchema(basicGeo)
};
