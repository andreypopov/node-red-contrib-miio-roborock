const MiioRoborockVocabulary = require('../lib/miio-roborock-vocabulary.js');

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

                    case 'object': {
                        payload = node.config.payload;
                        break;
                    }

                    case 'vacuum_payload':
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
                        if (command in MiioRoborockVocabulary.commands && !MiioRoborockVocabulary.commands[command].args) {
                            payload = [];
                        }
                        switch (command) {
                            case "app_start_wet":
                                command = ["set_custom_mode", "app_start"];
                                payload = [[105], []];
                            break;

                            case "app_wet":
                                command = "set_custom_mode";
                                payload = [105];
                                break;

                            case "app_stop_dock":
                                command = ["app_stop", "app_charge"];
                                payload = [[], []];
                            break;

                            case "dnld_install_sound":
                                var voiceId = parseInt(node.config.voice_pack);
                                if (voiceId > 0 && voiceId in MiioRoborockVocabulary.voices) {
                                    var voicePack = MiioRoborockVocabulary.voices[voiceId];
                                    payload = {"md5":voicePack.md5,"sid":voiceId,"url":voicePack.url,"sver":voicePack.sver};
                                } else {
                                    payload = command = null;
                                }
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

                            if ('app_stop' === command && node.config.homekit_stop_to_dock) {
                                command = ["app_stop", "app_charge"];
                                payload = [[], []];
                            }
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


                if (typeof(command) === 'object') {
                    for (var key in command) {
                        node.sendCommand(command[key], payload[key]);
                    }
                } else {
                    node.sendCommand(command, payload);
                }
            });
        }

        sendCommand(command, payload) {
            var node = this;
            var device = node.server.device;


            if (device === null) return false;
            if (command === null) return false;
            if (payload === undefined) payload = [];
            if (payload && typeof(payload) !== 'object') payload = [payload];

            // console.log('BEFORE SEND:');
            // console.log({command:command,payload:payload});

            return device.call(command, payload).then(result => {
                var status = {
                    fill: "green",
                    shape: "dot",
                    text: command
                };

                var sendPayload = result;
                if (Object.keys(result).length === 1 && (typeof(result[0]) === 'string' || typeof(result[0]) === 'number')) {
                    status.text += ': '+result[0];
                    sendPayload = result[0];
                }
                node.status(status);
                node.cleanTimer = setTimeout(function(){
                    node.status({});
                }, 3000);


                node.send({request: {command: command, payload: payload}, payload: sendPayload});
            }).catch(err => {
                node.warn("Miio Roborock error on command '"+command+"': "+err.message);
                node.send({request: {command: command, args: payload}, error: err});
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "node-red-contrib-miio-roborock/command:status.error"
                });
                node.cleanTimer = setTimeout(function(){
                    node.status({});
                }, 3000);
            });
        }

        formatHomeKit(message, payload) {
            if (message.hap.context === undefined) {
                return null;
            }

            var node = this;
            var msg = {};

            if (Object.keys(payload).length) {
                if (payload.RotationSpeed !== undefined && Object.keys(MiioRoborockVocabulary.fan_power(node.server.device.miioModel)).length) {
                    var newCustomMode = 0;
                    var delta = 100;
                    var speeds = MiioRoborockVocabulary.fan_power(node.server.device.miioModel);
                    for (var i in speeds) {
                        if (delta > Math.abs(payload.RotationSpeed - speeds[i].homekitTopLevel)) {
                            newCustomMode = speeds[i].miLevel;
                            delta = Math.abs(payload.RotationSpeed - speeds[i].homekitTopLevel);
                        }
                    }
                    msg['command'] = 'set_custom_mode';
                    msg['payload'] = [newCustomMode];
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
