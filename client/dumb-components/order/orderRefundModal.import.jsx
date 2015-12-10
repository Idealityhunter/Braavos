import {Modal, Button, Input} from "/lib/react-bootstrap";

const IntlMixin = ReactIntl.IntlMixin;
const FormattedMessage = ReactIntl.FormattedMessage;

const orderRefundModal = React.createClass({
  mixins: [IntlMixin],

  getInitialState() {
    return{
      password: ''
    }
  },

  // 控制密码输入
  _handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    })
  },

  // 提交密码
  _handleSubmit(e) {
    this.props.handleSubmit(this.state.password);
  },

  styles: {
    marginBottom: {
      marginBottom: 15
    }
  },

  render() {
    return (
      <Modal
        aria-labelledby="contained-modal-title"
        show={this.props.showModal}
        onHide={this.props.handleClose}
        bsSize='sm'
        style={{marginTop: 100}}
        >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">退款确认</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={this.styles.marginBottom}>请输入登陆密码, 完成退款</div>
          <Input
            type="password"
            value={this.state.password}
            autoComplete="off"
            groupClassName="group-class"
            labelClassName="label-class"
            onChange={this._handlePasswordChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this._handleSubmit}>确定</Button>
          <Button onClick={this.props.handleClose}>取消</Button>
        </Modal.Footer>
      </Modal>
    )
  }
})

export const OrderRefundModal = orderRefundModal;