import {Modal, Button} from "/lib/react-bootstrap";
import {NumberInput} from '/client/common/numberInput';

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const commodityPlansModal = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    index: React.PropTypes.number,
    plan: React.PropTypes.object,
    onClose: React.PropTypes.func,
    onSubmit: React.PropTypes.func
  },

  getInitialState() {
    let transferredPricing = [];
    let i = 0;
    if (this.props.plan.pricing) {
      transferredPricing = this.props.plan.pricing.map((pricing) => ({
        'price': pricing.price,
        'key': Meteor.uuid(),
        'timeRange': [moment(pricing.timeRange[0]).format('YYYY-MM-DD'), moment(pricing.timeRange[1]).format('YYYY-MM-DD')]
      }));
    };

    // 当没有填写信息的时候,默认提供一条价格信息(只有日期)
    if (this.props.plan.pricing.length == 0){
      transferredPricing = [{
        'price': '',
        'key': Meteor.uuid(),
        'timeRange': [moment().format('YYYY-MM-DD'), moment(new Date().valueOf() + 1000 * 60 * 60 * 24 * 90).format('YYYY-MM-DD')]
      }]
    }

    return {
      pricing: transferredPricing.slice(),//控制ui
      originalPricing: transferredPricing.slice()//cache,存储进来编辑的状态
    }
  },

  componentDidMount() {
    $('.commodity-basic-datepicker .input-daterange').datepicker({
      format: 'yyyy-mm-dd',
      keyboardNavigation: false,
      // TODO 当plan状态为view时不应该可以操作daterange...
      //enableOnReadonly: self.props.plan.status != 'edit',
      forceParse: false,
      autoclose: true,
      language: 'zh'
    });
  },

  // 每次新增一条pricing的时候,都需要重新绑定一次datepicker plugin
  componentDidUpdate(){
    // TODO (奇怪...)假如不用requestAnimationFrame的话,新增加的pricing文本框就会绑定不上datepicker
    window.requestAnimationFrame(function() {
      $('.commodity-basic-datepicker .input-daterange').datepicker({
        format: 'yyyy-mm-dd',
        keyboardNavigation: false,
        // TODO 当plan状态为view时不应该可以操作daterange...
        //enableOnReadonly: self.props.plan.status != 'edit',
        forceParse: false,
        autoclose: true,
        language: 'zh'
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

    // 获取价格信息的当前修改结果
    let newPricing = [];
    for (let i = 0; i < $pricingList.length; i++) {
      newPricing[i] = {
        price: $($pricingList[i]).find('input.commodity-basic-price').val(),
        timeRange: [
          $($pricingList[i]).find('input[name=start]').val(),
          $($pricingList[i]).find('input[name=end]').val()
        ]
      };
    };

    // 检验价格信息
    if (! _.reduce(newPricing, function(validate, pricingItem){ return validate && pricingItem.price != ''}, true)){
      swal('请输入售价', '', 'error');
      return ;
    }

    // 检查时间的起始和结束
    // 时间始末都可为null
    //if (! _.reduce(newPricing, function(validate, pricingItem){ return validate && (!pricingItem.timeRange[0] || !pricingItem.timeRange[1] || pricingItem.timeRange[0] <= pricingItem.timeRange[1])}, true)){
    //  swal('截止时间必须大于起始时间!', '', 'error');
    //  return ;
    //}
    for (let i = 0; i < newPricing.length; i++ ){
      if (!newPricing[i].timeRange[0]){
        $($pricingList[i]).find('input[name=start]').addClass('error');
        swal('起始时间不能为空!', '', 'error');
        return ;
      };
      if (!newPricing[i].timeRange[1]){
        $($pricingList[i]).find('input[name=end]').addClass('error');
        swal('截止时间不能为空!', '', 'error');
        return ;
      };
      if (newPricing[i].timeRange[0] > newPricing[i].timeRange[1]){
        swal('截止时间必须不早于起始时间!', '', 'error');
        return ;
      };
    };


    // 检验时间重叠情况
    if (newPricing.length > 1) {
      // 排序
      newPricing.sort((pricingA, pricingB) => {
        if (pricingA.timeRange[0] == null) return false;
        if (pricingB.timeRange[0] == null) return true;
        if (pricingA.timeRange[0] > pricingB.timeRange[0]) return true;
        return false;
      });

      const dateInterval = newPricing[0].timeRange.slice();
      let isValid = true;
      for (let i = 1; i < newPricing.length; i++){
        if (dateInterval[1] == null || dateInterval[0] == newPricing[i].timeRange[0] || dateInterval[1] >= newPricing[i].timeRange[0]){
          isValid = false;
          break;
        }
      };

      if (!isValid){
        swal('请输入正确的时间范围(时间范围不可以重叠)', '', 'error');
        return ;
      };
    };

    // 修改寄存器存储的原始价格信息
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

  // 清除因为提交造成的error效果
  _handleClearErrorClass(e){
    $(e.taraget).removeClass('error');
  },

  render() {
    const prefix = 'commodities.modify.';
    let i = 0;
    const pricingList = this.state.pricing && this.state.pricing.map(pricing =>
      <div className="pricing-wrap" data-id={i++} key={pricing.key}>
        <NumberInput numberType='float' decimalDigits={2} className="inline commodity-basic-price" placeholder="售价￥" value={pricing.price}/>
        <div className="inline">
          <div className="form-group commodity-basic-datepicker inline" style={{width:350}}>
            <div className="input-daterange input-group">
              <input type="text" className="input-sm form-control" name="start" placeholder="from" readOnly
                     defaultValue={pricing.timeRange[0]}
                     style={{backgroundColor: '#fff'}}
                     onChange={this._handleClearErrorClass}
              />
              <span className="input-group-addon">-</span>
              <input type="text" className="input-sm form-control" name="end" placeholder="to" readOnly
                     defaultValue={pricing.timeRange[1]}
                     style={{backgroundColor: '#fff'}}
                     onChange={this._handleClearErrorClass}
              />
            </div>
          </div>
        </div>
        {(this.props.plan.status == 'edit' && this.state.pricing.length > 1) ? <i className='fa fa-minus-circle' onClick={this._handleDelete}/> : ''}
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
          <Modal.Title id="contained-modal-title">{this.props.plan.title} 设置价格</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="commodity-basic-price-list">
            {pricingList}
          </div>
          {(this.props.plan.status == 'edit') ? <div className="plus" onClick={this._handleAddPricing}>+</div> : ''}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this._handleClose}>取消</Button>
          {(this.props.plan.status == 'edit') ? <Button bsStyle="primary" onClick={this._handleSubmit}>确认</Button> : ''}
        </Modal.Footer>
      </Modal>
    );
  }
});

export const CommodityPlansModal = commodityPlansModal;