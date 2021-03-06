/** nodbee messages worker module
 *  2014 kevin von flotow
 *
 *  communication with master node
 */
( function ()
    {
        var CLUSTER = require( 'cluster' )

        var UTIL = require( 'util' )

        var EventEmitter = require( 'events' ).EventEmitter

        var UID = 0

        /** @constructor */
        function Messages()
        {
            EventEmitter.call( this )

            this.connected = false

            this.init()
        }

        UTIL.inherits( Messages, EventEmitter )

        Messages.prototype.init = function ()
        {
            ( function ( that )
                {
                    // setup some listeners
                    that
                        .on( 'connected', function ()
                            {
                                that.connected = true
                            }
                        )
                }
            )( this )
        }

        Messages.prototype.send = function ( name, data, callback )
        {
            //data = data || {}

            // always include worker id
            //data.worker = data.worker || CLUSTER.worker.id

            // make sure name is a string
            name = name.toString()

            if ( callback )
            {
                var uid = UID++

                var that = this

                this.once( name + uid, callback )
            }

            process.send(
                {
                    name: name,

                    data: data
                }
            )
        }

        var messages = new Messages()

        process.on( 'message', function ( message )
            {
                if ( !message.name )
                {
                    return
                }

                messages.emit( message.name, message.data )
            }
        )

        module.exports = messages
    }
)()
