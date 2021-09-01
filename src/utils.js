const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols');
// 提示信息包裹函数
exports.wrapFetchAddLoading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start()
  const r = await fn(...args);
  spinner.succeed()
  return r
}



/**
 * Normalize a repo string.
 *
 * @param {String} repo
 * @return {Object}
 */

 exports.normalize = function (repo) {
  var regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/
  var match = regex.exec(repo)

  if (match) {
    var url = match[2]
    var checkout = match[3] || 'master'

    return {
      type: 'direct',
      url: url,
      checkout: checkout
    }
  } else {
    regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^\/]+)\/([^#]+)(?:#(.+))?$/
    match = regex.exec(repo)
    var type = match[1] || 'github'
    var origin = match[2] || null
    var owner = match[3]
    var name = match[4]
    var checkout = match[5]

    if (origin == null) {
      if (type === 'github') {
        origin = 'github.com'
      } else if (type === 'gitlab') {
        origin = 'gitlab.com'
      } else if (type === 'bitbucket') {
        origin = 'bitbucket.org'
      }
    }

    return {
      type: type,
      origin: origin,
      owner: owner,
      name: name,
      checkout: checkout
    }
  }
}


exports.chalkSuccess = (text) => console.log(symbols.success,chalk.green(text))
exports.chalkError = (text) => console.log(symbols.error,chalk.red(text))