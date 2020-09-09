const process = require('process')
const utils = require('./utils')

const CUSTOM_WORDS = [
  'bufferpool', 'caos', 'filesystem', 'hostname', 'hwm', 'inodes',
  'isr', 'ipv4', 'ipv6', 'metadata', 'mtu', 'namespace', 'newrelic', 'nr', 'offline',
  'pid', 'tbd', 'unreplicated', 'vm', 'https',

  // AWS
  'arn', 'aws', 'serverless', 'sns', 'sqs', 's3', 'datastore', '4xx', '5xx', 'ec2',
  'dns', 'ebs', 'vpc', 'hypervisor', 'virtualization', 'appsync', 'app', 'ql', 'efs',
  'autoscaling', 'iam', 'apigateway', 'api', 'trustedadvisor', 'qldb', 'ios', 'occ',
  'workgroup', 'mq', 'sparql', 'iops', 'forecasted','waf', 'webacl', 'rulegroup', 'ecs',
  'elasticbeanstalk', 'p10|p50|p75|p85|p90|p95|p99|p99_9', '2xx', '3xx', 'emr', 'wafv2', 'v2',
  '53resolver', 'db0',

  'iowait', 'irq', 'softirq', 'util', 'elasti', 'elasticache', 'unfetched', 'defrag',

  'route53', 'tls', 'lcus', 'elb', '3xx', '2xx', 'nlb',  'kinesis', 'firehose',
  'iot', 'unsubscribe','mebibytes', 'kms', 'kibana', 'searchable',
  'vpn', 'ses', 'dynamodb', 'directconnect', 'crc',
  'igw', 'sg', 'saml', 'msk',
  'misconfigured', 'dialable',
  'cognito',
  'transitgateway', 'blackhole', // and revelations 🎵

  'rds', 'binlog', 'ddl', 'sz', 'iosps', 'kbps', 'rrqm', 'tps', 'wrqm', 'wr', 'dml', 'ds',
  'rsvd', 'surp', 'nonpaged', 'write', 'back', 'virt', 'priv', 'postgre', 'vcpu',
  'kinesisanalytics', 'kpus?', 'mediaconvert', 'hd', 'uhd', '8k', 'errored', 'transcoding',

  // Azure
  'sku', 'rss', 'rediscache', 'redis', 'apimanagement', 'timedout', 'resourcename', 'resourcetype',
  'datafactory',
  'cancelled',
  'machinelearning', 'gpu', 'snat',
  'servicebus','deadlettered',
  'costmanagement', 'php', 'storageaccount', 'successe2e', 'expressroute', 'admin', 'arp', 'qos',
  'eventhub', 'logicapps', 'workflow', 'kube', 'frontdoor', 'keyvault', 'shoebox',
  'appgateway', 'servicefabric',

  // Azure app service
  'appservice', 'gen0', 'gen1', 'gen2', 'http101', 'http401', 'http403', 'http404', 'http406',
  'php',

  'mariadb', 'mysql', 'postgre', 'serverlog',

  'p2s', 'roundtrip', 'ddos', 'udp', 'ddo',
  'dtu', 'dwu', 'xtp', 'dw',

  // GCP
  'gcp',
  'vpcaccess',
  'bfd', 'bgp',
  'dataflow', 'vcpus?',
  'appengine', 'memcache', 'centi', 'mcu',
  'bigquery',
  'acked', 'unacked',
  'preemptible',
  'firebasedatabase', 'firebasestorage', 'firebasehosting', 'firestore', 'firebase',

  // GCP > LoadBalancer

  'loadbalancer', 'rtt', 'l3', 'ssl',
  'dataproc', 'hdfs', 'datanodes', 'gibibytes', 'apps', 'nodemanagers', 'uuid',

  'unicast',
  // Docker
  'pids', 'ecs',

  // HAProxy
  'haproxy', 'redispatch', 'http500', 'http300', 'http400', 'http200', 'http100', 'frontend',
  'backend',

  // MongoDB
  'mongo', 'nindexes', 'config', 'wiredtiger', 'mongos', 'repl', 'getmores', 'opscountrepl',
  'getmore', 'fastmod', 'idhack', 'mem', 'oplog', 'globallock', 'mongod', 'wtimeouts',
  'getlasterror', 'millis', 'eval', 'wtime', 'opcounts', 'lookaside', 'wtime', 'replset',
  'prefetch', 'preload', 'mmapv1', 'queryexecutor',

  // Consul
  'datacenter', 'p99', 'p95', 'p90', 'p75', 'p25', 'rpc', 'kv', 'acl', 'txns',
  'goroutines', 'txn', 'ip', 'gc',

  // OracleDB
  'gc', 'logon', 'logons', 'centiseconds', 'dbwr', 'pga', 'sql', 'freeable', 'sga',
  'dict', 'uga', 'tablespace', 'cdb', 'pdb', 'datafiles',

  // PostgreSQL
  'backend', 'bgwriter', 'bufferpin', 'fsync', 'maxwait', 'mssql', 'pgbouncer',
  'postgres', 'postgresql', 'preconnect',

  // F5
  'f5', 'virtualserver', 'cmp', 'clientside', 'tmm', 'conns', 'connq', 'edm',

  // Elasticsearch
  'elasticsearch', 'rollup', 'jvm', 'threadpool', 'fs', 'indices', 'translog', 'mem',

  // Memcached
  'auth', 'badval', 'cas', 'cmd', 'cmds', 'conns', 'decr', 'decrs', 'incr', 'incrs',
  'maxbytes', 'mem', 'memcached', 'num', 'refcount', 'rusage',

  // RabbitMQ
  'rabbitmq', 'ack', 'vhost',

  // MSSQL
  'mssql', 'preconnect',

  // Varnish
  'alloc', 'allocs', 'backend', 'backends', 'chuncked', 'dups', 'eof', 'esi', 'gunzip',
  'gzip', 'hcb', 'htt', 'lru', 'mempool', 'mgt', 'objectcores', 'objectheads', 'oustanding',
  'p10', 'p20', 'pipereq', 'req', 'reqs', 'sess', 'shm', 'summs', 'txn', 'unresurrected',
  'vcl', 'vmods',

  // Couchbase
  'couchbase', 'queryengine', 'cas', 'failover', 'vbucket', 'cmd', '80th', '95th', '99th',

  // Casssandra
  'memtables', 'memtable', 'unavailables', 'keyspace', 'compactions',

  // MySql
  'mysql', 'pos', 'errno', 'tmp', 'rnd', 'innodb', 'fsyncs', 'myisam', 'lowmem', 'stmt',

  // Redis
  'aof', 'rdb', 'bgsave', 'pubsub', 'lua', 'bgrewrite',

  // Nginx
  'nginx',

  // FSI
  'fsi',

  // Kubernetes
  'kubernetes', 'k8s', '8s', 'controllermanager', 'apiserver', 'etcd', 'mvcc', 'grpc',
  'fds', 'api', 'workqueue', 'daemonset', 'misscheduled', 'replicaset', 'statefulset', 
  'cfs', 'hugepages',
  
  //VSphere
  'vsphere', 'perf', 'oio', 'sioc', 'vmmemctl', 'costop', 'multicast', 'protos', 'hbr', 
  'pbc', 'terabytes', 'vflash', 'dks', 'crypto', 'balloned', 'ssd', 'maxlimited',
  'vmmemctltarget', 'pnic', 'nas', 'datastores', 'drs', 'vmotion', 'das', 'vmop', 'numsv',
  'numxv', 'numv','hb'
]

