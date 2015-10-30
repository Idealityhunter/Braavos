
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
  handleScroll(e){
    if ($(e.target).hasClass('frozen')) return ;
    let self = this;
    let operator = $(e.target).hasClass('left') ? '+' : '-';
    $('.scroll-wrap').animate({
      marginLeft: operator + '=90px'
    }, function(e){
      let marginLeft = this.style.marginLeft;
      marginLeft = marginLeft.substring(0, marginLeft.length - 2);
      if (parseInt(marginLeft) < 0){
        self.setState({
          left: true
        });
      }else{
        self.setState({
          left: false
        });
      }
      if (Math.abs(parseInt(marginLeft) / 90) + 3 < images.length){
        self.setState({
          right: true
        });
      }else{
        self.setState({
          right: false
        });
      }
    });
  },

  getInitialState() {
    return {
      focusImage: images[0].src,
      images: images,
      left: false,
      right: images.length > 3
    };
  },

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

  handleFocus(e){
    this.setState({
      focusImage: e.target.src
    });
  },

  handleMain(e){
    swal("Good job!", "已将该图设为主图！", "success");
    console.log(e);
  },

  render() {
    let imgList = this.state.images.map((img) =>
      <div className='inline img-wrap'>
        <img className={(img.src == this.state.focusImage) ? 'active' : ''} src={img.src} alt="" key={img} onClick={this.handleFocus}/>
        <i className='fa fa-trash-o' onClick={this.handleDelete}/> <i className={img.main ? 'fa fa-heart' : 'fa fa-heart-o'} onClick={this.handleMain}/>
      </div>
    );

    return (
      <div className="gallery-wrap">
        <div className="img-view">
          <img src={this.state.focusImage} alt="" style={{width: 250, height:200}}/>
        </div>
        <div className="scroll-view">
          <div className={this.state.left ? "ctl-btn left " : "ctl-btn left frozen"} onClick={this.handleScroll}>{'<'}</div>
          <div className="middle-view inline">
            <div className='scroll-wrap'>
              {imgList}
              <div className="select-frame img-wrap inline">
                <div className="plus" style={{fontSize: 40}}>+</div>
              </div>
            </div>
          </div>
          <div className={this.state.right ? "ctl-btn right " : "ctl-btn right frozen"} onClick={this.handleScroll}>></div>
        </div>
      </div>
    );
  }
});

export const CommodityGallery = commodityGallery;