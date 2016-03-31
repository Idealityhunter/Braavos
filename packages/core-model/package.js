Package.describe({
  name: "lvxingpai:core-model",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Schemas of Lvxingpai apps",
  // URL to the Git repository containing the source code for this package.
  git: "https://github.com/Lvxingpai/core-model-meteor",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function (api) {
  api.versionsFrom("1.2.1");
  api.use("ecmascript");
  api.use("aldeed:simple-schema");
  api.imply("aldeed:simple-schema");

  api.addFiles(["core-model.js", "lib/misc.js", "lib/geo.js", "lib/finance.js", "lib/account.js",
    "lib/marketplace.js", "lib/talk.js", "lib/activity.js"], ["client", "server"]);
  api.export("CoreModel", ["client", "server"])
});

Package.onTest(function (api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("lvxingpai:core-model");
  api.addFiles("core-model-tests.js");
});
