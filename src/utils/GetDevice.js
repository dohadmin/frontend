import UAParser from 'ua-parser-js'

export const getDeviceType = () => {
  const parser = new UAParser();
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  const deviceType = device.type || 'Desktop';
  const browserName = browser.name || 'unknown browser';
  const osName = os.name || 'unknown OS';
  const osVersion = os.version || 'unknown version';

  return `${browserName} on ${osName} ${osVersion} (${deviceType})`;
};