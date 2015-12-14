// library SpinKit: https://github.com/tobiasahlin/SpinKit/blob/master/examples/2-double-bounce.html
// 样式依赖CSS

export const PageLoading = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    showShadow: React.PropTypes.bool,
    labelText: React.PropTypes.string,
    alpha: React.PropTypes.number // 控制loading效果的透明度
  },

  getDefaultProps(){
    return {
      show: false,
      showShadow: true,
      labelText: '加载中,请稍候...',
      alpha: 0.7
    }
  },

  styles: {
    shadowLayer: {
      opacity: 1.04,
      display: 'block',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 10000
    },
    loadingBoard: {
      display: 'block',
      //backgroundColor: 'rgba(255, 255, 255, 0.7)',
      width: 220,
      marginTop: -57,
      marginLeft: -130,
      fontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      padding: 20,
      borderRadius: 5,
      textAlign: 'center',
      position: 'fixed',
      left: '50%',
      top: '50%',
      overflow: 'hidden',
      zIndex: 99999
    },
    loadingLabel: {
      paddingBottom: 15
    },
    spinnerGroup: {
      height: 60,
      width: 70
    },
    spinnerItem: {
      margin: '0 3px'
    }
  },

  render(){
    return (
      <div className={this.props.show ? "page-loading-wrap" : "page-loading-wrap hidden"}>
        <div className={this.props.showShadow ? "page-loading-shadow" : "page-loading-shadow hidden"} style={this.styles.shadowLayer}></div>
        <div className="page-loading-board" style={_.extend(this.styles.loadingBoard, {backgroundColor: `rgba(255, 255, 255, ${this.props.alpha})`})}>
          <div className="page-loading-label" style={this.styles.loadingLabel}>{this.props.labelText}</div>
          <div className="page-loading-spinner sk-spinner sk-spinner-wave" style={this.styles.spinnerGroup}>
            <div className="sk-rect1" style={this.styles.spinnerItem}></div>
            <div className="sk-rect2" style={this.styles.spinnerItem}></div>
            <div className="sk-rect3" style={this.styles.spinnerItem}></div>
            <div className="sk-rect4" style={this.styles.spinnerItem}></div>
            <div className="sk-rect5" style={this.styles.spinnerItem}></div>
          </div>
        </div>
      </div>
    )
  }
})
