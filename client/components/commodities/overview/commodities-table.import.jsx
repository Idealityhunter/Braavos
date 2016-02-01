/**
 * 商品列表的表格
 *
 * Created by zephyre on 2/1/16.
 */

import { fromJS } from '/lib/immutable'

export const CommoditiesTable = React.createClass({
  mixins: [ReactMeteorData],

  propTypes: {
    // filter信息
    filters: React.PropTypes.object
  },

  getMeteorData() {
    const userId = parseInt(Meteor.userId());
    const isAdmin = BraavosCore.Utils.account.isAdmin(userId);

    const filters = this.props.filters.toObject();
    if (filters) {
      Meteor.subscribe('marketplace.commodity', filters, isAdmin);
      const query = BraavosCore.Utils.marketplace.buildCommodityQuery(filters, isAdmin, userId);
      const fields = {commodityId: 1, seller: 1, title: 1, cover: 1, price: 1, createTime: 1, status: 1};
      // 默认排序: 按照时间倒序
      const sort = {createTime: -1};
      const commodities = BraavosCore.Database.Braavos.Commodity.find(query, {fields: fields, sort: sort}).fetch();

      return {commodities};
    } else {
      return {commodities: []};
    }
  },

  render() {
    return (
      <div>我是表格</div>
    );
  }
});
