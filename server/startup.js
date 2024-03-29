/**
 * 服务端的启动代码
 * Created by zephyre on 10/22/15.
 */


/**
 * 获得etcd的数据
 */
function resolveEtcdData() {
  const logger = BraavosCore.logger;

  // 获得etcd的地址. 优先查找Meteor.settings中的etcd.server. 如果没有找到, 则使用环境变量.
  // 如果二者都没有, 则使用localhost:2379
  let etcd_server;
  let etcd_auth = {};
  logger.debug(`Retrieving etcd server from Meteor.settings`);
  // etcd.server的格式: {host: '192.168.1.1', port: 2379}
  if (Meteor.settings.etcd) {
    let {host, port, user, password} = Meteor.settings.etcd.server || {};
    port = port || 2379;
    if (host && port) {
      etcd_server = `${host}:${port}`;
    }
    if (user && password) {
      etcd_auth = {user, password};
    }
  }

  logger.info(`etcd server: ${etcd_server}, user: ${etcd_auth ? etcd_auth['user'] : 'guest'}`);

  // 获取相关服务
  const servicesBuilder = _.reduce(Meteor.settings.etcd.services, (memo, f) => {
    return (_.keys(f).length > 1)
      ? memo.addEntry(_.values(f))
      : memo.addEntry(_.values(f)[0]);
  }, new EtcdHelper.EtcdServiceBuilder(etcd_server, etcd_auth));
  const services = servicesBuilder.build();

  // 获取其它配置
  const configBuilder = _.reduce(Meteor.settings.etcd.config, (memo, f) => {
    return (_.keys(f).length > 1)
      ? memo.addEntry(_.values(f))
      : memo.addEntry(_.values(f)[0]);
  }, new EtcdHelper.EtcdConfigBuilder(etcd_server, etcd_auth));
  const config = configBuilder.build();

  BraavosCore.RootConf = _.extend(services, config);
}

/**
 * 初始化MongoDB
 */
function initMongo() {

  const services = BraavosCore.RootConf.backends['mongo'];
  const servers = Object.keys(services).map(key=> {
    const {host, port} = services[key];
    return `${host}:${port}`;
  }).join(',');

  /**
   * 初始化braavos数据库对象
   */
  const helper = (dbKey, confKey, colls) => {
    const conf = BraavosCore.RootConf.braavos;
    const {db, user, password, replicaSet, readPreference, authSource} = conf['mongo'][dbKey];

    const options = {readPreference: readPreference || 'primaryPreferred', authSource: authSource || db};
    if (replicaSet) {
      options.replicaSet = replicaSet;
    }
    const optionsStr = Object.keys(options).map(key=>`${key}=${options[key]}`).join('&');
    const url = `mongodb://${user}:${password}@${servers}/${db}?${optionsStr}`;

    // 确定OPLOG_URL
    var connectionOptions = {};
    if (process.env.MONGO_OPLOG_URL) {
      connectionOptions.oplogUrl = process.env.MONGO_OPLOG_URL;
    }
    const driver = new MongoInternals.RemoteCollectionDriver(url, connectionOptions);

    BraavosCore.Database[confKey] = {};

    colls.forEach(({collName, alias, schema}) => {
      const c = new Mongo.Collection(collName, {_driver: driver, idGeneration: "MONGO"});
      if (schema) {
        c.attachSchema(schema);
      }
      BraavosCore.Database[confKey][alias ? alias : collName] = c;
    });

  };

  const Schema = BraavosCore.Schema;
  helper('braavos', 'Braavos', [
    {collName: 'Token', schema: Schema.Account.Token},
    {collName: "Seller", schema: Schema.Marketplace.Seller},
    {collName: 'TransactionLog', schema: Schema.Finance.TransactionLog},
    {collName: "Commodity", schema: Schema.Marketplace.Commodity},
    {collName: "Order", schema: Schema.Marketplace.Order},
    {collName: "CommoditySnapshot", schema: Schema.Marketplace.Commodity},
    {collName: "Country", schema: Schema.Marketplace.Country},
    {collName: "Locality", schema: Schema.Marketplace.Locality},
    {collName: "Column", Schema: Schema.Activity.Column},
    {collName: "LocalityArticle", Schema: Schema.Activity.Article}
  ]);
  helper('yunkai', 'Yunkai', [{collName: 'UserInfo', schema: Schema.Account.UserInfo}]);
  helper('hedy', 'Hedy', [
    {collName: 'Message', schema: Schema.Talk.Message},
    {collName: 'ConversationView', schema: Schema.Talk.ConversationView},
    {collName: 'Conversation'}
  ]);
}

