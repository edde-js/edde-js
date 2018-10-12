#!/usr/bin/env bash
set -e

echo "Resetting repo to the original state"
git reset --hard
echo "Bumping version"
npm --no-git-tag-version version from-git
echo "Let's publish the thing!"
npm --no-git-tag-version publish --access public
