// 数字输入框: 禁止用户输入非数字的行为(暂时支持整数和小数)

export const NumberInput = React.createClass({
  propTypes:{
    // 输入框的自定义样式
    style: React.PropTypes.object,

    // number 的初始值
    value: React.PropTypes.string,

    // number 的类型限制
    numberType: React.PropTypes.string,

    // number 的小数点位数限制(当 numberType 为 'float' 的时候才起作用)
    decimalDigits: React.PropTypes.number,

    // 修改 state 的函数
    onChange: React.PropTypes.func,

    // 输入框的 placeholder
    placeholder: React.PropTypes.string
  },

  getInitialState() {
    // 用于记录前一次的value
    this.originValue = _.isNil(this.props.value) ? '' : this.props.value;
    this.numberType = this.props.numberType || 'integer';// 默认为正整数;还可以是float或者ID模式(开头可为0)
    this.decimalDigits = this.props.decimalDigits || 15;// 小数位数, 默认为无限大(最多大概只能到15位 => js的原因)
    this.headZero = this.props.headZero || false;
    this.tailZero = this.props.tailZero || true;

    return {};
  },

  // 禁止用户输入纯数字,小数点(不超过一个)以外的内容
  _handleInput (e){
    switch (this.numberType){
      case 'integer':
        if ((/^([1-9]\d*|[0]{1,1})$/).test($(e.target).val()) || $(e.target).val() == ''){
          this.originValue = $(e.target).val();
        } else {
          $(e.target).val(this.originValue);
        };
        break;
      case 'float':
        // 中文句号的替换
        $(e.target).val($(e.target).val().replace(/\。/, "."));
        if ((/^(\d*[\.]?\d*)$/).test($(e.target).val()) || $(e.target).val() == ''){
          this.originValue = $(e.target).val();
        } else {
          $(e.target).val(this.originValue);
        };
        break;
      default :
        break;
    };
    this.props.onChange && this.props.onChange(e);
  },

  _handleBlur(e){
    // TODO 验证编号(开头可为0)
    // TODO 验证数字
    // TODO 验证整数(开头不为0)
    // TODO 验证小数(可以有小数点, 结尾是否可以为0)
    switch (this.numberType){
      case 'float':
        const number = $(e.target).val();
        if (parseInt(number) == number){
          $(e.target).val( parseFloat(number) );
        }else{
          if (isNaN(parseFloat(number))){
            $(e.target).val('');
          }else{
            $(e.target).val( Math.floor(parseFloat(number) * Math.pow(10, this.decimalDigits)) / Math.pow(10, this.decimalDigits));
          }
        };
        this.props.onChange && this.props.onChange(e);
        break;
      default :
        break;
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
             onBlur={this._handleBlur}
             id={this.props.id}
      />
    )
  }
});
