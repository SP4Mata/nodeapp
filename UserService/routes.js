const routeHandler = require('./handlers/route-handler');

const multer = require('multer');
const path = require('path')

// For images

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "LicenseFront") {
      cb(null, './public/Front');
    }
    else if (file.fieldname === "LicenseBack") {
      cb(null, './public/Back')
    }


  },
  filename: function (req, file, cb) {
    if (file.fieldname === "LicenseFront") {
      cb(null, file.fieldname + Math.random() + path.extname(file.originalname))
    }
    else if (file.fieldname === "LicenseBack") {
      cb(null, file.fieldname + Math.random() + path.extname(file.originalname))
    }

  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20000000
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true)
    }
    else {
      return cb(new Error('Invalid File'), false)
    }
  }
})

const storage_video = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Video');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Math.random() + path.extname(file.originalname))
  }
})

const upload_video = multer({
  storage: storage_video,
  limits: {
    fileSize: 10000000
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error('Please upload a video'))
    }
    cb(undefined, true)
  }
})


class Routes {
  constructor(app) {
    this.app = app;
  }

  /* creating app Routes starts */
  appRoutes() {
    this.app.get('/getMessage', routeHandler.getName)
    this.app.post('/register', routeHandler.registerRouteHandler);

    this.app.post('/login', routeHandler.loginRouteHandler);
    this.app.get('/user/:userId', routeHandler.getUserDetailsHandler);
    this.app.get('/updateMobileNumber', routeHandler.getCustomerMobileNumber)
    this.app.post('/udpateCustomerInfo', routeHandler.updateCustomerInfo);
    this.app.post('/sendCode', routeHandler.SendCode);
    this.app.post('/resetCount', routeHandler.ResetCount)
    this.app.post('/smsVerification', routeHandler.SMSVerification)
    this.app.post('/licenseUpload', upload.fields([{ name: 'LicenseFront', maxCount: 1 }, { name: 'LicenseBack', maxCount: 1 }]), routeHandler.LicenseUpload)
    this.app.post('/video', upload_video.single('video'), routeHandler.VideoUpload)
    this.app.post('/creditcardInfo', routeHandler.CreditCardInfo)
    this.app.get('/MovetoUser', routeHandler.Moveuser)
    this.app.get('*', routeHandler.routeNotFoundHandler);
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
