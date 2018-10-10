#!/usr/bin/env bash
set -e

lerna bootstrap --ci
lerna run test
