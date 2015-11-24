
const numberInput = React.createClass({
  getInitialState() {
    // 用于记录前一次的value
    this.originValue = this.props.value || '';
    return {};
  },

  // 禁止用户输入纯数字以外的内容
  _handleInput (e){
    if ((/^([1-9]\d*|[0]{1,1})$/).test($(e.target).val()) || $(e.target).val() == ''){
      this.originValue = $(e.target).val();
    } else {
      $(e.target).val(this.originValue);
    }
  },

  render(){
    return (
      <input type='text'
             className={this.props.className}
             placeholder={this.props.placeholder}
             style={this.props.style}
             defaultValue={this.originValue}
             onChange={this._handleInput}
             id={this.props.id}
      />
    )
  }
});

export const NumberInput = numberInput;