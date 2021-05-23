export const sandboxesList = [
  {
    id: 'test1',
    realm: 'realm1',
    instance: '005',
    versions: {
      app: '20.8.0.108',
      web: '20.2.1.0',
    },
    state: 'stopped',
    createdAt: '2020-06-03T03:43:05.955Z',
    createdBy: 'sachin.upmanyu@ranosys.com',
  },
  {
    id: 'test2',
    Realm: 'realm1',
    instance: '004',
    versions: {
      app: '20.8.0.108',
      web: '20.2.1.0',
    },
    state: 'started',
    createdAt: '2020-06-03T03:41:56.228Z',
    createdBy: 'sachin.upmanyu@ranosys.com',
  },
  {
    id: 'test3',
    realm: 'realm1',
    instance: '002',
    versions: {
      app: '20.8.0.108',
      web: '20.2.1.0',
    },
    state: 'stopped',
    createdAt: '2020-05-04T11:00:47.684Z',
    createdBy: 'sachin.upmanyu@ranosys.com',
  },
];

export const realmData = {
  id: 'realm1',
  createdSandboxes: 8,
  activeSandboxes: 8,
  deletedSandboxes: 3,
  sandboxSeconds: 11694299,
  minutesUp: 194903,
  minutesDown: 309606,
};

export var legendPie = {
  names: ['Remaining', 'Used', 'Down'],
  types: ['info', 'danger', 'warning'],
};

export const sandboxUsageData = {
  id: 'test1',
  sandboxSeconds: 2137620,
  minutesUp: 35627,
  minutesDown: 8602,
  history: [
    {
      from: '2020-06-25T04:07:01Z',
      to: '2020-06-25T13:31:02Z',
      sandboxSeconds: 33841,
    },
    {
      from: '2020-06-26T04:40:02Z',
      to: '2020-06-26T13:34:02Z',
      sandboxSeconds: 32040,
    },
    {
      from: '2020-06-26T13:45:02Z',
      to: '2020-07-02T05:14:02Z',
      sandboxSeconds: 487740,
    },
    {
      from: '2020-07-02T05:51:02Z',
      to: '2020-07-11T06:25:01Z',
      sandboxSeconds: 779639,
    },
    {
      from: '2020-07-11T06:27:01Z',
      to: '2020-07-16T06:06:02Z',
      sandboxSeconds: 430741,
    },
    {
      from: '2020-07-16T06:10:01Z',
      to: '2020-07-16T07:46:03Z',
      sandboxSeconds: 5762,
    },
    {
      from: '2020-07-16T07:53:02Z',
      to: '2020-07-16T13:29:01Z',
      sandboxSeconds: 20159,
    },
    {
      from: '2020-07-17T04:32:02Z',
      to: '2020-07-17T13:42:02Z',
      sandboxSeconds: 33000,
    },
    {
      from: '2020-07-20T04:53:02Z',
      to: '2020-07-20T14:06:02Z',
      sandboxSeconds: 33180,
    },
    {
      from: '2020-07-20T16:20:02Z',
      to: '2020-07-23T05:23:01Z',
      sandboxSeconds: 219779,
    },
    {
      from: '2020-07-23T05:27:02Z',
      to: '2020-07-23T13:42:02Z',
      sandboxSeconds: 29700,
    },
    {
      from: '2020-07-24T04:44:02Z',
      to: '2020-07-24T13:38:01Z',
      sandboxSeconds: 32039,
    },
  ],
};

export const sandboxOperationData = [
  {
    id: 'data--xxxxx---ix1',
    operation: 'upgrade',
    createdAt: '2020-06-25T04:00:01.567Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix2',
    operation: 'start',
    createdAt: '2020-06-26T04:39:22.375Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix3',
    operation: 'stop',
    createdAt: '2020-06-25T13:31:20.584Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix4',
    operation: 'stop',
    createdAt: '2020-06-26T13:34:22.93Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix5',
    operation: 'start',
    createdAt: '2020-06-25T04:06:51.04Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix6',
    operation: 'upgrade',
    createdAt: '2020-07-11T06:09:48.538Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix7',
    operation: 'start',
    createdAt: '2020-06-26T13:44:16.052Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix8',
    operation: 'upgrade',
    createdAt: '2020-07-11T06:09:46.008Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix9',
    operation: 'upgrade',
    createdAt: '2020-07-11T06:09:49.898Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix10',
    operation: 'stop',
    createdAt: '2020-07-17T13:41:59.058Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix11',
    operation: 'upgrade',
    createdAt: '2020-07-23T05:00:59.104Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix12',
    operation: 'stop',
    createdAt: '2020-07-16T13:29:19.179Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix13',
    operation: 'start',
    createdAt: '2020-07-17T04:31:51.106Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix14',
    operation: 'start',
    createdAt: '2020-07-20T04:52:22.169Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix15',
    operation: 'stop',
    createdAt: '2020-07-20T14:06:18.649Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix16',
    operation: 'start',
    createdAt: '2020-07-20T16:19:23.394Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix17',
    operation: 'stop',
    createdAt: '2020-07-24T13:38:10.199Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix18',
    operation: 'stop',
    createdAt: '2020-07-23T13:42:22.95Z',
    operationState: 'finished',
    status: 'success',
  },
  {
    id: 'data--xxxxx---ix19',
    operation: 'start',
    createdAt: '2020-07-24T04:43:05.552Z',
    operationState: 'finished',
    status: 'success',
  },
];

export const tableColumns = [
  'Id',
  'Instance',
  'State',
  'createdBy',
  'CreatedAt',
  'Actions',
];

export const usageTableColumns = ['S.NO', 'From', 'To', 'SandboxSeconds'];

export const operationsTableColumns = [
  'S.NO',
  'Id',
  'CreatedAt',
  'operationState',
  'status',
  'operation',
];

export const creditHistoryTableColumns = [
  'S.No',
  'Credits',
  'Date of Purchase',
  'Auto Renewal',
  'Actions',
];
