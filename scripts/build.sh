#!/usr/bin/env bash

readonly configDir=./config
readonly modules=(commonjs esm5 esm2015 types)

set -e

# Clean up
echo Cleaning up build artifacts...

rm -rf ./dist

echo Clean up complete!

# Build modules
echo Compiling Typescript files...

for module in ${modules[*]}
do
    configFilePath=$configDir/tsconfig.$module.json
    echo Compiling module format: $module
    if [ -e $configFilePath ]
    then
        tsc -p $configFilePath
    fi
done

echo Build complete!
