#!/bin/sh

rm -rf .tmp-deploy
gitbook build . -o .tmp-deploy
cp -r .tmp-deploy/* ../scaling-js-apps-gh-pages
