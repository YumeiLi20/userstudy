//Note: Initiation of this cursor after other elements will put the cursor on top of them.
function FreezeTrajectoryCursor(selection) {
	//Hold previous mouse points for dynamic data
	var prevMousePt = [0, 0];
	var ox = 0,
		oy = 0;
	var pts = [[]];

	//Controls the 'tail' of cursor
	var i = 0;
	var threshold = 10;

	//Angle of flashlight
	var angle = 50;

	//Controls accumulation behavior near freeze region
	var accumulations = true;

	//Name of svg element to grab for targets
	var targets = ".point";

	//Create cursor
	var svg = selection;
	var gCopies = svg.insert("g", ".chart").attr("class", "copies");
	var gSelection = svg.insert("g", ":first-child").attr("class", "selection");
	var polyline = gSelection.append("polyline")
		.attr("points", "0,0 0,0 0,0")
		.style("fill", "lightgrey")
		.style("fill-opacity", "0.5");

	//Set on mousemove
	svg.on("mousemove.FreezeTrajectoryCursor." + selection.attr("id"), function(d,i) {
		var target = FreezeTrajectoryCursor.redraw(d3.mouse(this));
	});

	//Hide mouse when outside svg selection
	svg.on("mouseout.FreezeTrajectoryCursor." + selection.attr("id"), function(d, i) {
		polyline
			.attr("points", "0,0 0,0 0,0");
	});

	//Redraws 'flashlight' like cursor and 'freezes' targets on the inside
	FreezeTrajectoryCursor.redraw = function(mouse) {
		var mousePt;
		var target = null;
		if (arguments.length == 0 && !accumulations) return;
		if (arguments.length > 0) {
			mousePt = [mouse[0], mouse[1]];
			
			var x1 = prevMousePt[0],
				y1 = prevMousePt[1],
				x2 = mousePt[0],
				y2 = mousePt[1];

			if (i == threshold) {
				prevMousePt = pts.shift();
				pts.push(mousePt);
			} else if ( i < threshold) {
				i++;
				pts.push(mousePt);
			} else {
				pts.push(mousePt);
				prevMousePt = pts.shift();
			}
		} else {
			var x1 = prevMousePt[0],
				y1 = prevMousePt[1],
				x2 = ox,
				y2 = oy;
		}

		//Hold origin x,y
		ox = x2;
		oy = y2;

		//Scale points to extend 'flashlight'
		dist = distance([x1, y1], [x2, y2]);
		var length = Math.max(+svg.attr("width"),+svg.attr("length"));
		x2 = x2 + (x2 - x1) / dist * length * 2;
		y2 = y2 + (y2 - y1) / dist * length * 2;

		//Convert angle to radians
		var theta1 = angle * (Math.PI / 360),
			theta2 = -angle * (Math.PI / 360);

		//Apply rotation about origin
		var lx1 = (x2 - ox) * Math.cos(theta1) - (y2 - oy) * Math.sin(theta1) + ox,
			ly1 = (x2 - ox) * Math.sin(theta1) + (y2 - oy) * Math.cos(theta1) + oy;

		var lx2 = (x2 - ox) * Math.cos(theta2) - (y2 - oy) * Math.sin(theta2) + ox,
			ly2 = (x2 - ox) * Math.sin(theta2) + (y2 - oy) * Math.cos(theta2) + oy;

		//Update location of cursor
		if (isFinite(x2) && isFinite(y2)) {
			polyline
				.attr("points", ox + "," + oy + " " +
								lx1 + "," + ly1 + " " +
								lx2 + "," + ly2);
		}

		//Copy-Pause points within cursor
		var points = d3.selectAll(targets);
		points
			.style("fill-opacity", function() { return d3.select(this).attr("id") == "tagged" ? 0.5 : 1.0; })
			.style("stroke-opacity", function() { return d3.select(this).attr("id") == "tagged" ? 0.5 : 1.0; })
			.each(function(d, i) {
				var pt = d3.select(this);
				var x = +pt.attr("cx");
				var y = +pt.attr("cy");

				var ptA = [ox, oy];
				var ptB = [lx1, ly1];
				var ptC = [lx2, ly2];
				var ptD = [x, y];

				if(det(ptA, ptB, ptD) <= 0 && det(ptA, ptC, ptD) >= 0 && d3.select(".i" + d[0] +".snapshot").empty()) {
					pt.attr("id", "tagged");
					gCopies.append("circle")
						.attr("class", "i" + d[0] + " snapshot")
						.attr("r", pointRadius)
						.attr("cx", x)
						.attr("cy", y);
				} else if (det(ptA, ptB, ptD) >= 0 || det(ptA, ptC, ptD) <= 0) {
					pt.attr("id", "untagged");
				}
			});


		//Only delete snapshots outside of cursor window
		var closest = Infinity;
		d3.selectAll(".snapshot")
			.style("fill", "orange")
			.style("stroke", "orange")
			.each(function(d, i) {
				var pt = d3.select(this);
				var x = +pt.attr("cx");
				var y = +pt.attr("cy");

				var ptA = [ox, oy];
				var ptB = [lx1, ly1];
				var ptC = [lx2, ly2];
				var ptD = [x, y];

				var dist = +distance(ptA, ptD);
				if(det(ptA, ptB, ptD) > 0 || det(ptA, ptC, ptD) < 0) {
					pt.remove();
				} else if (dist < closest) {
					closest = dist;
					target = pt;
				}
			});

		if (target != null) {
			target
				.style("fill", "springgreen")
				.style("stroke", "springgreen");
		} 
		
		return target;
	};

	FreezeTrajectoryCursor.tarName = function(_) {
		if(!arguments.length) return targets;
		targets = _;
		return FreezeTrajectoryCursor;
	};

	FreezeTrajectoryCursor.cursorAngle = function(_) {
		if(!arguments.length) return angle;
		angle = _;
		return FreezeTrajectoryCursor;
	};

	FreezeTrajectoryCursor.accumulate = function(_) {
		if(!arguments.length) return accumulations;
		accumulations = _;
		return FreezeTrajectoryCursor;
	}
}

//Helper function for obtaining containment and intersection distances
function distance(ptA, ptB) {
	var diff = [ptB[0]-ptA[0], ptB[1]-ptA[1]];
	return Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]);
}

//Find if point (C) is on/left/right of line formed by point (A,B)
function det(ptA, ptB, ptC) {
	return ((ptB[0] - ptA[0]) * (ptC[1] - ptA[1]) - (ptB[1] - ptA[1]) * (ptC[0] - ptA[0]));
}