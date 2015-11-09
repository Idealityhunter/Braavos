import {Modal, Button} from "/lib/react-bootstrap"

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
    // repaint之后再绑定事件
    window.requestAnimationFrame(function() {
      $('.commodity-basic-datepicker .input-daterange').datepicker({
        format: 'yyyy-mm-dd',
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
      });
    });
  },

  // 删除一条pricing
  _handleDelete(e){
    const curIndex = $(e.target).parents('.pricing-wrap').attr('data-id');
    let copyPricing = this.state.pricing.slice();
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

  // 提交修改
  _handleSubmit(e){
    const $modal = $(e.target).parents('.modal-dialog');
    const $pricingList = $modal.find('.pricing-wrap');

    let newPricing = [];
    for(let i = 0;i < $pricingList.length;i++){
      newPricing[i] = {
        price: $($pricingList[i]).find('input.commodity-basic-price').val(),
        timeRange: [
          $($pricingList[i]).find('input[name=start]').val(),
          $($pricingList[i]).find('input[name=end]').val()
        ]
      };
    }

    // 为什么这种就不行
    //let newPricing = $pricingList.map(pricingDom => {
    //  return {
    //    price: $(pricingDom).find('input.commodity-basic-price').val(),
    //    timeRange: [
    //      $(pricingDom).find('input[name=start]').val(),
    //      $(pricingDom).find('input[name=end]').val()
    //    ]
    //  }
    //});
    this.props.onSubmit(newPricing, this.props.index);
  },

  // 不提交的关闭逻辑
  _handleClose(e){
    this.props.onClose(this.props.index);
    let transferredPricing = [];
    let i = 0;
    if (this.props.plan.pricing){
      transferredPricing = this.props.plan.pricing.map((pricing) => ({
        'price': pricing.price,
        'key': Meteor.uuid(),
        'timeRange': [moment(pricing.timeRange[0]).format('YYYY-MM-DD'), moment(pricing.timeRange[1]).format('YYYY-MM-DD')]
      }))
    }
    this.setState({
      pricing: transferredPricing
    });
  },

  // 监控价格变化
  _handlePrice(e){
    console.log($(e.target).val());
    const curIndex = $(e.target).parents('.pricing-wrap').attr('data-id');
    let copyPricing = this.state.pricing.slice();
    _.extend(copyPricing[curIndex], {
      price: $(e.target).val()
    });
    this.setState({
      pricing: copyPricing
    });
  },

  // 监控时间变化
  _handleStartTime(e){
    console.log($(e.target).val());
    const curIndex = $(e.target).parents('.pricing-wrap').attr('data-id');
    let copyPricing = this.state.pricing.slice();
    copyPricing[curIndex].timeRange[0] = $(e.target).val();
    this.setState({
      pricing: copyPricing
    });
  },

  // 监控时间变化
  _handleEndTime(e){
    console.log($(e.target).val());
    const curIndex = $(e.target).parents('.pricing-wrap').attr('data-id');
    let copyPricing = this.state.pricing.slice();
    copyPricing[curIndex].timeRange[1] = $(e.target).val();
    this.setState({
      pricing: copyPricing
    });
  },

  render() {
    let i = 0;
    const pricingList = this.state.pricing && this.state.pricing.map(pricing =>
      <div className="pricing-wrap" data-id={i++} key={pricing.key}>
        <input className="inline commodity-basic-price" type='text' placeholder="售价￥" defaultValue={pricing.price} onBlur={this._handlePrice}/>
        <div className="inline">
          <div className="form-group commodity-basic-datepicker inline">
            <div className="input-daterange input-group">
              <input type="text" className="input-sm form-control" name="start" placeholder="from" defaultValue={pricing.timeRange[0]} onBlur={this._handleStartTime}/>
              <span className="input-group-addon">-</span>
              <input type="text" className="input-sm form-control" name="end" placeholder="to" defaultValue={pricing.timeRange[1]} onBlur={this._handleEndTime}/>
            </div>
          </div>
        </div>
        {(this.props.plan.status == 'edit') ? <i className='fa fa-minus-circle' onClick={this._handleDelete}/> : ''}
      </div>
    );
    return (
      <Modal
        data-id={this.props.index}
        show={this.props.plan.showModal}
        onHide={this._handleClose}
        aria-labelledby="contained-modal-title"
        id={"calendar-modal-" + this.props.index}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">set price for {this.props.plan.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="commodity-basic-price-list">
            {pricingList}
          </div>
          {(this.props.plan.status == 'edit') ? <div className="plus" onClick={this._handleAddPricing}>+</div> : ''}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this._handleClose}>Cancel</Button>
          {(this.props.plan.status == 'edit') ? <Button bsStyle="primary" onClick={this._handleSubmit}>Submit</Button> : ''}
        </Modal.Footer>
      </Modal>
    )
  }
});

export const CommodityPlansModal = commodityPlansModal;