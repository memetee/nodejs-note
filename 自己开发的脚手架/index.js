#!/usr/bin/env node

const program = require('commander');
const helpOptions = require('./lib/core/help');
const createCommands = require('./lib/core/create')

program.version(require('./package.json').version);

// 帮助和可选信息
const programInstance = helpOptions(program);

// 创建指令
createCommands();

program.parse(process.argv);
const options = programInstance.opts();

