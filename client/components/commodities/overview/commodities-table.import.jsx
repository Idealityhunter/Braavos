/**
 * 商品列表的表格
 *
 * Created by zephyre on 2/1/16.
 */

import { fromJS, Immutable } from '/lib/immutable'
const { Map, is } = Immutable;

import { Button, ButtonGroup } from '/lib/react-bootstrap'
import { FixedDataTable} from '/lib/fixed-data-table'
const { Table, Column, Cell } = FixedDataTable;

const TextCell = React.createClass({
  propTypes: {
    // 第几行
    rowIndex: React.PropTypes.number,
    // table的数据
    data: React.PropTypes.object,
    // 列名称
    col: React.PropTypes.string,
    // 数据转换函数
    transform: React.PropTypes.func
  },

  //shouldComponentUpdate(nextProps) {
  //  // 这些key要求没有发生变化
  //  const keys = ['col', 'columnKey', 'height', 'width', 'rowIndex'];
  //  let changed = !!_.find(keys, key => this.props[key] != nextProps[key]);
  //  if (changed) {
  //    return true;
  //  }
  //  // 数据也不能发生变化
  //  const v1 = this.props.data.getIn([this.props.rowIndex, ...this.props.col.split('.')]);
  //  const v2 = nextProps.data.getIn([nextProps.rowIndex, ...nextProps.col.split('.')]);
  //  return !is(v1, v2);
  //},

  render() {
    const {rowIndex, data, col, transform} = this.props;

    let contents = data.getIn([rowIndex, ...col.split('.')]);
    if (transform && (typeof transform == 'function')) {
      contents = transform(contents);
    }

    return (
      <Cell>
        {contents}
      </Cell>
    );
  }
});

const TextCell2 = ({rowIndex, data, col, transform}) => {
  let contents = data.getIn([rowIndex, ...col.split('.')]);
  if (transform && (typeof transform == 'function')) {
    contents = transform(contents);
  }

  console.log(`Render: rowIndex=${rowIndex}, col=${col}`);

  return (
    <Cell>
      {contents}
    </Cell>
  );
};

// 操作
const OperationCell = ({rowIndex, data}) => {
  const commodity = data.get(rowIndex);

  const handleEdit = commodityId => (() => {
    const isAdmin = BraavosCore.Utils.account.isAdmin();
    FlowRouter.go(`/commodities/editor/${commodityId}?isAdmin=${isAdmin}`);
  });

  // 下架商品
  const handleDropCommodity = commodityId => (e => {
    e.preventDefault();
    swal({
      title: "确认下架?",
      text: "",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "下架",
      closeOnConfirm: false
    }, function () {
      Meteor.call('commodity.status.update', commodityId, 'disabled', function (err, res) {
        if (err) {
          // 下架失敗
          swal("下架失败!", "", "error");
        }
        if (res) {
          // 下架成功
          swal("下架成功", "", "success");
        }
      });
    });
  });

  // 上架商品
  const handlePubCommodity = commodityId => (e => {
    e.preventDefault();
    Meteor.call('commodity.status.update', commodityId, 'pub', function (err, res) {
      if (err) {
        // 上架失败
        swal("上架失败!", "", "error");
      }
      if (res) {
        // 上架成功
        swal("上架成功!", "", "success");
      }
    });
  });

  const commodityId = commodity.get('commodityId');
  const buttons = [<Button key={`${commodityId}.edit`} bsClass="btn btn-white"
                           onClick={handleEdit(commodityId)}>编辑</Button>];

  const status = commodity.get('status');
  if (status == 'pub') {
    buttons.push(<Button key={`${commodityId}.disabled`} bsClass="btn btn-white"
                         onClick={handleDropCommodity(commodity.get('commodityId'))}>下架</Button>);
  } else if (status == 'disabled') {
    buttons.push(<Button key={`${commodityId}.pub`} bsClass="btn btn-white"
                         onClick={handlePubCommodity(commodity.get('commodityId'))}>上架</Button>);
  }

  return (
    <Cell>
      <ButtonGroup bsSize="xsmall">
        {buttons}
      </ButtonGroup>
    </Cell>
  );
};

const ImageCell = ({rowIndex, data, col}) => {
  const contents = data.getIn([rowIndex, ...col.split('.'), 'url']);
  const dimension = 108;

  return (
    <Cell>
      <img width={dimension} height={dimension}
           src={`${contents}?imageView2/1/w/${dimension}/h/${dimension}`}/>
    </Cell>
  );
};

