var screenWidth = $(window).innerWidth(), 
	mobileScreen = (screenWidth > 500 ? false : true);

var margin = {left: 50, top: 10, right: 50, bottom: 10},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
			
var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height/1.8  + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
	innerRadius = outerRadius * 0.95,
	opacityDefault = 0.7, //default opacity of chords
	opacityLow = 0.02; //hover opacity of those chords not hovered over
	
//How many pixels should the two halves be pulled apart
var pullOutSize = (mobileScreen? 20 : 50)

//////////////////////////////////////////////////////
//////////////////// Titles on top ///////////////////
//////////////////////////////////////////////////////

var titleWrapper = svg.append("g").attr("class", "chordTitleWrapper"),
	titleOffset = mobileScreen ? 15 : 40,
	titleSeparate = mobileScreen ? 30 : 0;

//Title	top left
titleWrapper.append("text")
	.attr("class","title left")
	.style("font-size", mobileScreen ? "12px" : "16px" )
	.attr("x", (width/2 + margin.left - outerRadius - titleSeparate))
	.attr("y", titleOffset)
	.text("Emotional Parameters");
titleWrapper.append("line")
	.attr("class","titleLine left")
	.attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6)
	.attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4)
	.attr("y1", titleOffset+8)
	.attr("y2", titleOffset+8);
//Title top right
titleWrapper.append("text")
	.attr("class","title right")
	.style("font-size", mobileScreen ? "12px" : "16px" )
	.attr("x", (width/2 + margin.left + outerRadius + titleSeparate))
	.attr("y", titleOffset)
	.text("Subjects");
titleWrapper.append("line")
	.attr("class","titleLine right")
	.attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6 + 2*(outerRadius + titleSeparate))
	.attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4 + 2*(outerRadius + titleSeparate))
	.attr("y1", titleOffset+8)
	.attr("y2", titleOffset+8);
	
////////////////////////////////////////////////////////////
/////////////////// Animated gradient //////////////////////
////////////////////////////////////////////////////////////

var defs = wrapper.append("defs");
var linearGradient = defs.append("linearGradient")
	.attr("id","animatedGradient")
	.attr("x1","0%")
	.attr("y1","0%")
	.attr("x2","100%")
	.attr("y2","0")
	.attr("spreadMethod", "reflect");

linearGradient.append("animate")
	.attr("attributeName","x1")
	.attr("values","0%;100%")
//	.attr("from","0%")
//	.attr("to","100%")
	.attr("dur","7s")
	.attr("repeatCount","indefinite");

linearGradient.append("animate")
	.attr("attributeName","x2")
	.attr("values","100%;200%")
//	.attr("from","100%")
//	.attr("to","200%")
	.attr("dur","7s")
	.attr("repeatCount","indefinite");

linearGradient.append("stop")
	.attr("offset","5%")
	.attr("stop-color","#E8E8E8");
linearGradient.append("stop")
	.attr("offset","45%")
	.attr("stop-color","#A3A3A3");
linearGradient.append("stop")
	.attr("offset","55%")
	.attr("stop-color","#A3A3A3");
linearGradient.append("stop")
	.attr("offset","95%")
	.attr("stop-color","#E8E8E8");
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["Social","Family","Friends","Humans","Feel","Body","Sexual","Work","Achievement","Home","Death","Money","Religion","","Dissent","Sad","Anger","Anxiety","Negative Emotion","Negative Sentiment Calculated By VADER","Positive Sentiment Calculated By VADER","Assent","Positive Emotion","",];

var respondents = 5.2519, //Total number of respondents (i.e. the number that make up the total group
	emptyPerc = 0.2, //What % of the circle should become empty
	emptyStroke = Math.round(respondents*emptyPerc); 
