//NOTE: Initiation of this cursor after other elements will put the cursor on top of them.
function FreezeAroundCursor2() {
	//Hold previous mouse point for dynamic data
	var prevMousePt = [0, 0];

	//Name of svg element to grab for targets
	var targets = ".point";

	//Freeze/Cursor radius
	var frzRadius = Math.sqrt((window.innerWidth * window.innerHeight/2) / (10 * Math.PI));
	//NOTE: Don't combine click with accumulations... it doesn't work.

	//Controls accumulation behavior near freeze region
	var accumulations = false;
	//If click is true then freeze will only happen on click
	var click = false;
	var gCursor;
	var gSelection;
	var gCopies;

	//Create cursor
	function cursor(selection) {
		var svg = selection;
		var gCopies = svg.insert("g", ".chart").attr("class", "copies");
		var gSelection = svg.insert("g", ":first-child").attr("class", "selection");
		var gCursor = gSelection.append("circle")
			.attr("class","cursor")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", frzRadius)
			.style("fill","lightgray")
			.style("fill-opacity","0.5")
	
		if(click) {
			var cursorClick = gSelection.append("circle")
				.attr("class","cursor")
				.attr("cx", 0)
				.attr("cy", 0)
				.attr("r", 0)
				.style("fill","lightgray")
				.style("fill-opacity","0.5");
		}
	
		//Set on mousemove
		if (!click) {
			svg.on("mousemove.FreezeAroundCursor2." + selection.attr("id"), function(d,i) {
				gCursor
					.attr("cx",0)
					.attr("cy",0)
					.attr("r",frzRadius);
				var target = FreezeAroundCursor2.redraw(d3.mouse(this));
			});
		} else {
			svg.on("mousemove.FreezeAroundCursor2." + selection.attr("id"), function(d,i) {
				var mouse = d3.mouse(this);
				gCursor
					.attr("cx",mouse[0])
					.attr("cy",mouse[1])
					.attr("r",frzRadius);
				var target = getTarget(mouse);
				d3.selectAll(".snapshot.target")
					.attr("class", function() { return d3.select(this).attr("class").slice(0, -7); });
	
				if (target != null) {
					target
						.attr("class", target.attr("class") + " target");
				}
			});
		}
	
		if (click) {
			svg.on("click.FreezeAroundCursor2." + selection.attr("id"), function(d,i) {
				var mouse = d3.mouse(this);
				cursorClick
					.attr("cx",mouse[0])
					.attr("cy",mouse[1])
					.attr("r",frzRadius);
				cleanSnapshots(mouse);
				createSnapshots(mouse);
			});
		}
	}

	cursor.redraw = function(mouse) {
		var mousePt;
		var target = null,
			targetTrail;
		if (arguments.length > 2) {
			return;
		}
		if (!arguments.length && !accumulations){
			return;
		} else if (!arguments.length) {
			mousePt = prevMousePt;
		} else {
			mousePt = [mouse[0], mouse[1]];
		}

		prevMousePt = mousePt;

		//Update location of cursor
		if (gCursor)
		gCursor
			.attr("cx", mousePt[0])
			.attr("cy", mousePt[1]);

		//Copy-Pause points within cursor
		if(typeof createSnapshots == 'function')
		createSnapshots(mousePt);

		//Only delete snapshots outside of cursor window
		if(typeof createSnapshots == 'function')
		target = cleanSnapshots(mousePt);
		d3.selectAll(".snapshot.target")
			.attr("class", function() { return d3.select(this).attr("class").slice(0, -7); });

		if (target != null) {
			target
				.attr("class", target.attr("class") + " target");
		}

		return target;
	};

	cursor.createSnapshots = function(mousePt) {
		var points = d3.selectAll(targets);
		points
			.each(function(d, i) {
				var pt = d3.select(this);
				var x = +pt.attr("cx"),
					y = +pt.attr("cy"),
					r = +pt.attr("r");

				var targetPt = [x, y];
				var currDist = distance(mousePt,targetPt);

				if (currDist < frzRadius && d3.select(".i" + d[0] + ".snapshot").empty()) {
					pt.attr("id", "tagged");

					gCopies.append("circle")
						.attr("class", "i" + d[0] + " snapshot")
						.attr("r", pointRadius)
						.attr("cx", x)
						.attr("cy", y);

				} else if (currDist > frzRadius) {
					pt.attr("id", "untagged");
				}
			});
	}

	cursor.cleanSnapshots = function(mousePt) {
		var target = null
		d3.selectAll(".snapshot")
			.each(function(d, i) {
				var pt = d3.select(this)
				var x = +pt.attr("cx"),
					y = +pt.attr("cy"),
					r = +pt.attr("r");

				var targetPt = [x, y];

				var currDist = distance(mousePt,targetPt);
				if (currDist < r) {
					target = pt;
				}
				if (currDist > frzRadius) {
					pt.remove();
				}
			});
		return target;
	}

	cursor.getTarget = function(mousePt) {
		var target = null
		d3.selectAll(".snapshot")
			.each(function(d, i) {
				var pt = d3.select(this)
				var x = +pt.attr("cx"),
					y = +pt.attr("cy"),
					r = +pt.attr("r");

				var targetPt = [x, y];

				var currDist = distance(mousePt,targetPt);
				if (currDist < r) {
					target = pt;
				}
			});
		return target;
	}

	cursor.tarName = function(_) {
		if(!arguments.length) return targets;
		targets = _;
		return cursor;
	};

	cursor.freezeRadius = function(_) {
		if(!arguments.length) return frzRadius;
		frzRadius = _;
		return cursor;
	};

	cursor.accumulate = function(_) {
		if(!arguments.length) return accumulations;
		accumulations = _;
		return cursor;
	}

	cursor.clickOnly = function(_) {
		if(!arguments.length) return click;
		click = _;
		return cursor;
	}

	return cursor;
}

//Helper function for obtaining containment and intersection distances
function distance(ptA,ptB) {
	var diff = [ptB[0]-ptA[0], ptB[1]-ptA[1]];
	return Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]);
}