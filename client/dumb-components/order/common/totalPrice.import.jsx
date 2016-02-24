// 费用明细弹层
export const TotalPrice = React.createClass({
  propsType: {
    // 总价(/分)
    totalPrice: React.PropTypes.number,

    // 折扣-平台补贴(/分)
    discount: React.PropTypes.number,
  },

  getInitialState(){
    return {
      // 控制annotation(订单费用明细)层的展示
      showAnnotation: false
    }
  },

  // 当鼠标滑过时,展示费用明细弹层
  _handleShowAnnotation(){
    this.setState({
      showAnnotation: true
    })
  },

  // 当鼠标滑出时,隐藏费用明细弹层
  _handleHideAnnotation(){
    this.setState({
      showAnnotation: false
    })
  },
  styles: {
    container: {
      position: 'relative'
    },
    symbol: {
      height: 15,
      width: 15,
      fontSize: 10,
      textAlign: 'center',
      borderRadius: 8,
      color: '#fff',
      //backgroundColor: 'darkorange',
      backgroundColor: '#ff8c00',
      cursor: 'pointer',
      marginLeft: 5
    },
    content: {
      position: 'absolute',
      padding: 5,
      color: '#666',
      width: 120,
      background: 'rgba(248, 172, 89, 0.86)',
      border: '1px solid #ddd',
      left: 20,
      top: 5,
      borderRadius: '0px 15px 15px 15px'
    }
  },
  render (){
    return this.props.discount ?
      <div className="inline" style={this.styles.container}>
        <div style={this.styles.symbol}
             onMouseOver={this._handleShowAnnotation}
             onMouseOut={this._handleHideAnnotation}>?
        </div>
        {this.state.showAnnotation ?
          <div style={this.styles.content}>
            <h3>费用明细</h3>
            <p>订单总价: {this.props.totalPrice / 100}</p>
            <p>买家支付: {(this.props.totalPrice - this.props.discount) / 100}</p>
            <p>平台支付: {this.props.discount / 100}</p>
          </div>
          : <span />
        }
      </div>
      : <div />
  }
})