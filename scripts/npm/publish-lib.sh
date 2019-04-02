#!/bin/bash

readonly rootDir=./dist/@ngx-extensions
readonly module=rxjs-extensions
readonly moduleDir="$rootDir/$module"

echo "Publishing modules at [$scope]"

npm login --scope=$scope

echo "Publishing: $module"
npm publish "$moduleDir" --access=public

npm logout

echo "Modules published at [$scope]!. Use 'npm install [$scope/pkg]' in a client project."