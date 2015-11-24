/**
 * 服务端的启动代码
 * Created by zephyre on 10/22/15.
 */

/**
 * 获得etcd的数据
 */
function resolveEtcdData() {
  // 通过环境变量获得etcd地址, 默认为localhost:2379
  const url = `${process.env['ETCD_HOST'] || "localhost"}:${process.env['ETCD_PORT'] || 2379}`;

  const services = new EtcdHelper.EtcdServiceBuilder(url)
    .addEntry(['mongo-dev', 'mongo'])
    .addEntry(['yunkai-dev', 'yunkai'])
    .addEntry('smscenter')
    .addEntry('idgen')
    .addEntry(['hedy-base', 'hedy'])
    .addEntry(['hedy-dev', 'hedy'])
    .build();
  const config = new EtcdHelper.EtcdConfigBuilder(url).addEntry('braavos').build();
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
    const {db, user, password, replicaSet, readPreference} = conf['mongo'][dbKey];

    const options = {readPreference: readPreference || 'primaryPreferred', authSource: db};
    if (replicaSet) {
      options.replicaSet = replicaSet;
    }
    const optionsStr = Object.keys(options).map(key=>`${key}=${options[key]}`).join('&');
    const url = `mongodb://${user}:${password}@${servers}/${db}?${optionsStr}`;
    const driver = new MongoInternals.RemoteCollectionDriver(url);

    BraavosCore.Database[confKey] = {};

    colls.forEach(({collName, alias, schema}) => {
      const c = new Mongo.Collection(collName, {_driver: driver, idGeneration: "MONGO"});
      if (schema) {
        c.attachSchema(schema);
      };
      BraavosCore.Database[confKey][alias ? alias : collName] = c;
    });

  };

  const Schema = BraavosCore.Schema;
  helper('braavos', 'Braavos', [
    {collName: 'Token', schema: Schema.Account.Token},
    {collName: "Seller", schema: Schema.Marketplace.Seller},
    {collName: "Commodity", schema: Schema.Marketplace.Commodity},
    {collName: "Country", schema: Schema.Marketplace.Country},
    {collName: "Locality", schema: Schema.Marketplace.Locality}
  ]);
  helper('yunkai', 'Yunkai', [{collName: 'UserInfo', schema: Schema.Account.UserInfo}]);
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

  const apiSet = ['getUserById', 'login', 'createUserPoly'];
  const client = ThriftHelper.createClient(Yunkai, host, port, apiSet, {transport: 'framed'});
  BraavosCore.Thrift.Yunkai = {types: YunkaiTypes, client: client};
}

/**
 * 初始化IdGen Thrift服务
 */
function initIdGenService() {
  const services = BraavosCore.RootConf.backends['idgen'];
  if (!Object.keys(services)) {
    throw('Cannot find Idgen services.');
  }
  const {host, port} = services[Object.keys(services)[0]];
  const module = Npm.require('idgen');
  const IdGen = module.IdGen;
  const IdGenTypes = module.IdGenTypes;

  const apiSet = ['ping', 'generate', 'getCounter', 'resetCounter'];
  const client = ThriftHelper.createClient(IdGen, host, port, apiSet, {transport: 'framed'});
  BraavosCore.Thrift.IdGen = {types: IdGenTypes, client: client};
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

Meteor.startup(()=> {
  console.log('Server startup');
  // 获取etcd设置
  resolveEtcdData();
  // 数据库设置
  initMongo();
  // 初始化Yunkai
  initYunkaiService();

  // 初始化IdGen
  initIdGenService();

  initQiniuSDK();

});
