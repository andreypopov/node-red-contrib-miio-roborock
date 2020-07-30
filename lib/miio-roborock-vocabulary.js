'use strict';


class MiioRoborockVocabulary {
    static get models() {
        return {
            'rockrobo.vacuum.v1': MiioRoborockVocabulary.speedmodes_gen1,
            'roborock.vacuum.c1': MiioRoborockVocabulary.speedmodes_gen1,
            'roborock.vacuum.s5': MiioRoborockVocabulary.speedmodes_gen2,
            'roborock.vacuum.s6': MiioRoborockVocabulary.speedmodes_gen3,
            'roborock.vacuum.m1s': MiioRoborockVocabulary.speedmodes_gen3,
            'roborock.vacuum.a10': MiioRoborockVocabulary.speedmodes_gen3,            
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
            18:'room-cleaning',
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
            id20: { description: 'Unknown.' },
            id21: { description: 'Please make sure that the top cover of the laser distance sensor is not pinned.' },
            id22: { description: 'Please wipe the dock sensor.' },
            id23: { description: 'Make sure the signal emission area of dock is clean.' }
        };
    }

    static get commands() {
        return {
            app_start: {name:"► Start", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/basic.md#start-cleaning", args:false},
            app_start_wet: {name:"► Start wet", link:"", args:false},
            app_spot: {name:"► Start spot", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/basic.md#start-spot-cleaning", args:false},
            app_zoned_clean: {name:"► Start zone ", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/zoned_clean.md", args:true},
            app_pause: {name:"❙❙ Pause", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/basic.md#pause-cleaning", args:false},
            app_stop: {name:"◼ Stop", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/basic.md#stop-cleaning", args:false},
            app_stop_dock: {name:"◼ Stop & dock", link:"", args:false},
            resume_zoned_clean: {name:"Resume zone clean", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/zoned_clean.md#resume-zone-cleaning", args:false},
            app_wet: {name:"Wet mode", link:"", args:false},
            app_charge: {name:"Dock", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/basic.md#start-charging", args:false},
            find_me: {name:"Find me", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/find_me.md", args:false},
            app_goto_target: {name:"Send to coordinates", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/goto_target.md", args:true},

            get_status: {name:"ⓘ Get status", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/status.md", args:false},
            get_consumable: {name:"ⓘ Get consumables status", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/consumable.md", args:false},
            get_custom_mode: {name:"ⓘ Get fan power", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/custom_mode.md#get-custom-mode", args:false},
            get_timezone: {name:"ⓘ Get timezone", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/timezone.md#get-timezone", args:false},
            get_sound_volume: {name:"ⓘ Get sound level", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/sound_volume.md", args:false},
            get_sound_progress: {name:"ⓘ Get sound progress", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/install_sound.md", args:false},
            get_current_sound: {name:"ⓘ Get current voice", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/current_sound.md", args:false},
            get_gateway: {name:"ⓘ Get gateway", link:"", args:false},
            get_serial_number: {name:"ⓘ Get serial number", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/serial_number.md", args:false},
            // "miIO.info": {name:"ⓘ Mi IO Info", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/miIOinfo.md", args:false},
            get_dnd_timer: {name:"ⓘ Get do not disturb", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md#get-dnd-timer", args:false},
            get_timer: {name:"ⓘ Get timers", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/timer.md#get-cleaning-timer", args:false},
            get_clean_summary: {name:"ⓘ Get cleaning summary", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/clean_summary+record.md", args:false},
            //doesnt work
            get_clean_record: {name:"ⓘ Get clean record", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/clean_summary+record.md", args:true},
            // get_map_v1: {name:"ⓘ Get map v1", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/map_v1.md", args:false},
            // get_persist_map_v1: {name:"get_persist_map_v1", link:"", args:false},
            // get_map_v2: {name:"get_map_v2", link:"", args:true},
            // get_clean_record_map_v2: {name:"get_clean_record_map_v2", link:"", args:true},
            get_log_upload_status: {name:"ⓘ Get log upload status", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/log_upload.md", args:false},
            get_carpet_mode: {name:"ⓘ Get carpet mode", link:"", args:false},
            get_fw_features: {name:"ⓘ Get modes", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/fw_features.md", args:false},
            app_get_locale: {name:"ⓘ Get locale", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/locale.md", args:false},

            set_custom_mode: {name:"⚙ Fan Power", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/custom_mode.md#set-custom-mode", args:true},
            change_sound_volume: {name:"⚙ Set sound level", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/sound_volume.md#change-sound-volume", args:true},
            set_timezone: {name:"⚙ Set timezone", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/timezone.md#set-timezone", args:true},
            set_dnd_timer: {name:"⚙ Set do not disturb time", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md#set-dnd-timer", args:true},
            close_dnd_timer: {name:"⚙ Disable do not disturb", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/dnd_timer.md", args:false},
            test_sound_volume: {name:"⚙ Test sound level", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/sound_volume.md", args:false},

            app_rc_start: {name:"🕹 Remote control: start", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/rc.md#start-remote-control", args:false},
            app_rc_end: {name:"🕹 Remote control: stop", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/rc.md#end-remote-control", args:false},
            app_rc_move: {name:"🕹Remote control: move", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/rc.md#movement-remote-control", args:true},

            // get_clean_record_map: {name:"Get the map reference", link:"", args:true},
            dnld_install_sound: {name:"🌍 Voice pack", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/install_sound.md#install-sound", args:true},

            set_timer: {name:"🕑 Timer: add", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/timer.md#set-cleaning-timer", args:true},
            upd_timer: {name:"🕑 Timer: update", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/timer.md#enabledisable-cleaning-timer", args:true},
            del_timer: {name:"🕑 Timer: remove", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/timer.md", args:true},

            enable_log_upload: {name:"Enable log upload", link:"", args:false},
            reset_consumable: {name:"Reset consumables", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/consumable.md", args:false},
            // app_wakeup_robot: {name:"app_wakeup_robot", link:"", args:false},

            app_segment_clean: {name:"Room cleaning: Start", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/segment_clean.md#start-segment-cleaning", args:true},
            stop_segment_clean: {name:"Room cleaning: Stop", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/segment_clean.md#stop-segment-cleaning", args:false},
            resume_segment_clean: {name:"Room cleaning: Resume", link:"https://github.com/marcelrv/XiaomiRobotVacuumProtocol/blob/master/segment_clean.md#resume-segment-cleaning", args:false}
        };
    }


    static get voices() {
        return {
            //russian
            5000: {name:"Official", lang:"ru", url:"https://dl.dropboxusercontent.com/s/3aq5uunznjtxbsa/ru_official.pkg", md5:"d76532a68bfd9321967a4d4b495da300", ver:"gen1,gen2", sver:"2"},
            5001: {name:"Uncensored_1 18+", lang:"ru", url:"https://dl.dropboxusercontent.com/s/co94u0r6lgoviri/ru_leather_bastards.pkg", md5:"332b36a8eac4bae3aa0dc15a60a0d974", ver:"gen1,gen2", sver:"2"},
            5002: {name:"Uncensored_2 18+", lang:"ru", url:"https://dl.dropboxusercontent.com/s/6zrjlh9mtvzxep7/ru_robot.pkg", md5:"bd1ad60ae1b6f5034a41f7605695f479", ver:"gen1,gen2", sver:"2"},
            5003: {name:"Outsidepro", lang:"ru", url:"https://dl.dropboxusercontent.com/s/2zl0t0okt1tppvv/ru_outsidepro_universal.pkg", md5:"db6fb2e25ac343907a3f480573b9dcea", ver:"gen1,gen2", sver:"2"},
            5004: {name:"Boorish", lang:"ru", url:"https://dl.dropboxusercontent.com/s/z34dgg1mihja5ye/ru_robot_2.pkg", md5:"dfd3fa69ee5defbc6bf6f944580885d7", ver:"gen1,gen2", sver:"2"},
            5005: {name:"Milena", lang:"ru", url:"https://dl.dropboxusercontent.com/s/e3k7i53drhucu3g/ru_milena.pkg", md5:"79ef91801486feab8f3f244b73a7ac6d", ver:"gen1,gen2", sver:"2"},
            5006: {name:"Zahar", lang:"ru", url:"https://dl.dropboxusercontent.com/s/p0jqz49gw6rwama/ru_zahar.pkg", md5:"40bc4ec2417ef01afabd5e9122442810", ver:"gen1,gen2", sver:"2"},
            5007: {name:"Oksana", lang:"ru", url:"https://dl.dropboxusercontent.com/s/lqpjl95lrcpdb8l/ru_oksana.pkg", md5:"34447fff15ec3fe0babf12b778137747", ver:"gen1,gen2", sver:"2"},
            5008: {name:"Aliss", lang:"ru", url:"https://dl.dropboxusercontent.com/s/r1dl27onnlictwf/ru_aliss.pkg", md5:"f87876f5f6e4811426b1b9f7753f76f8", ver:"gen1,gen2", sver:"2"},
            5009: {name:"Robot", lang:"ru", url:"https://dl.dropboxusercontent.com/s/jh4vub66hckjf8h/ru_robot_fiksik.pkg", md5:"e9a6a08245408c4c523b71103176bdd4", ver:"gen1,gen2", sver:"2"},
            5010: {name:"Maksim", lang:"ru", url:"https://dl.dropboxusercontent.com/s/n6n5ha1duatatl7/ru_maxim.pkg", md5:"46022838228679ffd598ec2b44a54b2d", ver:"gen1,gen2", sver:"2"},
            5011: {name:"Maksim normal", lang:"ru", url:"https://www.dropbox.com/s/yjnta57uc30jt24/ru_maxim_normal.pkg?dl=0", md5:"adc1e0de7ef881a0d52c0cf0a4a2be0b", ver:"gen1", sver:"1"},

            //hebrew
            5100: {name:"Cartoon", lang:"he", url:"https://dl.dropboxusercontent.com/s/a9lqihjo4kzmcbw/he_cartoon_v2.pkg", md5:"644f0431c0addbad672b302fd7ec2cf3", ver:"gen1,gen2", sver:"2"},
            5101: {name:"Despicable me", lang:"he", url:"https://dl.dropboxusercontent.com/s/uz6nf0fgehdljmt/he_despicable_me_v2.pkg", md5:"5bfdcf819b4273c941bc9a5aa0022dd2", ver:"gen1,gen2", sver:"2"},
            5102: {name:"Carmit", lang:"he", url:"https://dl.dropboxusercontent.com/s/0tz50c3k28zzjnj/he_female_carmit_v2.pkg", md5:"8749b67cef311f55aacca642b5a36d7e", ver:"gen1,gen2", sver:"2"},
            5103: {name:"Hotel transylvania", lang:"he", url:"https://dl.dropboxusercontent.com/s/4or3i40gcciko5c/he_hotel_transylvania_v2.pkg", md5:"07624814bde2ad7184daa0c58dd5d38f", ver:"gen1,gen2", sver:"2"},
            5104: {name:"Asaf", lang:"he", url:"https://dl.dropboxusercontent.com/s/n0q3sklv8dijwvs/he_male_asaf_v2.pkg", md5:"b75990e87db94421818e0cf00dfd1c28", ver:"gen1,gen2", sver:"2"},

            //ukraine
            5200: {name:"Sofia", lang:"uk", url:"https://dl.dropboxusercontent.com/s/vgek1a2p9jzbesl/uk_sofia.pkg", md5:"053e3616efb06ccb256015631542e3a9", ver:"gen1,gen2", sver:"2"},

            //s5 official
            5300: {name:"Cantonese", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/cantonese.pkg", md5:"72d83a60a4177d4648abaf7e4e034c88", ver:"gen1,gen2", sver:"2"},
            5301: {name:"German", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/de.pkg", md5:"63413971f86cfd9cb18c8ed2107f3309", ver:"gen1,gen2", sver:"2"},
            5302: {name:"English", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/english.pkg", md5:"911bdd115c5b93823e6a87e6c80633cc", ver:"gen1,gen2", sver:"2"},
            5303: {name:"Spanish", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/es.pkg", md5:"2e678321fa2aa23fb0a0b84634a385ad", ver:"gen1,gen2", sver:"2"},
            5304: {name:"French", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/fr.pkg", md5:"36631f1aa840168322a6daa107f9226b", ver:"gen1,gen2", sver:"2"},
            5305: {name:"Italian", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/it.pkg", md5:"d09e5e91b73caa54cdf6b7c1b71d0597", ver:"gen1,gen2", sver:"2"},
            5306: {name:"Japanese", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/ja.pkg", md5:"4131f05f22f885d6c54cc1feb23f24e2", ver:"gen1,gen2", sver:"2"},
            5307: {name:"Korean", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/ko.pkg", md5:"e4681aee0381290597475a598fdfdda6", ver:"gen1,gen2", sver:"2"},
            5308: {name:"Russian", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/ru.pkg", md5:"bd570e8d702d1471b4aa01f5464883b1", ver:"gen1,gen2", sver:"2"},
            5309: {name:"Taiwanese", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/taiwanese.pkg", md5:"1574e15e45b94e6ad2d0274a940f0281", ver:"gen1,gen2", sver:"2"},
            5310: {name:"Transformer", lang:"s5_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s5/transformer.pkg", md5:"b6f17aff96a918dbc3c235077eb977cc", ver:"gen1,gen2", sver:"2"},

            //s6 official
            5400: {name:"German", lang:"s6_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s6/de.pkg", md5:"eaa4670e1ea4d10543e1546392a25aa3", ver:"gen3", sver:"3"},
            5401: {name:"Spanish", lang:"s6_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s6/es.pkg", md5:"3a642abd8c170dfae467d9b2ccc5c70d", ver:"gen3", sver:"3"},
            5402: {name:"French", lang:"s6_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s6/fr.pkg", md5:"f936c0e5c2f7f9235a35bdb17cd99e65", ver:"gen3", sver:"3"},
            5403: {name:"Italian", lang:"s6_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s6/it.pkg", md5:"a62d1a15e8280e8b40e851f1ee15dfd4", ver:"gen3", sver:"3"},
            5404: {name:"Japanese", lang:"s6_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s6/ja.pkg", md5:"c2dc4b66ccd20b71a61090dcd3a14c77", ver:"gen3", sver:"3"},
            5405: {name:"Korean", lang:"s6_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s6/ko.pkg", md5:"a4c163edb7f2afdbe8c6e706fddcb133", ver:"gen3", sver:"3"},
            5406: {name:"Russian", lang:"s6_official", url:"https://dustbuilder.xvm.mit.edu/pkg/voice-s6/ru.pkg", md5:"c76d5d6957d605ca2331843fe1a9ef73", ver:"gen3", sver:"3"}


        };
    }
}


module.exports = MiioRoborockVocabulary;
