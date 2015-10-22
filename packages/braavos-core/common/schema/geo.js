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

