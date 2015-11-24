/**
 *
 * Created by zephyre on 11/24/15.
 */
/**
 * @description
 * 1.拖放文件到编辑区域，自动上传并插入到选区
 * 2.插入粘贴板的图片，自动上传并插入到选区
 * @author Jinqn
 * @date 2013-10-14
 */
UM.plugins['autoupload'] = function () {

  var me = this;

  me.setOpt('pasteImageEnabled', true);
  me.setOpt('dropFileEnabled', true);
  var sendAndInsertImage = function (file, editor) {
    // drop或者paste的时候, 会触发这个函数
    const reader = new FileReader();
    let result = null;
    reader.onload = () => {
      const result = reader.result;
      console.log(`Drag/paste done. Ready to upload. Length: ${result.length}`);
      console.log(result);
      const picLink = 'http://7sbm17.com1.z0.glb.clouddn.com/000003013081659c4b649a597b945da3?imageView2/1/w/200';
      editor.execCommand('insertimage', {
        src: picLink,
        _src: picLink
      });
    };
    reader.readAsDataURL(file);

    //const cb = function () {
    //  editor.execCommand('insertimage', {
    //    src: picLink,
    //    _src: picLink
    //  });
    //};
    //formUpload(file, cb);
  };

  function getPasteImage(e) {
    return e.clipboardData && e.clipboardData.items && e.clipboardData.items.length == 1 && /^image\//.test(e.clipboardData.items[0].type) ? e.clipboardData.items : null;
  }

  function getDropImage(e) {
    return e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null;
  }

  me.addListener('ready', function () {
    if (window.FormData && window.FileReader) {
      var autoUploadHandler = function (e) {
        var hasImg = false,
          items;
        //获取粘贴板文件列表或者拖放文件列表
        items = e.type == 'paste' ? getPasteImage(e.originalEvent) : getDropImage(e.originalEvent);
        if (items) {
          var len = items.length,
            file;
          while (len--) {
            file = items[len];
            if (file.getAsFile) file = file.getAsFile();
            if (file && file.size > 0 && /image\/\w+/i.test(file.type)) {
              sendAndInsertImage(file, me);
              hasImg = true;
            }
          }
          if (hasImg) return false;
        }

      };
      me.getOpt('pasteImageEnabled') && me.$body.on('paste', autoUploadHandler);
      me.getOpt('dropFileEnabled') && me.$body.on('drop', autoUploadHandler);

      //取消拖放图片时出现的文字光标位置提示
      me.$body.on('dragover', function (e) {
        if (e.originalEvent.dataTransfer.types[0] == 'Files') {
          return false;
        }
      });
    }
  });

};


UM.registerUI('image',
  function () {
    var me = this;
    var $btn = $.eduibutton({
      icon: 'image',
      click: function () {
        // TODO 弹出input对话框, 选择图像文件
        console.log('TODO: input image file');
      },
      title: this.getLang('labelMap')['image'] || ''
    });

    this.addListener('selectionchange', function () {
      var state = this.queryCommandState('image');
      $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
  });
