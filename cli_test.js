const parser = require('./player_action.parser.js');
const fs = require('fs');

actType = parseInt(process.argv[2]);

var help = "Parse player actions from data.json, and output a JSON of just those actions.\n"+
    "Usage:\n\tnode cli_test.js <actions 1-6>\n"+
    "Actions:\n"+
    "\t1: Mouse Press\n"+
    "\t2: Mouse Release\n"+
    "\t3: HP Decrease\n"+
    "\t4: Wave Start\n"+
    "\t5: Tower Create\n"+
    "\t6: Game Over\n"+
    "\t7: Level Win\n";

if(isNaN(actType) || actType < 1 || actType > 7){
    console.log(help);
    process.exit();
}

fs.readFile('data.json', function(err, data){
	if (err){
		throw err;
	}
	var input = JSON.parse(data);
	var output = parser.parseAct(input, actType);
	fs.writeFile('actions'+actType+'.json', JSON.stringify(output,null,2), function(e){
		if (e){
			throw e;
		}
	});
});