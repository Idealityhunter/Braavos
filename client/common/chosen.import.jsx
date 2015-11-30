/**
 * Chosen插件
 * Created by zephyre on 11/27/15.
 */

export const Chosen = React.createClass({
  propTypes: {
    // 没有选择的时候的placeholder
    placeholder: React.PropTypes.string,
    // 选项
    options: React.PropTypes.array,
    // 是否允许多选
    multiSelect: React.PropTypes.bool,
    // 样式
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    // 已选择的options
    selected: React.PropTypes.array,
    // 回调函数
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      multiSelect: false
    }
  },

  // 调用jQuery, 渲染插件
  _initUI() {
    const node = $(ReactDOM.findDOMNode(this.refs.chosen));
    node.attr("data-placeholder", this.props.placeholder || "");
    const self = this;
    node.chosen().change((evt, param) => {
      if (self.props.onChange) {
        self.props.onChange({target: self, selected: param.selected, deselected: param.deselected})
      }
    });
  },

  componentDidMount() {
    this._initUI();

    const node = $(ReactDOM.findDOMNode(this.refs.chosen));
    // 被选中的项目
    const vals = (this.props.selected || []);
    node.val(vals).trigger("chosen:updated");
  },

  componentDidUpdate() {
    const node = $(ReactDOM.findDOMNode(this.refs.chosen));
    // 被选中的项目
    const vals = (this.props.selected || []);
    node.val(vals).trigger("chosen:updated");
  },

  render() {
    const items = (this.props.options || []).map(item => {
        return <option key={Meteor.uuid()} value={item.value}>{item.text}</option>;
      }
    );

    const style = _.pick(this.props.style || {}, "width");
    const className = this.props.className || ""
    return this.props.multiSelect ?
      <select ref="chosen" multiple className={className} style={style}>{items}</select> :
      <select ref="chosen" className={className} style={style}>{items}</select>;
  }
});