/**
 * 初始化Yunkai Thrift服务
 */
function initYunkaiService() {
  const services = BraavosCore.RootConf.backends['yunkai'];
  if (!Object.keys(services)) {
    throw('Cannot find Yunkai services.');
  }
  const {host, port} = services[Object.keys(services)[0]];
  const module = Npm.require('yunkai');
  const Yunkai = module.Yunkai;
  const YunkaiTypes = module.YunkaiTypes;

  const apiSet = ['getUserById', 'login', 'createUserPoly', 'resetPassword', 'verifyCredential'];
  const client = ThriftHelper.createClient(Yunkai, host, port, apiSet, {name: 'yunkai', transport: 'framed'});
  BraavosCore.Thrift.Yunkai = {types: YunkaiTypes, client: client};
}

/**
 * 初始化IdGen Thrift服务
 */
function initIdGenService() {
  // (Deprecated) Used Thrift Service
  //const services = BraavosCore.RootConf.backends['idgen'];
  //if (!Object.keys(services)) {
  //  throw('Cannot find Idgen services.');
  //}
  //const {host, port} = services[Object.keys(services)[0]];
  //const module = Npm.require('idgen');
  //const IdGen = module.IdGen;
  //const IdGenTypes = module.IdGenTypes;
  //
  //const apiSet = ['ping', 'generate', 'getCounter', 'resetCounter'];
  //const client = ThriftHelper.createClient(IdGen, host, port, apiSet, {name: 'idgen', transport: 'framed'});
  //BraavosCore.Thrift.IdGen = {types: IdGenTypes, client: client};

  // (Recommended) Used Http Service
  const services = BraavosCore.RootConf.backends['idgen'];

  if (!Object.keys(services)) {
    throw('Cannot find Idgen services.');
  }
  const {host, port} = services[Object.keys(services)[0]];

  //const apiSet = ['ping', 'generate', 'getCounter', 'resetCounter'];
  const apiSet = ['ping', 'generate'];
  BraavosCore.Thrift.IdGen = {
    client: {
      generate: (generator) => HTTP.post(`http://${host}:${port}/generators/${generator}/ids`),
      ping: () => HTTP.get(`http://${host}:${port}/ping`)
    }
  };
}

/**
 * 初始化七牛的SDK
 */
function initQiniuSDK() {
  const qiniu = Meteor.npmRequire('qiniu');
  qiniu.conf.ACCESS_KEY = BraavosCore.RootConf.braavos.qiniu.accessKey;
  qiniu.conf.SECRET_KEY = BraavosCore.RootConf.braavos.qiniu.secretKey;
  BraavosCore.Qiniu = qiniu;
}

function initKadira() {
  const {appId, appSecret} = BraavosCore.RootConf.braavos.kadira;
  Kadira.connect(appId, appSecret);
}

Meteor.startup(()=> {
  // 设置winston
  const winston = Meteor.npmRequire('winston');
  // 默认日志级别: info
  BraavosCore.logger = new winston.Logger({
    level: (Meteor.settings.logging || {}).level || 'info',
    transports: [
      new (winston.transports.Console)()
    ]
  });

  // 获取etcd设置
  resolveEtcdData();

  // 数据库设置
  initMongo();

  // 初始化Yunkai
  initYunkaiService();

  // 初始化IdGen
  initIdGenService();

  // 初始化七牛SDK
  initQiniuSDK();

  // 初始化Kadira
  initKadira();
});
