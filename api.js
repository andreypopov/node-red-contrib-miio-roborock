var NODE_PATH = '/miio-roborock/';
const MiioRoborockVocabulary = require('./lib/miio-roborock-vocabulary.js');

const mihome = require('node-mihome');
mihome.miioProtocol.init();
mihome.aqaraProtocol.init();


module.exports = function (RED) {
    /**
     * Enable http route to static files
     */
    RED.httpAdmin.get(NODE_PATH + 'static/*', function (req, res) {
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });

    RED.httpAdmin.get(NODE_PATH + 'getStatus', function (req, res) {
        // res.json({"msg_ver":3,"msg_seq":19069,"state":"charging","batteryLevel":100,"cleanTime":2008,"cleanArea":33300000,"error":{"code":3,"message":"Try moving the vacuum to a different place."},"map_present":1,"in_cleaning":0,"in_returning":0,"in_fresh_state":1,"lab_status":1,"water_box_status":0,"fanSpeed":101,"dnd_enabled":0,"map_status":3,"lock_status":0,"error_code":0});
        var config = req.query;
        var controller = RED.nodes.getNode(config.controllerID);
        if (controller && controller.constructor.name === "ServerNode") {
            res.json(controller.status);
        } else {
            res.json([]);
        }
    });

    RED.httpAdmin.get(NODE_PATH + 'getCommands', function (req, res) {
        res.json(MiioRoborockVocabulary.commands);
    });

    RED.httpAdmin.get(NODE_PATH + 'getVoices', function (req, res) {
        res.json(MiioRoborockVocabulary.voices);
    });

    RED.httpAdmin.get(NODE_PATH + 'find', function (req, res) {
        var config = req.query;
        // var controller = RED.nodes.getNode(config.controllerID);
        // if (controller && controller.constructor.name === "ServerNode") {
        find(config.email, config.password, config.ipAddress).then(function(response){
            res.json(response);
        }).catch(error => {
            res.json(error);
        });
        // } else {
        //     res.json({"error_description":"You have to deploy before searching token"});
        // }

        function find(email, password, ipAddress) {
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
    });
}
