const chalk = require('chalk');
const path = require('path');

class Logger {
  constructor() {
    this.levels = {
      ERROR: { color: chalk.red, label: 'ERROR' },
      WARN: { color: chalk.yellow, label: 'WARN' },
      INFO: { color: chalk.blue, label: 'INFO' },
      SUCCESS: { color: chalk.green, label: 'SUCCESS' },
      DEBUG: { color: chalk.gray, label: 'DEBUG' }
    };
  }

  /**
   * Get the current timestamp in HH:MM:SS format
   */
  getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  /**
   * Get the filename from the call stack
   */
  getCallerFile() {
    const originalFunc = Error.prepareStackTrace;
    let callerfile;
    
    try {
      const err = new Error();
      Error.prepareStackTrace = function (err, stack) { return stack; };
      
      const currentfile = err.stack.shift().getFileName();
      
      while (err.stack.length) {
        callerfile = err.stack.shift().getFileName();
        if (currentfile !== callerfile) break;
      }
    } catch (e) {}
    
    Error.prepareStackTrace = originalFunc;
    
    return callerfile ? path.basename(callerfile) : 'unknown.js';
  }

  /**
   * Format and output log message
   */
  log(level, message, ...args) {
    const timestamp = this.getTimestamp();
    const filename = this.getCallerFile();
    const levelConfig = this.levels[level];
    
    if (!levelConfig) {
      console.log(`${timestamp} [${filename}] ${message}`, ...args);
      return;
    }

    const coloredLevel = levelConfig.color(`[${levelConfig.label}]`);
    const timeColor = chalk.white(timestamp);
    const fileColor = chalk.green(`[${filename}]`);
    
    console.log(`[${timeColor}] ${fileColor} ${coloredLevel} ${message}`, ...args);
  }

  /**
   * Simple log without level (matches your example format)
   */
  simple(message, ...args) {
    const timestamp = this.getTimestamp();
    const filename = this.getCallerFile();
    const timeColor = chalk.gray(timestamp);
    const fileColor = chalk.cyan(`[${filename}]`);
    
    console.log(`${timeColor} ${fileColor} ${message}`, ...args);
  }

  // Convenience methods
  error(message, ...args) {
    this.log('ERROR', message, ...args);
  }

  warn(message, ...args) {
    this.log('WARN', message, ...args);
  }

  info(message, ...args) {
    this.log('INFO', message, ...args);
  }

  success(message, ...args) {
    this.log('SUCCESS', message, ...args);
  }

  debug(message, ...args) {
    this.log('DEBUG', message, ...args);
  }
}

// Create and export a singleton instance
const logger = new Logger();

module.exports = logger;