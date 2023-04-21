#!/bin/bash

logfile=/apps/subsystems.log
echo "`date '+%Y%m%d %H:%M:%S'` - CodeDeploy Install script started." > $logfile
appdir=/apps/subsystems
artifactdir=/tmp
artifactapi=${artifactdir}/api

rm -rf ${appdir}/api
cp -rv $artifactapi ${appdir}/
cd ${appdir}/api
ln -s ${appdir}/cfg .
npm install
pm2 stop www
pm2 start bin/www
echo "`date '+%Y%m%d %H:%M:%S'`- Ended."
