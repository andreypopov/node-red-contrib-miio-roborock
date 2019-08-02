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

                    case 'num': {
                        payload = parseInt(node.config.payload);
                        break;
                    }

                    case 'str': {
                        payload = node.config.payload;
                        break;
                    }

                    case 'vacuum_payload':
                    case 'object':
                    case 'homekit':
                    case 'msg':
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
                            case "app_start_wet":
                                command = ["set_custom_mode", "app_start"];
                                payload = [[105], []];
                            break;

                            case "app_stop_dock":
                                command = ["app_stop", "app_charge"];
                                payload = [[], []];
                            break;

                            case "app_zoned_clean":
                                if (node.config.payloadType === 'vacuum_payload') {
                                    payload = JSON.parse((node.config.coordinates).replace(/\s+/g, " "));
                                }
                                break;

                            case "set_custom_mode":
                                if (node.config.payloadType === 'vacuum_payload') {
                                    payload = parseInt((node.config.fan_speed));
                                    if (payload > 100 || isNaN(payload)) payload = 100;
                                    if (payload < 0) payload = 0;
                                }
                                break;

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

                if (typeof(command) === 'object') {
                    for (var key in command) {
                        var commandVal = command[key];
                        var payloadVal = payload[key];

                        // console.log('BEFORE SEND ARRAY:');
                        // console.log({command:commandVal,payload:payloadVal});
                        // break;


                        device.call(commandVal, payloadVal).then(result => {
                            node.send({request: {command: commandVal, args: payloadVal}, payload: result});
                        }).catch(err => {
                            console.log('Encountered an error while controlling device');
                            console.log('Error was (3):');
                            console.log(err.message);
                            console.log('command' + commandVal);
                            console.log(payloadVal);
                            node.send({request: {command: commandVal, args: payloadVal}, err: err});
                        });
                    }
                } else {

                    // console.log('BEFORE SEND:');
                    // console.log({command:command,payload:payload});
                    // return false;


                    device.call(command, payload).then(result => {
                        node.send({request: {command: command, args: payload}, payload: result});
                    }).catch(err => {
                        console.log('Encountered an error while controlling device');
                        console.log('Error was (3):');
                        console.log(err.message);
                        console.log('command' + command);
                        console.log(payload);
                        node.send({request: {command: command, args: payload}, err: err});
                    });
                }



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
