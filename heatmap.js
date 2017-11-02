function map_tower_temporal(tower_data, level, svg, max_time, max_height){
    
    const timestep = 10; //time in seconds
    
    //bucketize data: initialize 2d spatial bucket
    var buckets = new Array(Math.floor(max_time/timestep));
    for (var i = 0; i < buckets.length; i++){
        buckets[i] = new Array(max_height);
        for(var j = 0; j < buckets[i].length; j++){
            buckets[i][j] = 0;
        }
    }
    var max_bucket_val = 0;
    //fill buckets with tower data
    for (var i = 0; i<tower_data.length; i++){
        if(tower_data[i]["Level"] == level){
            var t = Math.floor(tower_data[i]["Time"]/timestep);
            if(t>=buckets.length){
                t = buckets.length-1;
            }
            
            for (var h = 0; h < tower_data[i]["Materials"]; h++){
                buckets[t][h] += 1;
                if(buckets[t][h] > max_bucket_val){
                    max_bucket_val = buckets[t][h];
                }
            }
        }
    }

    //graph dimensions
    var grid_size = 16;
    svg.attr("width", buckets[0].length*grid_size)
        .attr("height", buckets.length*grid_size);
    var colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58'];

    //create grid squares
    var colorScale = d3.scale.quantile()
        .domain([0, colors.length-1, max_bucket_val])
        .range(colors);

    for(var x = 0; x < buckets.length; x++){
        for(var y = 0; y < buckets[x].length; y++){
            svg.append("rect")
                .attr("x", x*grid_size)
                .attr("y", y*grid_size)
                .attr("width", grid_size)
                .attr("height", grid_size)
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("fill", colorScale(buckets[x][y]));
        }
    }
}

function map_mouse_tutorial_clicks(mouse_data, level, svg){
    //game dimensions
    const GAME_WIDTH = 960;
    const GAME_HEIGHT = 720;
    const snap = 32;
    
    //bucketize data: initialize 2d spatial bucket
    var buckets = new Array(Math.floor(GAME_HEIGHT/snap));
    for (var i = 0; i < buckets.length; i++){
        buckets[i] = new Array(Math.floor(GAME_WIDTH/snap));
        for(var j = 0; j < buckets[i].length; j++){
            buckets[i][j] = 0;
        }
    }
    var max_bucket_val = 0;
    //fill buckets with mouse_release data
    for (var i = 0; i<mouse_data.length; i++){
        if(mouse_data[i]["Level"] == level){
            var x = Math.floor(mouse_data[i]["X"]/snap);
            var y = Math.floor(mouse_data[i]["Y"]/snap);
            if(y>=buckets.length){
                y = buckets.length-1;
            }
            if(x>=buckets[y].length){
                x = buckets[y].length-1;
            }

            buckets[y][x] += 1; 
            if(buckets[y][x] > max_bucket_val){
                max_bucket_val = buckets[y][x];
            }
        }
    }

    //graph dimensions
    var grid_size = 16;
    svg.attr("width", buckets[0].length*grid_size)
        .attr("height", buckets.length*grid_size);
    var colors = ['#ffffe5','#f7fcb9','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#006837','#004529'];

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

function map_tower_spatial(tower_data, level, svg, normalizeHeight){
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
    //populate buckets with tower data
    var max_height = 0, max_time = 0;
    for (var i = 0; i<tower_data.length; i++){
        if(tower_data[i]["Level"] == level){
            var x = Math.floor(tower_data[i]["X"]/snap);
            var y = Math.floor(tower_data[i]["Y"]/snap);
            if(y>=buckets.length){
                y = buckets.length-1;
            }
            if(x>=buckets[y].length){
                x = buckets[y].length-1;
            }

            buckets[y][x] += normalizeHeight ? tower_data[i]["Materials"] : 1; 
            if(buckets[y][x] > max_bucket_val){
                max_bucket_val = buckets[y][x];
            }

            if(tower_data[i]["Time"] > max_time){
                max_time = tower_data[i]["Time"];
            }
            if(tower_data[i]["Materials"] > max_height){
                max_height = tower_data[i]["Materials"];
            }
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
    
    return [max_time, max_height];
}
