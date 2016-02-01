/**
 * 展示商品的列表
 *
 * 注意: 商品列表的最大数量不超过500个. 如果商品数量过多, 建议合理采用filter来将其限制
 *
 * Created by zephyre on 2/1/16.
 */

import {
  createStore, combineReducers, compose, Provider, connect, applyMiddleware, thunkMiddleware
} from '/lib/redux'
import { FixedDataTable } from '/lib/fixed-data-table'
import { Input, Button, Alert } from '/lib/react-bootstrap'
import { BraavosBreadcrumb } from '/client/components/breadcrumb/breadcrumb';

import { fromJS } from '/lib/immutable'

import { setSortStyle, setQuery, setFilter, resetFilters, applyFilters } from './action'
import { filterReducer } from './reducers'
import { TableFilters } from './table-filters'
import { CommoditiesTable } from './commodities-table'

const reducer = combineReducers({filter: filterReducer});
const store = createStore(reducer, compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    handlers: {
      // 和筛选控件相关的事件回调
      filters: {
        onChangeQuery: value => dispatch(setQuery(value)),

        onChangeStatusFilter: value => dispatch(setFilter('commodityStatus', value)),

        onSelectDate: dateType => (date => dispatch(setFilter(`date.${dateType}`, date))),

        onResetFilters: () => dispatch(resetFilters()),

        // 点击搜索按钮
        onApplyFilters: () => dispatch(applyFilters())
      }
      // 和表格相关的事件回调
    }
  }
};

const Container = connect(mapStateToProps, mapDispatchToProps)(
  React.createClass({
    propTypes: {
      // 排序字段
      sortKey: React.PropTypes.string,
      // 升序还是降序
      sortOrder: React.PropTypes.string,
      // 搜索关键词
      query: React.PropTypes.string,
      // 各种filter
      filters: React.PropTypes.object,
      // 各种回调函数
      handlers: React.PropTypes.object
    },

    render() {
      const filters = this.props.filter.get('filters', fromJS({}));
      // 为TableFilters准备的
      const tableFiltersProps = {filters: filters, ...this.props.handlers.filters};
      // 为CommoditiesTable准备的
      const commodityTableProps = {filters: this.props.filter.get('appliedFilters', fromJS({}))}

      return (
        <div className="commodity-mngm-wrap">
          <BraavosBreadcrumb />
          <div className="wrapper wrapper-content animated fadeInRight">
            <TableFilters {...tableFiltersProps}/>
            <CommoditiesTable {...commodityTableProps}/>
          </div>
        </div>
      );
    }
  })
);

export const Commodities = () => <Provider store={store}><Container /></Provider>;
