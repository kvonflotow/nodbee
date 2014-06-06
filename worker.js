/** nodebee cluster worker
 *  2014 kevin von flotow
 */
( function ()
    {
        var CLUSTER = require( 'cluster' )
        
        // return if not worker
        if ( !CLUSTER.isWorker )
        {
            return
        }
        
        var PATH = require( 'path' )

        // load net module for tcp server
        var NET = require( 'net' )

        // require index from lib directory
        // var LIB = require( PATH.join( __dirname, 'lib' ) )

        var Collection = require( PATH.join( __dirname, 'lib', 'constructors', 'Collection' ) )

        // reference Socket class
        var Socket = require( PATH.join( __dirname, 'lib', 'constructors', 'Socket' ) )

        // default port is 2324 - can overwrite with command line
        var PORT = 2324

        // set custom port from command line
        if ( process.argv.length > 2 )
        {
            // use the first argument
            PORT = process.argv[ 2 ]
        }

        // create tcp server
        var server = NET.createServer(
            {
                allowHalfOpen: true
            }
        )

        // listen for connections
        server.on( 'connection', function ( socket )
            {
                new Socket( socket )
            }
        )

        console.log( process.env.NBKEY )

        // bind server to port
        server.listen( PORT, function ()
            {
                // server is bound
                console.log( 'nodebee worker listening on port ' + PORT )

                var col = new Collection( 'testcollection' )

                console.log( col )
            }
        )
        
        /* process.on( 'uncaughtException', function ( msg, data )
            {
                console.log( msg )
                
                console.log( data )
                
                process.kill()
            }
        ) */
    }
)()