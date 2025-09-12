#!/bin/bash

# load environment variables
set -a
source .env
set +a

# get db
scp -P "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP:$VPS_PROJECT_ROUTE/database/*" ./database/
