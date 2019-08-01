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

            node.on('input', function(message) {
                clearTimeout(node.cleanTimer);

                var payload;
                switch (node.config.payloadType) {
                    case 'flow':
                    case 'global': {
                        RED.util.evaluateNodeProperty(node.config.payload, node.config.payloadType, this, message, function (error, result) {
                            if (error) {
                                node.error(error, message);
                            } else {
                                payload = result;
                            }
                        });
                        break;
                    }
                    case 'date': {
                        payload = Date.now();
                        break;
                    }

                    case 'object':
                    case 'homekit':
                    case 'msg':
                    case 'num':
                    case 'str':
                    default: {
                        payload = message[node.config.payload];
                        break;
                    }
                }

                var command;
                switch (node.config.commandType) {
                    case 'msg': {
                        command = message[node.config.command];
                        break;
                    }
                    case 'vacuum_cmd':
                        command = node.config.command;
                        switch (command) {
                            default: {
                                break;
                            }
                        }
                        break;

                    case 'homekit_cmd':
                        var fromHomekit = node.formatHomeKit(message, payload);
                        if (fromHomekit && 'payload' in fromHomekit) {
                            payload = fromHomekit['payload'];
                            command = fromHomekit['command'];
                        } else {
                            payload = command = null;
                        }
                        break;

                    case 'str':
                    default: {
                        command = node.config.command;
                        break;
                    }
                }

                //empty payload, stop
                if (payload === null) {
                    return false;
                }

                if (payload && typeof(payload) !== 'object') {
                    payload = [payload];
                }

                var device = node.server.device;
                device.call(command, payload).then(result => {
                    node.send( {request: { command: command, args: payload }, payload: result } );
                })
                .catch(err => {
                    console.log('Encountered an error while controlling device');
                    console.log('Error was (3):');
                    console.log(err.message);
                    console.log('command'+command);
                    console.log(payload);
                    node.send( {request: { command: command, args: payload }, err: err } );
                });



            });


        }

        formatHomeKit(message, payload) {
            if (message.hap.context === undefined) {
                return null;
            }


            var msg = {};

            if (Object.keys(payload).length) {
                if (payload.RotationSpeed !== undefined) {
                    msg['command'] = 'set_custom_mode';
                    msg['payload'] = [payload.RotationSpeed];
                } else if (payload.Active !== undefined) {
                    msg['command'] = payload.Active ? 'app_start' : 'app_stop';
                    msg['payload'] = [];
                } else if (payload.On !== undefined) {
                    msg['command'] = payload.On ? 'app_start' : 'app_stop';
                    msg['payload'] = [];
                } else if (payload.SwingMode !== undefined) {
                    msg['command'] = 'set_custom_mode';
                    msg['payload'] = payload.SwingMode ? [105] : [100];
                } else if (payload.LockPhysicalControls !== undefined) {
                    msg['command'] = 'app_charge';
                    msg['payload'] = [];
                }
            }


            return msg;
        }
    }

    RED.nodes.registerType('miio-roborock-command', xiaomiRoborockCommand);
};
