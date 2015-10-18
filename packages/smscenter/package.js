Package.describe({
  name: 'lxp:smscenter',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'SmsCenter',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.addFiles('smscenter.js');
  api.export('SmsCenter', 'server');
  api.export('SmsCenterTypes', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lxp:smscenter');
  api.addFiles('smscenter-tests.js');
});
