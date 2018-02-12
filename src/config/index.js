module.exports = {
  db: 'mongodb://'+process.env.IP+'/data',
  dbInit: "mongod --bind_ip=$IP --dbpath=data --nojournal --rest '$@'",
  dbShutDown: "mongod --shutdown",
  sessionSecret: 'developmentSessionSecret'
};