#!/usr/bin/env bash
set -e

cd ${APP_ROOT}
cat package.json
yarn install
npm run build
npm publish --access public
