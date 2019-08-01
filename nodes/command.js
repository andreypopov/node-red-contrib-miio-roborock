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
                    console.log('Error was:');
                    console.log(err.message);
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
                }
            }


            return msg;
        }

        getCommands() {
            return {
                app_start: {name:"Start vacuuming", link:""},
                app_stop: {name:"Stop vacuuming", link:""},
                app_spot: {name:"Start spot cleaning", link:""},
                app_pause: {name:"Pause cleaning", link:""},
                app_charge: {name:"Start charging", link:""},
                find_me: {name:"Send findme", link:""},
                get_consumable: {name:"Get consumables status", link:""},
                reset_consumable: {name:"Reset consumables", link:""},
                get_clean_summary: {name:"Cleaning details", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/cleanSummary+detail.md"},
                get_clean_record: {name:"Cleaning details", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/cleanSummary+detail.md"},
                get_clean_record_map: {name:"Get the map reference", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/getMap.md"},
                get_map_v1: {name:"Get Map", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/getMap.md"},
                get_status: {name:"Get Status information", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/StatusMessage.md"},
                get_serial_number: {name:"Get Serial #", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/getSerial.md"},
                get_dnd_timer: {name:"Do Not Disturb Settings", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md"},
                set_dnd_timer: {name:"Set the do not disturb timings", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md"},
                close_dnd_timer: {name:"Disable the do not disturb function", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md"},
                set_timer: {name:"Add a timer", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md"},
                upd_timer: {name:"Activate/deactivate a timer", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md"},
                get_timer: {name:"Get Timers", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md"},
                del_timer: {name:"Remove a timer", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md"},
                get_timezone: {name:"Get timezone", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timezone.md"},
                set_timezone: {name:"Set timezone", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timezone.md"},
                dnld_install_sound: {name:"Voice pack installation", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/install_sound.md"},
                get_current_sound: {name:"Current voice", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/CurrentVoice.md"},
                get_sound_volume: {name:"Get sound level", link:""},
                get_log_upload_status: {name:"Get log upload status", link:""},
                enable_log_upload: {name:"Enable log upload", link:""},
                set_custom_mode: {name:"Set the vacuum level", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/FanPower.md"},
                get_custom_mode: {name:"Get the vacuum level", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/FanPower.md"},
                app_rc_start: {name:"Start remote control", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md"},
                app_rc_end: {name:"End remote control", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md"},
                app_rc_move: {name:"Remote control move command", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md"},
                get_gateway: {name:"Get current gateway", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/MiscCmds.md"},
                app_zoned_clean: {name:"Start zone vacuum", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/app_zoned_clean.md"},
                app_goto_target: {name:"Send vacuum to coordinates", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/app_goto_target.md"},
            };
        }
    }

    RED.nodes.registerType('miio-roborock-command', xiaomiRoborockCommand);
};
