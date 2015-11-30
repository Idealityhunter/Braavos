/**
 * 一个带有Overlay功能的Text Field
 * Created by zephyre on 11/30/15.
 */

import {Overlay, Tooltip} from "/lib/react-bootstrap"

export const TextField = React.createClass({
  propTypes: {
    // 输入框的内容
    value: React.PropTypes.string,
    // 输入框的label
    label: React.PropTypes.string,
    type: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    labelClassName: React.PropTypes.string,
    wrapperClassName: React.PropTypes.string,
    showOverlay: React.PropTypes.bool,
    overlayMessage: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      type: "text",
      value: "",
      showOverlay: false,
      label: "",
      placeholder: "",
      labelClassName: "col-xs-3",
      wrapperClassName: "col-xs-9"
    }
  },

  onChange(event) {
    if (this.props.onChange) {
      this.props.onChange({target: event.target, value: event.target.value});
    }
  },

  _tooltipId: Meteor.uuid(),

  render() {
    return (
      <div>
        <div className="form-group">
          <div className={this.props.labelClassName}>
            <label className="control-label">{this.props.label}</label>
          </div>
          <div className={this.props.wrapperClassName}>
            <input type={this.props.type} className="form-control" value={this.props.value} ref="input"
                   placeholder={this.props.placeholder} onChange={this.onChange}/>
          </div>
        </div>
        <Overlay show={this.props.showOverlay} placement="right"
                 target={() => ReactDOM.findDOMNode(this.refs["input"])}>
          <Tooltip id={this._tooltipId}>
            {this.props.overlayMessage}
          </Tooltip>
        </Overlay>
      </div>
    );
  }
});
