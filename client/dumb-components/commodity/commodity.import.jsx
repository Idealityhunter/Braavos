import {BraavosBreadcrumb} from '/client/components/breadcrumb/breadcrumb';
import {ButtonToolbar, Button} from "/lib/react-bootstrap"
import {NumberInput} from '/client/common/numberInput';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var commodity = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
      options: {}
    }
  },

  getMeteorData() {
    let options = _.clone(this.state.options);
    const userId = parseInt(Meteor.userId());

    // 获取用户权限
    if (BraavosCore.SubsManager.account.ready()){
      const userInfo = BraavosCore.Database.Yunkai.UserInfo.findOne({'userId': userId});
      const adminRole = 10;
      const isAdmin = (_.indexOf(userInfo.roles, adminRole) != -1);
      if (isAdmin) options['isAdmin'] = true;
    };

    // 获取商品信息
    const handleCommodity = Meteor.subscribe('commodities', options);
    let commodities = [];
    if (handleCommodity.ready()){
      //commodities = BraavosCore.Database.Braavos.Commodity.find(_.extend({'seller.sellerId': userId}, this.state.options), {sort: {createTime: -1}}).fetch();
      commodities = BraavosCore.Database.Braavos.Commodity.find({}, {sort: {createTime: -1}}).fetch();
      commodities = commodities.map(commodity => _.extend(commodity, {
        key: Meteor.uuid(),
        // 对所有的price进行换算处理
        price: commodity.price / 100,
        marketPrice: commodity.marketPrice / 100,
        plan: commodity.plans.map(plan => _.extend(plan, {
          price: plan.price / 100,
          marketPrice: plan.marketPrice / 100,
          pricing: plan.pricing.map(pricing => _.extend(pricing, {
            price: pricing.price / 100
          }))
        }))
      }));
    }
    return {
      commodities: commodities,
      isAdmin: options.isAdmin
    };
  },

  componentDidMount(){
    $('.footable').footable();
    $('.input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true,
      language: 'zh'
    });
  },

  componentDidUpdate(){
    const footable = $('.footable');
    //footable.footable();
    //footable.trigger('footable_initialize'); //Reinitialize
    footable.trigger('footable_redraw'); //Redraw the table
  },

  // 商品筛选结果的更新
  _handleFilter(){
    const sellerId= $('#seller-id').val()
        ? {'seller.sellerId': parseInt($('#seller-id').val())}
        : {};

    const commodityId = $('#commodity-id').val()
      ? {'commodityId': parseInt($('#commodity-id').val())}
      : {};

    let createTimeRange = {};
    if ($('.input-daterange>input[name=start]').val() || $('.input-daterange>input[name=end]').val()){
      _.extend(createTimeRange, {'createTime': {}})

      if ($('.input-daterange>input[name=start]').val()){
        _.extend(createTimeRange.createTime, {
          '$gte': $('.input-daterange>input[name=start]').val()
        });
      };
      if ($('.input-daterange>input[name=end]').val()){
        _.extend(createTimeRange.createTime, {
          '$lte': moment($('.input-daterange>input[name=end]').val()).add(1, 'day').format('YYYY-MM-DD')
        });
      };
    };

    const commodityStatusIndex = $('#commodity-status').val();
    let commodityStatus;
    switch(parseInt(commodityStatusIndex)){
      case 0:
        commodityStatus = {};
        break;
      case 1:
        commodityStatus = {status: 'disabled'};
        break;
      case 2:
        commodityStatus = {status: 'pub'};
        break;
      case 3:
        commodityStatus = {status: 'review'};
        break;
      default:
        commodityStatus = {};
    };
    this.setState({
      options: _.extend(sellerId, createTimeRange, commodityId, commodityStatus)
    });
  },

  // 重置筛选条件,并且展示所有商品
  _handleReset(){
    // 清空3个选择条件的数据
    // TODO 是否需要展示全部
    $('#commodity-id').val('');
    $('#seller-id').val('');
    $('.input-daterange>input[name=start]').val('');
    $('.input-daterange>input[name=end]').val('');
    $('.input-daterange input').each(function (){
      $(this).datepicker("clearDates");
    });
    $('#commodity-status').val('0');
  },

  // 下架商品
  _handleDropCommodity(e){
    const self = this;
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    swal({
      title: "确认下架?",
      text: "",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "下架",
      closeOnConfirm: false
    }, function(){
      Meteor.call('commodity.status.update', self.data.commodities[curIndex].commodityId, 'disabled', function(err, res){
        if (err){
          // 下架失敗
          swal("下架失败!", "", "error");
        };
        if (res){
          // 下架成功
          swal("下架成功", "", "success");
        }
      });
    });
  },

  // 上架商品
  _handlePubCommodity(e){
    const self = this;
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    Meteor.call('commodity.status.update', self.data.commodities[curIndex].commodityId, 'pub', function(err, res){
      if (err){
        // 上架失败
        swal("上架失败!", "", "error");
      };
      if (res){
        // 上架成功
        swal("上架成功!", "", "success");
      }
    });
  },

  // 编辑商品
  _handleEditCommodity(e){
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const curCommodityId = this.data.commodities[curIndex].commodityId;
    FlowRouter.go(`/commodities/editor/${curCommodityId}?isAdmin=${!!this.data.isAdmin}`);
  },

  styles: {
    addBtn: {
      marginTop: 25,
      width: 100,
      float: 'left',
      marginLeft: 20
    },
    calendar: {
      marginLeft: -20,
      marginTop: 11,
      verticalAlign: 'top'
    },
    datepickerInput: {
      height: 35,
      backgroundColor: 'rgba(0,0,0,0)'
    }
  },

  render() {
    let prefix = 'commodities.';

    // 筛选控制
    const filter =
      <div className="ibox-content m-b-sm border-bottom">
        <div className="row">
          <a href="/commodities/add" style={this.styles.addBtn}>
            <Button bsStyle="info" bsSize="small"><FormattedMessage message={this.getIntlMessage(prefix + 'btn.addCommodity')}/></Button>
          </a>
          <div className="col-sm-2">
            <div className="form-group">
              <label className="control-label" htmlFor="commodity-id"><FormattedMessage message={this.getIntlMessage(prefix + 'label.commodityId')}/></label>
              <NumberInput id="commodity-id" name="commodity-id" value="" placeholder="商品编号" className="form-control"/>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label className="control-label" htmlFor="commodity-createdDate"><FormattedMessage message={this.getIntlMessage(prefix + 'label.createdDate')}/></label>
              <div className="input-daterange input-group">
                <input type="text" className="input-sm form-control" name="start" placeholder="" defaultValue=""
                       readOnly
                       style={this.styles.datepickerInput}/>
                <i className="fa fa-calendar cursor-pointer calender-price" style={this.styles.calendar}/>
                <span className="input-group-addon">-</span>
                <input type="text" className="input-sm form-control" name="end" placeholder="" defaultValue=""
                       readOnly
                       style={this.styles.datepickerInput}/>
                <i className="fa fa-calendar cursor-pointer calender-price" style={this.styles.calendar}/>
              </div>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label className="control-label" htmlFor="commodity-status"><FormattedMessage message={this.getIntlMessage(prefix + 'label.status')}/></label>
              <select name="product-status" id="commodity-status" className="form-control" defaultValue="0">
                <option value="0">全部</option>
                <option value="1">已下架</option>
                <option value="2">已发布</option>
                <option value="3">审核中</option>
              </select>
            </div>
          </div>
          {(this.data.isAdmin)
              ?
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="control-label" htmlFor="seller-id"><FormattedMessage message={this.getIntlMessage(prefix + 'label.sellerId')}/></label>
                    <NumberInput id="seller-id" name="seller-id" value="" placeholder="商家编号" className="form-control"/>
                  </div>
                </div>
              : ''
          }

          <ButtonToolbar style={{marginTop:25}}>
            <Button bsStyle="primary" bsSize="small" onClick={this._handleFilter} active><FormattedMessage message={this.getIntlMessage(prefix + 'btn.query')}/></Button>
            <Button bsStyle="warning" bsSize="small" onClick={this._handleReset} active><FormattedMessage message={this.getIntlMessage(prefix + 'btn.reset')}/></Button>
          </ButtonToolbar>
        </div>
      </div>;

    const commodityTableHead =
      <thead>
        <tr>
          {/*TODO 并没有起到作用!!! => 貌似是react将数字转成了id*/}
          <th data-breakpoints="xs sm" data-type="numeric" data-toggle="true"><FormattedMessage message={this.getIntlMessage(prefix + 'label.number')}/></th>
          {(this.data.isAdmin) ? <th data-hide="phone"><FormattedMessage message={this.getIntlMessage(prefix + 'label.sellerId')}/></th> : <th className='hidden'></th>}
          {(this.data.isAdmin) ? <th data-hide="phone"><FormattedMessage message={this.getIntlMessage(prefix + 'label.sellerName')}/></th> : <th className='hidden'></th>}
          <th data-hide="phone"><FormattedMessage message={this.getIntlMessage(prefix + 'label.commodityId')}/></th>
          <th data-hide="phone" data-sort-ignore="true"><FormattedMessage message={this.getIntlMessage(prefix + 'label.commodityCover')}/></th>
          <th data-hide="phone" data-sort-ignore="true"><FormattedMessage message={this.getIntlMessage(prefix + 'label.commodityTitle')}/></th>
          <th data-hide="phone" ><FormattedMessage message={this.getIntlMessage(prefix + 'label.price')}/></th>
          <th data-hide="phone" ><FormattedMessage message={this.getIntlMessage(prefix + 'label.createdDate')}/></th>
          {/*
           <th data-hide="all"><FormattedMessage message={this.getIntlMessage(prefix + 'label.desc')}/></th>
           <th data-hide="phone,tablet" ><FormattedMessage message={this.getIntlMessage(prefix + 'label.stock')}/></th>
           <th data-hide="phone,tablet" ><FormattedMessage message={this.getIntlMessage(prefix + 'label.salesVolume')}/></th>
           */}
          <th data-hide="phone"><FormattedMessage message={this.getIntlMessage(prefix + 'label.status')}/></th>
          <th className="text-right" data-sort-ignore="true"><FormattedMessage message={this.getIntlMessage(prefix + 'label.action')}/></th>
        </tr>
      </thead>;

    // 商品列表行
    let i = 0;
    const commodityList = this.data.commodities.map(commodity =>
      <tr key={commodity.key} data-id={i} style={(commodity.status == 'disabled') ? {color: '#aaa'} : {color: '#333'}}>
        <td data-value={++i}>{i}</td>
        {(this.data.isAdmin) ? <td>{commodity.seller.sellerId}</td> : <td className='hidden'></td>}
        {(this.data.isAdmin) ? <td>{commodity.seller.name}</td> : <td className='hidden'></td>}
        <td>{commodity.commodityId}</td>
        <td><img src={commodity.cover.url} alt="" style={{width: 100, height: 100}}/></td>
        <td>{commodity.title}</td>
        {/*<td>￥{commodity.price}{commodity.plans.length > 1 ? '起' : ''}</td>*/}
        <td>
          ￥{commodity.price}
          {(commodity.plans.length > 1
            && _.reduce(commodity.plans, (memo, f) => {
              return {
                diff: memo.diff || memo.price != f.price,
                price: f.price
              }
            }, {
              diff: false,
              price: commodity.plans[0].price
            }).diff
            || _.reduce(commodity.plans[0].pricing, (memo, f) => {
              return {
                diff: memo.diff || memo.price != f.price,
                price: f.price
              }
            }, {
              diff: false,
              price: commodity.plans[0].pricing[0].price
            }).diff)
            ? '起' : ''}
        </td>
        <td>{moment(commodity.createTime).format('YYYY-MM-DD')}</td>
        <td>
          {
            ((status) => {
                switch (status){
                  case 'review': return '审核中';
                  case 'pub': return '已发布';
                  case 'disabled': return '已下架';
                  default: return '已下架';
                }
            })(commodity.status)
          }
        </td>
        <td className="text-right" style={{color: '#333'}}>
          {(this.data.isAdmin)
              ? (
                <div className="btn-group">
                  <button className="btn-white btn btn-xs" onClick={this._handleEditCommodity}>编辑</button>
                  {
                    (commodity.status == 'pub')
                        ? <button className="btn-white btn btn-xs" onClick={this._handleDropCommodity}>下架</button>
                        : <button className="btn-white btn btn-xs" onClick={this._handlePubCommodity}>上架</button>
                  }
                </div>
              )
              : (
                <div className="btn-group">
                  <button className="btn-white btn btn-xs" onClick={this._handleEditCommodity}>编辑</button>
                  {
                    (commodity.status == 'pub')
                        ? <button className="btn-white btn btn-xs" onClick={this._handleDropCommodity}>下架</button>
                        : (commodity.status == 'disabled')
                        ? <button className="btn-white btn btn-xs" onClick={this._handlePubCommodity}>上架</button>
                        : ''
                  }
                </div>
              )
          }

        </td>
      </tr>
    );

    const commodityTableBody =
      <tbody>
        {commodityList}
      </tbody>;

    const commodityTableFoot =
      <tfoot>
        <tr>
          <td colSpan={this.data.isAdmin ? "10" : "8"}>
            <ul className="pagination pull-right"></ul>
          </td>
        </tr>
      </tfoot>;

    // 商品表格
    const commodityTable =
      <div className="row">
        <div className="col-lg-12">
          <div className="ibox">
            <div className="ibox-content">
              <table className="footable table table-stripped toggle-arrow-tiny" data-page-size="10">
                {commodityTableHead}
                {commodityTableBody}
                {commodityTableFoot}
              </table>
            </div>
          </div>
        </div>
      </div>;

    return (
      <div className="commodity-mngm-wrap">
        <BraavosBreadcrumb />

        <div className="wrapper wrapper-content animated fadeInRight ecommerce">
          {filter}
          {commodityTable}
        </div>
      </div>
    );
  }
});

export const Commodity = commodity;
