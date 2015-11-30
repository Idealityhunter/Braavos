Package.describe({
  name: "lvxingpai:meteor-jcrop",
  version: "0.1.0",
  // Brief, one-line summary of the package.
  summary: "jQuery Jcrop repackaged for Meteor",
  // URL to the Git repository containing the source code for this package.
  git: "https://github.com/haizi-zh/meteor-jquery-jcrop.git",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.on_use(function (api) {
  api.use('jquery', 'client');
  api.add_files([
    'lib/Jcrop/js/jquery.Jcrop.min.js',
    'lib/Jcrop/css/jquery.Jcrop.css'
  ], 'client');
  api.addAssets('lib/Jcrop/css/Jcrop.gif', 'client');
});
