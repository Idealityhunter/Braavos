/**
 *
 * Created by zephyre on 10/18/15.
 */

ThriftHelper = {
  createClient: function(service, host, port, apiList, options) {
    var module = Npm.require('thrift-helper');
    var client = module.createClient(service, host, port, options);
    if (apiList) {
      return Async.wrap(client, apiList);
    }else {
      return client
    }
  }
};
