/**
 * 商品列表的表格
 *
 * Created by zephyre on 2/1/16.
 */

import { fromJS } from '/lib/immutable'
import { FixedDataTable} from '/lib/fixed-data-table'
const { Table, Column, Cell } = FixedDataTable;

const TextCell = ({rowIndex, data, col}) => {
  const getByPath = (obj, path) => _.reduce(path.split('.'), (result, key) => result[key] || {}, obj);

  return (
    <Cell>
      {getByPath(data[rowIndex], col)}
    </Cell>
  );
};

const ImageCell = ({rowIndex, data, col}) => {
  const getByPath = (obj, path) => _.reduce(path.split('.'), (result, key) => result[key] || {}, obj);
  const dimension = 108;

  return (
    <Cell>
      <img width={dimension} height={dimension}
           src={`${getByPath(data[rowIndex], col)['url']}?imageView2/1/w/${dimension}/h/${dimension}`}/>
    </Cell>
  );
};

export const CommoditiesTable = React.createClass({
  mixins: [ReactMeteorData],

  getDefaultProps() {
    return {
      maxCommodityCount: 200
    };
  },

  propTypes: {
    // 最大读取的商品数量
    maxCommodityCount: React.PropTypes.number,
    // filter信息
    filters: React.PropTypes.object
  },

  getMeteorData() {
    const userId = parseInt(Meteor.userId());
    const isAdmin = BraavosCore.Utils.account.isAdmin(userId);
    const limit = this.props.maxCommodityCount;
    const filters = this.props.filters.toObject();

    const logger = BraavosCore.logger;

    // 先订阅没有任何filter的版本
    logger.debug('Subscribing bare data collection...');
    const bareSub = Meteor.subscribe('marketplace.commodity', {}, isAdmin, limit);

    // 在客户端获得商品
    const buildCommodities = () => {
      const query = BraavosCore.Utils.marketplace.buildCommodityQuery(filters, isAdmin, userId);
      const fields = {commodityId: 1, seller: 1, title: 1, cover: 1, price: 1, createTime: 1, status: 1};
      // 默认排序: 按照时间倒序
      const sort = {createTime: -1};
      return BraavosCore.Database.Braavos.Commodity.find(query, {fields: fields, sort: sort, limit: limit}).fetch();
    };

    // 默认情况下没有商品
    let commodities = [];

    if (bareSub.ready()) {
      // 如果完整版的订阅已经成功
      logger.debug('Bare data collection successfully subscribed.');

      // 通过订阅返回的文档数量是否等于maxCommodityCount, 来确定是不是所有符合条件的数据都一次性获取到了
      const bareQuery = BraavosCore.Utils.marketplace.buildCommodityQuery({}, isAdmin, userId);
      const totalCount = BraavosCore.Database.Braavos.Commodity.find(bareQuery, {fields: {}}).count();
      if (totalCount >= limit) {
        // 服务端还有数据. 这种情况下, 需要根据filter, 做新的订阅
        const filteredSub = Meteor.subscribe('marketplace.commodity', filters, isAdmin, limit);
        if (filteredSub.ready()) {
          logger.debug('Filtered subscription is ready.');
          commodities = buildCommodities();
        }
      } else {
        // 所有数据都已经取到, 在客户端直接读取数据
        commodities = buildCommodities();
      }
    }
    return {commodities};
  },

  render() {
    return (
      <Table
        rowsCount={this.data.commodities.length}
        rowHeight={120}
        headerHeight={50}
        width={1200}
        height={800}
      >
        <Column
          header={<Cell>商户编号</Cell>}
          cell={<TextCell data={this.data.commodities} col="seller.sellerId" />}
          fixed={true}
          width={80}
        />
        <Column
          header={<Cell>商户名称</Cell>}
          cell={<TextCell data={this.data.commodities} col="seller.name" />}
          fixed={true}
          width={120}
        />
        <Column
          header={<Cell>商品编号</Cell>}
          cell={<TextCell data={this.data.commodities} col="commodityId" />}
          fixed={true}
          width={80}
        />
        <Column
          header={<Cell>商品名称</Cell>}
          cell={<TextCell data={this.data.commodities} col="title" />}
          fixed={true}
          width={160}
        />
        <Column
          header={<Cell>封面</Cell>}
          cell={<ImageCell data={this.data.commodities} col="cover" />}
          fixed={true}
          width={140}
        />
      </Table>
    );
  }
});
