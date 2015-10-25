export const TextEditor = React.createClass({
  getInitialState() {
    return {
      text: this.props.text,
      editing: false,
      // 原始数据
      original: this.props.text,
      // 上一次更新的值. 每次blur的时候, 将检查这一数值.
      // 只有当二者不一致的时候, 才会真正执行提交的操作
      lastUpdate: undefined,
      // 标记位. 如果esc被按下, 会被置为true. 帮助检测esc事件
      escPressed: false
    };
  },

  propTypes: {
    // 提交修改的回调函数
    onSubmit: React.PropTypes.object,
    // 初始的文本信息
    text: React.PropTypes.string,
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
      text: "",
      visibleEditAnchor: true,
      editAnchorLabel: '修改',
      placeholder: '请输入',
      multiLines: false
    };
  },

  componentDidMount() {
    const inputNode = React.findDOMNode(this.refs['text-input']);

    jQuery(inputNode).keyup(evt => {
      const enterCode = 13;
      // 如果为多行情况, 则不支持使用enter进行提交操作
      if (!this.props['multiLine'] && evt.keyCode == enterCode) {
        // Enter is pressed
        evt.target.blur();
      }
    });

    jQuery(inputNode).keydown(evt=> {
      const escCode = 27;
      if (evt.keyCode == escCode) {
        this.state.escPressed = true;
      }
    });
  },


  onClick() {
    // 准备进入编辑状态
    this.setState({editing: true, text: this.props.text});

    setTimeout(() => {
      const inputNode = React.findDOMNode(this.refs['text-input']);
      const len = this.state.text.length * 2;
      inputNode.setSelectionRange(0, len);
      inputNode.focus();
    }, 10);
  },

  /**
   * 输入框内容发生变化
   */
    onChange(evt) {
    this.setState({text: evt.target.value});
  },

  onFocus() {
    // 获得焦点的时候, 需要保存原始数据
    this.state.original = this.state.text;
  },

  onBlur() {
    if (this.state.escPressed) {
      // Esc被按下
      this.state.text = this.state.original;
      this.state.escPressed = false;
    }

    // 是否真的提交了
    let submitted = false;
    if (this.state.lastUpdate != this.state.text) {
      this.state.lastUpdate = this.state.text;
      if (this.props.onSubmit) {
        submitted = true;
        this.props.onSubmit(this.state.text);
      }
    }

    if (submitted) {
      // 给一些延迟. 造成的效果是, 输入框失去焦点的时候, 需要过很小一段时间, 才把文本框切换出来. 这样给文本框一些更新内容的时间
      setTimeout(() => {
        this.setState({editing: false});
      }, 10);
    } else {
      // 直接切换
      this.setState({editing: false});
    }
  },

  render() {
    // 根据state, 获得文本区域的显示字符
    const textAreaStyle = _.extend(
      {display: this.state.editing ? 'none' : 'block'},
      this.props.text ? {} : {color: 'lightgray', 'font-style': 'italic'});

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
             onFocus={this.onFocus}
             onChange={this.onChange}/>;

    return (
      <div>
        <div className="col-xs-6 col-sm-7 col-md-8">
          <div className="form-control no-border height-auto cursor-pointer"
               style={textAreaStyle}
               onClick={this.onClick}>
            {this.props.text ? this.props.text : this.props['placeholder']}
          </div>
          {inputNode}
        </div>
        {anchor}
      </div>
    )
  }
});