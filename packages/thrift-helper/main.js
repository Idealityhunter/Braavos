/**
 *
 * Created by zephyre on 10/18/15.
 */

ThriftHelper = (function () {
  const createClient = function (service, host, port, apiList, options) {
    const poolModule = Npm.require("generic-pool");
    const pool = poolModule.Pool({
      name: options && options.name || "default",
      refreshIdle: true,
      max: 4,
      min: 2,
      idleTimeoutMillis: 120000,
      log: false,

      create: function (callback) {
        const thrift = Npm.require("thrift");

        const transport_map = {
          framed: thrift.TFramedTransport,
          buffered: thrift.TBufferedTransport
        };

        const protocol_map = {
          binary: thrift.TBinaryProtocol,
          json: thrift.TJSONProtocol,
          compact: thrift.TCompactProtocol
        };

        const transport_type = (options && options.transport) ? transport_map[options.transport] : thrift.TBufferedTransport;
        const protocol_type = (options && options.protocol) ? protocol_map[options.protocol] : thrift.TBinaryProtocol;

        const connection = thrift.createConnection(host, port, {
          transport: transport_type,
          protocol: protocol_type
        });

        const poolObject = {
          id: Meteor.uuid(),
          connected: true,
        };

        connection.on('error', function (err) {
          poolObject.connected = false;
          poolObject.lastError = err;
          console.log(`Error occurred in Thrift connection: ${poolObject.id}, ${err}`);
          throw err;
        });

        poolObject.underlyingClient = thrift.createClient(service, connection);
        poolObject.underlyingConnection = connection;
        console.log(`Thrift connection ${poolObject.id} created`);

        callback(null, poolObject);
      },

      destroy: function (client) {
        console.log(`Closing Thrift connection ${client.id}...`);
        client.underlyingConnection.end();
        client.connected = false;
      },

      validate: function (client) {
        return client.connected;
      }
    });

    const handle = {};
    for (const api of apiList) {
      const pooledFunc = pool.pooled(function () {
        const args = arguments;
        const client = args[0];

        const self = client.underlyingClient;
        const realArgs = Array.prototype.slice.call(args, 1, -1);
        const realCallback = _.last(args);

        // 检查一下连接层的设置, 看看有没有出现连接失效的情况
        function checkConnectionCallback(err, ret) {
          if (err) {
            realCallback(err, null);
          } else if (!client.connected) {
            const e = Error("Thrift connection is lost");
            e.cause = client.lastError;
            realCallback(e, null);
          } else {
            realCallback(null, ret);
          }
        }

        try {
          self[api].apply(self, Array.prototype.concat(realArgs, [checkConnectionCallback]));
        } catch (err) {
          const e = Error("Thrift connection is lost");
          e.cause = client.lastError;
          checkConnectionCallback(e, null);
        }
      });

      handle[api] = function () {
        // 检查输入
        const callerArgs = arguments;
        const callerCallback = callerArgs[callerArgs.length - 1];
        const callerHasCallback = typeof callerCallback === 'function';

        // 真实的调用参数和回调函数
        const realArgs = Array.prototype.slice.call(callerArgs, 0, callerHasCallback ? -1 : undefined);
        const realCallback = callerHasCallback ? callerCallback : function (err, ret) {
        };

        // 实现错误重试的功能
        function impl(tryIndex) {
          // 第几次尝试, 以及原始的回调函数
          function wrapCallback(err, ret) {
            if (err) {
              // 是否是连接层的错误
              if (err.message == "Thrift connection is lost") {
                // 连接错误, 需要重试
                if (tryIndex < 5) {
                  setTimeout(function () {
                    impl(tryIndex + 1);
                  }, 100);
                } else {
                  realCallback(err, null);
                }
              } else {
                // 其它错误, 不再重试
                realCallback(err, null);
              }
            } else {
              realCallback(null, ret);
            }
          }

          pooledFunc.apply(null, Array.prototype.concat(realArgs, [wrapCallback]));
        }

        impl(0);
      };
    }
    return Async.wrap(handle, apiList);
  };

  return {
    createClient: createClient
  }
})();
