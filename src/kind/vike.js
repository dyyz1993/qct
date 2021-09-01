
const Vika = require("@vikadata/vika").default;
const inquirer = require('inquirer');
const chalk = require("chalk");

exports.setConfig = async function(){
    const {token} =  await inquirer.prompt({
        type:'input',
        name:'token',
        message:'输入token',
        validate:(input)=>input===''?'不能为空':true
    });

    const {sheetId} =  await inquirer.prompt({
        type:'input',
        name:'sheetId',
        message:'输入sheetId',
        validate:(input)=>input===''?'不能为空':true
    });

    const {viewId} =  await inquirer.prompt({
        type:'input',
        name:'viewId',
        message:'输入viewId',
        validate:(input)=>input===''?'不能为空':true
    });

    
    return {
        type:'vike',
        data:{token,sheetId,viewId}
    }
}


exports.getList = async function getList({token, sheetId, viewId}) {
    const vika = new Vika({ token, fieldKey: "name" });
    // 通过 datasheetId 来指定要从哪张维格表操作数据。
    const datasheet = vika.datasheet(sheetId);
  
    return await datasheet.records
      .query({ viewId })
      .then((response) => {
        if (response.success) {
          // console.log(response)
          return response.data.records.map((item) => item.fields);
        } else {
          console.error(chalk.red(response));
        }
      });
  }

