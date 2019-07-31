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
                node.server.on('onStateChanged', (data) => node.onStateChanged(data));
                node.server.on('onStateChangedError', (error) => node.onStateChangedError(error));
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
            node.send({'status':status});
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
                    var duration = moment.duration({"seconds":node.server.status.cleanTime});
                    status.text += ' ' + duration.humanize();
                break;

                case "waiting":
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
                break;
            }

            //add battery level
            status.text += ' ('+node.server.status.batteryLevel+'%)';

            node.status(status);
        }

        onStateChanged(data) {
            var node = this;
            console.log(data);

            if ("key" in data &&  ["state", "cleanTime", "batteryLevel"].indexOf(data.key) >= 0) {
                node.updateStatus();
            }

            //ignore for now
            if ("key" in data &&  ["msg_seq"].indexOf(data.key) >= 0) {
               return false;
            }

            node.send({'payload': data, 'status':node.server.status});
        }

        onStateChangedError(error) {
            var node = this;
            console.log('ERROR!!!!!!!!!!!!!!!!!!!');
            console.log(error);
            console.log(error.description);
            console.log('=====');

            node.status({
                fill: "red",
                shape: "dot",
                text: error.id
            });
            node.server.warn("Roborock error: "+ error.description)
        }

    }
    RED.nodes.registerType('miio-roborock-event', xiaomiRoborockEvent);
};
