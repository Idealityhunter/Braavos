/**
 * 和商品列表展示页相关的reducer
 *
 * 有下列remote states需要保存(这部分状态, 使用Meteor本身的机制来管理):
 * - 当前商品列表
 *
 * 有下列local states需要保存(使用redux来管理):
 * - 用户输入的筛选词
 *
 * Created by zephyre on 2/1/16.
 */

const { Map, fromJS } = Immutable;
import { Immutable } from '/lib/immutable'

export const tableReducer = (state=fromJS({}), action) => {
  switch (action.type) {
    case 'SET_SORT  _STYLE':
      // 更改了排序方式(排序字段, 排序: asc/desc)
      const sortStyle = _.pick(action, ['sortKey', 'sortOrder']);
      return state.merge(fromJS(sortStyle));
    case 'SET_QUERY':
      // 更改了查找字符串
      return state.merge(fromJS({query: action.query}));
    case 'APPLY_FILTER':
      const oldFilters = state.get('filters', fromJS({}));
      if (action.enabled) {
        // 应用filter
        return state.set('filters', oldFilters.set(action['filterKey'], action['filterValue']));
      } else {
        // 清除filter
        return state.set('filters', oldFilters.delete(action['filterKey']));
      }
    case 'RESET_FILTERS':
      // 清除所有的filter
      return state.set('filters', fromJS({}));
    default:
      return state;
  }
};

