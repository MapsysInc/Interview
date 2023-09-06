/**
 * Name: log
 * Desc:  Logs a message with a timestamp and specific identifier.
 * @param {string} message - The message to log.
 */
function log(message) {
    const timestamp = new Date().toISOString()
    console.log(`> [${timestamp}] ${message} <`)
  }
  
module.exports = {
    log: log
}