const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const db = require('../models');
const sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const { exit } = require('process');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT, // true for 465, false for other ports
  host: process.env.SMTP_HOST,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

const checkisAuth = (req, res, next) => {
  if (req.headers.authorization) {
    res.status(401).json({ message: 'test data' });
  }
  next();
};

/**
 * Do interactive authentication (in a browser window)
 */
router.post('/auth/login', async (req, res, next) => {
  try {
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const { client, clientSecret } = req.body;
    const child = spawn('node', [
      filePath,
      'auth:login',
      `${client}`,
      `${clientSecret}`,
    ]);

    let requestResult = '';
    child.stdout.on('data', (data) => {
      requestResult += data;
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next(1);
        return;
      }
      res.status(200).json(requestResult);
    });

    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Do automated authentication with user credentials
 */
router.post('/client/login', async (req, res, next) => {
  try {
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const { client, clientSecret, user, userPassword } = req.body;
    const child = spawn('node', [
      filePath,
      'client:auth',
      `${client}`,
      `${clientSecret}`,
      `${user}`,
      `${userPassword}`,
    ]);

    let returnData = '';

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json({ login: true, token: Math.random(50000) });
    });

    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Do automated authentication with dw.json
 */
router.get('/dwjson/login', async (req, res, next) => {
  try {
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [filePath, 'client:auth']);
    let returnData = '';
    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      if (
        /^[\],:{}\s]*$/.test(
          data
            .toString()
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(
              /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
              ']',
            )
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
        )
      ) {
        //the json is ok
        console.log('OK');
      } else {
        //the json is not ok
        console.log('NOT OK');
      }
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next(code);
        return;
      }
      res.status(200).json({ login: true, token: Math.random(50000) });
    });

    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Logs user out and clears configuration
 */
router.get('/logout', async (req, res, next) => {
  try {
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [filePath, 'auth:logout']);

    child.stdout.on('data', (data) => {});

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next(code);
        return;
      }
      res.status(200).json(code);
    });

    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get realm list
 */
router.get('/sandbox/realms/list', async (req, res, next) => {
  try {
    const filePath = path.resolve(process.cwd(), 'cli.js');
    var returnData = '';
    const child = spawn('node', [filePath, 'sandbox:realm:list', '-j']);

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });
    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        res.status(400);
        next({ message: 'Error ' });
        return;
      }
      res.status(200).json(JSON.parse(returnData));
    });

    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get realm usages
 */
router.get('/sandbox/realms/list/:realmId/:topic', async (req, res, next) => {
  try {
    const { realmId, topic } = req.params;

    if (topic !== 'usage') {
      res.status(400).json('Invalid Option');
    }

    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [
      filePath,
      'sandbox:realm:list',
      `--realm=${realmId}`,
      '--show-usage',
      '-j',
    ]);
    var returnData = '';

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(JSON.parse(returnData));
    });

    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});


/**
 * Get realm configuration
 */
  router.get('/sandbox/realm/config/:realmId', async (req, res, next) => {
  try {
    const { realmId} = req.params;

    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [
      filePath,
      'sandbox:realm:list',
      `--realm=${realmId}`,
      '-j',
    ]);
    var returnData = '';

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(JSON.parse(returnData));
    });

    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// sandbox:list lands here
router.get('/sandbox/list', async (req, res, next) => {
  try {
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [filePath, 'sandbox:list', `-j`]);
    var returnData = '';
    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next({ message: 'Error ' });
        // next();
        return;
      }
      res.status(200).json(JSON.parse(returnData));
    });

    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// sandbox:list  --show-deleted lands here
