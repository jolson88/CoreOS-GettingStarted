#!/usr/bin/env bash

/opt/lb/gen-nginx-conf.sh > /opt/lb/nginx.conf
curl http://${COREOS_PRIVATE_IPV4}:4001/v2/keys/services/web
cat /opt/lb/nginx.conf
nginx -c /opt/lb/nginx.conf -g 'daemon off;'

