import { registerNativeHandlers } from '..';

const NetInfo = {
  addEventListener: () => {},
  fetch: async () => {
    await undefined;
    return true;
  },
};
registerNativeHandlers({
  NetInfo,
});
