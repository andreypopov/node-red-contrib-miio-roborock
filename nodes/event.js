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
                // node.server.on('onClose', () => this.onClose());
                node.server.on('onInitEnd', (status) => node.onInitEnd(status));
                node.server.on('onStateChanged', (data, output) => node.onStateChanged(data, output));
                node.server.on('onStateChangedError', (error) => node.onStateChangedError(error));


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
                    if ((node.config.eventTypes).indexOf(key) >= 0) {
                        node.send({'payload': {"key":key, "value":value}, 'status': node.server.status});
                    }
                }
            }
        }

        updateStatus() {
            var node = this;

            var status = {
                fill: "green",
                shape: "dot",
                text: node.server.status.state
            };

            switch (status.text) {
                case "cleaning":
                case "spot-cleaning":
                case "zone-cleaning":
                    var duration = moment.duration({"seconds":node.server.status.cleanTime});
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
                    if ("error" in node.server.status && node.server.status.error && "code" in node.server.status.error) {
                        status.text += ' code #'+ node.server.status.error.code;
                    }
                    break;

                case "returning":
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
                    if (node.server.status.batteryLevel <= 20) {
                        status.fill = 'red';
                    } else if (node.server.status.batteryLevel <= 50) {
                        status.fill = 'yellow';
                    } else {
                        status.fill = 'green';
                    }

                    status.shape = node.server.status.batteryLevel<95?'ring':'dot';
                break;
            }

            //add battery level
            status.text += ' ('+node.server.status.batteryLevel+'%)';

            node.status(status);
        }

        onStateChanged(data, output) {
            var node = this;

            if ("key" in data &&  ["state", "cleanTime", "batteryLevel"].indexOf(data.key) >= 0) {
                node.updateStatus();
            }

            if (output) {
                if ("key" in data && node.config.eventTypes && (node.config.eventTypes).indexOf(data.key) >= 0) {
                    node.send({'payload': data, 'status': node.server.status});
                }
            }
        }

        onStateChangedError(error) {
            var node = this;
            node.updateStatus();
        }

    }
    RED.nodes.registerType('miio-roborock-event', xiaomiRoborockEvent);
};