const SortHeaderCell = React.createClass({
  propTyps: {
    sortDir: React.PropTypes.string,
    children: React.PropTypes.object,
    onSortChange: React.PropTypes.func
  },

  _reverseSortDirection(sortDir) {
    return sortDir === 'desc' ? 'asc' : 'desc';
  },

  _onSortChange(e) {
    e.preventDefault();
    if (this.props.onSortChange) {
      this.props.onSortChange(this.props.sortDir ? this._reverseSortDirection(this.props.sortDir) : 'desc');
    }
  },

  render() {
    const {sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }
});

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
    filters: React.PropTypes.object,
    // 排序的信息
    sorting: React.PropTypes.object,
    // 处理排序
    onSortChange: React.PropTypes.func
  },

  shouldComponentUpdate(nextProps, nextState) {
    for (let data of [nextProps, nextState]) {
      const pairs = _.toPairs(data);
      for (let [key, value] of pairs) {
        if (value != this.props[key]) {
          return true;
        }
      }
    }
    return false;
  },

  /**
   * 为了提高数据订阅的效率, 采用以下算法. 首先, 保持一个没有任何filter的订阅, 即bareSub. 通过返回的文档数量, 可以很容易得知
   * 该订阅是否为"完整订阅", 即数据库中所有符合条件的文档都已经返回. 当有filter存在的时候, 如果是完整订阅, 可以直接通过客户端
   * 的minimongo来查询, 不再需要重新访问远程的数据库.
   * @returns {{commodities: Array}}
   */
  getMeteorData() {
    const userId = parseInt(Meteor.userId());
    const isAdmin = BraavosCore.Utils.account.isAdmin();
    const limit = this.props.maxCommodityCount;
    const filters = this.props.filters.toObject();
    const sorting = this.props.sorting.toObject();

    const logger = BraavosCore.logger;

    // 先订阅没有任何filter的版本
    logger.debug('Subscribing bare data collection...');
    const bareSub = Meteor.subscribe('marketplace.commodity', {}, {isAdmin, limit});

    // 在客户端获得商品
    const buildCommodities = () => {
      const query = BraavosCore.Utils.marketplace.buildCommodityQuery(filters, isAdmin, userId);
      const fields = {commodityId: 1, seller: 1, title: 1, cover: 1, price: 1, createTime: 1, status: 1};
      // 默认排序: 按照时间倒序
      const sort = BraavosCore.Utils.marketplace.buildCommoditySort(sorting);
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
        logger.debug('Subscribing from server.');

        // 服务端还有数据. 这种情况下, 需要根据filter, 做新的订阅
        // 先做一次不带sorting的版本. 如果返回的数量不多, 说明所有filter的结果都已返回, 在客户端做sorting就可以了
        const filteredSubWoSorting = Meteor.subscribe('marketplace.commodity', filters, {isAdmin, limit});
        if (filteredSubWoSorting.ready()) {
          logger.debug('Filtered commodities w/o sorting is ready.');

          // 先尝试一次获取商品
          const result = buildCommodities();
          if (result.length >= limit) {
            logger.debug('Too many results returned. Need to perform sorting on server-side.');

            // 返回结果太多, 说明服务端可能还有数据. 老老实实从服务端获得所有数据
            const filteredSub = Meteor.subscribe('marketplace.commodity', filters, {isAdmin, limit, sorting});
            if (filteredSub.ready()) {
              logger.debug('Server side filtering and sorting is ready.');
              commodities = buildCommodities();
            }
          } else {
            commodities = result;
          }
        }
      } else {
        logger.debug('Subscribing on client side.');
        // 所有数据都已经取到, 在客户端直接读取数据
        commodities = buildCommodities();
      }
    }
    return fromJS({commodities: commodities});
  },

  // 根据字段名称, 获得排序信息
  _getSortDir(col) {
    const sorting = this.props.sorting.toObject();
    // asc / desc / undefined
    return sorting[col];
  },

  _onSortChange(col) {
    return sortDir => {
      if (this.props.onSortChange) {
        this.props.onSortChange(col, sortDir);
      }
    }
  },

  _buildHeader(col, children) {
    return <SortHeaderCell sortDir={this._getSortDir(col)}
                           onSortChange={this._onSortChange(col)}
                           children={children}/>;
  },

  render() {
    const commodities = this.data.get('commodities');
    const buildKey = (rowIndex, col) => `${commodities.getIn([rowIndex, 'commodityId'])}.${col}`;
    return (
      <Table
        rowsCount={this.data.get('commodities').count()}
        rowHeight={120}
        headerHeight={50}
        width={1200}
        height={800}
      >
        <Column
          header={this._buildHeader('seller.sellerId', '商户编号')}
          cell={<TextCell data={this.data.get('commodities')} col="seller.sellerId" />}
          fixed={true}
          width={80}
        />
        <Column
          header={this._buildHeader('seller.name', '商户名称')}
          cell={<TextCell data={this.data.get('commodities')} col="seller.name" />}
          fixed={true}
          width={120}
        />
        <Column
          header={this._buildHeader('commodityId', '商品编号')}
          cell={props => <TextCell key={buildKey(props.rowIndex, props.col)} data={commodities} col="commodityId"
                                   {...props} />}
          fixed={true}
          width={80}
        />
        <Column
          header={this._buildHeader('title', '商品名称')}
          cell={<TextCell data={this.data.get('commodities')} col="title" />}
          fixed={true}
          width={160}
        />
        <Column
          header={<Cell>封面</Cell>}
          cell={<ImageCell data={this.data.get('commodities')} col="cover" />}
          fixed={true}
          width={140}
        />
        <Column
          header={this._buildHeader('price', '价格')}
          cell={<TextCell data={this.data.get('commodities')} col="price" transform={v => `￥${v / 100}`} />}
          fixed={true}
          width={80}
        />
        <Column
          header={<Cell>状态</Cell>}
          cell={<TextCell data={this.data.get('commodities')} col="status" transform={v => {
              const dict = {
                pub: '已发布',
                review: '审核中',
                disabled: '已下架'
              };
              return dict[v] || '';
            }} />}
          fixed={true}
          width={80}
        />
        <Column
          header={this._buildHeader('createTime', '创建时间')}
          cell={<TextCell data={this.data.get('commodities')} col="createTime" transform={ v=> {
            if (v) {
              return moment(v).format('YYYY-MM-DD');
            } else {
              return '';
            }
          }} />}
          fixed={true}
          width={100}
        />
        <Column
          header={<Cell>操作</Cell>}
          cell={<OperationCell data={this.data.get('commodities')} />}
          fixed={true}
          width={100}
        />
      </Table>
    );
  }
});
