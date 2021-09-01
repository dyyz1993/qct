const fs = require('fs')
const { encode, decode } = require('ini')
const camelCase = require('camelcase');

const { defaultConfig, configFile,SourceTypes } = require('../constants')  
const inquirer = require('inquirer');
const chalk = require('chalk');



module.exports = async function main (p)  {
    const flag = fs.existsSync(configFile)
    if(flag) {
        if(p&&p.delete){
            fs.rmSync(configFile)
            console.log('删除配置成功')
        }else{
            const content = fs.readFileSync(configFile).toString()
            const contentDecoded = decode(content);// 将文件解析成对象
            // Object.assign(obj, contentDecoded)
            console.log(contentDecoded)
            return contentDecoded;
        }
       
    }else{
       const {value} =  await inquirer.prompt({
            type:'list',
            name:'value',
            message:'选择配置源',
            choices:SourceTypes
        });

       const conf = await  require('../kind'+value)
            //   obj[key] = val;
        fs.writeFileSync(configFile, encode(conf))
        // console.log(`${key}=${v}`)
        console.log('设置成功')
        return conf;
        
    }
}




