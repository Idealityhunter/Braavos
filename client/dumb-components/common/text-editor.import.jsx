import {Label, Input, Overlay, Tooltip} from "/lib/react-bootstrap"

export const TextEditor = React.createClass({
  getInitialState() {
    return {
      // 是否处于编辑状态
      editing: false,
      // 原始数据
      original: "",
      // 编辑框的数据
      text: "",
      // 上一次提交的数据
      lastSubmit: "",
      // 是否显示overlay
      showOverlay: false
    };
  },

  // 提交数据的时候, 使用该属性
  _submitText: null,

  propTypes: {
    // 是否显示"修改"标签
    visibleEditAnchor: React.PropTypes.bool,
    // "修改"标签的文案
    editAnchorLabel: React.PropTypes.string,
    // 输入框的placeholder
    placeholder: React.PropTypes.string,
    // 是否为多行
    multiLines: React.PropTypes.bool,
    // Overlay的信息
    overlayMessage: React.PropTypes.string,
    // 检查输入是否正确
    validator: React.PropTypes.func,

    // 标签的数据
    label: React.PropTypes.string,

    style: React.PropTypes.object,
    className: React.PropTypes.string,
    inputClassName: React.PropTypes.string,

    // 编辑框文字变化的回调
    onChange: React.PropTypes.func,
    // 点击事件的回调
    onClick: React.PropTypes.func,
    // 获得焦点的事件
    onFocus: React.PropTypes.func,
    // 提交修改的回调函数
    onSubmit: React.PropTypes.func,
    // 按Esc取消修改的事件
    onCanceled: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      label: "",
      visibleEditAnchor: true,
      editAnchorLabel: '修改',
      placeholder: '请输入',
      multiLines: false
    };
  },

  onKeyUp(event) {
    const keyCode = event.keyCode;
    const KEY_CODE_ENTER = 13;
    const KEY_CODE_ESC = 27;
    switch (keyCode) {
      case KEY_CODE_ENTER:
        // 如果为多行情况, 则不支持使用enter进行提交操作
        if (!this.props['multiLine']) {
          // Enter is pressed
          event.target.blur();
        }
        break;
      case KEY_CODE_ESC:
        // Esc is pressed
        this.setState({text: this.state.original});
        this._submitText = null;
        if (this.props.onCanceled) {
          this.props.onCanceled();
        }
        event.target.blur();
        break;
      default:
        break;
    }
  },

  _selAll() {
    const inputNode = ReactDOM.findDOMNode(this.refs['text-input']);
    const len = this.props.label.length * 2;
    setTimeout(() => {
      inputNode.setSelectionRange(0, len);
      inputNode.focus();
    }, 10);
  },

  onClick() {
    // 准备进入编辑状态
    this.setState({editing: true, text: this.props.label, original: this.props.label});
    if (this.props.onClick) {
      this.props.onClick();
    }
    this._selAll();
  },

  onFocus() {
    this.setState({text: this.props.label});
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  },

  onBlur() {
    const submitText = this._submitText;
    const shouldSubmit = this.state.lastSubmit != submitText;
    if (this._submitText && shouldSubmit && this.props.onSubmit) {
      this.props.onSubmit({value: submitText});
    }
    setTimeout(() => {
      this.setState({showOverlay: false, editing: false, lastSubmit: submitText});
    }, 10);
  },

  onChange(event) {
    const newValue = event.target.value;
    // 输入有效性检查
    if (this.props.validator) {
      this.setState({showOverlay: !this.props.validator(newValue)});
    }

    this.setState({text: newValue});
    this._submitText = newValue;
    if (this.props.onChange) {
      this.props.onChange({target: this, newValue: event.target.value});
    }
  },

  render() {
    // 根据state, 获得文本区域的显示字符
    const textAreaStyle = _.extend(
      {display: this.state.editing ? 'none' : 'block'},
      this.props.label ? {} : {color: 'lightgray', fontStyle: 'italic'});

    // "修改"链接的style
    const anchorStyle = {display: this.state.editing ? 'none' : 'block'};

    // 输入框的style
    const inputStyle = {display: this.state.editing ? 'block' : 'none'};

    const anchor = this.props.visibleEditAnchor ?
      <a href="javascript:void(0)" style={anchorStyle} className="col-xs-2"
         onClick={this.onClick}>{this.props.editAnchorLabel}</a> :
      <span />;

    const overlay =
      <Overlay show={this.state.showOverlay} placement="right"
               target={() => ReactDOM.findDOMNode(this.refs["textField"])}>
        <Tooltip id={Meteor.uuid()}>
          {this.props.overlayMessage}
        </Tooltip>
      </Overlay>;

    const inputNode = this.props['multiLine'] ?
      <textarea ref="text-input"
                className="form-control"
                style={inputStyle}
                placeholder={this.props['placeholder']}
                value={this.state.text}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onChange={this.onChange}/>
      :
      <input ref="text-input"
             className="form-control"
             style={inputStyle}
             placeholder={this.props['placeholder']}
             value={this.state.text}
             onKeyUp={this.onKeyUp}
             onBlur={this.onBlur}
             onFocus={this.onFocus}
             onChange={this.onChange}/>;

    return (
      <div style={this.props.style || {}} className={this.props.className || ""}>
        <div className={this.props.inputClassName || "col-xs-6 col-sm-7 col-md-8"} ref="textField">
          <div className="form-control no-border height-auto cursor-pointer"
               style={textAreaStyle}
               onClick={this.onClick}>
            {this.props.label ? this.props.label : this.props['placeholder']}
          </div>
          {inputNode}
          {overlay}
        </div>
        {anchor}
      </div>
    )
  }
});