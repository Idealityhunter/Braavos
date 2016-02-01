/**
 * 展示商品的列表
 *
 * 注意: 商品列表的最大数量不超过500个. 如果商品数量过多, 建议合理采用filter来将其限制
 *
 * Created by zephyre on 2/1/16.
 */

import {
  createStore, combineReducers, compose, Provider, connect, applyMiddleware, thunkMiddleware, createLogger
} from '/lib/redux'
import { FixedDataTable } from '/lib/fixed-data-table'
const { Table, Column, Cell } = FixedDataTable;
import { Input, Button, Alert } from '/lib/react-bootstrap'
import { BraavosBreadcrumb } from '/client/components/breadcrumb/breadcrumb';

import { Immutable } from '/lib/immutable'
const { Map, fromJS } = Immutable;

import { setSortStyle, setQuery, applyFilter, resetFilters } from './action'
import { tableReducer } from './reducers'
import { TableFilters } from './table-filters'

const reducer = combineReducers({table: tableReducer});
const store = createStore(reducer, compose(
  applyMiddleware(thunkMiddleware, createLogger()),
  window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

const mapStateToProps = (state) => {
  console.log(state);
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    handlers: {
      table: {
        onChangeQuery: (value) => {
          dispatch(setQuery(value));
        },

        onChangeStatusFilter: (value) => {
          dispatch(applyFilter('commodityStatus', value));
        },

        onSelectDate: (dateType) => {
          return (date) => {
            dispatch(applyFilter(`date.${dateType}`, date));
          }
        },

        onResetFilters: () => {
          dispatch(resetFilters());
          dispatch(setQuery(""))
        }
      }
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
      filters: React.PropTypes.object
    },

    render() {

      return (
        <div className="commodity-mngm-wrap">
          <BraavosBreadcrumb />
          <div className="wrapper wrapper-content animated fadeInRight">
            <TableFilters {...{...(this.props.table.toObject()), ...this.props.handlers.table}}/>
          </div>
        </div>
      );
    }
  })
);

export const Commodities = () => <Provider store={store}><Container /></Provider>;
