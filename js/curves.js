ATUtil = {
	randomRange : function(min, max) {
		return min + Math.random() * (max - min);
	},
	randomInt : function(min,max){
		return Math.floor(min + Math.random() * (max - min + 1));
	},
	map : function(value, min1, max1, min2, max2) {
		return ATUtil.lerp(ATUtil.norm(value, min1, max1), min2, max2);
	},
	lerp : function(value, min, max){
		return min + (max -min) * value;
	},
	norm : function(value , min, max){
		return (value - min) / (max - min);
	},
	shuffle : function(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
	clamp : function(value, min, max) {
		return Math.max(Math.min(value, max), min);
	}
};

//curves
var CURVE_COUNT = 3;
var SEGMENT_COUNT = 6;
var curves = [];
var curvePts = []; //2D array: number of curves x number of segments
var xstep
var curveOpacity = 0;
var curveGroup;


function initCurves(){
	//init curves
	curveGroup = new PIXI.DisplayObjectContainer();
	vizGroup.addChild(curveGroup);
	
	xstep = (renderer.width)/SEGMENT_COUNT;
	for (var i = 0; i < CURVE_COUNT; i++) {
		var curve = new PIXI.Graphics();
		curveGroup.addChild(curve);
		//curve.blendMode = PIXI.blendModes.MULTIPLY;
		curves.push(curve);

		//create random curve points
		var thisCurvePts = [];
		curvePts.push(thisCurvePts)
		
		var xpos = -(renderer.width )/2;			
		for (var j = 0; j <= SEGMENT_COUNT; j++) {
			var pt = getRandomPt(xpos);
			thisCurvePts.push(pt);
			xpos += xstep;
		}
	}

	drawCurves();
}

function resizeCurves(){
	//resize curves
	if (curveGroup){
		xstep = (renderer.width )/SEGMENT_COUNT;
		for (var i = 0; i < CURVE_COUNT; i++) {
			var thisCurvePts = curvePts[i];
			var xpos = -(renderer.width )/2;			
			for (var j = 0; j <= SEGMENT_COUNT; j++) {
				thisCurvePts[j].x = xpos;
				xpos += xstep;
			}
		}
	}
}


//every frame - update curve points and redraw curves
function drawCurves(){

	for (var i = 0; i < CURVE_COUNT; i++) {

		var curve = curves[i];
		var thisCurvePts = curvePts[i];
		
		for (var j = 0; j <= SEGMENT_COUNT; j ++) {
			thisCurvePts[j].y = simplexNoise.noise(noiseTime + j/8, i/8) *  200;
		}

		curve.clear();
		
		//DO FILL?
		if (curveOpacity > 0){
			curve.beginFill(COLORS[i],curveOpacity);	
		}else{
			//curve.lineStyle(10, COLORS[i],.8);
			curve.lineStyle(1, 0xcccccc,1);
		}
		
		// move to the first point			
		curve.moveTo(thisCurvePts[0].x, thisCurvePts[0].y);

		//draw through mid points
		for (var j = 1; j <= SEGMENT_COUNT - 2; j ++)
		{
			var xc = (thisCurvePts[j].x + thisCurvePts[j + 1].x) / 2;
			var yc = (thisCurvePts[j].y + thisCurvePts[j + 1].y) / 2;
			curve.quadraticCurveTo(thisCurvePts[j].x, thisCurvePts[j].y, xc, yc);
		}
		// curve through the last two points
		curve.quadraticCurveTo(thisCurvePts[j].x, thisCurvePts[j].y, thisCurvePts[j+1].x,thisCurvePts[j+1].y);

		//FILL
		if (curveOpacity > 0){
			curve.lineTo(thisCurvePts[j+1].x, 300);
			curve.lineTo(thisCurvePts[0].x, 300);
			curve.lineTo(thisCurvePts[0].x, thisCurvePts[0].y)
			curve.endFill();
		}

	};

}

function getRandomPt(xpos){
	var yRange = renderer.height/2;
	return new PIXI.Point(xpos,ATUtil.randomRange(-yRange,yRange));
}
