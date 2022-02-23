


const getEnv = () => {
  const appEnv = window.location.host.split('.')[0];
  switch (appEnv) {
    case 'client-test':
      return 'test';
    case 'client-stage':
      return 'stage';
    case 'client':
      return 'prod';
    default:
      return 'local';
  }
}

const apiUrl = () => {
  switch (getEnv()) {
    case 'test':
      return 'https://api-test.cloud.scannget.com';
    case 'stage':
      return 'https://api-stage.cloud.scannget.com';
    case 'prod':
      return 'https://api-prod.cloud.scannget.com';
    default:
      return 'http://192.168.250.124:3000';
  }
}



export default {
  url: apiUrl(),
  isDeployed: window.location.hostname !== 'localhost',
  env: getEnv()
};