Package.describe({
  name: 'lvxingpai:braavos-core',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'The core part of Braavos',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.use('aldeed:simple-schema');
  api.use('lvxingpai:core-model');
  api.use('meteorhacks:subs-manager', 'client');

  // Init
  api.addFiles('braavos-core.js');
  api.addFiles('braavos-core-server.js', 'server');
  api.addFiles('braavos-core-client.js', 'client');

  api.export('BraavosCore');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lxp:braavos-core');
  api.addFiles('braavos-core-tests.js');
});
