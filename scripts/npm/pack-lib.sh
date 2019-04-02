#!/usr/bin/env bash

readonly rootDir=./dist/@ngx-extensions
readonly module=rxjs-extensions
readonly moduleDir="$rootDir/$module"

echo 'Preparing modules to be packaged...'

gulp move-additional-files

echo 'Packaging modules...'

if [ -d $moduleDir ]
then
  echo "Packaging $module"
  cd $moduleDir
  npm pack
  cd -
fi

echo 'Modules ready to be published!'