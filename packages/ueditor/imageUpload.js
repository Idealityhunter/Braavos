/**
 *
 * Created by zephyre on 11/24/15.
 */

var sendAndInsertImage = function (file, editor) {
  // drop或者paste的时候, 会触发这个函数
  const reader = new FileReader();
  const loadingId = `loading_${Meteor.uuid()}`;
  editor.execCommand('inserthtml', `<img class="loadingclass" id="${loadingId}" src="/images/spinner.gif">`);
  reader.onload = () => {
    const result = reader.result;
    // TODO 考虑这种情况: 将来umeditor可能会用在非commodity的场合. 所以, 应该考虑一下bucketKey和prefix的命名.
    const bucketKey = "commodity";
    const imageData = atob(result.replace(/^data:image\/[a-z]+;base64,/, ""));
    const key = `commodity/images/${CryptoJS.MD5(imageData).toString()}`;

    Meteor.call("qiniu.getUploadToken", bucketKey, key, {}, (err, ret) => {
      if (!err && ret) {
        // 组建form
        const form = new FormData();
        form.append("key", ret.key);
        form.append("token", ret.token);
        form.append("file", file);

        // 发送post请求
        $.ajax({
          url: 'http://upload.qiniu.com',
          data: form,
          contentType: false,
          processData: false,
          type: 'POST',
          success: function (data, textStatus, jqXHR) {
            // TODO 修改成功
            editor.execCommand('insertimage', {
              src: ret.url,
              _src: ret.url
            });
            $(`#${loadingId}`).remove();
          },
          error(jqXHR, textStatus, errorThrown){
            // TODO 修改失败
            $(`#${loadingId}`).remove();
          }
        });
      } else {
        // TODO 修改失败
      }
    });
  };
  reader.readAsDataURL(file);
};
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
        // 新建一个input,并且绑定上传事件
        if ($('#ueditorUploadImage').length == 0) {
          this._$el.after('<input type="file" id="ueditorUploadImage" class="uploadFile" style="display:none"/>');
          $('#ueditorUploadImage').on('change', function (e) {
            const file = e.target.files[0] || e.dataTransfer.files[0];
            if (file) {
              sendAndInsertImage(file, me);
            }
          });
        }
        ;

        $('#ueditorUploadImage').trigger('click');
      },
      title: this.getLang('labelMap')['image'] || ''
    });

    this.addListener('selectionchange', function () {
      var state = this.queryCommandState('image');
      $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
  });

