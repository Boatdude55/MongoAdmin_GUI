module.exports = {
  db: "mongodb://"+process.env.IP+"/db/data",
  dbInit: "mongod -config /etc/mongod.conf",
  dbShutDown: "mongod -config /etc/mongod.conf --shutdown",
  sessionSecret: 'developmentSessionSecret'
};