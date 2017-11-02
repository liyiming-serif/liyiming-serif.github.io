function create_heatmap(mouse_press, mouse_release, tower_create, svg) { 
    map_tower_spatial(tower_create, 0, svg, false);
}

function map_tower_temporal(tower_data, level, svg){

}



function map_tower_spatial(tower_data, level, svg, includeMat){
    //game dimensions
    const GAME_WIDTH = 960;
    const GAME_HEIGHT = 720;
    const snap = 64;
    
    //bucketize data
    var buckets = new Array(Math.floor(GAME_HEIGHT/snap));
    for (var i = 0; i < buckets.length; i++){
        buckets[i] = new Array(Math.floor(GAME_WIDTH/snap));
        for(var j = 0; j < buckets[i].length; j++){
            buckets[i][j] = 0;
        }
    }
    var max_bucket_val = 0;

    for (var i = 0; i<tower_data.length; i++){
        var x = Math.floor(tower_data[i]["X"]/snap);
        var y = Math.floor(tower_data[i]["Y"]/snap);
        if(y>=buckets.length){
            y = buckets.length-1;
        }
        if(x>=buckets[y].length){
            x = buckets[y].length-1;
        }

        buckets[y][x] += includeMat ? tower_data[i]["Materials"] : 1; 
        if(buckets[y][x] > max_bucket_val){
            max_bucket_val = buckets[y][x];
        }
    }

    //graph dimensions
    var grid_size = 32;
    svg.attr("width", buckets[0].length*grid_size)
        .attr("height", buckets.length*grid_size);
    var colors = ['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a'];

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