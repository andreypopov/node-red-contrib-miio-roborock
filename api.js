var NODE_PATH = '/miio-roborock/';
const MiioRoborockVocabulary = require('./lib/miio-roborock-vocabulary.js');


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
        var controller = RED.nodes.getNode(config.controllerID);
        if (controller && controller.constructor.name === "ServerNode") {
            controller.find(config.email, config.password, config.ipAddress).then(function(response){
                res.json(response);
            }).catch(error => {
                res.json(error);
            });
        } else {
            res.status(404).end();
        }
    });
}
