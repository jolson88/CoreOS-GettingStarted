var restify = require('restify');
var r = require('rethinkdb');
var axios = require('axios');
var server = restify.createServer();
var etcd = process.env.COREOS_PRIVATE_IPV4;

var rethinkServer;
function connect() {
    return r.connect({ host: rethinkServer, port: 28015 });
}

function init() {
    return axios.get('http://' + etcd + ':4001/v2/keys/services/rethinkdb').then((response) => {
        rethinkServer = response.data.node.nodes[0].value;
        console.log('RethinkDB Server: ' + rethinkServer);

        return connect().then((conn) => {
            return r.dbList().contains('test').run(conn).then((exists) => {
                if (!exists) {
                    return r.dbCreate('test').run(conn);
                } else {
                    return Promise.resolve();
                }
            }).then(() => {
                return r.tableList().contains('settings').run(conn).then((exists) => {
                    if (!exists) {
                        return r.tableCreate('settings').run(conn).then(() => {
                            return r.table('settings').insert({ name: 'Prompt', value: 'Hello' }).run(conn);
                        });
                    } else {
                        return Promise.resolve();
                    }
                });
            });
        });
    });
}

server.get('/greeting', (req, res, next) => {
    connect().then((conn) => {
        r.table('settings').filter(r.row('name').eq('Prompt')).nth(0)
            .run(conn)
            .then((prompt) => {
                 res.send(prompt['value'] + ', User! From ' + etcd);
                 next();
            });
    });
});

init().then(() => {
    server.listen(8080, () => {
        console.log('Listening on 8080');
    });
});
