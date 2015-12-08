import {Modal, Button} from "/lib/react-bootstrap";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderCloseModal = React.createClass({
  mixins: [IntlMixin],
  styles: {
    notice: {
      border: '1px solid orange',
      backgroundColor: 'aliceblue',
      padding: 5,
      marginBottom: 20
    },
    reason:{
      label: {
        fontSize: 15
      },
      select: {
        width: 200,
        marginLeft: 20,
        marginBottom: 20
      }
    },
    tips: {
      head: {
        fontSize: 14,
        color: 'darkgoldenrod',
        marginBottom: 2
      },
      body: {
        marginLeft: 28
      }
    }
  },

  render() {
    return (
      <Modal
        aria-labelledby="contained-modal-title"
        show={this.props.showModal}
        onHide={this.props.handleClose}
        id="order-close-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">关闭交易</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={this.styles.notice}>建议您在与买家达成一致的前提下, 使用关闭交易这个功能哟!</div>
          <div className="form-group reason">
            <label className="label-text" style={this.styles.reason.label}>请选择关闭交易的理由: </label>
            <select className="inline form-control" style={this.styles.reason.select}>
              <option value="0">未及时付款</option>
              <option value="1">买家不想买</option>
              <option value="2">买家信息填写有误,请重拍</option>
              <option value="3">恶意买家/同行捣乱</option>
              <option value="4">缺货</option>
              <option value="5">买家拍错了</option>
              <option value="6">同城见面交易</option>
              <option value="7">其它</option>
            </select>
          </div>
          <div>
            <h3 style={this.styles.tips.head}>温馨提示: </h3>
            <p style={this.styles.tips.body}>关闭交易后, 订单不可恢复, 如果需要购买需要重新下单</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.props.handleSubmit}>确定</Button>
          <Button onClick={this.props.handleClose}>取消</Button>
        </Modal.Footer>
      </Modal>
    )
  }
})

export const OrderCloseModal = orderCloseModal;