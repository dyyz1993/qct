#!/usr/bin/env node
const program = require("commander");
const path = require("path");
const { name, version } = require("../src/constants");
const inquirer = require('inquirer')
const chalk = require('chalk');
program
.version('1.0.0', '-V, --version')
.usage('<command> [options]')

// 
program
  .command('create <app-name>')
  .description('create a new project powered by project-cli-service')
  .option('-d, --default <type>', 'Skip prompts and use default preset')
  .action((name , cmd) => {
      console.log(cmd.default)
    console.log(chalk.blue(`${name }项目正在创建中...`))

})

program
  .command('config')
  .description('设置配置文件文件')
  .option('-d, --delete ', '删除配置')
  .action((...args) => {
      require('../src/config')(...args)
})

program
  .command('list')
  .alias('l')
  .description('show list template')
  .option('-a, --all', 'show all template')
  .action((cmd) => {
    require('../src/action/list')({all:cmd.all})
})
program.parse(process.argv)
