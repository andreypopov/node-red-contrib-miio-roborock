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


        onStateChanged(data) {
            var node = this;
            // console.log(node.server.state);
            // console.log('=====');
            // // console.log(data);
            // if ("t" in data && data.t === "event") {
                node.send({'payload': data, 'state':node.server.state});
            //     clearTimeout(node.cleanTimer);
            //     node.status({
            //         fill: "green",
            //         shape: "dot",
            //         text: "node-red-contrib-miio-roborock/event:status.event"
            //     });
            //     node.cleanTimer = setTimeout(function () {
            //         node.status({}); //clean
            //     }, 3000);
            // }

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
