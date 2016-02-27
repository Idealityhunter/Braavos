/**
 * 登录页面中的text field
 *
 * Created by zephyre on 1/31/16.
 */

import {Input} from '/lib/react-bootstrap'

export const TextField = React.createClass({
  propTypes: {
    inputType: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    handleChange: React.PropTypes.func,
    label: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      inputType: 'text'
    };
  },

  handleChange(evt) {
    if (this.props.handleChange) {
      this.props.handleChange(evt.target.value);
    }
  },

  /**
   * 全选文字
   */
  onFocus() {
    const node = ReactDOM.findDOMNode(this).getElementsByTagName('input')[0];
    const len = (this.props.value || '').length * 2;
    setTimeout(()=> {
      node.setSelectionRange(0, len);
    }, 0);
  },

  render() {
    return (
      <Input type={this.props.inputType} value={this.props.value} label={this.props.label} onClick={this.onFocus}
             placeholder={this.props.placeholder} onChange={this.handleChange}/>
    )
  }
});
