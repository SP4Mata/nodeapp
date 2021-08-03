const { Db } = require('mongodb');
const Mongodb = require('../config/db');


class QueryHandler {
  constructor() {
    this.Mongodb = Mongodb.MongoDB;
  }
  login(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
        DB.collection('user').findOneAndUpdate(
          data,
          {
            $set: {
              online: 'Y',
            },
          },
          (error, result) => {
            DBClient.close();
            if (error) {
              reject(error);
            }
            result.lastErrorObject.updatedExisting ? resolve(result.value._id) : resolve(null);
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  getUserDetails(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
        DB.collection('user').aggregate([
          {
            $match: { _id: ObjectID(userId) },
          },
          {
            $project: {
              name: true,
              email: true,
              lastname: true,
              online: true,
              _id: false,
              id: '$_id',
            },
          },
        ]).toArray((error, result) => {
          DBClient.close();
          if (error) {
            reject(error);
          }
          let userDetails = null;
          if (result.length > 0) {
            userDetails = result[0];
          }
          resolve(userDetails);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  getMobilenumber(useremail) {

    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();

        DB.collection('temp').find({ email: useremail }).toArray((error, result) => {
          DBClient.close()
          if (error) {
            reject(error)
          }
          let userDetails = null;
          if (result.length > 0) {
            userDetails = result[0];
          }
          resolve(userDetails);
        })

      } catch (error) {
        reject(error);
      }
    });

  }
  updateCustomerInfo(data) {

    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
        DB.collection('temp').findOneAndUpdate({ email: data.email }, { $set: { mobilenumber: data.mobilenumber } }).toArray(function (err, docs) {
          DBClient.close()
          if (error) {
            reject(error)
          }
          resolve(docs)
        })
      } catch (error) {
        resolve(error)
      }
    })
  }
  updateResetCount(data) {

    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
        DB.collection('temp').findOneAndUpdate({ email: data.email }, { $set: { ResetCount: data.resetCount } }).toArray(function (err, docs) {
          DBClient.close()

          if (error) {
            reject(error)
          }
          resolve(docs)
        })

      } catch (error) {
        resolve(error)
      }
    })
  }
  SMSVerification(data) {

    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
        DB.collection('temp').findOneAndUpdate({ email: data.email }, { $set: { TwilioVerification: true } }).forEach(function (err, docs) {
          DBClient.close()
          if (error) {
            reject(error)
          }
          resolve(docs)
        })
      } catch (error) {
        resolve(error)
      }
    })
  }
  ImageUpload(data) {

    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
        DB.collection('user').findOneAndUpdate({ email: data.email }, { $set: { LicenseFront: data.LicenseFront[0].filename, Licenseback: data.LicenseBack[0].filename } }).toArray(function (err, docs) {
          DBClient.close()
          if (err) {
            reject(err)
          }
          resolve(docs)
        })
      } catch (error) {
        resolve(error)
      }
    })
  }
  CreditCardInfo(data) {
    console.log(data)
    return new Promise(async (resolve, reject) => {
      const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
      try {
        DB.collection('user').findOneAndUpdate({ email: data.email }, { $set: { cardholdername: data.cardholdername, cardnumber: data.cardnumber, expirymonth: data.expirymonth, expiryyear: data.expiryyear, CVV: data.CVV } }).toArray(function (err, docs) {
          DBClient.close()
          if (err) {
            reject(err)
          }
          resolve(docs)
        })
      } catch (error) {
        resolve(error)
      }


    })
  }
  MoveUser(data) {

    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
        DB.collection('temp').find({ email: data.email }).forEach((docs, err) => {
          if (err) {
            reject(err)
          }
          DB.collection('user').insert(docs)
          DB.collection('temp').remove({ email: data.email })
          resolve(docs)
        })


      } catch (error) {
        resolve(error);
      }
    })
  }
  registerUser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, ObjectID, DBClient] = await this.Mongodb.onConnect();
        DB.collection('user').find({ email: data.email }).toArray(function (err, docs) {

          if (docs.length == 0) {
            DB.collection('temp').find({ email: data.email }).toArray(function (err, docs) {
              if (docs.length == 0) {
                DB.collection('temp').insertOne(data, (err, result) => {

                  DBClient.close();
                  if (err) {
                    reject(err);
                  }
                  resolve(result);
                });
              }
              else {
                resolve(err)
              }

            })

          }
          else {
            resolve(err)
          }
        })
      } catch (error) {
        console.log('Error checker')
        console.log(error);
        reject(error);
      }
    });
  }
}

module.exports = new QueryHandler();
