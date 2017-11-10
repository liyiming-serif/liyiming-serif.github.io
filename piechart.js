//@author: Yiming Li

function create_piechart(data, svg) { 
	console.log(JSON.stringify(data));
	const WIDTH = 400;
	const HEIGHT = 400;

	svg.attr('width', WIDTH)
		.attr('height', HEIGHT);
	var group = svg.append('g')
    	.attr('transform', 'translate('+(WIDTH/2)+','+(HEIGHT/2)+')');

    var colors = ['#8dd3c7','#ffffb3','#bebada'];
    var colorScale = d3.scaleOrdinal()
        .range(colors);

    var radius = Math.min(WIDTH,HEIGHT)/2;
    var holeRadius = 75;
    var arc = d3.arc()
		.innerRadius(holeRadius)
		.outerRadius(radius);
	var pie = d3.pie()
		.value(function(d){return d.count; })
		.sort(null);
	var path = group.selectAll('path')
		.data(pie(data))
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', function(d){return colorScale(d.data.name); });
}