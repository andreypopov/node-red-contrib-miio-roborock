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

    // RED.httpAdmin.get(NODE_PATH + 'find', function (req, res) {
    //     var config = req.query;
    //     var controller = RED.nodes.getNode(config.controllerID);
    //
    //
    //     setTimeout(function(){
    //         const devices = miio.devices({
    //             cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
    //         });
    //
    //         devices.on('available', device => {
    //             console.log(device);
    //         });
    //     }, 1000);
    //
    //
    //     if (controller && controller.constructor.name === "ServerNode") {
    //         controller.find(function (result) {
    //             if (result) {
    //                 res.json(result);
    //             } else {
    //                 res.status(404).end();
    //             }
    //         }, forceRefresh);
    //     } else {
    //         res.status(404).end();
    //     }
    // });
}
