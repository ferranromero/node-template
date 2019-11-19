export default class Logger {
  static debug(msg) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(msg);
    }
  }

  static warn(msg) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(msg);
    }
  }
}
