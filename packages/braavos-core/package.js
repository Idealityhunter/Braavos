Package.describe({
  name: 'lxp:braavos-core',
  version: '0.0.1',
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


  api.addFiles('braavos-core.js');

  // Init
  api.addFiles('common/global.js');

  // Schemas
  api.addFiles([
    'common/schema/geo.js',
    'common/schema/trade.js',
    'common/schema/account.js'
  ]);

  api.export('BraavosCore');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lxp:braavos-core');
  api.addFiles('braavos-core-tests.js');
});
