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
            resume_zoned_clean: {name:"Resume zone clean", link:"", args:false},
            app_wet: {name:"Wet mode", link:"", args:false},
            app_charge: {name:"Dock", link:"", args:false},
            find_me: {name:"Find me", link:"", args:false},
            app_goto_target: {name:"Send to coordinates", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/app_goto_target.md", args:true},

            get_status: {name:"ⓘ Get status", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/StatusMessage.md", args:false},
            get_consumable: {name:"ⓘ Get consumables status", link:"", args:false},
            get_custom_mode: {name:"ⓘ Get fan power", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/FanPower.md", args:false},
            get_timezone: {name:"ⓘ Get timezone", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timezone.md", args:false},
            get_sound_volume: {name:"ⓘ Get sound level", link:"", args:false},
            get_sound_progress: {name:"ⓘ Get sound progress", link:"", args:false},
            get_current_sound: {name:"ⓘ Get current voice", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/CurrentVoice.md", args:false},
            get_gateway: {name:"ⓘ Get gateway", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/MiscCmds.md", args:false},
            get_serial_number: {name:"ⓘ Get serial number", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/getSerial.md", args:false},
            "miIO.info": {name:"ⓘ Mi IO Info", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/miIOinfo.md", args:false},
            get_dnd_timer: {name:"ⓘ Get do not disturb", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md", args:false},
            get_timer: {name:"ⓘ Get timers", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md", args:false},
            get_clean_summary: {name:"ⓘ Get cleaning summary", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/cleanSummary+detail.md", args:false},
            //doesnt work
            get_clean_record: {name:"ⓘ Get clean record", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/cleanSummary+detail.md", args:true},
            // get_map_v1: {name:"ⓘ Get map v1", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/getMap.md", args:false},
            // get_persist_map_v1: {name:"get_persist_map_v1", link:"", args:false},
            // get_map_v2: {name:"get_map_v2", link:"", args:true},
            // get_clean_record_map_v2: {name:"get_clean_record_map_v2", link:"", args:true},
            get_log_upload_status: {name:"ⓘ Get log upload status", link:"", args:false},
            get_carpet_mode: {name:"ⓘ Get carpet mode", link:"", args:false},
            get_fw_features: {name:"ⓘ Get modes", link:"", args:false},
            app_get_locale: {name:"ⓘ Get locale", link:"", args:false},

            set_custom_mode: {name:"⚙ Fan Power", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/FanPower.md", args:true},
            change_sound_volume: {name:"⚙ Set sound level", link:"", args:true},
            set_timezone: {name:"⚙ Set timezone", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timezone.md", args:true},
            set_dnd_timer: {name:"⚙ Set do not disturb time", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md", args:true},
            close_dnd_timer: {name:"⚙ Disable do not disturb", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md", args:false},
            test_sound_volume: {name:"⚙ Test sound level", link:"", args:false},

            app_rc_start: {name:"🕹 Remote control: start", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md", args:false},
            app_rc_end: {name:"🕹 Remote control: stop", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md", args:false},
            app_rc_move: {name:"🕹Remote control: move", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/remote_control.md", args:true},

            reset_consumable: {name:"Reset consumables", link:"", args:false},
            // get_clean_record_map: {name:"Get the map reference", link:"", args:true},
            dnld_install_sound: {name:"Voice pack installation", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/install_sound.md", args:true},
            enable_log_upload: {name:"Enable log upload", link:"", args:false},
            set_timer: {name:"Timer: add", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md", args:true},
            upd_timer: {name:"Timer: update", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md", args:true},
            del_timer: {name:"Timer: remove", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/Timer.md", args:true},
            // app_wakeup_robot: {name:"app_wakeup_robot", link:"", args:false},
        };
    }
}


module.exports = MiioRoborockVocabulary;