var matrix = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.00041973134486461116, 0.09584982933344637, 0.0010095798954755542, 0.002387202529152798, 0.0007204193383400871, 0.0973076863354037, 0.0370388198757764, 0.0015071251923254973, 0.0054641646945278, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.00009796159248955096, 0.05555765111871285, 0.00032216437348351067, 0.0008746761957942374, 0.0002109685393375761, 0.15425855546001715, 0.021284608770421317, 0.001134453981921477, 0.001983505597168987, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.000573900306329997, 0.11410094460752253, 0.0007598914149197867, 0.0026344373144036965, 0.0007224306223750036, 0.16279954566106264, 0.04106663637740415, 0.0013348574538169292, 0.0059118820237216785, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0010937213111462565, 0.12988333488165102, 0.00243044495039238, 0.0068439580786201935, 0.001928848997463025, 0.369275652980592, 0.06538989052933149, 0.0019323989198880387, 0.015296947119982432, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0002451192905679424, 0.06254899674123203, 0.000489773132334074, 0.0017501129757489658, 0.00038512132490359723, 0.04156144126822118, 0.026040632541348585, 0.0009497950416768867, 0.0034630741913771954, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0028926100354671786, 0.12567112379488946, 0.0009853147608249648, 0.0027450063164348873, 0.0009216589861751152, 0.5920428571428572, 0.036571428571428574, 0.0012457588494454855, 0.004651980063434968, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0004981503174916937, 0.11763019534615535, 0.001387521607891117, 0.001617716088833126, 0.0005581614003591469, 0.44280043582673584, 0.033377212487769974, 0.001617745772842207, 0.0051501854925910685, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.00048108435093218577, 0.08928237213343804, 0.0008569720211330559, 0.001843465068592905, 0.0005407774650048486, 0.3859152719525996, 0.027564276679315245, 0.0011058558561847158, 0.004497449928838094, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0006604994042046937, 0.10974783314002877, 0.0011750819398388193, 0.0015842148242097252, 0.0007445648474736456, 0.4243731330977609, 0.036479740871613216, 0.001687709137844027, 0.005462712776126079, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0008426434523880916, 0.10236610001787542, 0.0008957637252744055, 0.0007912280834232519, 0.00023457694082995763, 0.4593848888888887, 0.02592, 0.014917632490125073, 0.0025048553870392607, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0003922825143558496, 0.07647212531350743, 0.0010121857630163826, 0.003432704725021291, 0.0006525411115457274, 0.030261744138214218, 0.04011805841217637, 0.0017747930610762731, 0.006926527430411425, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.002774873807756173, 0.04473859519782871, 0.0006976445855230673, 0.003965534104411271, 0.0005105397861394139, 0.6667876796714587, 0.12650718685831616, 0.0008215936558252906, 0.0063182798230378865, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, emptyStroke],
    [0.00041973134486461116, 0.00009796159248955096, 0.000573900306329997, 0.0010937213111462565, 0.0002451192905679424, 0.0, 0.0028926100354671786, 0.0004981503174916937, 0.00048108435093218577, 0.0006604994042046937, 0.0008426434523880916, 0.0003922825143558496, 0.002774873807756173, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.09584982933344637, 0.05555765111871285, 0.11410094460752253, 0.12988333488165102, 0.06254899674123203, 0.0, 0.12567112379488946, 0.11763019534615535, 0.08928237213343804, 0.10974783314002877, 0.10236610001787542, 0.07647212531350743, 0.04473859519782871, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ,0.0, 0.0],
    [0.0010095798954755542, 0.00032216437348351067, 0.0007598914149197867, 0.00243044495039238, 0.000489773132334074, 0.0, 0.0009853147608249648, 0.001387521607891117, 0.0008569720211330559, 0.0011750819398388193, 0.0008957637252744055, 0.0010121857630163826, 0.0006976445855230673, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ,0.0, 0.0],
    [0.002387202529152798, 0.0008746761957942374, 0.0026344373144036965, 0.0068439580786201935, 0.0017501129757489658, 0.0, 0.0027450063164348873, 0.001617716088833126, 0.001843465068592905, 0.0015842148242097252, 0.0007912280834232519, 0.003432704725021291, 0.003965534104411271, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ,0.0, 0.0],
    [0.0007204193383400871, 0.0002109685393375761, 0.0007224306223750036, 0.001928848997463025, 0.00038512132490359723, 0.0, 0.0009216589861751152, 0.0005581614003591469, 0.0005407774650048486, 0.0007445648474736456, 0.00023457694082995763, 0.0006525411115457274, 0.0005105397861394139, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ,0.0, 0.0],
    [0.0973076863354037, 0.15425855546001715, 0.16279954566106264, 0.369275652980592, 0.04156144126822118, 0.0, 0.5920428571428572, 0.44280043582673584, 0.3859152719525996, 0.4243731330977609, 0.4593848888888887, 0.030261744138214218, 0.6667876796714587, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ,0.0, 0.0],
    [0.0370388198757764, 0.021284608770421317, 0.04106663637740415, 0.06538989052933149, 0.026040632541348585, 0.0, 0.036571428571428574, 0.033377212487769974, 0.027564276679315245, 0.036479740871613216, 0.02592, 0.04011805841217637, 0.12650718685831616, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ,0.0, 0.0],
    [0.0015071251923254973, 0.001134453981921477, 0.0013348574538169292, 0.0019323989198880387, 0.0009497950416768867, 0.0, 0.0012457588494454855, 0.001617745772842207, 0.0011058558561847158, 0.001687709137844027, 0.014917632490125073, 0.0017747930610762731, 0.0008215936558252906, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ,0.0, 0.0],
    [0.0054641646945278, 0.001983505597168987, 0.0059118820237216785, 0.015296947119982432, 0.0034630741913771954, 0.0, 0.004651980063434968, 0.0051501854925910685, 0.004497449928838094, 0.005462712776126079, 0.0025048553870392607, 0.006926527430411425, 0.0063182798230378865, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ,0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, emptyStroke, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
          
];
//Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
//invisible chord center vertically
var offset = (2 * Math.PI) * (emptyStroke/(respondents + emptyStroke))/4;

