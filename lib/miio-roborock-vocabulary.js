'use strict';


class MiioRoborockVocabulary {
    static get models() {
        return {
            'rockrobo.vacuum.v1': MiioRoborockVocabulary.speedmodes_gen1,
            'roborock.vacuum.c1': MiioRoborockVocabulary.speedmodes_gen1,
            'roborock.vacuum.s5': MiioRoborockVocabulary.speedmodes_gen2,
            'roborock.vacuum.s6': MiioRoborockVocabulary.speedmodes_gen3,
        }
    }

    static get speedmodes_gen1() {
        return [
            // 0%       = Off / Aus
            { homekitTopLevel: 0, miLevel: 0, name: "Off" },
            // 1-38%   = "Quiet / Leise"
            { homekitTopLevel: 38, miLevel: 38, name: "Quiet" },
            // 39-60%  = "Balanced / Standard"
            { homekitTopLevel: 60, miLevel: 60, name: "Balanced" },
            // 61-77%  = "Turbo / Stark"
            { homekitTopLevel: 77, miLevel: 77, name: "Turbo" },
            // 78-100% = "Full Speed / Max Speed / Max"
            { homekitTopLevel: 100, miLevel: 90, name: "Max" }
        ];
    }

    static get speedmodes_gen2() {
        return [
            // 0%      = Off / Aus
            { homekitTopLevel: 0, miLevel: 0, name: "Off" },
            // 1-15%   = "Mop / Mopping / Nur wischen"
            { homekitTopLevel: 15, miLevel: 105, name: "Mop" },
            // 16-38%  = "Quiet / Leise"
            { homekitTopLevel: 38, miLevel: 38, name: "Quiet" },
            // 39-60%  = "Balanced / Standard"
            { homekitTopLevel: 60, miLevel: 60, name: "Balanced" },
            // 61-75%  = "Turbo / Stark"
            { homekitTopLevel: 75, miLevel: 75, name: "Turbo" },
            // 76-100% = "Full Speed / Max Speed / Max"
            { homekitTopLevel: 100, miLevel: 100, name: "Max" }
        ];
    }

    static get speedmodes_gen3() {
        return [
            // 0%      = Off / Aus
            { homekitTopLevel: 0, miLevel: 0, name: "Off" },
            // 1-38%   = "Quiet / Leise"
            { homekitTopLevel: 38, miLevel: 101, name: "Quiet" },
            // 39-60%  = "Balanced / Standard"
            { homekitTopLevel: 60, miLevel: 102, name: "Balanced" },
            // 61-77%  = "Turbo / Stark"
            { homekitTopLevel: 77, miLevel: 103, name: "Turbo" },
            // 78-100% = "Full Speed / Max Speed / Max"
            { homekitTopLevel: 100, miLevel: 104, name: "Max" }
        ];
    }

    // From https://github.com/aholstenson/miio/blob/master/lib/devices/vacuum.js#L128
    static get cleaningStatuses() {
        return [
            'cleaning',
            'spot-cleaning',
            'zone-cleaning'
        ];
    }

    static get states() {
        return {
            1:'initiating',
            2:'charger-offline',
            3:'waiting',
            5:'cleaning',
            6:'returning',
            8:'charging',
            9:'charging-error',
            10:'paused',
            11:'spot-cleaning',
            12:'error',
            13:'shutting-down',
            14:'updating',
            15:'docking',
            16:'coordinates',
            17:'zone-cleaning',
            100:'full',

            101: 'quiet',
            102: 'balanced',
            103: 'turbo',
            104: 'max'
        };
    }