router.get('/sandbox/list/:deleted', async (req, res, next) => {
  try {
    const { deleted } = req.params;
    var returnData = '';

    if (deleted !== 'deleted') {
      res.status(400).json('Invalid Option');
    }
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [
      filePath,
      'sandbox:list',
      '-j',
      '--show-deleted',
    ]);

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });
    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(JSON.parse(returnData));
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// sandbox:get -details of individual sandbox
router.get('/sandbox/stats/:id/:topic', async (req, res, next) => {
  try {
    const { id, topic } = req.params;
    var returnData = '';

    const validOption = ['usage', 'operations', 'settings', 'storage'];

    if (!validOption.includes(topic)) {
      res.status(400).json('Invalid Option');
    }
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [
      filePath,
      'sandbox:get',
      `--sandbox=${id}`,
      `--show-${topic}`,
      '-j',
    ]);

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(JSON.parse(returnData));
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// start sandbox
router.get('/sandbox/start/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [filePath, 'sandbox:start', `--sandbox=${id}`]);
    var returnData = '';

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(returnData);
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// stop sandbox
router.get('/sandbox/stop/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [filePath, 'sandbox:stop', `--sandbox=${id}`]);
    var returnData = '';

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });
    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(returnData);
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// restart sandbox
router.get('/sandbox/restart/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [
      filePath,
      'sandbox:restart',
      `--sandbox=${id}`,
    ]);
    var returnData = '';

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });
    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(returnData);
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// reset sandbox
router.get('/sandbox/reset/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [
      filePath,
      'sandbox:reset',
      `--sandbox=${id}`,
      `--noprompt`,
    ]);
    var returnData = '';

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });
    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(returnData);
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// delete sandbox
router.get('/sandbox/delete/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [
      filePath,
      'sandbox:delete',
      `--sandbox=${id}`,
      `--noprompt`,
    ]);
    var returnData = '';

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });
    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      res.status(200).json(returnData);
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// sandbox list of links  to open in browser
router.get('/sandbox/link/:id', async (req, res, next) => {
  try {
    const { id, topic } = req.params;
    var returnData = '';

    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [
      filePath,
      'sandbox:get',
      `--sandbox=${id}`,
      '-j',
    ]);

    child.stdout.on('data', (data) => {
      returnData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next(error);
        return;
      }
      res.status(200).json(JSON.parse(returnData));
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// start sandbox
router.get('/sandbox/start-all/:realmId', async (req, res, next) => {
  try {
    const { realmId } = req.params;
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [filePath, 'sandbox:list', `-j`]);
    var realmData = '';
    child.stdout.on('data', (data) => {
      realmData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      realmData = JSON.parse(realmData);
      var returnData = '';
      var id = '';
      realmData.forEach((sandbox) => {
        if (sandbox.realm === realmId) {
          const filePath = path.resolve(process.cwd(), 'cli.js');
          id = sandbox.id;
          const child = spawn('node', [
            filePath,
            'sandbox:start',
            `--sandbox=${id}`,
          ]);
          child.stdout.on('data', (data) => {
            returnData += data.toString();
          });
        }
      });
      child.on('close', (code) => {
        if (code || error) {
          next();
          return;
        }
        res.status(200).json(returnData);
      });
      res.status(200).json(realmData);
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});
// stop sandbox
router.get('/sandbox/stop-all/:realmId', async (req, res, next) => {
  try {
    const { realmId } = req.params;
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [filePath, 'sandbox:list', `-j`]);
    var realmData = '';
    child.stdout.on('data', (data) => {
      realmData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      realmData = JSON.parse(realmData);
      var returnData = '';
      var id = '';
      realmData.forEach((sandbox) => {
        if (sandbox.realm === realmId) {
          const filePath = path.resolve(process.cwd(), 'cli.js');
          id = sandbox.id;
          const child = spawn('node', [
            filePath,
            'sandbox:stop',
            `--sandbox=${id}`,
          ]);
          child.stdout.on('data', (data) => {
            returnData += data.toString();
          });
        }
      });
      child.on('close', (code) => {
        if (code || error) {
          next();
          return;
        }
        res.status(200).json(returnData);
      });
      res.status(200).json(realmData);
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// restart sandbox
router.get('/sandbox/restart-all/:realmId', async (req, res, next) => {
  try {
    const { realmId } = req.params;
    const filePath = path.resolve(process.cwd(), 'cli.js');
    const child = spawn('node', [filePath, 'sandbox:list', `-j`]);
    var realmData = '';
    child.stdout.on('data', (data) => {
      realmData += data.toString();
    });

    let error = false;
    child.stderr.on('data', (data) => {
      error = true;
    });

    child.on('close', (code) => {
      if (code || error) {
        next();
        return;
      }
      realmData = JSON.parse(realmData);
      var returnData = '';
      var id = '';
      realmData.forEach((sandbox) => {
        if (sandbox.realm === realmId) {
          const filePath = path.resolve(process.cwd(), 'cli.js');
          id = sandbox.id;
          const child = spawn('node', [
            filePath,
            'sandbox:restart',
            `--sandbox=${id}`,
          ]);
          child.stdout.on('data', (data) => {
            returnData += data.toString();
          });
        }
      });
      child.on('close', (code) => {
        if (code || error) {
          next();
          return;
        }
        res.status(200).json(returnData);
      });
      res.status(200).json(realmData);
    });
    child.on('error', (err) => {
      res.status(400).json(err);
    });
  } catch (err) {
    next(err);
  }
});

// create an api to add the credit history
router.post('/credit/add', async (req, res, next) => {
  try {
    const { credit, realmId, purchaseDate, linkToTicket, autoRenewal } =
      req.body;
    var notifyCheck = 0;
    return db.Credit.create({
      credit,
      realmId,
      purchaseDate,
      linkToTicket,
      autoRenewal,
      notifyCheck,
    })
      .then((creditData) => res.status(200).json(creditData))
      .catch((err) => {
        console.log(
          '***There was an error creating a credit',
          JSON.stringify(credit),
        );
        res.status(400).json(err);
      });
  } catch (err) {
    next(err);
  }
});

// create an api to get the credit history
router.get('/credit/get-list/:realmId', async (req, res, next) => {
  try {
    //id is realm id
    const { realmId } = req.params;
    if (process.env.DEMO_MODE === 'On') {
      var dataList = [
        { id: 1, credit: 121, purchaseDate: Date.now() },
        { id: 2, credit: 145, purchaseDate: Date.now() },
        { id: 3, credit: 1212, purchaseDate: Date.now() },
      ];
      res.status(200).json(dataList);
    } else {
      return db.Credit.findAll({
        where: {
          realmId: realmId,
        },
      })
        .then((credits) => res.status(200).json(credits))
        .catch((err) => {
          console.log(
            'There was an error querying credits',
            JSON.stringify(err),
          );
          res.status(400).json('Error');
          // return res.send(err)
        });
    }
  } catch (err) {
    next(err);
  }
});

// create an api to delete the credit history by its id
router.delete('/credit/delete/:creditId', async (req, res, next) => {
  try {
    var id = parseInt(req.params.creditId);
    return db.Credit.findOne({
      where: {
        id: id,
      },
    })
      .then((credit) => credit.destroy())
      .then(() =>
        res
          .status(200)
          .json({ message: 'Credit has been deleted successfully' }),
      )
      .catch((err) => {
        console.log('***Error deleting credit', JSON.stringify(err));
        res
          .status(400)
          .json({ message: 'Error in deleting, please try again' });
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// create an api to get the credit history
router.get('/credits-usage/:realmId', async (req, res, next) => {
  try {
    //id is realm id
    const { realmId } = req.params;
    //fetch credits list from DB functionality
    const creditList = db.Credit.findAll({
      attributes: [
        'realmId',
        [sequelize.fn('sum', sequelize.col('credit')), 'total_credits'],
      ],
      where: {
        realmId: realmId,
      },
      group: ['realmId'],
    })
      .then((credits) => {
        //call realms/list/zzrq/usage : line no 218

        const filePath = path.resolve(process.cwd(), 'cli.js');
        const child = spawn('node', [
          filePath,
          'sandbox:realm:list',
          `--realm=${realmId}`,
          '--show-usage',
          '-j',
        ]);
        var returnData = '';

        child.stdout.on('data', (data) => {
          returnData += data.toString();
        });
        let error = false;
        child.stderr.on('data', (data) => {
          error = true;
        });

        child.on('close', (code) => {
          if (code || error) {
            next();
            return;
          }
          let realmData = JSON.parse(returnData);
          let creditListData, remainingCredits, remainingCreditPercent;
          if (credits && credits[0]) {
            creditListData = credits[0].toJSON();
            remainingCredits =
              creditListData.total_credits -
              (realmData.minutesUp + realmData.minutesDown * 0.3);
            remainingCreditPercent =
              ((creditListData.total_credits - remainingCredits) /
                creditListData.total_credits) *
              100;
          } else {
            remainingCredits =
              0 - (realmData.minutesUp + realmData.minutesDown * 0.3);
            remainingCreditPercent = 0;
          }
          // calculate the remaining credit percent
          res.status(200).json({
            remainingCredits: remainingCredits,
            creditList: creditListData,
            remainingCreditPercent: remainingCreditPercent,
            returnData: realmData,
          });
        });
      })
      .catch((err) => {
        console.log('There was an error querying credits', JSON.stringify(err));
        res.status(400).json({ error: true, message: 'Bad Request' });
      });
    //calculate credits from the sandox data
  } catch (err) {
    next(err);
  }
});

// create an api to send the mail
router.get('/notify-user', async (req, res, next) => {
  try {
    //fetch credits list from DB functionality
    realmId = 'bfxt';

    //fetch credits list from DB functionality
    const creditList = await db.Credit.findAll({
      attributes: [
        'realmId',
        [sequelize.fn('sum', sequelize.col('credit')), 'total_credits'],
      ],
      where: {
        realmId: realmId,
      },
      group: ['realmId'],
    })
      .then((credits) => {
        //call realms/list/zzrq/usage : line no 218

        const filePath = path.resolve(process.cwd(), 'cli.js');
        const child = spawn('node', [
          filePath,
          'sandbox:realm:list',
          `--realm=${realmId}`,
          '--show-usage',
          '-j',
        ]);
        var returnData = '';

        child.stdout.on('data', (data) => {
          returnData += data.toString();
        });
        let error = false;
        child.stderr.on('data', (data) => {
          error = true;
        });

        child.on('close', (code) => {
          if (code || error) {
            next();
            return;
          }
          let realmData = JSON.parse(returnData);
          let creditListData, remainingCredits, remainingCreditPercent;
          if (credits && credits[0]) {
            creditListData = credits[0].toJSON();
            remainingCredits =
              creditListData.total_credits -
              (realmData.minutesUp + realmData.minutesDown * 0.3);
            remainingCreditPercent =
              ((creditListData.total_credits - remainingCredits) /
                creditListData.total_credits) *
              100;
          } else {
            remainingCredits =
              0 - (realmData.minutesUp + realmData.minutesDown * 0.3);
            remainingCreditPercent = 0;
          }
          // calculate the remaining credit percent
          const creditListNew = db.Credit.findOne({
            where: {
              realmId: realmId,
            },
            order: [['id', 'DESC']],
          })
            .then(function (data) {
              var cron_time_check_arr = JSON.parse(
                process.env.CRON_NOTIFICATION,
              );
              var creditListData = data.toJSON();
              let usedCreditPercent = remainingCreditPercent;
              if (
                usedCreditPercent &&
                usedCreditPercent > creditListData.notifyCheck
              ) {
                var dataKey = cron_time_check_arr.findIndex(
                  (keyVal) => parseInt(keyVal) === parseInt(usedCreditPercent),
                );
                console.log(
                  dataKey,
                  parseInt(usedCreditPercent),
                  usedCreditPercent,
                  creditListData.notifyCheck,
                  cron_time_check_arr[dataKey],
                );
                if (
                  dataKey >= 0 &&
                  creditListData.notifyCheck != cron_time_check_arr[dataKey]
                ) {
                  console.log('----------------------------------', dataKey);
                  // if (
                  //   creditListData.notifyCheck <=
                  //     cron_time_check_arr[dataKey] &&
                  //   realmId == creditListData.realmId
                  // ) {
                  // send email to the user to notify that cron_time_check_arr[dataKey] time is consumed.
                  const mailData = {
                    from: process.env.EMAIL_ADDRESS, // sender address
                    to: process.env.EMAIL_ADDRESS, // list of receivers
                    subject: 'Realm Credit Usage Notification',
                    text: 'You have consumed ' + cron_time_check_arr[dataKey],
                    html:
                      '<b>Hi, </b> <br/> You have consumed ' +
                      cron_time_check_arr[dataKey] +
                      '% of your alloted sandbox credits. <br/> ',
                  };
                  transporter.sendMail(mailData, function (err, info) {
                    if (err) console.log(err);
                  });
                  //update notifyCheck to realm_a_time_consumed
                  let updateQuery = db.Credit.update(
                    {
                      notifyCheck: cron_time_check_arr[dataKey],
                    },
                    { where: { id: data.id } },
                  ).then(function () {
                    // update callback
                  });
                  res.status(200).json({ realmId: realmId });
                }
              }
              // console.log(
              //   'test',
              //   '----------------------',
              //   remainingCreditPercent,
              //   creditListData.notifyCheck,
              // );
            })
            .catch((err) => {
              console.log(
                'There was an error querying credits',
                err,
                JSON.stringify(err),
              );
              res.status(400).json('Error');
            });

          res.status(200).json({
            remainingCreditPercent: 100 - remainingCreditPercent,
          });
        });
      })
      .catch((err) => {
        console.log('There was an error querying credits', JSON.stringify(err));
        res.status(400).json({ error: true, message: 'Bad Request' });
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

exports.router = router;
