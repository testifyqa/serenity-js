#!/bin/bash
set -e

echo "Bootstrapping modules"
npm run lerna bootstrap

echo "Removing stale node_modules"
npm run lerna exec --loglevel info -- npm prune