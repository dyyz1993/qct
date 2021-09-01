const downLoadGitRepo = require('download-git-repo')
const { promisify } = require('util')
const { normalize, wrapFetchAddLoading, chalkSuccess } = require('../utils')
const axios = require('axios')
const path = require('path')
const inquirer = require('inquirer')
const symbols = require('log-symbols');
let ncp = require('ncp')
ncp = promisify(ncp)
const cpy = require('cpy');

// 转为promise格式
const downLoadGit = promisify(downLoadGitRepo);
const baseUrl_repos = `https://api.github.com/repos/` // tag

// 获取当前文件目录
const downLoadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.qct_template`


// 获取版本信息列表
const fetchTagsList = async (owner, name) => {
    const { data } = await axios.get(`${baseUrl_repos}/${owner}/${name}/tags`);
    return data;
};



module.exports = async (data) => {

    let repo = data.source;

    let { owner, name, checkout, type } = normalize(repo)

    if (!checkout && type === 'github') {
        // 选择版本
        let tags = await wrapFetchAddLoading(fetchTagsList, '正在获取版本号，请稍等...')(owner, name)
        tags = tags.map(item => item.name);

        checkout = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            message: '请选择版本',
            choices: tags
        }).tag

        // 切换分支
        repo.replace(/#.*/, '#' + checkout)
    }

    let dest = process.cwd()
    if (data.type == 'project') {
        const { dirName } = await inquirer.prompt({
            type: "input",
            message: '请输入项目目录!',
            name: 'dirName',
            validate: (input) => input === '' ? '不能为空' : true
        })
        dest = dest + '/' + dirName
    }

    // 下载项目
    await wrapFetchAddLoading(downLoadGit, 'download template')(repo, downLoadDirectory);
    // 挪过来
    const ret = await cpy(downLoadDirectory, dest, { overwrite: false })
    chalkSuccess(`创建成功`)
    // console.log(ret)
    // data.type ==='fragment'



    // 提示替换是否覆盖？

}