const SpellChecker = require('simple-spellchecker')
var Dictionary = SpellChecker.getDictionarySync('en-US')
Dictionary.addRegex(new RegExp(`^(?:${CUSTOM_WORDS.join('|')})*$`))

function checkSpec(def) {
  // TODO: it would be nice to infer from schema those attributes that are candidates
  // to contain spell errors.
  const integrationName = def.integrationName

  checkComposedName(integrationName, integrationName, 'Integration name')
  checkComposedName(def.owningTeam, integrationName, 'Owning team name')

  def.entities.forEach(entity => {
    checkComposedName(entity.entityType, integrationName, 'Entity type')

    if (entity.migrationInformation) {
      checkComposedName(
        entity.migrationInformation.legacyProviderAttribute, integrationName,
        'Entity legacy provider attribute')
    }

    entity.metrics.forEach(metric => {
      checkComposedName(metric.name, integrationName, 'Metric')
      checkComposedName(metric.unit, integrationName, 'Metric unit')
      checkComposedName(metric.migrationInformation.legacyEventType, integrationName, 'Metric legacy event type')
    })

    entity.tags.forEach(tag => {
      checkComposedName(tag.name, integrationName, 'Tag')
      tag.migrationInformation.legacyEventTypes.forEach(legacyEventType => checkComposedName(
        legacyEventType, integrationName, 'Tag legacy event type'))
    })

    if (entity.internalAttributes) {
      entity.internalAttributes.forEach(internalAttribute => {
        checkComposedName(internalAttribute.name, integrationName, 'Internal attribute')
        internalAttribute.migrationInformation.legacyEventTypes.forEach(legacyEventType => checkComposedName(
          legacyEventType, integrationName, 'Internal attribute legacy event type'))
      })
    }

    if (entity.ignoredAttributes) {
      entity.ignoredAttributes.forEach(ignoredAttribute => checkComposedName(
        ignoredAttribute, integrationName, 'Ignored attribute'))
    }
  })
}

function checkComposedName(composedName, integrationName, type) {
  splitComposedName(composedName).forEach(word => {
    const errorMessage = `${type} ${composedName} in ${integrationName} definition contains an spell error: ${word}`
    checkWord(word, errorMessage)
  })
}

function checkWord(word, errorMessage) {
  if (utils.isNumber(word) || word.includes('*')) {
    // Don't check against the dictionary if it's a number or a wildcard pattern
    return
  }

  const result = Dictionary.checkAndSuggest(word.toLowerCase())

  if (result.misspelled) {
    const suggestions = result.suggestions ? result.suggestions.join(', ') : 'None'

    console.error(`ERROR - ${errorMessage}`)
    console.error(`Suggestions: ${suggestions}`)

    process.exit(1)
  }
}

/**
 * Split a composed name in each of its word.
 * Words could be separated by ., -, or camelCase.
 * Input: aws-foo.barBiz
 * Expected output: ['aws'. 'foo', 'bar', 'biz']
 */
function splitComposedName(str){
  var result = []

  str.split(/[.-]+/).forEach(camelCased => {
    result.push(...camelCased.split(/([A-Z][a-z]+|[0-9]+[a-z]+)/).filter(e => e))
  })

  return result;
}

utils.getAllDefinitions(def => checkSpec(def))
