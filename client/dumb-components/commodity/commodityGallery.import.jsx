// 商品编辑页面的图片管理组件

import {ImageCropper} from "/client/common/image-cropper"

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

let commodityGallery = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    addImage: React.PropTypes.func,
    changeCover: React.PropTypes.func,
    deleteImage: React.PropTypes.func,
    cover: React.PropTypes.object,
    images: React.PropTypes.array
  },

  getInitialState() {
    return {
      // 是否显示上传图片的modal
      showUploadModal: false,

      // 上传头像的modal中, 需要显示的image
      uploadModalImageSrc: "",

      // 头像是否处于preloading状态
      imagePreloading: false,

      leftImages: 0,//左边不显示的图片的数量

      focusImageIndex: (this.props.images.length > 0) ? 0 : -1
    }
  },

  // 控制滚动的点击事件
  handleScroll(e){
    const scrollLeft = (this.state.leftImages > 0);
    const scrollRight = (this.state.leftImages + 4 < this.props.images.length + 1);

    if ($(e.target).hasClass('left')) {
      if (!scrollLeft) return;
      // scroll right
      this.setState({
        leftImages: this.state.leftImages - 1
      });
      $('.scroll-wrap').animate({
        marginLeft: '+=90px'
      });
    } else {
      // scroll left
      if (!scrollRight) return;
      this.setState({
        leftImages: this.state.leftImages + 1
      });
      $('.scroll-wrap').animate({
        marginLeft: '-=90px'
      });
    }
  },

  // 删除图片
  handleDelete(e){
    const self = this;
    const curIndex = $(e.target).parents('.img-wrap').attr('data-id');
    swal({
      title: "确定删除这张图片吗?",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "删除",
      closeOnConfirm: false
    }, function () {
      // 当为focus图的逻辑时
      if (curIndex == self.state.focusImageIndex) {
        if (self.props.images.length > 1) {
          self.setState({
            focusImageIndex: 0
          })
        } else {
          self.setState({
            focusImageIndex: -1
          })
        }
      } else {
        if (curIndex < self.state.focusImageIndex) {
          self.setState({
            focusImageIndex: self.state.focusImageIndex - 1
          })
        }
      };

      self.props.deleteImage(curIndex);
      swal("成功删除该图片", "", "success");
    });
  },

  // 选择图片展示
  handleFocus(e){
    this.setState({
      focusImageIndex: $(e.target).parent('.img-wrap').attr('data-id')
    });
  },

  // 设置主图(作为商品的主图)
  _handleChangeCover(e){
    this.setState({
      focusImageIndex: $(e.target).parent('.img-wrap').attr('data-id')
    });
    this.props.changeCover($(e.target).parent('.img-wrap').attr('data-id'));
    swal("已将该图设为主图！", "", "success");
  },

  // 上传图片
  uploadImage(evt) {
    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          showUploadModal: true,
          uploadModalImageSrc: reader.result
        });

        // 当plus按钮要被挤掉的时候
        if (this.state.leftImages + 4 == this.props.images.length + 1){
          // scroll left
          this.setState({
            leftImages: this.state.leftImages + 1
          });
          $('.scroll-wrap').animate({
            marginLeft: '-=90px'
          }, 200);
        }
      };
      reader.readAsDataURL(file);
    };
    $(evt.target).val('');
  },

  // 关闭上传图片的modal
  handleCloseUploadModal(evt) {
    this.setState({showUploadModal: false});
  },

  // 修改图片
  handleModifyImage(evt) {
    const self = this;
    this.setState({
      showUploadModal: false,
      imagePreloading: true
    });

    // 获取原始宽高
    const oSelection = evt.oSelection;


    const imageSrc =  evt.oImage;
    const imageData = atob(imageSrc.replace(/^data:image\/[a-z]+;base64,/, ""));
    const key = `commodity/images/${CryptoJS.MD5(imageData).toString()}`;
    const bucketKey = "commodity";

    Meteor.call("qiniu.getUploadToken", bucketKey, key, {}, (err, ret) => {
      if (!err && ret) {
        // 组建form
        const form = new FormData();
        form.append("key", ret.key);
        form.append("token", ret.token);

        // 添加文件
        const writer = new Uint8Array(imageData.length);
        for (let i = 0; i < writer.length; i++) {
          writer[i] = imageData.charCodeAt(i);
        }
        const blob = new Blob([writer], {type: "application/octet-stream"});
        form.append("file", blob);
        //form.append("file", imageSrc);

        // 发送post请求
        $.ajax({
          url: 'http://upload.qiniu.com',
          data: form,
          contentType: false,
          processData: false,
          type: 'POST',
          success: function (data, textStatus, jqXHR) {
            // 修改成功的状态转换
            self.props.addImage({
              url: ret.url,
              cropHint: {
                left: oSelection[0],
                top: oSelection[1],
                right: oSelection[0] + oSelection[2],
                bottom: oSelection[1] + oSelection[3]
              }
            });
            self.setState({
              imagePreloading: false,
              uploadModalImageSrc: '',
              focusImageIndex: self.props.images.length - 1
            });
          },
          error(jqXHR, textStatus, errorThrown){
            // 修改失败的状态转换
            self.setState({
              imagePreloading: false
            });
          }
        });
      } else {
        // 修改失败的状态转换
        self.setState({
          imagePreloading: false
        });
      }
    })
  },

  _handlePreloading(e){
    swal({
      title: '图片正在上传中',
      type: 'success',
      timer: 1000
    })
  },

  styles: {
    focusImg: {
      width: 250,
      height: 250,
      display: 'inline-block',
      border: '1px solid rgb(170, 170, 170)',
      margin: '0px auto'
    },
    preloader: {
      position: "absolute",
      top: "110px",
      left: "235px",
      width: "30px",
      height: "30px"
    }
  },

  render() {
    const prefix = 'commodities.modify.basicTab.gallery';

    const preloader = (
      <div style={{display: this.state.imagePreloading ? "block" : "none"}}>
        <img src="/images/spinner.gif"
             style={this.styles.preloader}/>
      </div>
    );

    const focusImage = this.props.images[this.state.focusImageIndex];
    const focusImageHtml =
      <div className="img-view" style={{position:'relative'}}>
        <img
          src={focusImage
            ? focusImage.cropHint
              ? `${focusImage.url}?imageMogr2/crop/!${focusImage.cropHint.right - focusImage.cropHint.left}x${focusImage.cropHint.bottom - focusImage.cropHint.top}a${focusImage.cropHint.left}a${focusImage.cropHint.top}/thumbnail/500/500/`
              : `${focusImage.url}?imageView2/2/w/500/h/500`
            : ''
          }
          alt=""
          style={this.styles.focusImg}
        />
      {preloader}
    </div>;

    const uploadModal = this.state.showUploadModal ?
      <ImageCropper title={this.getIntlMessage(`${prefix}.cropUploadImage`)}
                    okTitle={this.getIntlMessage("dialog.ok")} cancelTitle={this.getIntlMessage("dialog.cancel")}
                    imageSrc={this.state.uploadModalImageSrc}
                    showModal={true} aspectRatio={2}
                    changeAspectRatio={true}
                    imageMaxWidth={500}
                    onOk={this.handleModifyImage}
                    onClose={this.handleCloseUploadModal}
                    onShadowClose={false}/>
      :
      <div />;

    const scrollLeft = (this.state.leftImages > 0);
    const scrollRight = (this.state.leftImages + 4 < this.props.images.length + 1);

    let i = 0;
    const imgList = this.props.images.map((img) => {
      return (
        <div className='inline img-wrap' key={Meteor.uuid()} data-id={i++}>
          <img className={(i-1 == this.state.focusImageIndex) ? 'active' : ''} alt=""
               src = { img.cropHint
                ? `${img.url}?imageMogr2/crop/!${img.cropHint.right - img.cropHint.left}x${img.cropHint.bottom - img.cropHint.top}a${img.cropHint.left}a${img.cropHint.top}/thumbnail/150/150/`
                : `${img.url}?imageView2/2/w/150/h/150`
               }
               onClick={this.handleFocus}
          />
          <i className='fa fa-trash-o' onClick={this.handleDelete}/>
          <i className={_.isEqual(img, this.props.cover) ? 'fa fa-heart' : 'fa fa-heart-o'} onClick={this._handleChangeCover}/>
        </div>
      )}
    );

    return (
      <div className="gallery-wrap">
        <div className="col-xs-6 col-sm-7 col-md-8">
          {uploadModal}
        </div>
        {focusImageHtml}
        <div className="scroll-view">
          <div className={scrollLeft ? "ctl-btn left " : "ctl-btn left frozen"} onClick={this.handleScroll}>{'<'}</div>
          <div className="middle-view inline">
            <div className='scroll-wrap'>
              {imgList}
              <div className="select-frame img-wrap inline">
                <label className="plus cursor-pointer" htmlFor="upload-file-input">+</label>
                <input id="upload-file-input" className="hidden" type="file" onChange={this.uploadImage}/>
              </div>
            </div>
          </div>
          <div className={scrollRight ? "ctl-btn right " : "ctl-btn right frozen"} onClick={this.handleScroll}>></div>
        </div>
      </div>
    );
  }
});

export const CommodityGallery = commodityGallery;