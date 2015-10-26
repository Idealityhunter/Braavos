/**
 *
 * Created by zephyre on 10/21/15.
 */

var Schema = BraavosCore.Schema;

Schema.GeoEntity = new SimpleSchema({
  zhName: {
    type: String,
    max: 128
  },
  enName: {
    type: String,
    max: 128
  },
  className: {
    type: String
  }
});

Schema.Country = new SimpleSchema({
  // 中文名称
  zhName: {
    type: String,
    max: 128
  },

  // 英文名称
  enName: {
    type: String,
    max: 128
  },

  // ISO 3166-2标准的国家代码
  code: {
    type: String,
    regEx: /^[A-Z]{2}$/
  }
});

