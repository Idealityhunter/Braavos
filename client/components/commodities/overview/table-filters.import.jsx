/**
 * 表格的过滤控件
 * Created by zephyre on 2/1/16.
 */

import { Immutable } from '/lib/immutable'
const { fromJS } = Immutable;

import { Input, ButtonToolbar, Button } from '/lib/react-bootstrap'
import { DatePicker, moment } from '/lib/react-datepicker'

export const TableFilters = React.createClass({
  propTypes: {
    // 搜索项目
    query: React.PropTypes.string,
    // 商品状态
    statusFilter: React.PropTypes.number,
    // 添加商品
    onAddCommodity: React.PropTypes.func,
    // 修改查询关键词
    onChangeQuery: React.PropTypes.func,
    // 修改商品状态
    onChangeStatusFilter: React.PropTypes.func,
    // 选择筛选时间
    onSelectDate: React.PropTypes.func
  },

  // 改变关键词搜索
  handleChangeQuery(evt) {
    if (this.props.onChangeQuery) {
      this.props.onChangeQuery(evt.target.value);
    }
  },

  // 改变商品状态筛选
  handleChangeStatusFilter(evt) {
    if (this.props.onChangeStatusFilter) {
      this.props.onChangeStatusFilter(evt.target.value);
    }
  },

  // 选择日期
  handleSelectDate(dateType) {
    return (date) => {
      if (this.props.onSelectDate) {
        this.props.onSelectDate(dateType)(date ? date.toString() : undefined);
      }
    }
  },

  // 重置筛选器
  handleResetFilters() {
    if (this.props.onResetFilters) {
      this.props.onResetFilters();
    }
  },

  // 开始搜索
  applyFilters() {
    if (this.props.onApplyFilters) {
      this.props.onApplyFilters(this.props.filters.toObject());
    }
  },

  render() {
    const filters = this.props.filters.toObject();
    let tmp = filters['date.start'];
    const selectedDateStart = tmp ? moment(tmp) : null;
    tmp = filters['date.end'];
    const selectedDateEnd = tmp ? moment(tmp) : null;
    return (
      <div className="ibox-content m-b-sm border-bottom">
        <div className="row">
          <a href="/commodities/add" style={{
          marginTop: 25,
          float: 'left',
          marginLeft: 20,
          marginRight: 0
          }}>
            <Button bsStyle="info" bsSize="small" onClick={this.props.onAddCommodity}>添加商品</Button>
          </a>
          <form>
            {/* 关键词搜索 */}
            <div className="col-sm-2">
              <Input type="text" label="　" value={filters['query']} placeholder="搜索..."
                     onChange={this.handleChangeQuery}/>
            </div>
            {/* 商品状态 */}
            <div className="col-sm-2">
              <Input type="select" label="商品状态"
                     value={filters['commodityStatus'] || 'all'}
                     onChange={this.handleChangeStatusFilter}>
                <option value="all">全部</option>
                <option value="disabled">已下架</option>
                <option value="pub">已发布</option>
                <option value="review">审核中</option>
              </Input>
            </div>
            {/* 日期控件 */}
            <div className="col-sm-2">
              <label className="control-label" style={{marginBottom: 8}}>起始日期</label>
              <DatePicker selected={selectedDateStart} onChange={this.handleSelectDate('start')}/>
            </div>
            <div className="col-sm-2">
              <label className="control-label" style={{marginBottom: 8}}>终止日期</label>
              <DatePicker selected={selectedDateEnd} onChange={this.handleSelectDate('end')}/>
            </div>
            {/* 按钮 */}
            <div className="col-sm-3" style={{marginTop: 25}}>
              <ButtonToolbar>
                <Button bsStyle="primary" bsSize="small" onClick={this.applyFilters} active>查询</Button>
                <Button bsStyle="warning" bsSize="small" onClick={this.handleResetFilters} active>重置</Button>
              </ButtonToolbar>
            </div>
          </form>
        </div>
      </div>
    );
  }
});
