/**
 * 服务端的启动代码
 * Created by zephyre on 10/22/15.
 */

/**
 * 获得etcd的数据
 */
function resolveEtcdData() {
  const url = `${process.env['ETCD_HOST']}:${process.env['ETCD_PORT']}`;

  const services = new EtcdHelper.EtcdServiceBuilder(url)
    .addEntry(['mongo-dev', 'mongo'])
    .addEntry('yunkai')
    .addEntry('smscenter')
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
      const c = new Mongo.Collection(collName, {_driver: driver});
      if (schema) {
        c.attachSchema(schema);
      }
      BraavosCore.Database[confKey][alias ? alias : collName] = c;
    });
  };

  const Schema = BraavosCore.Schema;
  helper('braavos', 'Braavos', [{collName: 'RegisterToken', schema: Schema.RegisterToken}]);
  helper('yunkai', 'Yunkai', [{collName: 'UserInfo'}])
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

  const apiSet = ['getUserById', 'login'];
  const client = ThriftHelper.createClient(Yunkai, host, port, apiSet, {transport: 'framed'});
  BraavosCore.Thrift.Yunkai = {types: YunkaiTypes, client: client};
}

Meteor.startup(()=> {
  console.log('Server startup');
  // 获取etcd设置
  resolveEtcdData();
  // 数据库设置
  initMongo();
  // 初始化Yunkai
  initYunkaiService();
});
