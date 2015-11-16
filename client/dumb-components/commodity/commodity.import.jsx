import {Breadcrumb} from '/client/dumb-components/common/breadcrumb';
import {ButtonToolbar, Button} from "/lib/react-bootstrap"

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var commodity = React.createClass({
  mixins: [IntlMixin, ReactMeteorData],

  getInitialState(){
    return {
    }
  },

  getMeteorData() {
    // TODO 数据新增的时候需要重新生成一下table => 还是没起效果?
    //window.requestAnimationFrame(function() {
    //  console.log('request');
    //  $('.footable').footable();
    //});

    Meteor.subscribe('commodities');
    const userId = parseInt(Meteor.userId());
    let commodities = BraavosCore.Database.Braavos.Commodity.find({'seller.sellerId': userId}).fetch() || [];
    commodities = commodities.map(commodity => _.extend(commodity, {
      key: Meteor.uuid()
    }));
    return {
      commodities: commodities
    };
  },

  componentDidMount(){
    $('.input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true
    });
  },

  // 商品筛选结果的更新
  _handleFilter(){

  },

  // 重置筛选条件,并且展示所有商品
  _handleReset(){

  },

  // 下架商品
  _handleDropCommodity(e){
    const self = this;
    e.preventDefault();
    const curIndex = $(e.target).parents('tr').attr('data-id');
    swal({
      title: "Are you sure?",
      text: "客戶將無法看到您下架的商品!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    }, function(){
      Meteor.call('commodity.status.update', self.data.commodities[curIndex].commodityId, 'disabled', function(err, res){
        if (err){
          // 下架失敗
          swal("Failed!", "Your commodity cannot be dropped.", "error");
        };
        if (res){
          // 下架成功
          swal("Dropped!", "Your commodity has been dropped.", "success");
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
        // 下架失敗
        swal("Failed!", "Your commodity cannot be published.", "error");
      };
      if (res){
        // 下架成功
        swal("Published!", "Your commodity has been published.", "success");
      }
    });
  },

  // 编辑商品
  _handleEditCommodity(e){
    const curIndex = $(e.target).parents('tr').attr('data-id');
    const curCommodityId = this.data.commodities[curIndex].commodityId;
    FlowRouter.go(`/commodities/editor?commodityId=${curCommodityId}`);
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
    let i = 0;
    const commodityList = this.data.commodities.map(commodity =>
      <tr key={commodity.key} data-id={i}>
        <td>{++i}</td>
        <td>{commodity.commodityId}</td>
        <td>{commodity.title}</td>
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
        <td className="text-right">
          <div className="btn-group">
            <button className="btn-white btn btn-xs" onClick={this._handleEditCommodity}>编辑</button>
            {
              (commodity.status == 'pub')
                ? <button className="btn-white btn btn-xs" onClick={this._handleDropCommodity}>下架</button>
                : <button className="btn-white btn btn-xs" onClick={this._handlePubCommodity}>上架</button>
            }
          </div>
        </td>
      </tr>
    );
    return (
      <div className="commodity-mngm-wrap">
        <Breadcrumb />

        {/*测试footble的绑定事件
          <Button bsStyle="primary" bsSize="large" onClick={() => $('.footable').footable()} active>Bind Event</Button>
          <Button bsStyle="primary" bsSize="large">Test Attribute</Button>
         */}

        <div className="wrapper wrapper-content animated fadeInRight ecommerce">
          <div className="ibox-content m-b-sm border-bottom">
            <div className="row">
              <a href="/commodities/add" style={this.styles.addBtn}>
                <Button bsStyle="info" bsSize="small"><FormattedMessage message={this.getIntlMessage(prefix + 'btn.addCommodity')}/></Button>
              </a>
              <div className="col-sm-2">
                <div className="form-group">
                  <label className="control-label" htmlFor="commodity-id"><FormattedMessage message={this.getIntlMessage(prefix + 'label.commodityId')}/></label>
                  <input type="text" id="commodity-id" name="commodity-id" defaultValue="" placeholder="商品编号" className="form-control"/>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <label className="control-label" htmlFor="commodity-createdDate"><FormattedMessage message={this.getIntlMessage(prefix + 'label.createdDate')}/></label>
                  <div className="input-daterange input-group">
                    <input type="text" className="input-sm form-control" name="start" placeholder="" defaultValue="" style={this.styles.datepickerInput}/>
                    <i className="fa fa-calendar cursor-pointer calender-price" style={this.styles.calendar}/>
                    <span className="input-group-addon">-</span>
                    <input type="text" className="input-sm form-control" name="end" placeholder="" defaultValue="" style={this.styles.datepickerInput}/>
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
              <ButtonToolbar style={{marginTop:25}}>
                <Button bsStyle="primary" bsSize="small" onClick={this._handleFilter} active><FormattedMessage message={this.getIntlMessage(prefix + 'btn.query')}/></Button>
                <Button bsStyle="warning" bsSize="small" onClick={this._handleReset} active><FormattedMessage message={this.getIntlMessage(prefix + 'btn.reset')}/></Button>
              </ButtonToolbar>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-content">
                  <table className="footable table table-stripped toggle-arrow-tiny" data-page-size="15">
                    <thead>
                      <tr>
                        <th data-toggle="true"><FormattedMessage message={this.getIntlMessage(prefix + 'label.number')}/></th>
                        <th data-hide="phone"><FormattedMessage message={this.getIntlMessage(prefix + 'label.commodityId')}/></th>
                        {/*<th data-hide="all"><FormattedMessage message={this.getIntlMessage(prefix + 'label.commodityCover')}/></th>*/}
                        <th data-hide="phone"><FormattedMessage message={this.getIntlMessage(prefix + 'label.commodityTitle')}/></th>
                        {/*
                          <th data-hide="all"><FormattedMessage message={this.getIntlMessage(prefix + 'label.desc')}/></th>
                          <th data-hide="phone,tablet" ><FormattedMessage message={this.getIntlMessage(prefix + 'label.price')}/></th>
                          <th data-hide="phone,tablet" ><FormattedMessage message={this.getIntlMessage(prefix + 'label.stock')}/></th>
                          <th data-hide="phone,tablet" ><FormattedMessage message={this.getIntlMessage(prefix + 'label.salesVolume')}/></th>
                          <th data-hide="phone,tablet" ><FormattedMessage message={this.getIntlMessage(prefix + 'label.createdDate')}/></th>
                          */}
                        <th data-hide="phone"><FormattedMessage message={this.getIntlMessage(prefix + 'label.status')}/></th>
                        <th className="text-right" data-sort-ignore="true"><FormattedMessage message={this.getIntlMessage(prefix + 'label.action')}/></th>
                      </tr>
                    </thead>
                    <tbody>
                      {commodityList}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4">
                          <ul className="pagination pull-right"></ul>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export const Commodity = commodity;