//Custom sort function of the chords to keep them in the original order
var chord = customChordLayout() //d3.layout.chord()
	.padding(.02)
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
	.endAngle(endAngle);

var path = stretchedChord() //Call the stretched chord function 
	.radius(innerRadius)
	.startAngle(startAngle)
	.endAngle(endAngle)
	.pullOutSize(pullOutSize);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", fade(opacityLow))
	.on("mouseout", fade(opacityDefault));

g.append("path")
	.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
	.style("fill", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
	.style("pointer-events", function(d,i) { return (Names[i] === "" ? "none" : "auto"); })
	.attr("d", arc)
	.attr("transform", function(d, i) { //Pull the two slices apart
				d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
				return "translate(" + d.pullOutSize + ',' + 0 + ")";
	});

////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//The text also needs to be displaced in the horizontal directions
//And also rotated with the offset in the clockwise direction
g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.style("font-size", mobileScreen ? "8px" : "10px" )
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
		+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + 20 + ",0)"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
  .text(function(d,i) { return Names[i]; })
  .call(wrapChord, 100);

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
var chords = wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	.style("fill", "url(#animatedGradient)") //An SVG Gradient to give the impression of a flow from left to right
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
	.style("pointer-events", function(d,i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
	.attr("d", path)
	.on("mouseover", fadeOnChord)
    .on("mouseout", fade(opacityDefault));	
    

////////////////////////////////////////////////////////////
///////////////////////// Tooltip //////////////////////////
////////////////////////////////////////////////////////////

//Arcs
g.append("title")	
	.text(function(d, i) {return (d.value/5.2519 * 100) + "% of posts indicate: " + Names[i];});
	
//Chords
chords.append("title")
	.text(function(d) {
		return [(d.source.value/5.2519 * 100), "% posts on ", Names[d.source.index], " indicate the emotion: ", Names[d.target.index]].join(""); 
	});
////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
	wrapper.selectAll("path.chord")
		.filter(function(d) { return d.source.index !== i && d.target.index !== i && Names[d.source.index] !== ""; })
		.transition()
		.style("opacity", opacity);
  };
}//fade

// Fade function when hovering over chord
function fadeOnChord(d) {
	var chosen = d;
	wrapper.selectAll("path.chord")
		.transition()
		.style("opacity", function(d) {
			return d.source.index === chosen.source.index && d.target.index === chosen.target.index ? opacityDefault : opacityLow;
		});
}//fadeOnChord

/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrapChord(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = 0,
		x = 0,
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrapChord