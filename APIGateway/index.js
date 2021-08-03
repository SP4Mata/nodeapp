const DotEnv = require('dotenv');

DotEnv.config();

const Server = require('./server');
Server.swaggerSetup();
Server.startTheServer();