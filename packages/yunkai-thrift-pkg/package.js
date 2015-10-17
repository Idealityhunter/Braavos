Package.describe({
  summary: "yunkai thrift api for meteor server",
  version: "1.0.0"
});


/* This defines your actual package */
Package.onUse(function (api) {
  api.versionsFrom('0.9.0');
  api.use('underscore', 'server');
  api.addFiles('yunkai-thrift.js', 'server');
  api.export('thrift', 'server');
});