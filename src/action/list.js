
const inquirer = require('inquirer')
const chalk = require("chalk");

const {wrapFetchAddLoading}  = require('../utils');

// async function getList (){
//   return [
//     {
//       name:'name',
//       type:'h5',
//       desc:'我是h5',
//       source:'地址1'
//     },
//     {
//       name:'name2',
//       type:'h5',
//       desc:'我是h5',
//       source:'地址1'
//     },
//     {
//       name:'name2',
//       type:'admin',
//       desc:'我是admin',
//       source:'地址2'
//     }
//   ]
// }



async function main(opt){
 const getConfig =  require('./config');
 const conf = await getConfig();
 const {getList} = require('../kind/'+conf.type)
  const list = await wrapFetchAddLoading(getList,'加载模版列表')(conf.data);
  let steps =[['tags','选择类型？'],['name','请选择模版？']]
  // 列出所有模版
  if(opt.all){
    return showList(list,steps);
  }else{
   const ret =  await choices(list,steps);
   require('./create')(ret)
  //  console.log(ret)
  }
}


async function showList (list,steps){
  let showKey = steps[steps.length-1][0];
  let groupKey = steps[0][0];
  const newList = Object.entries(list.reduce((obj,item)=>{
    const key = item[groupKey]||"未分类";
    if(!obj[key]) obj[key] = [];
    obj[key].push(item[showKey]);
    return obj
  },{})).reduce((arr,[k,v])=>{
    arr.push((chalk.green('----'+k+'----')))
    arr.push(...v)
    return arr;
  },[])
  console.log(newList.join('\n'));
  
}
/**
 * 递归选择
 * @param {*} list [{}]
 * @param {*} steps [['type','选择类型？'],['name','请选择模版？']]
 * @returns list=>item
 */
async function choices (list,steps){
  let tempList = list;
  let value = null;
  for(let step of steps){
   const ret  = await inquirer.prompt({
      name: 'value',
      type: 'list',
      loop:false,
      message: step[1],
      choices: [...new Set(tempList.reduce((arr,item)=>arr.concat(item[step[0]]),[]).filter(i=>i!==undefined))]
    })
    value = ret.value;
    tempList =  tempList.filter((item)=>item[step[0]].includes(value));
  }
  return tempList[0];
}

module.exports = main;
