function parsePie(data){
    //build the dictionary of game overs
    var losses = {};
    var actions = JSON.parse(data)["player_actions"];
    for(var i = 0; i < actions.length; i++){
        if(actions[i]["action_id"] == 6){ //hit a game over!
            losses[actions[i]["dynamic quest id"]] = actions[i]["log_timestamp"];
        }
    }


    //loop through level loads
    var output = [];
    var wins = 0;
    var losses = 0;
    var quits = 0;
    var loads = JSON.parse(data)["player_quests"];
    for(var i = 0; i < loads.length; i++){
        if(loads[i]["end_timestamp"] == null){ //player quit
            quits += 1;
        }
        output.push({name:"Quits", count:quits});
        else if(losses.hasOwnProperty(loads[i]["dynamic_quest_id"])){ //player lost
            losses += 1;
        }
        output.push({name:"Losses", count:losses});
        else{ //player won
            wins += 1;
        }
        output.push({name:"Wins", count:wins});
    }
    return output;
};