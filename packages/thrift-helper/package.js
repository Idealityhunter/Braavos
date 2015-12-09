// Write your package code here!
Package.describe({
  name: 'lxp:thrift-helper',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Thrift helper',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "thrift": "0.9.3",
  "generic-pool": "2.2.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.addFiles('main.js', 'server');
  api.export('ThriftHelper', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lxp:thrift-helper');
  api.addFiles('package-tests.js');
});
