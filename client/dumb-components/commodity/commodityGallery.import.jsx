import {ImageCropper} from "/client/common/image-cropper"

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

//let images = [{
//    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/2s.jpg',
//    main: true
//  }, {
//    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/3s.jpg',
//  }, {
//    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/4s.jpg',
//  }, {
//    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/5s.jpg',
//  }, {
//    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/6s.jpg',
//  }, {
//    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/7s.jpg',
//  }
//];

let commodityGallery = React.createClass({
  mixins: [IntlMixin],
  getInitialState() {
    let coverCount = 0;// 假如有两张一样的图片,就需要coverCount来取其中前面一张
    const images = (this.props.images.length > 0)
      ? this.props.images.map(image => {
          if (image.url == this.props.cover.url && !coverCount){
            coverCount = 1;
            return {
              src: image.url,
              main: true
            }
          }else{
            return {
              src: image.url,
              main: false
            }
          };
        })
      : [];
    return {
      // 是否显示上传图片的modal
      showUploadModal: false,
      // 上传头像的modal中, 需要显示的image
      uploadModalImageSrc: "",

      // 头像是否处于preloading状态
      imagePreloading: false,


      leftImages: 0,//左边不显示的图片的数量
      //focusImage: images[0].src,
      focusImageIndex: (images.length > 0) ? 0 : null,
      images: images
    }
  },

  // 控制滚动的点击事件
  handleScroll(e){
    const scrollLeft = (this.state.leftImages > 0);
    const scrollRight = (this.state.leftImages + 4 < this.state.images.length + 1);

    if ($(e.target).hasClass('left')){
      if (!scrollLeft) return ;
      this.setState({
        leftImages: this.state.leftImages - 1
      });
      $('.scroll-wrap').animate({
        marginLeft: '+=90px'
      });
    }else{
      if (!scrollRight) return ;
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
    }, function(){
      let copyImages = self.state.images.slice();
      // 当为主图时的逻辑
      if (copyImages[curIndex].main && copyImages.length > 1){
        if (curIndex != 0)
          copyImages[0].main = true;
        else
          copyImages[1].main = true;
      }

      // 当为focus图的逻辑时
      if (curIndex == self.state.focusImageIndex){
        if (copyImages.length > 1){
          self.setState({
            focusImageIndex: 0
          })
        }else{
          self.setState({
            focusImageIndex: null
          })
        }
      }else{
        if (curIndex < self.state.focusImageIndex){
          self.setState({
            focusImageIndex: self.state.focusImageIndex - 1
          })
        }
      }

      copyImages.splice(curIndex, 1);
      self.setState({
        images: copyImages
      })
      swal("成功删除该图片", "", "success");
    });
  },

  //  选择图片展示
  handleFocus(e){
    this.setState({
      focusImageIndex: $(e.target).parent('.img-wrap').attr('data-id')
    });
  },

  // 设置主图(作为商品的主图)
  handleMain(e){
    const imageUrl = $(e.target).siblings('img')[0].src;
    let copyImages = this.state.images.slice();
    this.setState({
      images: _.map(copyImages, (image) => {
        return {
          src: image.src,
          main: (image.src == imageUrl)
        }
      }),
      focusImageIndex: $(e.target).parent('.img-wrap').attr('data-id')
    });
    swal("已将该图设为主图！", "", "success");
  },

  // 上传图片
  changeImage(evt) {
    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          showUploadModal: true,
          uploadModalImageSrc: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
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
    const imageSrc = evt.croppedImage;

    //deprecated 利用图像的内容, 做MD5, 得到key
    const imageData = atob(imageSrc.replace(/^data:image\/(png|jpg);base64,/, ""));
    const bk = 'avatar';
    const prefix = 'avatar/';

    Meteor.call("qiniu.uploadImage", imageSrc, bk, prefix, (err, ret) => {
      if (!err && ret){
        // 组建form
        var form = new FormData();
        form.append("key", ret.key);
        form.append("token", ret.token);
        form.append("file", imageData);

        // 发送post请求
        $.ajax({
          url: 'upload.qiniu.com',
          data: form,
          async: false,
          cache: false,
          contentType: false,
          processData: false,
          type: 'POST',
          success: function(data, textStatus, jqXHR) {
            // TODO 修改成功的状态转换
            let copyImages = self.state.images.slice();
            copyImages.push({
              main: (copyImages.length == 0),
              src: ret.url
            });
            self.setState({
              images: copyImages,
              imagePreloading: false,
              uploadModalImageSrc: '',
              focusImageIndex: copyImages.length - 1
            });
          },
          error(jqXHR, textStatus, errorThrown){
            // TODO 修改失败的状态转换
            self.setState({
              imagePreloading: false
            });
          }
        });
      }else{
        // TODO 修改失败的状态转换
        self.setState({
          imagePreloading: false
        });
      }
    })
  },

  render() {
    const prefix = 'commodities.modify.basicTab.gallery';

    const preloader = (
      <div style={{display: this.state.imagePreloading ? "block" : "none"}}>
        <img src="/images/spinner.gif"
             style={{position: "absolute", top: "110px", left: "235px", width: "30px", height: "30px"}}/>
      </div>
    );

    const uploadModal = this.state.showUploadModal ?
      <ImageCropper title={this.getIntlMessage(`${prefix}.cropUploadImage`)}
                    okTitle={this.getIntlMessage("dialog.ok")} cancelTitle={this.getIntlMessage("dialog.cancel")}
                    imageSrc={this.state.uploadModalImageSrc} showModal={true} aspectRatio={1}
                    imageMaxWidth={500}
                    onOk={this.handleModifyImage}
                    onClose={this.handleCloseUploadModal} />
      :
      <div />;

    const scrollLeft = (this.state.leftImages > 0);
    const scrollRight = (this.state.leftImages + 4 < this.state.images.length + 1);

    let i = 0;
    const imgList = this.state.images.map((img) =>
      <div className='inline img-wrap' key={Meteor.uuid()} data-id={i++}>
        <img className={(i-1 == this.state.focusImageIndex) ? 'active' : ''} src={`${img.src}?imageView2/2/w/128/h/128`} alt="" onClick={this.handleFocus}/>
        <i className='fa fa-trash-o' onClick={this.handleDelete}/>
        <i className={img.main ? 'fa fa-heart' : 'fa fa-heart-o'} onClick={this.handleMain}/>
      </div>
    );

    return (
      <div className="gallery-wrap">
        <div className="col-xs-6 col-sm-7 col-md-8">
          {uploadModal}
        </div>

        <div className="img-view" style={{position:'relative'}}>
          <img src={(this.state.focusImageIndex !== null) ? `${this.state.images[this.state.focusImageIndex].src}?imageView2/2/w/250/h/250` : ''} alt="" style={{width: 250, height:250}}/>
          {preloader}
        </div>
        <div className="scroll-view">
          <div className={scrollLeft ? "ctl-btn left " : "ctl-btn left frozen"} onClick={this.handleScroll}>{'<'}</div>
          <div className="middle-view inline">
            <div className='scroll-wrap'>
              {imgList}
              <div className="select-frame img-wrap inline">
                <label className="plus cursor-pointer" htmlFor="upload-file-input">+</label>
                <input id="upload-file-input" className="hidden" type="file" onChange={this.changeImage} preloading={this.state.imagePreloading}/>
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