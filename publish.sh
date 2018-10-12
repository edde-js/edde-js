#!/usr/bin/env bash
set -e

echo "Resetting repo to the original state"
git reset --hard
echo "Bumping version"
npm version --no-git-tag-version from-git
echo "Let's publish the thing!"
npm publish --no-git-tag-version --access public
