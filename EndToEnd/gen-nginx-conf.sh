SERVERS=$(curl -L -s http://${COREOS_PRIVATE_IPV4}:4001/v2/keys/services/web | jq '.node.nodes[] | { server: .value }' | grep "server" | awk '{gsub(/"/, "", $2);print $2}')

cat << EOF
events {
    worker_connections 4096;
}

http {
    upstream backend {
EOF
    
for LINE in $SERVERS ; do
    echo "        server $LINE:8080;"
done

cat << EOF
    }
    server {
        listen 80;
        location / {
            proxy_pass http://backend;
        }
    }
}
EOF
