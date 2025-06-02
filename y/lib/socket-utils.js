let serverSocket = null;

export const getServerSideSocket = () => {
  // Try to get the socket from the global Next.js server
  if (typeof global !== 'undefined' && global.io) {
    return global.io;
  }
  return null;
};

export const setServerSocket = (io) => {
  if (typeof global !== 'undefined') {
    global.io = io;
  }
  serverSocket = io;
};