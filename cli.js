#!/usr/bin/env node

const APP_NAME = "librarian"

const fs           = require('fs')
const path         = require('path')
const readJson     = require('read-package-json')
const execSync = require('child_process').execSync
let   commandMap = {}

switch(process.argv[2]) {
  case 'load':
    const packages = fs.readdirSync(_librarian_packages_path())
    for (const packageDir of packages) {
      if (packageDir === "core") {
        continue
      }
      let data = JSON.parse(fs.readFileSync(path.join(_librarian_packages_path(), packageDir, 'package.json')))
      let commandName = Object.keys(data["bin"])[0]
      commandMap[commandName] = data["_sub_commands"]
    }
    fs.writeFileSync(path.join(__dirname, "command-map.json"), JSON.stringify(commandMap))
    break
  default:
    let data = JSON.parse(fs.readFileSync(path.join(_librarian_packages_path(), 'core', 'command-map.json')))
    if (data[process.argv[2]] && process.argv[3]) {
      let a = path.join(_librarian_packages_path(), process.argv[2], 'cli.js')
      let command = process.argv[3]
      let b = `${a} ${command}`
      let c = execSync(`node ${a} ${command} ${path.join(_librarian_path())}`)
      console.log(c.toString());
    }
}

function _librarian_path() {
  const regex    = /(.*)\.librarian\/(.*)/
  const abs_path = __dirname.match(regex)

  return path.join(abs_path[1], `.${APP_NAME}`)
}

function _librarian_packages_path() {
  const regex    = /(.*)\.librarian\/(.*)/
  const abs_path = __dirname.match(regex)

  return path.join(abs_path[1], `.${APP_NAME}`, 'packages')
}




// const path = require('path')
// const fs   = require('fs')
// const librarian_path = path.join(__dirname, '.librarian')
// const packages_path  = `packages/`

// files = fs.readdirSync(path.join(librarian_path, packages_path))
// console.log(files);
