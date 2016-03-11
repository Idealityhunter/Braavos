/**
 * 和商品相关的发布
 * Created by zephyre on 2/1/16.
 */

// 查询商品
Meteor.publish('marketplace.commodity', function (filters, {isAdmin, limit, sorting, ...kwargs}) {
  const query = BraavosCore.Utils.marketplace.buildCommodityQuery(filters, isAdmin, parseInt(this.userId));
  const fields = {commodityId: 1, seller: 1, title: 1, cover: 1, price: 1, createTime: 1, status: 1};

  // 管理员还需要展示 weightBoost
  if (isAdmin) _.extend(fields, {weightBoost: 1});

  // 默认排序: 按照时间倒序
  const sort = BraavosCore.Utils.marketplace.buildCommoditySort(sorting);
  // 默认前500个商品
  return BraavosCore.Database.Braavos.Commodity.find(query, {fields: fields, limit: limit || 500, sort: sort});
});
