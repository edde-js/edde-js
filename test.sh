#!/usr/bin/env bash
set -e

lerna bootstrap
lerna run test
