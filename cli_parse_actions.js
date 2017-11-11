const fs = require('fs');

var help = "Parse player actions from data.json, and output a JSON of just those actions.\n"+
    "Usage:\n\tnode parse_action.js <version> <action type 1-6>\n"+
    "Actions:\n"+
    "\t1: Mouse Press\n"+
    "\t2: Mouse Release\n"+
    "\t3: HP Decrease\n"+
    "\t4: Wave Start\n"+
    "\t5: Tower Create\n"+
    "\t6: Game Over\n";

var version = parseInt(process.argv[2]);
var actType = parseInt(process.argv[3]);

if(isNaN(version) || isNaN(actType)){
    console.log(help);
    process.exit();
}

var regex = /[A-Za-z]*\s[A-Za-z]+\:/;
var fields;
switch(actType){
    case 1: //Mouse Press: <Date> Level:<> x:<> y:<>/
        fields = ["Time","Level","X","Y"];
        break;
    case 2: //Mouse Release: <Date> Level:<> x:<> y:<>
        fields = ["Time","Level","X","Y"];
        break;
    case 3: //HP Decrease: <Date> Level:<> HP:<>
        fields = ["Time","Level","HP"];
        break;
    case 4: //Wave Start: <Date> Level:<> Money:<> Wave:<> Towers Killed:<>
        fields = ["Time","Level","Money","Wave","Towers Killed"];
        break;
    case 5: //Tower Create: <Date> Level:<> x:<> y:<> Materials:<>
        fields = ["Time","Level","X","Y","Materials"];
        break;
    case 6: //Game Over: Wave num:<> Level:<>
        fields = ["Time","Wave Num","Level"];
        break;
    default:
        console.log(help);
        process.exit();
}

var player_starttime = {};

fs.readFile("data.v"+version+".json", function(e, data){
    if(e){
        console.log(e);
        return;
    }

    //collect start time info on players
    var player_logs = JSON.parse(data)["page_loads"];
    for(var i = 0; i < player_logs.length; i++){
        var player = player_logs[i]["user_id"];
        var starttime = parseInt(player_logs[i]["server_timestamp"]);
        if(!player_starttime.hasOwnProperty(player)){
            player_starttime[player] = starttime;
        }
        else if(player_starttime[player]>starttime){
            player_starttime[player] = starttime;
        }
    }

    var input = JSON.parse(data)["player_actions"];
    var output = [];
    for(var i = 0; i < input.length; i++){
        if(input[i]["action_id"] == actType){ //action matches type!
            var entry = {};
            var entryValues = input[i]["action detail"].split(regex);

            var player = input[i]["user_id"];
            entry[fields[0]] = parseInt(input[i]["log_timestamp"])-player_starttime[player];
            for(var j = 1; j < fields.length; j++){
                if(isNaN(parseInt(entryValues[j]))){
                    entry[fields[j]] = entryValues[j];
                }
                else{
                    entry[fields[j]] = parseInt(entryValues[j]);
                }
            }
            output.push(entry);
        }
    }

    fs.writeFile("action"+actType+".json", JSON.stringify(output,null,2), function(e){
        if(e){
            console.log(e);
        }
    });
});