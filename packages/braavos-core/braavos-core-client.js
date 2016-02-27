/**
 *
 * Created by zephyre on 2/27/16.
 */

BraavosCore.SubsManager = {
  // 用户的订阅
  users: new SubsManager({cacheLimit: 1}),
  // 卖家的订阅
  sellers: new SubsManager({cacheLimit: 1})
};
