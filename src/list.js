const Vika = require("@vikadata/vika").default;
const chalk = require("chalk");
const inquirer = require('inquirer')
const ora = require('ora')
// 提示信息包裹函数
const wrapFetchAddLoading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start()
  const r = await fn(...args);
  spinner.succeed()
  return r
}
async function getList(token, sheetId, viewId) {
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


async function main(){
  const list = await wrapFetchAddLoading(getList,'加载模版列表')();

  const newList = Object.entries(list.reduce((obj,item)=>{
    const key = item.type||"default";
    if(!obj[key]) obj[key] = [];
    obj[key].push(item);
    return obj
  },{})).reduce((arr,[k,v])=>{
    arr.push(new inquirer.Separator(chalk.green('======'+k+'=====')))
    arr.push(...v)
    return arr;
  },[])
  console.log(newList)
  const item = await inquirer.prompt({
    name: 'repo',
    type: 'list',
    loop:false,
    message: '请选择一个模板来创建项目',
    choices: newList
})
console.log(item)

}

module.exports = main;
