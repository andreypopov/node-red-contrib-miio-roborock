const EventEmitter = require('events');
const miio = require('miio');

module.exports = function(RED) {
    class ServerNode {
        constructor(n) {
            RED.nodes.createNode(this, n);

            var node = this;
            node.config = n;
            node.state = [];

            node.miio = miio.device({
                address: node.config.host,
                token: node.config.token
            }).then(device => {
                node.device = device;
                node.device.updatePollDuration(node.config.polling * 1000);

                node.device.on('stateChanged', state => {
                    if (state.key in node.state && node.state[state.key] === state.value) {

                    } else {
                        if ("error" === state.key) {
                            node.emit("onStateChangedError", state.value);
                        } else {
                            node.state[state.key] = state.value;
                            node.emit("onStateChanged", state);
                        }
                    }
                });

                // The device is available for event handlers
                const handler = ({ action }, device) => console.log('Action', action, 'performed on', device);
                node.device.on('action', handler);
            })
            .catch(err => {
                node.warn('Encountered an error while connecting to device: ' + err.message);
            });


            // const devices = miio.devices({
            //     cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
            // });
            //
            // devices.on('available', device => {
            //     console.log('available');
            //     console.log(device);
            //     if(device.matches('placeholder')) {
            //         // This device is either missing a token or could not be connected to
            //     } else {
            //         // Do something useful with device
            //     }
            // });
            //
            // devices.on('unavailable', device => {
            //     console.log('Device is no longer available and is destroyed');
            //     console.log(device);
            //     // Device is no longer available and is destroyed
            // });
        }
    }

    RED.nodes.registerType('miio-roborock-server', ServerNode, {});
};

