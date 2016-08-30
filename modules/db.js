var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://wielrhuhgaumwo:vS5efDv-xOGL5XxcckpMqR2pqT@ec2-54-225-244-221.compute-1.amazonaws.com:5432/dpnm78ei6assj';
pg.defaults.ssl = true;


//PostgreSQL server can only handle 1 query at a time per conenction so use pg.connect
module.exports ={
  query:
      //text is the SQL Query
      //values is for prepared statements
      //cb is a callback function we pass in to do what we want with the query result
      //res is the HTTP response variable
      function(text, values, cb, res, req){
          pg.connect(connectionString, function(err, client, done){
            client.query(text, values, function(err, result){
                done();
                cb(err, result, res, req);
            });
          });
      }
}



