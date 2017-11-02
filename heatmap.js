function create_heatmap(mouse_press, mouse_release, tower_create, svg) { 
    //game dimensions
    const GAME_WIDTH = 960;
    const GAME_HEIGHT = 720;
	const snap = 64;

    //graph dimensions
    var scale = 0.5;
    svg.attr("width", GAME_WIDTH*scale)
        .attr("height", GAME_HEIGHT*scale);
    var grid_size = snap*scale;
    var colors = ['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a'];
    
    //bucketize data
    console.log(GAME_HEIGHT/snap);
    var buckets = new Array(GAME_HEIGHT/snap);
    for (var i = 0; i < buckets.length; i++){
        buckets[i] = new Array(GAME_WIDTH/snap);
        for(var j = 0; j < buckets[i].length; j++){
            buckets[i][j] = 0;
        }
    }
    var max_bucket_val = 0;

    for (var i = 0; i<tower_create.length; i++){
        var x = tower_create[i]["X"]/snap;
        var y = tower_create[i]["Y"]/snap;
        buckets[y][x] += 1; 
        if(buckets[y][x] > max_bucket_val){
            max_bucket_val = buckets[y][x];
        }
    }

    //create grid squares
    var colorScale = d3.scale.quantile()
        .domain([0, colors.length-1, max_bucket_val])
        .range(colors);

    for(var y = 0; y < buckets.length; y++){
        for(var x = 0; x < buckets[y].length; x++){
            svg.append("rect")
                .attr("x", x*grid_size)
                .attr("y", y*grid_size)
                .attr("width", grid_size)
                .attr("height", grid_size)
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("fill", colorScale(buckets[y][x]));
        }
    }
}