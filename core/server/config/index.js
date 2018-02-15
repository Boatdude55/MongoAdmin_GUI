module.exports = {
  db: 'mongodb://0.0.0.0/data',//Fix uri encoding
  dbInit: "mongod -config /etc/mongod.conf",
  dbShutDown: "mongod -config /etc/mongod.conf --shutdown",
  sessionSecret: 'developmentSessionSecret'
};