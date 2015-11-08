
const commodityPlansModal = React.createClass({
  getInitialState() {
    let transferredPricing = [];
    let i = 0;
    if (this.props.plan.pricing){
      transferredPricing = this.props.plan.pricing.map((pricing) => ({
        'price': pricing.price,
        'key': Meteor.uuid(),
        'timeRange': [moment(pricing.timeRange[0]).format('YYYY-MM-DD'), moment(pricing.timeRange[1]).format('YYYY-MM-DD')]
      }))
    }
    return {
      pricing: transferredPricing
    }
  },

  // 每次新增一条pricing的时候,都需要重新绑定一次datepicker plugin
  componentDidUpdate(){
    $('.commodity-basic-datepicker .input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true
    });
  },

  // 删除一条pricing
  _handleDelete(e){
    const curIndex = $(e.target).parents('.pricing-wrap').attr('data-id');
    let copyPricing = this.state.pricing && this.state.pricing.slice();
    copyPricing.splice(curIndex, 1);
    this.setState({
      pricing: copyPricing
    });
  },

  // 增加一条pricing
  _handleAddPricing(e){
    this.setState({
      pricing: this.state.pricing.concat({
        price: "",
        key: Meteor.uuid(),
        timeRange: [null, null]
      })
    })
  },

  render() {
    let i = 0;
    const pricingList = this.state.pricing && this.state.pricing.map(pricing =>
      <div className="pricing-wrap" data-id={i++} key={pricing.key}>
        <input className="inline commodity-basic-price" type='text' placeholder="售价￥" defaultValue={pricing.price}/>
        <div className="inline">
          <div className="form-group commodity-basic-datepicker inline">
            <div className="input-daterange input-group">
              <input type="text" className="input-sm form-control" name="start" placeholder="from" defaultValue={pricing.timeRange[0]}/>
              <span className="input-group-addon">-</span>
              <input type="text" className="input-sm form-control" name="end" placeholder="to" defaultValue={pricing.timeRange[1]}/>
            </div>
          </div>
        </div>
        <i className='fa fa-minus-circle' onClick={this._handleDelete}/>
      </div>
    );
    return (
      <div className="modal inmodal" id={"calendar-modal-" + this.props.index} tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content animated bounceInRight">
            <div className="modal-header">
              set price for {this.props.plan.title}
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
            </div>
            <div className="modal-body">
              <div className="commodity-basic-price-list">
                {pricingList}
              </div>
              <div className="plus" onClick={this._handleAddPricing}>+</div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-white" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

export const CommodityPlansModal = commodityPlansModal;