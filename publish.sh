#!/usr/bin/env bash
set -e

npm version from-git --force
npm publish --access public
