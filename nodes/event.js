var moment = require('moment');


module.exports = function(RED) {
    class xiaomiRoborockEvent {
        constructor(config) {
            RED.nodes.createNode(this, config);

            var node = this;
            node.config = config;
            node.cleanTimer = null;
            node.status({}); //clean

            //get server node
            node.server = RED.nodes.getNode(node.config.server);
            if (node.server) {
                node.listener_onInitEnd =  function(status) { node.onInitEnd(status); }
                node.server.on('onInitEnd', node.listener_onInitEnd);

                node.listener_onStateChanged =  function(data, output) { node.onStateChanged(data, output); }
                node.server.on('onStateChanged', node.listener_onStateChanged);

                node.listener_onStateChangedError =  function(error) { node.onStateChangedError(error); }
                node.server.on('onStateChangedError', node.listener_onStateChangedError);

                node.on('close', () => this.onClose());

                if (node.config.outputAtStartup) {
                    node.sendState();
                }
            } else {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "node-red-contrib-miio-roborock/event:status.server_node_error"
                });
            }

            node.on('input', function(message) {
                node.send({
                    'payload': node.server.status
                });
            });
        }

        onClose() {
            var node = this;

            //remove listeners
            if (node.listener_onInitEnd) {
                node.server.removeListener('onInitEnd', node.listener_onInitEnd);
            }
            if (node.listener_onStateChanged) {
                node.server.removeListener('onStateChanged', node.listener_onStateChanged);
            }
            if (node.listener_onStateChangedError) {
                node.server.removeListener("onStateChangedError", node.listener_onStateChangedError);
            }
        }

        onInitEnd(status) {
            var node = this;
            node.updateStatus();

            if (node.config.outputAtStartup) {
                node.sendState();
            }
        }

        sendState() {
            var node = this;
            if (Object.keys(node.server.status).length) {
                for (var key in node.server.status) {
                    var value = node.server.status[key];
                    node.send({
                        'payload': {"key":key, "value":value},
                        'status': node.server.status
                    });
                }
            }
        }

        updateStatus() {
            var node = this;

            var status = {
                fill: "green",
                shape: "dot",
                text: node.server.status.state_text!==undefined?node.server.status.state_text:node.server.status.state
            };

            switch (status.text) {
                case "cleaning":
                case "spot-cleaning":
                case "zone-cleaning":
                case "room-cleaning":
                    var duration = moment.duration({"seconds":node.server.status.clean_time});
                    status.text += ' ' + duration.humanize();
                    status.shape = 'ring';
                break;

                case "error":
                    status.fill = 'red';
                    status.shape = 'dot';
                    status.text = status.text?status.text:'error';
                break;

                case "charger-offline":
                case "charger-error":
                case "full":
                    status.fill = 'red';
                    status.shape = 'dot';
                    if ("error_code" in node.server.status && node.server.status.error_code > 0) {
                        status.text += ' ⛔'+ node.server.status.error_code;
                    }
                    break;

                case "returning":
                case "coordinates":
                case "initiating":
                case "waiting":
                case "paused":
                case "docking":
                case "shutting-down":
                case "updating":
                    status.fill = 'yellow';
                    status.shape = 'ring';
                break;

                case "charging":
                    if (node.server.status.battery <= 20) {
                        status.fill = 'red';
                    } else if (node.server.status.battery <= 50) {
                        status.fill = 'yellow';
                    } else {
                        status.fill = 'green';
                    }

                    status.shape = node.server.status.battery>=100?'dot':'ring';
                break;
            }

            //add battery
            if ("battery" in node.server.status) {
                status.text += ' ⚡' + node.server.status.battery + '%';
            }

            //water mode
            if ("water_box_carriage_status" in node.server.status && parseInt(node.server.status.water_box_carriage_status)) {
                status.text += ' 💧';
            }

            node.status(status);
        }

        onStateChanged(data, output) {
            var node = this;

            if ("key" in data &&  ["state_text", "clean_time", "battery", "water_box_carriage_status"].indexOf(data.key) >= 0) {
                node.updateStatus();
            }

            if (output) {
                node.send({
                    'payload': data,
                    'status': node.server.status
                });
            }
        }

        onStateChangedError(error) {
            var node = this;
            node.updateStatus();
        }

    }
    RED.nodes.registerType('miio-roborock-event', xiaomiRoborockEvent);
};


