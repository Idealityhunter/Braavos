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

import { fromJS } from '/lib/immutable'

/**
 * 和筛选控件相关的reducer
 */
export const filterReducer = (state = fromJS({}), action) => {
  const oldFilters = state.get('filters', fromJS({}));
  switch (action.type) {
    case 'SET_QUERY':
      // 更改了查找字符串
      return state.set('filters', oldFilters.set('query', action.query));
    case 'SET_FILTER':
      if (action.enabled) {
        // 应用filter
        return state.set('filters', oldFilters.set(action['filterKey'], action['filterValue']));
      } else {
        // 清除filter
        return state.set('filters', oldFilters.delete(action['filterKey']));
      }
    case 'RESET_FILTERS':
      // 清除所有的filter
      return state.set('filters', fromJS({})).set('appliedFilters', fromJS({}));
    case 'APPLY_FILTERS':
      // 应用filters: 其原理是将filter应用到appliedFilters上面
      return state.set('appliedFilters', state.get('filters', fromJS({})));
    default:
      return state;
  }
};

/**
 * 和排序相关的reducer
 */
export const sortingReducer = (state = fromJS({createTime: 'desc'}), action) => {
  switch (action.type) {
    case 'SET_SORTING':
      // 设置排序方式
      return action.order ? fromJS({}).set(action.key, action.order) : fromJS({});
    case 'RESET_SORTING':
      return fromJS({});
    default:
      return state;
  }
};

