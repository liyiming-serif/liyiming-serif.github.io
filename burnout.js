//@author: Nicole Tan

function create_burnout(data, fdata, ndata, svg) { 
	//<line graph (x:levels completed y:player num)>
	//aggregate the number of players who finish each level 

	//for player_quests [and not player_actions]
	//user_id is the same throughout right?
	//we said that end_timestamp - server_stamp is total time player [across levels?]
	//does quest_id mean the final level played by the person

	//% remaining, level
	var height = 500; 
	var width = 700; 
	var padding = 50; 
	
	var xScale = d3.scale.linear()
				.domain([0, 700])
				.range([padding, width-30]); 
	var yScale = d3.scale.linear()
				.domain([0, 100])
				.range([height-padding, 30])

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom"); 
	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	svg.append("g").attr("transform", "translate(0," + (height-padding) + ")")
		.attr("class", "axis")
		.call(xAxis);

	svg.append("g").attr("transform", "translate(" + padding + ",0)")
		.attr("class", "axis")
		.call(yAxis);

	svg.append("text")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + ((padding/2) - 5) + ","+(height/2)+")rotate(-90)")
		.text("% of Players for That Release");

	svg.append("text")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (width/2) + ","+(height-(padding/3)+5)+")")
		.text("Total Time Played in Seconds");

	svg.append("text")
		.attr("transform", "translate(500,50)")
		.attr("stroke", "green")
		.attr("stroke-width", 0.5)
		.text("Friends Release");

	svg.append("text")
		.attr("transform", "translate(500,80)")
		.attr("stroke", "red")
		.attr("stroke-width", 0.5)
		.text("Newgrounds Release");

	svg.append("text")
		.attr("transform", "translate(500,110)")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 0.5)
		.text("Kongregate Release");


		
	var valueline = d3.svg.line()
		.x(function(d) { return xScale(d.time); } )
		.y(function(d) { return yScale(d.players); });


	var data_array = filterData(data);
	var ndata_array = filterData(ndata);
	var fdata_array = filterData(fdata);

	svg.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 1.5)
		.attr("d", valueline(data_array));

	svg.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "red")
		.attr("stroke-width", 1.5)
		.attr("d", valueline(ndata_array));

	svg.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "green")
		.attr("stroke-width", 1.5)
		.attr("d", valueline(fdata_array));






	//<line graph (x:time y:player num)>

}

function filterData(data) {
	total_time_played = {};
	total_time_played[700] = 0;
	for (d in data) {
		time = data[d]['total_time_played']
		if (time in total_time_played) {
			total_time_played[time] += 1;
		} else if (!(time in total_time_played) && time > 700) {
			total_time_played[700] += 1;
		} else {
			total_time_played[time] = 1;
		}
	}
	
	data_array = [];
	intervals = Object.keys(total_time_played);
	player_left = data.length;
	for (time in total_time_played) {
		if (!(time == 0)) {
			minus = total_time_played[intervals[intervals.indexOf(time) - 1]];
			player_left -= minus
		}
		percentage = (player_left/data.length) * 100;
		data_array.push({'time': time, 'players': percentage});
	}

	return data_array;
}