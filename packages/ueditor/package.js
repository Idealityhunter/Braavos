Package.describe({
  name: 'zephyre:ueditor',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('jquery', 'client');
  api.addFiles(['umeditor.config.js', 'umeditor.min.js', 'imageUpload.js', 'themes/default/css/umeditor.css'
    , 'themes/default/css/edui-scale.css', 'lang/zh-cn/zh-cn.js'], 'client');

  // 加载静态文件(包括图像, css, 以及部分js)
  function loadHelper(assetNames, path) {
    api.addAssets(assetNames.map(function(name) {
      return path+name;
    }), 'client');
  }

  // theme images
  loadHelper(['caret.png', 'close.png', 'icons.gif', 'icons.png', 'ok.gif', 'pop-bg.png', 'spacer.gif'
    , 'videologo.gif'], 'themes/default/images/');

  // lang files
  loadHelper(['copy.png', 'imglabel.png', 'localimage.png', 'music.png', 'upload.png'], 'lang/zh-cn/images/');

  // image dialogs
  loadHelper(['image.js', 'image.css'], 'dialogs/image/');
  loadHelper(['close.png', 'upload1.png', 'upload2.png'], 'dialogs/image/images/');

  // link
  loadHelper(['link.js'], 'dialogs/link/');

  // map
  loadHelper(['map.html', 'map.js'], 'dialogs/map/');

  // formula
  loadHelper(['formula.css', 'formula.html', 'formula.js'], 'dialogs/formula/');
  loadHelper(['formula.png'], 'dialogs/formula/images/');

  // video
  loadHelper(['video.css', 'video.js'], 'dialogs/video/');
  loadHelper(['center_focus.jpg', 'left_focus.jpg', 'none_focus.jpg', 'right_focus.jpg'], 'dialogs/video/images/');

  // emotion
  loadHelper(['emotion.css', 'emotion.js'], 'dialogs/emotion/');
  loadHelper(['0.gif', 'bface.gif', 'cface.gif', 'fface.gif', 'jxface2.gif', 'neweditor-tab-bg.png', 'tface.gif'
    , 'wface.gif', 'yface.gif'], 'dialogs/emotion/images/');
});

