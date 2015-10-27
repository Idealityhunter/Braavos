export const TextEditor = React.createClass({
  getInitialState() {
    return {
      // 是否处于编辑状态
      editing: false
    };
  },

  propTypes: {
    id: React.PropTypes.string,

    // 是否显示"修改"标签
    visibleEditAnchor: React.PropTypes.bool,
    // "修改"标签的文案
    editAnchorLabel: React.PropTypes.string,
    // 输入框的placeholder
    placeholder: React.PropTypes.string,
    // 是否为多行
    multiLines: React.PropTypes.bool,

    // 编辑框的数据
    text: React.PropTypes.string,
    // 标签的数据
    label: React.PropTypes.string,

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
      text: "",
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
        this.props.onCanceled({key: this.props.id});
        event.target.blur();
        break;
      default:
        break;
    }
  },

  onClick() {
    // 准备进入编辑状态
    this.setState({editing: true});
    this.props.onClick({key: this.props.id});

    setTimeout(() => {
      const inputNode = React.findDOMNode(this.refs['text-input']);
      const len = this.props.text.length * 2;
      inputNode.setSelectionRange(0, len);
      inputNode.focus();
    }, 10);
  },

  onFocus() {
    this.props.onFocus({key: this.props.id});
  },

  onBlur() {
    this.setState({editing: false});
    this.props.onSubmit({key: this.props.id});
  },

  onChange(event) {
    this.props.onChange({key: this.props.id, newText: event.target.value});
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

    const inputNode = this.props['multiLine'] ?
      <textarea ref="text-input"
                className="form-control"
                style={inputStyle}
                placeholder={this.props['placeholder']}
                value={this.props.text}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onChange={this.onChange}/>
      :
      <input ref="text-input"
             className="form-control"
             style={inputStyle}
             placeholder={this.props['placeholder']}
             value={this.props.text}
             onKeyUp={this.onKeyUp}
             onBlur={this.onBlur}
             onFocus={this.onFocus}
             onChange={this.onChange}/>;

    return (
      <div>
        <div className="col-xs-6 col-sm-7 col-md-8">
          <div className="form-control no-border height-auto cursor-pointer"
               style={textAreaStyle}
               onClick={this.onClick}>
            {this.props.label ? this.props.label : this.props['placeholder']}
          </div>
          {inputNode}
        </div>
        {anchor}
      </div>
    )
  }
});