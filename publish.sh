#!/usr/bin/env bash
set -e

echo "Resetting repo to the original state"
git reset --hard
echo "Bumping version"
npm version from-git --no-git-tag-version
echo "Let's publish the thing!"
npm publish --access public
