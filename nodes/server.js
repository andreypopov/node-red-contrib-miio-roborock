const EventEmitter = require('events');
const miio = require('miio');
const MiioRoborockVocabulary = require('../lib/miio-roborock-vocabulary.js');
const retryOpertation = require('../lib/retry.js');

const mihome = require('node-mihome');
mihome.miioProtocol.init();
mihome.aqaraProtocol.init();


module.exports = function (RED) {
    class ServerNode {
        constructor(n) {
            RED.nodes.createNode(this, n);

            var node = this;
            node.config = n;
            node.state = [];
            node.status = {};

            node.setMaxListeners(255);
            node.refreshFindTimer = null;
            node.refreshFindInterval = node.config.polling * 1000;
            node.on('close', () => this.onClose());

            retryOperation(node.connect.bind(node), 'Connecting Miio Roborock')
                .then((result) => {
                    return node.getStatus(true)
                        .then((result) => {
                            node.emit("onInitEnd", result);
                        });
                })
                .catch((e) => console.log('Connecting to Miio Roborock failed', e));

            node.refreshStatusTimer = setInterval(function () {
                node.getStatus(true).catch((e) => console.log('Could not get status:', e));
            }, node.refreshFindInterval);
        }

        find(email, password, ipAddress) {
            var node = this;

            return new Promise(function (resolve, reject) {
//********* CONFIGURATION *********
                var _COUNTRY = "de"
//********* CONFIGURATION END *********

                if (mihome.miCloudProtocol.isLoggedIn) {
                    GetDeviceByIP(ipAddress).then(data => {
                        resolve(data)
                    }).catch(err => {
                        reject({"error_description": "Device not found, check IP address", "err":err});
                    });
                } else {
                    LoginMethod().then(_ => {
                        GetDeviceByIP(ipAddress).then(data => {
                            resolve(data)
                        }).catch(err => {
                            reject({"error_description": "Device not found, check IP address", "err":err});
                        });
                    }).catch(err => {
                        reject({"error_description": "Error: Invalid email/password", "err":err});
                    });
                }

                async function LoginMethod() {
                    await mihome.miCloudProtocol.login(email, password);
                }

                async function GetDeviceByIP(ip_address) {
                    return new Promise((resolve, reject) => {
                        GetDevices().then(devices => {
                            for (var i in devices) {
                                if (devices[i].localip === ip_address) {
                                    resolve(devices[i]);
                                    break;
                                }
                            }
                            reject({"error_description": 'Device not found'});
                        }).catch(err => {
                            reject({"error_description": 'Get devices error'});
                        });
                    });
                }

                async function GetDevices() {
                    return await mihome.miCloudProtocol.getDevices(null, {country: _COUNTRY});
                }
            });
        }

        onClose() {
            var that = this;
            clearInterval(that.refreshStatusTimer);

            if (that.device) {
                that.device.destroy();
                that.device = null;
            }
        }

        connect() {
            var node = this;

            return new Promise(function (resolve, reject) {
                node.miio = miio.device({
                    address: node.config.ip,
                    token: node.config.token
                }).then(device => {
                    node.device = device;
                    node.device.updateMaxPollFailures(0);


                    // console.log('Miio Roborock: Connected');

                    node.device.on('thing:initialized', () => {
                        node.log('Miio Roborock: Initialized');
                    });

                    node.device.on('thing:destroyed', () => {
                        node.log('Miio Roborock: Destroyed');
                    });

                    resolve(device);

                }).catch(err => {
                    node.warn('Miio Roborock Error: ' + err.message);
                    reject(err);
                });
            });
        }

        getStatus(force = false) {
            var that = this;

            return new Promise(function (resolve, reject) {
                if (force || !that.status) {
                    if (that.device !== null && that.device !== undefined) {
                        that.device.call("get_status", [])
                            .then(result => {
                                var result = result[0];
                                var props = {};
                                Object.assign(props, result);

                                //remove unused vars
                                if ("msg_ver" in result) delete(result['msg_ver']);
                                if ("msg_seq" in result) delete(result['msg_seq']);

                                //compatible mode
                                if ('batteryLevel' in result) { result['battery'] = result['batteryLevel']; delete(result['batteryLevel']); }
                                if ('fanSpeed' in result) { result['fan_power'] = result['fanSpeed']; delete(result['fanSpeed']); }
                                if ('cleanTime' in result) { result['clean_time'] = result['cleanTime']; delete(result['cleanTime']); }
                                if ('cleanArea' in result) { result['clean_area'] = result['cleanArea']; delete(result['cleanArea']); }

                                //add texts
                                if ("state" in result && result.state in MiioRoborockVocabulary.states) {
                                    result.state_text = MiioRoborockVocabulary.states[result.state];
                                }
                                if ("fan_power" in result && Object.keys(MiioRoborockVocabulary.fan_power(that.device.miioModel)).length && result.fan_power in MiioRoborockVocabulary.fan_power(that.device.miioModel)) {
                                    result.fan_power_homekit = MiioRoborockVocabulary.fan_power(that.device.miioModel)[result.fan_power].homekitTopLevel;
                                    result.fan_power_text = (MiioRoborockVocabulary.fan_power(that.device.miioModel)[result.fan_power].name).toLowerCase();
                                }
                                if ("water_box_mode" in result && result.water_box_mode in MiioRoborockVocabulary.water_box_mode) {
                                    result.water_box_mode_text = MiioRoborockVocabulary.water_box_mode[result.water_box_mode];
                                }
                                if ("error_code" in result && result.error_code in MiioRoborockVocabulary.errors) {
                                    result.error_code_text = MiioRoborockVocabulary.errors[result.error_code].description;
                                    that.warn('Miio Roborock error: #' + result.error_code + ': ' + result.error_code_text);
                                    that.emit("onStateChangedError", result.error_code_text);
                                }

                                //get changed values
                                for (var key in result) {
                                    var value = result[key];
                                    if (key in that.status) {
                                        if (!(key in that.status) || that.status[key] !== value) {
                                            that.status[key] = value;
                                            that.emit("onStateChanged", {key: key, value: value}, true);
                                        }
                                    } else { //init: silent add
                                        that.status[key] = value;
                                        that.emit("onStateChanged", {key: key, value: value}, false);
                                    }
                                }

                                resolve(that.status);
                            }).catch(err => {
                                console.log('Encountered an error while controlling device');
                                console.log('Error(2) was:');
                                console.log(err.message);
                                that.connect();
                                reject(err);
                            });
                    } else {
                        that.connect();
                        reject('No device');
                    }
                } else {
                    resolve(that.status);
                }
            });
        }


    }

    RED.nodes.registerType('miio-roborock-server', ServerNode, {});
};

