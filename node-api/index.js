const config  = require('./config'),
      restify = require('restify'),
      mysql   = require('mysql'),
      Schema  = require('./Schema.json');

const connection = config.db.connection;

const server = restify.createServer({
  name    : config.name,
  version : config.version,
  url : config.hostname
});

server.use(function crossOrigin(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});


// Entity properties
const fields = Schema.properties.map(ep => 'entity_' + ep.name + '.' + ep.name).join(', ');
const joins = Schema.properties.map(ep => 'entity_' + ep.name)
  .map(table => ' LEFT JOIN ' + table + ' ON (' + table + '.id = entity.id AND ' + table + '.end IS NULL) ')
  .join(' ');


// Read: get functions
server.get('/entities', function (req, res) {
  let sql = `SELECT entity.id, ${fields} FROM entity ${joins} `;
  if (req.query.parents !== '') {
    let last = req.query.parents.split(',').pop();
    sql = sql + `WHERE entity.id IN (${req.query.parents}) OR parent IN (${last})`;
  } else {
    sql = sql + `WHERE entity.id IN (0)`;
  }

  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

// Get Schema
server.get('/schema', function (req, res) {
  res.end(JSON.stringify(Schema));
});

server.get('/entities/:id', function (req, res) {
  let sql = `SELECT entity.id, entity_name.start, ${fields} FROM entity ${joins} WHERE entity.id = ?`;

  connection.query(sql, [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results[0]));
  });
});


// Create : Add new entity
server.post('/entities', function (req, res) {
  const data = JSON.parse(req.body);

  connection.query('INSERT INTO entity VALUES(NULL)', function (error, results, fields) {
    if (error) throw error;
    
    const entity_id = results.insertId;

    // Inserting data in to entity property tables
    for(let ep of Schema.properties) {

      // @TODO: implement frontend to capture data for all properties
      if (!data[ep.name] || data[ep.name] === '') continue;

      const table = 'entity_' + ep.name;

      let dataMap = {};
      dataMap['id'] = entity_id;
      dataMap[ep.name] = data[ep.name];
  
      connection.query('INSERT INTO ?? SET ?', [table, dataMap], function (error, results, fields) {
        if (error) console.log(error);
        res.end(JSON.stringify(results));
      });

    }
  
  });

});


// Update Entity propeties
server.put('/entities/:id', function (req, res) {
  const entity_id = req.params.id;
  const data = JSON.parse(req.body);
  const original_start = data.original_start;

  for(let ep of Schema.properties) {

    const table = 'entity_' + ep.name;

    if (data[ep.name] === undefined || data[ep.name] === null || data[ep.name] === '') {
      connection.query('DELETE FROM ?? WHERE id = ? AND start = ? ', [table, entity_id, original_start], function (error, results, fields) {
        if (error) console.log(error);
        res.end(JSON.stringify(results));
      });
      continue;
    }

    let dataMap = {};
    dataMap['id'] = entity_id;
    dataMap.start = data.start;
    dataMap.end = data.end || null;
    dataMap[ep.name] = data[ep.name];

    connection.query('INSERT INTO ?? SET ? ON DUPLICATE KEY UPDATE ?', [table, dataMap, dataMap], function (error, results, fields) {
      if (error) console.log(error);
      res.end(JSON.stringify(results));
    });

  }

});


// Delete entity and properties
server.del('/entities/:id', function (req, res) {
  connection.query('DELETE FROM entity WHERE entity.id = ?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});


server.opts('/entities/:id', function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'OPTIONS, DELETE, PUT');
  res.send(204);
  return next();
});


// Serve reactjs build 
server.get('/\/.*/', restify.plugins.serveStatic({
  directory: '../web-ui/build/',
  default: 'index.html'
}));