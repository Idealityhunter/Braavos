/**
 * 裁剪图像的modal dialog
 *
 * Created by zephyre on 11/5/15.
 */

import {Modal, Button} from "/lib/react-bootstrap"

export const ImageCropper = React.createClass({
  propTypes: {
    // 对话框的标题
    title: React.PropTypes.string.isRequired,
    // 图像数据(可以以base64编码的形式提供)
    imageSrc: React.PropTypes.string.isRequired,
    // 确认按钮的文本
    okTitle: React.PropTypes.string,
    // 取消按钮的文本
    cancelTitle: React.PropTypes.string,
    // 是否显示modal dialog
    showModal: React.PropTypes.bool,
    // 选择框的比例
    aspectRatio: React.PropTypes.number,

    imageMaxWidth: React.PropTypes.number,
    imageMaxHeight: React.PropTypes.number,

    // 回调函数
    onClose: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      showModal: false,
      imageMaxWidth: 480,
      imageMaxHeight: 480,
      aspectRatio: null,
      okTitle: "确认",
      cancelTitle: "取消"
    }
  },

  // jcrop对象
  jcropper: {},

  // 图像宽度
  imageWidth: 0,

  // 图像高度
  imageHeight: 0,

  // 原始图像宽度
  imageNaturalWidth: 0,

  // 原始图像高度
  imageNaturalHeight: 0,

  getInitialState() {
    return {
      // 裁剪信息: [left, top, width, height]
      selection: [0, 0, 0, 0]
    };
  },

  styles:{
    options:{
      textAlign: 'left',
      width: 400,
      verticalAlign: 'middle'
    }
  },

  onClose() {
    if (this.props.onClose) {
      const oSelection = this._selConversion(this.state.selection);
      this.props.onClose({target: this, selection: this.state.selection, oSelection: oSelection});
    }
  },

  // 坐标转换(从img标签的坐标转换成图像的原始坐标
  _imgToRaw(coords) {
    const [x, y] = coords;
    const w = this.imageWidth;
    const h = this.imageHeight;
    const ow = this.imageNaturalWidth;
    const oh = this.imageNaturalHeight;

    const ox = ow / w * x;
    const oy = oh / h * y;
    return [ox, oy];
  },

  // 在_imgToRaw的基础上, 做选区的变换
  _selConversion(sel) {
    const [l, t, w, h] = sel;
    const p1 = this._imgToRaw([l, t]);
    const p2 = this._imgToRaw([l + w, t + h]);
    const [l2, t2] = p1;
    const [r2, b2] = p2;
    return [l2, t2, r2 - l2, b2 - t2].map(v=>Math.round(v));
  },

  onOk() {
    if (this.props.onOk) {
      // oSelection: original selection
      const oSelection = this._selConversion(this.state.selection);
      const imageNode = ReactDOM.findDOMNode(this.refs["image"]);

      const canvas = document.createElement("canvas");
      const canvasSize = 240;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      var ctx = canvas.getContext("2d");
      const [l, t, w, h] = oSelection;
      ctx.drawImage(imageNode, l, t, w, h, 0, 0, canvasSize, canvasSize);

      this.props.onOk({
        target: this,
        selection: this.state.selection,
        oSelection: oSelection,
        // crop后的数据
        croppedImage: canvas.toDataURL("image/png"),
        oImage: this.props.imageSrc,
        imageNode: imageNode
      });
    }
  },

  onChange(coords) {
    const sel = [coords.x, coords.y, coords.w, coords.h];
    this.setState({selection: sel});
    if (this.props.onChange) {
      const oSelection = this._selConversion(sel);
      this.props.onChange({target: this, selection: sel, oSelection: oSelection});
    }
  },

  onSelect(coords) {
    const sel = [coords.x, coords.y, coords.w, coords.h];
    this.setState({selection: sel});
    if (this.props.onSelect) {
      const oSelection = this._selConversion(sel);
      this.props.onSelect({target: this, selection: sel, oSelection: oSelection});
    }
  },

  // 获得初始化的选择区域
  _getInitialSelection(minMargin) {
    const w = this.imageWidth;
    const h = this.imageHeight;
    const r = this.props.aspectRatio;
    // 原图的宽高比
    const r2 = w / h;

    if (r > r2) {
      // 宽选择区
      const w2 = w - 2 * minMargin;
      const h2 = w2 / r;
      const t2 = (h - h2) / 2;
      return [minMargin, t2, w2, h2].map(v=>Math.round(v));
    } else {
      // 高选择区
      const h2 = h - 2 * minMargin;
      const w2 = h2 * r;
      const l2 = (w - w2) / 2;
      return [l2, minMargin, w2, h2].map(v=>Math.round(v));
    }
  },

  // 图像加载完成以后的回调函数
  onImageLoaded() {
    const self = this;
    const imageNode = ReactDOM.findDOMNode(this.refs["image"]);
    this.imageWidth = $(imageNode).prop("width");
    this.imageHeight = $(imageNode).prop("height");
    this.imageNaturalWidth = $(imageNode).prop("naturalWidth");
    this.imageNaturalHeight = $(imageNode).prop("naturalHeight");

    // 留有20的边距
    const margin = 10;
    const initalSelection = this._getInitialSelection(margin);

    // 设置Jcrop
    $(imageNode).Jcrop({
      setSelect: initalSelection,
      allowSelect: false,
      bgOpacity: 0.4,
      onSelect: this.onSelect,
      onChange: this.onChange,
      aspectRatio: this.props.aspectRatio
    }, function () {
      // 保存句柄
      self.jcropper = this;

      // 设置margin
      $(imageNode).siblings(".jcrop-holder").css("margin", "10px auto");
    });
  },

  render() {
    const btnStyle = {margin: "0 20px 0 0"};
    return (
      <Modal show={this.props.showModal} onHide={this.onClose} bsSize="medium">
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <canvas ref="canvas" style={{display: "none"}} />
        <img ref="image" src={this.props.imageSrc}
             onLoad={this.onImageLoaded}
             style={{maxWidth:`${this.props.imageMaxWidth}px`, margin: "20px auto 20px"}}/>
        <Modal.Footer>
          <form className="form-horizontal">
            <div className="inline" style={this.styles.options}>
              <div>
                <input type="radio" name="ratio" id="fixedRatio"
                       defaultChecked={true}
                       onChange={() => this.jcropper.setOptions({aspectRatio:2})}/>
                <label htmlFor="fixedRatio">固定比例2:1(推荐)</label>
              </div>
              <div>
                <input type="radio" name="ratio" id="dynamicRatio"
                       onChange={() => this.jcropper.setOptions({aspectRatio:null})}/>
                <label htmlFor="dynamicRatio">不定比例</label>
              </div>
            </div>
            <Button onClick={this.onClose} style={btnStyle}>{this.props.cancelTitle}</Button>
            <Button bsStyle="primary" onClick={this.onOk} style={btnStyle}>{this.props.okTitle}</Button>
          </form>
        </Modal.Footer>
      </Modal>
    );
  }
});


