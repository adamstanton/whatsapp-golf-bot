const pg = require('pg'); 
//pg.defaults.ssl = true;
const conString = 'postgres://postgres:_D@t44mst@localhost/arss18'; 
//const conString = 'postgres://efqcbixfeqptjv:cmN2eFGKbVb1PL9eevaN8UiKiC@ec2-54-243-201-107.compute-1.amazonaws.com:5432/d96ld19pqkonuj'; 
//const conString = 'postgres://u8n0r9hfbt6bqp:pd57k7daq794ga9dbqfo4rmdk4i@ec2-52-44-76-152.compute-1.amazonaws.com:5432/d9icec58inj85c'
//const conString = 'postgres://ua7asv4on7ohcu:pceb75f2df91963693ab4d16d74f85a973b4b8249267a7fb592ecb46273ba2663@ec2-34-233-225-248.compute-1.amazonaws.com:5432/d1llfkumb03ke6'
var SQLClient;

pg.connect(conString, function (err, client, done) {  
    console.log('connect' + conString);
  if (err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::varchar AS my_first_query', ['node hero'], function (err, result) {
  //  done();

    if (err) {
      return console.error('error happened during query', err);
    }
    //set Global DB
    SQLClient = client;

  })
})



function User(){
    this.u_id = 0;
    //this.name ='';
    //this.photo ='';
    this.username = "";
    this.password= ""; //need to declare the things that i want to be remembered for each user in the database

    this.save = function(callback) {
        const conString = 'postgres://postgres:_D@t44mst@localhost/arss18';
        //const conString = 'postgres://efqcbixfeqptjv:cmN2eFGKbVb1PL9eevaN8UiKiC@ec2-54-243-201-107.compute-1.amazonaws.com:5432/d96ld19pqkonuj';
       // const conString = 'postgres://u8n0r9hfbt6bqp:pd57k7daq794ga9dbqfo4rmdk4i@ec2-52-44-76-152.compute-1.amazonaws.com:5432/d9icec58inj85c'

        var client = new pg.Client(conString);
        client.connect();

        console.log(this.email +' will be saved');

            client.query('INSERT INTO users(username, password) VALUES($1, $2)', [this.username, this.password], function (err, result) {
                if(err){
                    console.log(err);
                    return console.error('error running query', err);
                }
                console.log(result.rows);
                //console.log(this.email);
            });
            client.query('SELECT * FROM users ORDER BY uniqueid desc limit 1', null, function(err, result){

                if(err){
                    return callback(null);
                }
                //if no rows were returned from query, then new user
                if (result.rows.length > 0){
                    console.log(result.rows[0] + ' is found!');
                    var user = new User();
                    user.email= result.rows[0]['username'];
                    user.password = result.rows[0]['password'];
                    user.u_id = result.rows[0]['userid'];
                    console.log(user.username);
                    client.end();
                    return callback(user);
                }
            });



            //whenever we call 'save function' to object USER we call the insert query which will save it into the database.
        //});
    };
        //User.connect

    //this.findById = function(u_id, callback){
    //    console.log("we are in findbyid");
    //    var user = new User();
    //    user.email= 'carol';
    //    user.password='gah';
    //    console.log(user);
    //
    //    return callback(null, user);
    //
    //};


}

User.findOne = function(username, callback){
    //const conString = 'postgres://postgres:_D@t44mst@localhost/rugbyDB';

    var isNotAvailable = false; //we are assuming the email is taking
    //var email = this.email;
    //var rowresult = false;
    //console.log(username + ' is in the findOne function test');
    //check if there is a user available for this email;
  //  client.connect();
  //  client.connect(function(err) {
       //console.log(this.photo);
       //console.log(email);
   //    if (err) {
    //       return console.error('could not connect to postgres', err);
     //   }
   // });
    
        console.log(username + ' is in the findOne function test');
    SQLClient.query("SELECT * from users where username = $1", [username], function(err, result) {
        if(err){
          //  console.log(username + ' is in the findOne function test');
            return callback(err, isNotAvailable, this);
        }
        //if no rows were returned from query, then new user
        if (result.rowCount > 0 && result.rows[0]['active'] === true) {
            isNotAvailable = true; // update the user for return in callback
            ///email = email;
            //password = result.rows[0].password;
            console.log(username + ' is in the findOne function test');
            console.log(username + ' find ' + result.rows[0].username); 
            return callback(false, result.rows[0], this);
        }
        else {
            console.log(username + ' is in the findOne function test');
            isNotAvailable = false;
            //email = email;
            console.log(username + ' cannot find');
            return callback(false, isNotAvailable, this);
        }
        //the callback has 3 parameters:
        // parameter err: false if there is no error
        //parameter isNotAvailable: whether the email is available or not
        // parameter this: the User object;

      //  client.end();
       


    });
//});
};

User.findById = function(id, callback){
    console.log("we are in findbyid");
    const conString = 'postgres://postgres:_D@t44mst@localhost/arss18';
    //const conString = 'postgres://efqcbixfeqptjv:cmN2eFGKbVb1PL9eevaN8UiKiC@ec2-54-243-201-107.compute-1.amazonaws.com:5432/d96ld19pqkonuj';
   // const conString = 'postgres://u8n0r9hfbt6bqp:pd57k7daq794ga9dbqfo4rmdk4i@ec2-52-44-76-152.compute-1.amazonaws.com:5432/d9icec58inj85c'

    var client = new pg.Client(conString);

    client.connect();
    client.query("SELECT * from users where uniqueid = $1", [id], function(err, result){

        if(err){
            return callback(err, null);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0 && result.rows[0]['active'] === true ){
            console.log(result.rows[0] + ' is found!');
            var user = new User();
            user.email= result.rows[0]['username'];
            user.password = result.rows[0]['password'];
            user.u_id = result.rows[0]['userid'];
            console.log(user.email);
            return callback(null, user);
        }
    });
};

//User.connect = function(callback){
//    return callback (false);
//};

//User.save = function(callback){
//    return callback (false);
//};

module.exports = User;

