const express = require('express');
require('dotenv').config({ path: '.env' });
const path = require('path');
const { spawn } = require('child_process');

const { parentPort } = require('worker_threads');
const filePath = path.resolve(process.cwd(), '../cli.js');
let error = false;

function authLogin() {
  const child = spawn('node', [filePath, 'client:auth']);
  let returnData = '';
  child.stdout.on('data', (data) => {
    returnData += data.toString();
  });
  console.log(returnData, filePath);
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
      console.log('OK', data);
    } else {
      //the json is not ok
      console.log(returnData, 'NOT OK', data);
    }
    error = true;
  });
  console.log('returnData, ', returnData);
}

function startStopAllSandbox(realmId, startStop = false) {
  const childRealm = spawn('node', [filePath, 'sandbox:list', `-j`]);
  var realmData = '';
  childRealm.stdout.on('data', (data) => {
    realmData += data.toString();
  });

  startStop = startStop ? 'start' : 'stop';
  console.log('start-----------------------', startStop);

  childRealm.stderr.on('data', (data) => {
    error = true;
  });

  childRealm.on('close', (code) => {
    if (code || error) {
      next();
      return;
    }
    realmData = JSON.parse(realmData);
    var returnData = '';
    var id = '';
    console.log(realmData);
    realmData.forEach((sandbox) => {
      if (sandbox.realm === realmId) {
        id = sandbox.id;
        const childRealm = spawn('node', [
          filePath,
          'sandbox:${startStop}',
          `--sandbox=${id}`,
        ]);
        childRealm.stdout.on('data', (data) => {
          returnData += data.toString();
        });
      }
    });
    childRealm.on('close', (code) => {
      if (code || error) {
        // next();
        return;
      }
    });
  });
  childRealm.on('error', (err) => {
    return;
  });
  childRealm.on('error', (err) => {
    console.log(err);
  });
}

(async () => {
  let realmArr = JSON.parse(process.env.REALM_ARRAY);
  let realmStartTime = JSON.parse(process.env.START_TIME_ARRAY);
  let realmEndTime = JSON.parse(process.env.END_TIME_ARRAY);
  console.log(realmArr.length, 'realm length');
  let arrCount = 0;
  if (realmArr.length > 0) {
    await Promise.all(
      realmArr.map(async (realmId) => {
        return new Promise(async (resolve, reject) => {
          try {
            authLogin();
            //after login
            startStopAllSandbox(realmId, false);
            let date_ob = new Date();
            // current hours
            let hours = date_ob.getHours();
            // current minutes
            let minutes = date_ob.getMinutes();

            if (
              hours === realmStartTime[arrCount].split(':')[0] &&
              minutes === realmStartTime[arrCount].split(':')[1]
            ) {
              console.log('start sandboxes');
              startStopAllSandbox(realmId, true);
            }
            if (
              hours === realmEndTime[arrCount].split(':')[0] &&
              minutes === realmEndTime[arrCount].split(':')[1]
            ) {
              startStopAllSandbox(realmId, false);
              console.log('stop sandboxes');
            }
            arrCount++;
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }),
    );
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
// cabin.info("tweet schedule jobb");
