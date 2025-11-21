#!/bin/bash

# load environment variables
set -a
source .env
set +a

docker build -t one-piece-chapter-notifier .
docker save -o one-piece-chapter-notifier.tar one-piece-chapter-notifier

scp -P "$VPS_SSH_PORT" one-piece-chapter-notifier.tar "$VPS_USER@$VPS_IP:$VPS_PROJECT_ROUTE"

rm -f one-piece-chapter-notifier.tar
docker rmi one-piece-chapter-notifier
