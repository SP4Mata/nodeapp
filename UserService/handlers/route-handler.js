/* eslint-disable class-methods-use-this */
const helper = require('./../handlers/query-handler');
const CONSTANTS = require('./../config/constants');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken)

class RouteHandler {
  async Moveuser(request, response) {
    const data = {
      email: request.query.email
    }
    try {
      const MoveUser = await helper.MoveUser(data)


      if (MoveUser === null || MoveUser === undefined) {
        response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
          error: false,
          message: CONSTANTS.CREDIT_CARD_INFO_ERROR,
        });
      } else {
        response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
          error: false,
          message: CONSTANTS.USER_REGISTRATION_OK,
        });
      }

    } catch (error) {
      response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
        error: false,
        message: CONSTANTS.FILE_UPLOAD_ERROR,
      });
    }

  }
  async CreditCardInfo(request, response) {
    const data = {
      cardholdername: request.body.cardholdername,
      cardnumber: request.body.cardnumber,
      expirymonth: request.body.expirymonth,
      expiryyear: request.body.expiryyear,
      CVV: request.body.CVV,
      email: request.body.email
    }
    try {
      const CreditData = await helper.CreditCardInfo(data);
      if (CreditData === null || CreditData === undefined) {
        response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
          error: false,
          message: CONSTANTS.CREDIT_CARD_INFO_ERROR,
        });
      } else {
        response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
          error: false,
          message: CONSTANTS.CREDIT_CARD_INFO,
        });
      }

    } catch (error) {
      response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
        error: false,
        message: CONSTANTS.FILE_UPLOAD_ERROR,
      });
    }
  }
  async VideoUpload(request, response) {
    // console.log(request.file)
    console.log(request.body.email)
  }
  async LicenseUpload(request, response) {

    const data = {
      LicenseFront: request.files.LicenseFront,
      LicenseBack: request.files.LicenseBack,
      email: request.body.email
    }

    try {
      const upload = await helper.ImageUpload(data)
      if (upload === null || upload === undefined) {
        response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
          error: false,
          message: CONSTANTS.FILE_UPLOAD_ERROR,
        });
      } else {
        response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
          error: false,
          message: CONSTANTS.FILE_UPLOAD,
        });
      }
    } catch (error) {
      response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
        error: false,
        message: CONSTANTS.FILE_UPLOAD_ERROR,
      });
    }
  }
  async SMSVerification(request, response) {
    const data = {
      email: request.query.email,
      mobilenumber: request.body.mobilenumber,
      OTP: request.body.OTP
    }
    try {

      // Check OTP

      client.verify.services('VA28054729b95a4dab67b306353433dfc5')
        .verificationChecks
        .create({ to: data.mobilenumber, code: data.OTP })
        .then(async verification_check => {
          const updateTwilio = await helper.SMSVerification(data)
          if (updateTwilio === null || updateTwilio === undefined) {
            response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
              error: false,
              message: CONSTANTS.RESET_COUNT,
            });
          } else {
            response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
              error: false,
              message: CONSTANTS.VERIFICATION_TWILIO,
              verification_check: verification_check.status
            });
          }
        })


      // const updateTwilio = await helper.SMSVerification(data)
      // if (updateTwilio === null || updateTwilio === undefined) {
      //   response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
      //     error: false,
      //     message: CONSTANTS.RESET_COUNT,
      //   });
      // } else {
      //   response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      //     error: false,
      //     message: CONSTANTS.VERIFICATION_TWILIO,
      //   });
      // }

    } catch (error) {
      console.log(error)
      response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.SERVER_ERROR_MESSAGE,
      });
    }
  }
  async ResetCount(request, response) {
    const data = {
      resetCount: request.body.ResetCount,
      email: request.query.email
    }
    try {
      const updateResetcode = await helper.updateResetCount(data)

      if (updateResetcode === null || updateResetcode === undefined) {
        response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
          error: false,
          message: CONSTANTS.RESET_COUNT,
        });
      } else {
        response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
          error: false,
          message: CONSTANTS.RESET_COUNT,
        });
      }
    } catch (error) {
      console.log(error)
      response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.SERVER_ERROR_MESSAGE,
      });
    }
  }
  async SendCode(request, response) {
    console.log(request.body.mobilenumber)

    // Resend SMS

    client.verify.services('VA28054729b95a4dab67b306353433dfc5')
      .verifications
      .create({ to: request.body.mobilenumber, channel: 'sms' })
      .then(verification => {
        response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
          message: CONSTANTS.RESENT_CODE,
          verification: verification.status
        })
      });
    response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      message: CONSTANTS.RESENT_CODE,

    })

  }
  async updateCustomerInfo(request, response) {
    const data = {
      mobilenumber: request.body.mobilenumber,
      email: request.query.email
    }
    try {


      // Twilio Send

      client.verify.services('VA28054729b95a4dab67b306353433dfc5')
        .verifications
        .create({ to: request.body.mobilenumber, channel: 'sms' })
        .then(verification => {
          const updateInfo = await helper.updateCustomerInfo(data)
          if (updateInfo === null || updateInfo === undefined) {
            response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
              error: false,
              message: CONSTANTS.EMAIL_ALREADY_EXIST,
            });
          } else {
            response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
              error: false,
              message: CONSTANTS.UPDATE_PHONE_NUBER,
              OTP: verification.status
            });
          }
        });
      // const updateInfo = await helper.updateCustomerInfo(data)
      // if (updateInfo === null || updateInfo === undefined) {
      //   response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
      //     error: false,
      //     message: CONSTANTS.EMAIL_ALREADY_EXIST,
      //   });
      // } else {
      //   response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      //     error: false,
      //     message: CONSTANTS.UPDATE_PHONE_NUBER,

      //   });
      // }
    } catch (error) {
      console.log(error)
      response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.SERVER_ERROR_MESSAGE,
      });
    }
  }
  async getCustomerMobileNumber(request, response) {


    const useremail = request.query.email;
    console.log(useremail)
    if (useremail === '') {
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USERID_NOT_FOUND,
      });
    }
    else {

      try {

        const userMobileNumber = await helper.getMobilenumber(useremail);

        if (userMobileNumber === undefined) {
          response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
            error: true,
            details: CONSTANTS.USERNAME_DETAIL_FAILED,
          });
        } else {
          response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
            error: false,
            mobilenumber: userMobileNumber.mobilenumber,
            email: userMobileNumber.email
          });
        }
      } catch (error) {
        console.log(error)
        response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
          error: true,
          message: CONSTANTS.SERVER_ERROR_MESSAGE,
        });
      }

    }
  }
  async getUserDetailsHandler(request, response) {
    const userid = request.params.userId;
    if (userid === '') {
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USERID_NOT_FOUND,
      });
    } else {
      try {
        const userDetails = await helper.getUserDetails(userid.trim());
        if (userDetails === undefined) {
          response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
            error: true,
            details: CONSTANTS.USERNAME_DETAIL_FAILED,
          });
        } else {
          response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
            error: false,
            details: userDetails,
          });
        }
      } catch (error) {
        response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
          error: true,
          message: CONSTANTS.SERVER_ERROR_MESSAGE,
        });
      }
    }
  }
  async loginRouteHandler(request, response) {
    const data = {
      email: request.body.email === '' || request.body.name === undefined ? null : (request.body.email).trim(),
      password: request.body.password === '' || request.body.password === undefined ? null : request.body.password.trim(),
    };
    if (data.email === '' || data.name === null) {
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USERNAME_NOT_FOUND,
      });
    } else if (data.password === '' || data.password === null) {
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.PASSWORD_NOT_FOUND,
      });
    } else {
      try {
        const result = await helper.login(data);
        if (result === null || result === undefined) {
          response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
            error: true,
            message: CONSTANTS.USER_LOGIN_FAILED,
          });
        } else {
          response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
            error: false,
            userId: result,
            message: CONSTANTS.USER_LOGIN_OK,
          });
        }
      } catch (error) {
        response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
          error: true,
          message: CONSTANTS.USER_LOGIN_FAILED,
        });
      }
    }
  }
  async registerRouteHandler(request, response) {
    const data = {
      firstname: request.body.firstname === '' || request.body.firstname === undefined ? null : (request.body.firstname).trim(),
      lastname: request.body.lastname === '' || request.body.lastname === undefined ? null : (request.body.lastname).trim(),
      email: request.body.email === '' || request.body.email === undefined ? null : (request.body.email).trim(),
      mobilenumber: request.body.mobilenumber === '' || request.body.mobilenumber === undefined ? null : (request.body.mobilenumber).trim(),
      zipcode: request.body.zipcode === '' || request.body.zipcode === undefined ? null : (request.body.zipcode).trim(),

    }
    try {
      // OTP while Registration

      client.verify.services('VA28054729b95a4dab67b306353433dfc5')
        .verifications
        .create({ to: request.body.mobilenumber, channel: 'sms' })
        .then(async verification => {
          const result = await helper.registerUser(data);
          if (result === null || result === undefined) {
            response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
              error: false,
              message: CONSTANTS.EMAIL_ALREADY_EXIST,
            });
          } else {
            response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
              error: false,
              userId: result.insertedId,
              message: CONSTANTS.USER_REGISTRATION_OK,
              OTP: verification.status
            });
          }
        });


      // const result = await helper.registerUser(data);
      // if (result === null || result === undefined) {
      //   response.status(CONSTANTS.SERVER_INTERNAL_ERROR_HTTP_CODE).json({
      //     error: false,
      //     message: CONSTANTS.EMAIL_ALREADY_EXIST,
      //   });
      // } else {
      //   response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      //     error: false,
      //     userId: result.insertedId,
      //     message: CONSTANTS.USER_REGISTRATION_OK,
      //     // OTP: OTP
      //   });
      // }
    } catch (error) {
      console.log(error)
      response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.SERVER_ERROR_MESSAGE,
      });
    }
  }

  routeNotFoundHandler(request, response) {
    response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
      error: true,
      message: CONSTANTS.ROUTE_NOT_FOUND,
    });
  }
  getName(request, response) {
    console.log('Call')
    response.send("KISHANN")
  }
}

module.exports = new RouteHandler();
