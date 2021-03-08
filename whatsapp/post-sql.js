

module.exports = function( sql) {

    config = require('../config/project-config.json');

   // console.log('in post-sql=' + config.testmode);
    if (config.testmode != 1)
    {
         //console.log('in post-sql=' + config.testmode);
        sql.connect(config, err => {
            // ... error checks
        
            // Query
            new sql.Request().query('select * from Tournament where status = 1', (err, result) => {
                // ... error checks
                tournID = result.recordset[0].TournamentID;
                //console.dir(result.recordset[0].TournamentID);
                new sql.Request().query('SELECT * from Leaderboard where TournamentID = ' + result.recordset[0].TournamentID + ' and Round = ' + result.recordset[0].CurrentRound 
                + ' ORDER BY Match, orderInMatch', (err, result) => {
                    golfDraw = result.recordset;
                     // console.log(golfDraw);
                }) 
            })
        });    
    }   

    sql.on('error', err => {
        // ... error handler
        console.log('post-sql: error in query');
    })
}
