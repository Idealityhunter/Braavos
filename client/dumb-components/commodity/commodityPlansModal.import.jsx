import {Modal, Button} from "/lib/react-bootstrap";
import {NumberInput} from '/client/common/numberInput';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityPlansModal = React.createClass({
  mixins: [IntlMixin],
  getInitialState() {
    let transferredPricing = [];
    let i = 0;
    if (this.props.plan.pricing) {
      transferredPricing = this.props.plan.pricing.map((pricing) => ({
        'price': pricing.price,
        'key': Meteor.uuid(),
        'timeRange': [moment(pricing.timeRange[0]).format('YYYY-MM-DD'), moment(pricing.timeRange[1]).format('YYYY-MM-DD')]
      }))
    }
    return {
      pricing: transferredPricing.slice(),//控制ui
      originalPricing: transferredPricing.slice()//cache,存储进来编辑的状态
    }
  },

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.refs["haha"]);
    $(".input-daterange").children('input[name=start]').on('change', function(evt){
      console.log(`jQuery: ${evt}`);
    });
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
    for (let i = 0; i < $pricingList.length; i++) {
      newPricing[i] = {
        price: $($pricingList[i]).find('input.commodity-basic-price').val(),
        timeRange: [
          $($pricingList[i]).find('input[name=start]').val(),
          $($pricingList[i]).find('input[name=end]').val()
        ]
      };
    }
    this.setState({
      originalPricing: newPricing.slice(),
      pricing: newPricing.slice()
    });
    this.props.onSubmit(newPricing, this.props.index);
  },

  // 不提交的关闭逻辑
  _handleClose(e){
    this.props.onClose(this.props.index);
    let transferredPricing = [];
    let i = 0;
    if (this.state.originalPricing) {
      transferredPricing = this.state.originalPricing.map((pricing) => ({
        'price': pricing.price,
        'key': Meteor.uuid(),
        'timeRange': [moment(pricing.timeRange[0]).format('YYYY-MM-DD'), moment(pricing.timeRange[1]).format('YYYY-MM-DD')]
      }))
    }
    this.setState({
      originalPricing: transferredPricing.slice(),
      pricing: transferredPricing.slice()
    });
  },

  render() {
    prefix = 'commodities.modify.';
    let i = 0;
    const pricingList = this.state.pricing && this.state.pricing.map(pricing =>
        <div className="pricing-wrap" data-id={i++} key={pricing.key}>
          <NumberInput className="inline commodity-basic-price" placeholder="售价￥" value={pricing.price}/>
          <div className="inline">
            <div className="form-group commodity-basic-datepicker inline">
              <div className="input-daterange input-group">
                <input type="text" className="input-sm form-control" name="start" placeholder="from" readOnly
                       defaultValue={pricing.timeRange[0]}
                       style={{backgroundColor: '#fff'}}
                />
                <span className="input-group-addon">-</span>
                <input type="text" className="input-sm form-control" name="end" placeholder="to" readOnly
                       defaultValue={pricing.timeRange[1]}
                       style={{backgroundColor: '#fff'}}
                />
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
    );
  }
});

export const CommodityPlansModal = commodityPlansModal;