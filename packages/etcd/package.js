Package.describe({
  name: 'lxp:etcd',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Helpers for etcd',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.use('http');
  api.use('underscore');

  Npm.depends({
    fibers: '1.0.7'
  });

  api.addFiles('etcd.js', 'server');
  api.export('EtcdHelper', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lxp:etcd');
  api.addFiles('etcd-tests.js');
});