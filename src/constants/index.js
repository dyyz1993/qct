const { name, version } = require('../../package.json')

const configFile = `${process.env[process.platform === 'darwin' ? 'HOME' :
'USERPROFILE']}/.qctrc`

const defaultConfig = {
    repo: 'zhu-cli', // 默认拉取的仓库名
};

const SourceTypes = ['vike','github']

module.exports = {
    name, 
    version,
    defaultConfig,
    configFile,
    SourceTypes
}