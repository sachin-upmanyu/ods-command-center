export const realmsData = ['realm1', 'realm2'];

// http://localhost:3009/realms/list/<realmId>/usage
export const allRealms = [
  {
    id: 'realm1',
    createdSandboxes: 24,
    activeSandboxes: 24,
    deletedSandboxes: 22,
    sandboxSeconds: 54040750,
    minutesUpByProfile: [
      {
        profile: 'medium',
        minutes: 900667,
      },
    ],
    minutesUp: 500,
    minutesDown: 500,
  },
  {
    id: 'realm2',
    createdSandboxes: 24,
    activeSandboxes: 24,
    deletedSandboxes: 22,
    sandboxSeconds: 54040750,
    minutesUpByProfile: [
      {
        profile: 'medium',
        minutes: 900667,
      },
    ],
    minutesUp: 123,
    minutesDown: 432,
  },
];
