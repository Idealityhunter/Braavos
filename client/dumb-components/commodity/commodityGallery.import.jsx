
let images = [
  {
    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/2s.jpg',
    main: true
  },
  {
    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/3s.jpg',
  },
  {
    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/4s.jpg',
    main: false
  },
  {
    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/5s.jpg',
  },
  {
    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/6s.jpg',
  },
  {
    src: 'http://webapplayers.com/inspinia_admin-v2.3/img/gallery/7s.jpg',
  }
];

let commodityGallery = React.createClass({
  getInitialState() {
    return {
      leftImages: 0,//左边不显示的图片的数量
      focusImage: images[0].src,
      images: images
    };
  },

  //控制滚动的点击事件
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

  //删除图片
  handleDelete(e){
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    }, function(){
      swal("Deleted!", "Your imaginary file has been deleted.", "success");
    });
  },

  //选择图片展示
  handleFocus(e){
    this.setState({
      focusImage: e.target.src
    });
  },

  //设置主图(作为商品的主图)
  handleMain(e){
    swal("Good job!", "已将该图设为主图！", "success");
    console.log(e);
  },

  render() {
    const scrollLeft = (this.state.leftImages > 0);
    const scrollRight = (this.state.leftImages + 4 < this.state.images.length + 1);

    const imgList = this.state.images.map((img) =>
      <div className='inline img-wrap'>
        <img className={(img.src == this.state.focusImage) ? 'active' : ''} src={img.src} alt="" key={img.src} onClick={this.handleFocus}/>
        <i className='fa fa-trash-o' onClick={this.handleDelete}/> <i className={img.main ? 'fa fa-heart' : 'fa fa-heart-o'} onClick={this.handleMain}/>
      </div>
    );

    return (
      <div className="gallery-wrap">
        <div className="img-view">
          <img src={this.state.focusImage} alt="" style={{width: 250, height:200}}/>
        </div>
        <div className="scroll-view">
          <div className={scrollLeft ? "ctl-btn left " : "ctl-btn left frozen"} onClick={this.handleScroll}>{'<'}</div>
          <div className="middle-view inline">
            <div className='scroll-wrap'>
              {imgList}
              <div className="select-frame img-wrap inline">
                <div className="plus" style={{fontSize: 40}}>+</div>
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