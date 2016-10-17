var restify = require('restify');
var r = require('rethinkdb');
var server = restify.createServer();

function connect() {
    return r.connect({ host: 'rethinkdb', port: 28015, db: 'test' });
}

function init() {
    return connect().then((conn) => {
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
}

server.get('/greeting', (req, res, next) => {
    connect().then((conn) => {
        r.table('settings').filter(r.row('name').eq('Prompt')).nth(0)
            .run(conn)
            .then((prompt) => {
                 res.send(prompt['value'] + ', User!');
                 next();
            });
    });
});

init().then(() => {
    server.listen(8080, () => {
        console.log('Listening on 8080');
    });
});
