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

const { fromJS } = Immutable;
import { Immutable } from '/lib/immutable'

/**
 * 和筛选控件相关的reducer
 */
export const filterReducer = (state=fromJS({}), action) => {
  const oldFilters = state.get('filters', fromJS({}));
  switch (action.type) {
    case 'SET_QUERY':
      // 更改了查找字符串
      return state.merge(fromJS({query: action.query}));
    case 'APPLY_FILTER':
      if (action.enabled) {
        // 应用filter
        return state.merge(fromJS({}).set(action['filterKey'], action['filterValue']));
      } else {
        // 清除filter
        return state.delete(action['filterKey']);
      }
    case 'RESET_FILTERS':
      // 清除所有的filter
      return fromJS({});
    default:
      return state;
  }
};

