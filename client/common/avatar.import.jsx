/**
 * 用户头像的展示. 点击图像可以触发上传和修改
 *
 * Created by zephyre on 11/5/15.
 */

export const Avatar = React.createClass({
  propTypes: {
    // 是否允许修改
    allowEdit: React.PropTypes.bool,
    // 圆角矩形的参数
    borderRadius: React.PropTypes.number,
    // 图像地址
    imageUrl: React.PropTypes.string,
    // Style
    style: React.PropTypes.object,
    // 修改状态栏的文案
    stripLabel: React.PropTypes.string,

    // 回调函数
    onChange: React.PropTypes.func
  },

  getInitialState() {
    return {
      // 是否显示修改状态栏
      showStrip: false
    }
  },

  getDefaultProps() {
    return {
      allowEdit: true,
      borderRadius: 4,
      imageUrl: "",
      style: {},
      stripLabel: "修改头像"
    };
  },

  handleMouseOver() {
    this.setState({showStrip: true});
  },

  handleMouseOut() {
    this.setState({showStrip: false});
  },

  onChange(evt) {
    if (this.props.onChange) {
      this.props.onChange(evt);
    }
  },

  render() {
    // 是否有输入功能
    const inputNode = this.props.allowEdit ?
      <input id="avatar-file-input" type="file" style={{display:"none"}} onChange={this.onChange}
             onClick={()=>{
               $("#avatar-file-input").prop("value", null);
             }}/>
      :
      <div/>;

    const radius = this.props.borderRadius || "4px";
    const avatarStyle = {
      width: this.props.style.width || "120px",
      height: this.props.style.height || "120px",
      borderRadius: radius,
      cursor: "pointer"
    };
    const stripStyle = {
      width: "100%",
      height: "25px",
      lineHeight: "25px",
      textAlign: "center",
      cursor: "pointer",
      fontWeight: "normal",
      background: "#000",
      color: "#fff",
      display: this.state.showStrip ? "block" : "none",
      borderRadius: `0 0 ${radius}px ${radius}px`,
      position: "absolute",
      left: 0,
      bottom: 0
    };

    return (
      <div className="image-upload">
        <label htmlFor="avatar-file-input">
          <div style={{position:"relative", borderRadius:`${radius}px`}}>
            <img src={this.props.imageUrl} style={avatarStyle}
                 onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}/>
            <span style={stripStyle} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
              {this.props.stripLabel}
            </span>
          </div>
        </label>
        {inputNode}
      </div>
    );
  }
});
