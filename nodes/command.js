const miio = require('miio');

module.exports = function(RED) {
    class xiaomiRoborockCommand {
        constructor(config) {
            RED.nodes.createNode(this, config);

            var node = this;
            node.config = config;
            node.cleanTimer = null;

            //get server node
            node.server = RED.nodes.getNode(node.config.server);
            if (node.server) {
                // node.server.on('onClose', () => this.onClose());
                // node.server.on('onStateChanged', (data) => node.onStateChanged(data));
                // node.server.on('onStateChangedError', (error) => node.onStateChangedError(error));
            } else {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "node-red-contrib-miio-roborock/command:status.server_node_error"
                });
            }

            node.status({}); //clean

            node.on('input', function(msg) {
                node.command = msg.payload.command || config.command || 'find_me';
                node.args = msg.payload.args || config.args || null;

                var device = node.server.device;
                device.call(node.command, node.args)
                    .then(result => {
                        node.send( {request: { command: node.command, args: node.args, jobid: node.jobid }, payload: result } );
                    })
                    .catch(err => {
                        console.log('Encountered an error while controlling device');
                        console.log('Error was:');
                        console.log(err.message);
                        node.send( {request: { command: node.command, args: node.args, jobid: node.jobid }, err: err } );
                    });


            });


        }
    }

    RED.nodes.registerType('miio-roborock-command', xiaomiRoborockCommand);
};
