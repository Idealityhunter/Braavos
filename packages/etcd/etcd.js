/**
 * etcd服务器工具类
 * Created by zephyre on 9/19/15.
 */

const Future = Npm.require('fibers/future');

EtcdHelper = (function () {

  const EtcdBaseBuilder = function (server, auth) {
    /**
     * etcd服务器地址
     */
    this.server = server;

    /**
     * etcd服务器的验证信息(basic认证: user:password)
     */
    this.auth = (() => {
      const {user, password} = auth;
      if (user) {
        return `${user}:${password ? password : ''}`;
      } else {
        return undefined;
      }
    })();

    /**
     * 需要获取的key列表. 形式: [ ["key", "alias"] ]
     * @type {Array}
     */
    this.entries = [];
  };

  EtcdBaseBuilder.prototype = Object.create(null, {
    /**
     * 添加服务项目
     * @param entry 需要添加的配置key. 有两种形式: "nebula", 或者["nebula", "nebulaAlias"]. 或者提供了别名机制.
     */
    addEntry: {
      value: function (entry) {
        if (typeof entry == "string")
          this.entries.push([entry, entry]);
        else if (Array.isArray(entry) && entry.length == 2)
          this.entries.push(entry);
        else
          throw("Invalid config entry");
        return this;
      },
      enumerable: true,
      configurable: true,
      writable: true
    },

    /**
     * 获取
     * @param method
     * @param url
     * @param options
     * @param validator
     */
    httpCall: {
      value: function (method, url, options, validator) {
        return new Promise((resolve, reject) => {
          HTTP.call(method, url, options, (err, ret)=> {
            if (validator) {
              const {valid, err: err2, ret: ret2} = validator(err, ret);
              valid ? resolve(ret2) : reject(err2);
            } else {
              err ? reject(err) : resolve(ret);
            }
          })
        })
      },
      enumerable: true,
      configurable: true,
      writable: true
    },

    /**
     * 以GET方法访问一个url
     * @param url
     * @param options
     * @param validator
     * @returns {*}
     */
    httpGet: {
      value: function (url, options, validator) {
        return this.httpCall('GET', url, options, validator);
      },
      enumerable: true,
      configurable: true,
      writable: true
    },

    etcdValidator: {
      value: function (err, ret) {
        return {
          valid: !err || (ret && ret.statusCode == 404),
          err: err,
          ret: ret
        }
      },
      enumerable: true,
      configurable: true,
      writable: true
    }
  });

  EtcdBaseBuilder.prototype.constructor = EtcdBaseBuilder;

  /**
   * 从etcd服务器获得配置项目的类
   * @param server
   * @param auth
   * @constructor
   */
  const EtcdConfigBuilder = function (server, auth) {
    EtcdBaseBuilder.call(this, server, auth);
  };

  EtcdConfigBuilder.prototype = Object.create(EtcdBaseBuilder.prototype, {
    /**
     * 向配置对象中写入一个键值对
     * @param object 待写入的配置对象
     * @param keyPath 有两种形式: "key", 和普通的写入一样. ["p1", "p2", "p3"]: 往o.p1.p2.p3中写入值
     * @param value
     */
    _setConfig: {
      value: function (object, keyPath, value) {
        if (typeof keyPath == "string") {
          object[keyPath] = value;
        } else if (_.isArray(keyPath) && keyPath.length > 0) {
          let thisObj = object;
          for (let i = 0; i < keyPath.length; i++) {
            let term = keyPath[i];
            if (i == keyPath.length - 1) {
              // 到达叶节点
              thisObj[term] = value;
            } else {
              if (thisObj[term] == undefined) {
                thisObj[term] = {};
              }
              thisObj = thisObj[term];
            }
          }
        }
      },
      enumerable: true,
      configurable: true,
      writable: true
    },

    /**
     * 从配置文件中读出一个键值对
     * @param object
     * @param keyPath
     * @private
     */
    _getConfig: {
      value: function (object, keyPath) {
        if (keyPath.length == 0 || object == undefined) {
          return object;
        } else {
          let key = _.first(keyPath);
          keyPath = _.tail(keyPath);
          return _getConfig(object[key], keyPath);
        }
      },
      enumerable: true,
      configurable: true,
      writable: true
    },

    /**
     * 将source合并到target中
     * @param target
     * @param source
     * @private
     */
    _mergeConfig: {
      value: function (target, source) {
        // 递归寻找source的叶节点
        let walk = (object, keyPath) => {
          if (keyPath == undefined) {
            keyPath = [];
          }

          if (_.isArray(object)) {
            // 到达数组型叶节点, 合并
            let ret = this._getConfig(object, keyPath);
            if (_.isArray(ret)) {
              _.union(ret, object);
            } else {
              // 直接写入
              this._setConfig(target, keyPath, object);
            }
          } else if (_.isObject(object)) {
            // 未到叶节点, 递归
            _.each(_.keys(object), function (key) {
              let newKeyPath = keyPath.slice();
              newKeyPath.push(key);
              walk(object[key], newKeyPath);
            });
          } else {
            // 到达普通叶节点, 合并
            this._setConfig(target, keyPath, object);
          }
        };

        walk(source);
      },
      enumerable: true,
      configurable: true,
      writable: true
    },

    /**
     * 处理etcd返回的原始数据, 生成字典形式的config对象
     * @param data
     * @private
     */
    _process: {
      value: function (data) {

        /**
         * 处理一个node. 如果该node是叶节点, 则返回其值, 否则, 递归调用.
         * @param node
         */
        let func = node => {
          if (node == undefined) {
            return {_: undefined};
          }
          let nodeKey = _.last(node.key.split("/"));

          let masterNode = {};

          if (Array.isArray(node.nodes) && node.nodes.length > 0) {
            let nodeValues = _.map(node.nodes, function (val) {
              return func(val);
            });
            let o = {};
            _.each(nodeValues, function (val) {
              let key = _.first(_.keys(val));
              o[key] = val[key];
            });
            masterNode[nodeKey] = o;
            return masterNode;
          } else {
            masterNode[nodeKey] = node.value;
            return masterNode;
          }
        };

        let ret = func(data.node);
        return _.first(_.values(ret));
      },
      enumerable: true,
      configurable: true,
      writable: true
    },


    /**
     * 获得etcd的配置数据
     */
    build: {
      value: function () {
        const future = new Future();

        // 访问所有的key, 得到: [ {alias: yunkai, data: [Object]} ]形式的数据
        Promise.all(this.entries.map(entry=> {
          const [key, alias]=entry;
          const url = `http://${this.server}/v2/keys/project-conf/${key}/?recursive=true`;
          const options = {};
          if (this.auth) {
            options['auth'] = this.auth;
          }
          return this.httpGet(url, options, this.etcdValidator).then(ret=> {
            return {key: alias, data: ret.data};
          });
        })).then(results=> results.reduce((memo, entry)=> {   // 将返回的数据汇总
            const o = {};
            o[entry.key] = this._process(entry.data);
            this._mergeConfig(memo, o);
            return memo;
          }, {})
        ).then(data=> {
          future.return(data)
        }).catch(err=> {
          future.throw(err);
        });

        future.wait();
        return future.get();
      },
      enumerable: true,
      configurable: true,
      writable: true
    }
  });

  EtcdConfigBuilder.prototype.constructor = EtcdConfigBuilder;

  /**
   * 从etcd获得服务发现信息
   * @param server
   * @param auth
   * @constructor
   */
  const EtcdServiceBuilder = function (server, auth) {
    EtcdBaseBuilder.call(this, server, auth);
  };

  EtcdServiceBuilder.prototype = Object.create(EtcdBaseBuilder.prototype, {

    _process: {
      value: function (data) {
        if (data.node == undefined) {
          return undefined;
        }
        let nodes = data.node.nodes;
        if (nodes == undefined) {
          nodes = [];
        }
        let nodeEntries = _.map(nodes, function (node) {
          let hash = _.last(node.key.split("/"));
          let tmp = node.value.split(":");
          let host = tmp[0];
          let port = tmp[1];
          return [hash, {host: host, port: parseInt(port)}];
        });
        return _.reduce(nodeEntries, function (memo, entry) {
          memo[entry[0]] = entry[1];
          return memo;
        }, {});
      },
      enumerable: true,
      configurable: true,
      writable: true
    },

    /**
     * 获得etcd的配置数据
     */
    build: {
      value: function () {
        const future = new Future();

        // 访问所有的key, 得到: [ {alias: yunkai, data: [Object]} ]形式的数据
        Promise.all(this.entries.map(entry=> {
          const [key, alias]=entry;
          const url = `http://${this.server}/v2/keys/backends/${key}?recursive=true`;
          const options = {};
          if (this.auth) {
            options['auth'] = this.auth;
          }
          return this.httpGet(url, options, this.etcdValidator).then(ret=> {
            return {key: alias, data: ret.data};
          });
        })).then(results=> results.reduce((memo, entry)=> {   // 将返回的数据汇总
            memo[entry.key] = this._process(entry.data);
            return memo;
          }, {})
        ).then(data=> {
          future.return(data)
        }).catch(err=> {
          future.throw(err);
        });

        future.wait();
        return {backends: future.get()};
      },
      enumerable: true,
      configurable: true,
      writable: true
    }

  });
  EtcdServiceBuilder.prototype.constructor = EtcdServiceBuilder;

  return {
    EtcdServiceBuilder: EtcdServiceBuilder,
    EtcdConfigBuilder: EtcdConfigBuilder
  };

})();