    static get errors() {
        return {
            id1: { description: 'Try turning the orange laserhead to make sure it isnt blocked.' },
            id2: { description: 'Clean and tap the bumpers lightly.' },
            id3: { description: 'Try moving the vacuum to a different place.' },
            id4: { description: 'Wipe the cliff sensor clean and move the vacuum to a different place.' },
            id5: { description: 'Remove and clean the main brush.' },
            id6: { description: 'Remove and clean the sidebrushes.' },
            id7: { description: 'Make sure the wheels arent blocked. Move the vacuum to a different place and try again.' },
            id8: { description: 'Make sure there are no obstacles around the vacuum.' },
            id9: { description: 'Install the dustbin and the filter.' },
            id10: { description: 'Make sure the filter has been tried or clean the filter.' },
            id11: { description: 'Strong magnetic field detected. Move the device away from the virtual wall and try again' },
            id12: { description: 'Battery is low, charge your vacuum.' },
            id13: { description: 'Couldnt charge properly. Make sure the charging surfaces are clean.' },
            id14: { description: 'Battery malfunctioned.' },
            id15: { description: 'Wipe the wall sensor clean.' },
            id16: { description: 'Use the vacuum on a flat horizontal surface.' },
            id17: { description: 'Sidebrushes malfunctioned. Reboot the system.' },
            id18: { description: 'Fan malfunctioned. Reboot the system.' },
            id19: { description: 'The docking station is not connected to power.' },
            id20: { description: 'unkown' },
            id21: { description: 'Please make sure that the top cover of the laser distance sensor is not pinned.' },
            id22: { description: 'Please wipe the dock sensor.' },
            id23: { description: 'Make sure the signal emission area of dock is clean.' }
        };
    }

    static get commands() {
        return {
            app_start: {name:"► Start", link:"", args:false},
            app_start_wet: {name:"► Start wet", link:"", args:false},
            app_spot: {name:"► Start spot", link:"", args:false},
            app_zoned_clean: {name:"► Start zone ", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/app_zoned_clean.md", args:true},
            app_pause: {name:"❙❙ Pause", link:"", args:false},
            app_stop: {name:"◼ Stop", link:"", args:false},
            app_stop_dock: {name:"◼ Stop & dock", link:"", args:false},
            app_charge: {name:"Dock", link:"", args:false},
            find_me: {name:"Find me", link:"", args:false},
            set_custom_mode: {name:"Fan Power", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/FanPower.md", args:true},
            get_status: {name:"Get Status", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/StatusMessage.md", args:false},

            get_consumable: {name:"Get consumables status", link:"", args:false},
            reset_consumable: {name:"Reset consumables", link:"", args:false},
            get_clean_summary: {name:"Cleaning details", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/cleanSummary+detail.md", args:true},
            get_clean_record: {name:"Cleaning details", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/cleanSummary+detail.md", args:true},
            get_clean_record_map: {name:"Get the map reference", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/getMap.md", args:true},
            get_map_v1: {name:"Get Map", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/getMap.md", args:true},
            get_serial_number: {name:"Get Serial #", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/getSerial.md", args:true},
            get_dnd_timer: {name:"Do Not Disturb Settings", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md", args:true},
            set_dnd_timer: {name:"Set the do not disturb timings", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md", args:true},
            close_dnd_timer: {name:"Disable the do not disturb function", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md", args:true},
            set_timer: {name:"Add a timer", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md", args:true},
            upd_timer: {name:"Activate/deactivate a timer", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md", args:true},
            get_timer: {name:"Get Timers", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md", args:true},
            del_timer: {name:"Remove a timer", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md", args:true},
            get_timezone: {name:"Get timezone", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timezone.md", args:true},
            set_timezone: {name:"Set timezone", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timezone.md", args:true},
            dnld_install_sound: {name:"Voice pack installation", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/install_sound.md", args:true},
            get_current_sound: {name:"Current voice", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/CurrentVoice.md", args:true},
            get_sound_volume: {name:"Get sound level", link:"", args:false},
            get_log_upload_status: {name:"Get log upload status", link:"", args:false},
            enable_log_upload: {name:"Enable log upload", link:"", args:false},
            get_custom_mode: {name:"Get the vacuum level", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/FanPower.md", args:true},
            app_rc_start: {name:"Start remote control", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md", args:true},
            app_rc_end: {name:"End remote control", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md", args:true},
            app_rc_move: {name:"Remote control move command", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md", args:true},
            get_gateway: {name:"Get current gateway", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/MiscCmds.md", args:true},
            app_goto_target: {name:"Send vacuum to coordinates", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/app_goto_target.md", args:true},
        };
    }
}

module.exports = MiioRoborockVocabulary;