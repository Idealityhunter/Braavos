export const TextEditor = React.createClass({
  getInitialState() {
    return {
      text: '',
      editing: false
    };
  },

  propTypes: {
    // div部分所采用的css class
    divStyleCls: React.PropTypes.arrayOf(React.PropTypes.string),
    // a标签所采用的css class
    aStyleCls: React.PropTypes.arrayOf(React.PropTypes.string),
    // 是否显示"修改"标签
    visibleEditAnchor: React.PropTypes.bool,
    // "修改"标签的文案
    editAnchorLabel: React.PropTypes.string,
    // 输入框的placeholder
    placeholder: React.PropTypes.string,
    // 是否为多行
    multiLines: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      divStyleCls: [],
      aStyleCls: [],
      visibleEditAnchor: true,
      editAnchorLabel: '修改',
      placeholder: '请输入',
      multiLines: false
    };
  },

  onClick() {
    this.setState({editing: true});

    setTimeout(() => {
      const inputNode = React.findDOMNode(this.refs['text-input']);
      const len = this.state.text.length * 2;
      inputNode.setSelectionRange(0, len);
      inputNode.focus();
    }, 10);
  },

  /**
   * 输入框内容发生变化
   *
   * @param evt
   */
  onChange(evt) {
    this.setState({text: evt.target.value});
  },

  onKeyUp(evt) {
    // 如果为多行情况, 则不支持使用enter进行提交操作
    if (!this.props['multiLine'] && evt.keyCode == 13) {
      // Enter is pressed
      const inputNode = React.findDOMNode(this.refs['text-input']);
      inputNode.blur();
    }
  },

  onBlur() {
    this.setState({editing: false});
  },

  render() {
    // 根据state, 获得文本区域的显示字符
    const textAreaStyle = _.extend(
      {display: this.state.editing ? 'none' : 'block'},
      this.state.text ? {} : {color: 'lightgray', 'font-style': 'italic'});

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
                value={this.state.text}
                onBlur={this.onBlur}
                onKeyUp={this.onKeyUp}
                onChange={this.onChange}/>
      :
      <input ref="text-input"
             className="form-control"
             style={inputStyle}
             placeholder={this.props['placeholder']}
             value={this.state.text}
             onBlur={this.onBlur}
             onKeyUp={this.onKeyUp}
             onChange={this.onChange}/>;

    return (
      <div>
        <div className="col-xs-6 col-sm-7 col-md-8">
          <div className="form-control no-border height-auto cursor-pointer"
               style={textAreaStyle}
               onClick={this.onClick}>
            {this.state.text ? this.state.text : this.props['placeholder']}
          </div>
          {inputNode}
        </div>
        {anchor}
      </div>
    )
  }
});