const httpProxy = require('express-http-proxy');

const userServiceProxy = httpProxy('http://localhost:4000');

class Routes {
  constructor(app) {
    this.app = app;
  }

  /* creating app Routes starts */
  appRoutes() {

    /** 
      *@route GET /updateMobileNumber
       *@group User - User API!
     */

    this.app.get('/updateMobileNumber', (req, res) => {

      userServiceProxy(req, res)
    })
    /** 
     *@route POST /udpateCustomerInfo
      *@group User 
    */
    this.app.post('/udpateCustomerInfo', (req, res) => {
      userServiceProxy(req, res)
    })
    /** 
    *@route POST /sendCode
     *@group User - Resend Code!
   */
    this.app.post('/sendCode', (req, res) => {
      userServiceProxy(req, res)
    })
    /** 
        *@route POST /resetCount
         *@group User
       */
    this.app.post('/resetCount', (req, res) => {
      userServiceProxy(req, res)
    })
    /** 
    *@route POST /smsVerification
     *@group User
   */
    this.app.post('/smsVerification', (req, res) => {
      userServiceProxy(req, res)
    })

    this.app.post('/licenseUpload', (req, res) => {

      userServiceProxy(req, res)
    })
    this.app.post('/video', (req, res) => {
      // console.log('hii')
      userServiceProxy(req, res)
    })
    /** 
    *@route POST /creditcardInfo
     *@group User 
   */
    this.app.post('/creditcardInfo', (req, res) => {
      userServiceProxy(req, res)
    })
    /** 
    *@route GET /MovetoUser
     *@group User 
   */
    this.app.get('/MovetoUser', (req, res) => {
      userServiceProxy(req, res)
    })
    /** 
       *@route POST /register
        *@group User 
      */
    this.app.post('/register', (req, res) => {
      userServiceProxy(req, res);
    });

    this.app.post('/login', (req, res) => {
      userServiceProxy(req, res);
    });

    this.app.get('/', (req, res) => {
      res.send('Hello')
    })


  }

  routesConfig() {
    this.appRoutes();
  }
}

module.exports = Routes;
