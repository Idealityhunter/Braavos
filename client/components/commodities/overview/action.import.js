/**
 * 和商品列表展示页相关的action
 *
 * Created by zephyre on 2/1/16.
 */

/**
 * 排序设置
 * @param key 排序字段
 * @param order 升序还是降序
 */
export const setSorting = (key, order) => {
  return _.extend({key, order}, {type: 'SET_SORTING'});
};

/**
 * 清除排序
 */
export const resetSorting = () => {
  return {type: 'RESET_SORTING'};
};

/**
 * 设置关键词搜索
 */
export const setQuery = (value) => {
  return {
    type: 'SET_QUERY',
    query: value
  }
};

/**
 * 设置一个筛选条件
 * @param filterKey 筛选条件的名称, 比如: commodityStatus, date.start, date.end等
 * @param filterValue 筛选值
 */
export const setFilter = (filterKey, filterValue) => {
  return _.assign({filterKey, filterValue}, {type: 'SET_FILTER', enabled: true});
};

/**
 * 情况筛选器
 * @returns {{type: string}}
 */
export const resetFilters = () => {
  return {
    type: 'RESET_FILTERS'
  };
};

/**
 * 应用筛选条件(即点击"搜索"按钮)
 * @returns {{type: string}}
 */
export const applyFilters = () => {
  return {
    type: 'APPLY_FILTERS'
  };
};