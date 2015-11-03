/**
 * 和地理信息相关的schema
 *
 * Created by zephyre on 11/3/15.
 */

CoreModel.Geo = {
  // Locality和Country的抽象类
  GeoEntity: new SimpleSchema({
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
