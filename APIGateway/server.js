/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const Routes = require('./routes');
class Server {
  constructor() {
    this.app = express();
    this.http = http.Server(this.app);
  }

  /* Including app Routes starts */
  includeRoutes() {
    new Routes(this.app).routesConfig();
  }
  /* Including app Routes ends */

  startTheServer() {
    this.includeRoutes();
    const port = process.env.NODE_SERVER_POST || 8000;
    const host = process.env.NODE_SERVER_HOST || 'localhost';
    this.http.listen(port, host, () => {
      console.log(`Listening on http://${host}:${port}`);
    });
  }

  swaggerSetup() {
    let options = {
      swaggerDefinition: {
        info: {
          description: 'This is a sample server',
          title: 'Swagger',
          version: '1.0.0',
        },
        host: 'localhost:8000',
        //basePath: '/v1',
        basePath: '',
        produces: [
          "application/json",
          "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
          JWT: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: "",
          }
        }
      },
      basedir: __dirname, //app absolute path
      //files: ['./routes/**/*.js'] //Path to the API handle folder
      files: ['routes.js']
    };
    const expressSwagger = require('express-swagger-generator')(this.app);
    expressSwagger(options)
    this.app.listen(8000);
  }
}



module.exports = new Server();