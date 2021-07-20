const Bree = require('bree');
require('dotenv').config({ path: '../.env' });
const bree = new Bree({
  jobs: [
    // runs the job on Start
    // 'test',
    {
      name: 'sandbox-scheduler',
      cron: '* * * * *',
      worker: process.env.REALM_ARRAY,
      // interval: 'every minute',
    },
  ],
});

bree.start();
