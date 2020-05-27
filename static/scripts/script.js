$(document).ready(function () {
  $.get("/api/countries", function (data) {
    // If successful make the graph
    makeGraph(data);
  }).fail(function () {
    alert("No Data Found");
  });
});

var fileX = "income_per_person_gdppercapita_ppp_inflation_adjusted";
var fileY = "internet_users";
var padding = 40;

// Width and height
var w = 1000;
var h = 400;

// Max scales for the graph
var maxX = 0;
var maxY = 0;

//Create the svg
var svg;

var tooltip;

function makeGraph(data) {
  // fill data with only countries that contain both the selected files
  cleanedData = [];
  data.forEach(function (d) {
    if ([fileY] in d["data"] && [fileX] in d["data"]) {
      cleanedData.push(d);
    }
  });
  console.log(cleanedData)

  svg = d3
  .select("#d3_graph")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  // Make the slider for the graph
  slider();

  //scale functions
  maxX = getMax(fileX, cleanedData);
  console.log(maxX)
  var xScale = d3
    .scaleLinear()
    .domain([0, maxX])
    .range([padding, w - padding * 2]);
  maxY = getMax(fileY, cleanedData);
  var yScale = d3
    .scaleLinear()
    .domain([0, maxY])
    .range([h - padding, padding]);

  // Setting the graph axis
  var xAxis = d3.axisBottom().scale(xScale).ticks(5);
  var yAxis = d3.axisLeft().scale(yScale).ticks(5);

  // Setting the default date to be used
  var defaultYear = 2010;

  tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  //draw points on the graph
  drawCircles(cleanedData, defaultYear, svg, xScale, yScale);

  // x axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

  // y axis
  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
}

// Getting the the max value from the specified data in the data
// Warning: did this because d3.max() doesn't seem to return anything over 10,000
function getMax(file, cleanedData) {
  var new_array = cleanedData.map(function (d) {
    max = 0;
    for (var yearData in d["data"][fileY]) {
      if (d["data"][file][yearData] > max) {
        max = d["data"][file][yearData];
      }
    }
    return max;
  });
  return Math.max(...new_array);
}

function drawCircles(cleanedData, year, graphsvg, xScale, yScale) {
  // Draw the circles on the graph
  console.log(svg)
  graphsvg
    .selectAll("circle")
    .data(cleanedData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d["data"][fileX][year]);
    })
    .attr("cy", function (d) {
      return yScale(d["data"][fileY][year]);
    })
    .attr("r", 5)
    .attr("fill", "green")
    // Tooltips
    .on("mouseover", function (d) {
      console.log(d);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          d["name"] +
            "<br/>X Axis: " +
            d["data"][fileX][year] +
            "<br/>Y Axis: " +
            d["data"][fileY][year]
        )
        .style("left", d3.event.pageX + 5 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}

function slider() {
  var dataTime = d3.range(1800, 2021).map(function (d) {
    return new Date(d, 1, 1);
  });
  var ticksTest = [new Date(1800, 1, 1), new Date(2010, 1, 1)];

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(300)
    .tickFormat(d3.timeFormat("%Y"))
    .tickValues(ticksTest)
    .default(new Date(2010, 1, 1))
    .on("onchange", (val) => {
      d3.select("p#value-time").text(d3.timeFormat("%Y")(val));
      changeGraphYear(d3.timeFormat("%Y")(val));
    });
  var gTime = d3
    .select("div#slider_years")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(30,30)");

  gTime.call(sliderTime);

  d3.select("p#value_years").text(d3.timeFormat("%Y")(sliderTime.value()));
}

function changeGraphYear(year) {
  // THIS IS NOT WORKING
  // FIX THIS

  console.log(year);
  /*
  var svg = d3.select("#d3_graph");
*/
  //Remove this as its copy code from makeGraph()
  maxX = 0;
  var new_array = cleanedData.map(function (d) {
    max = 0;
    for (var yearData in d["data"][fileX]) {
      if (d["data"][fileX][yearData] > max) {
        max = d["data"][fileX][yearData];
      }
    }
    return max;
  });
  maxX = Math.max(...new_array);

  maxY = 0;
  var new_array = cleanedData.map(function (d) {
    max = 0;
    for (var yearData in d["data"][fileY]) {
      if (d["data"][fileY][yearData] > max) {
        max = d["data"][fileY][yearData];
      }
    }
    return max;
  });
  maxY = Math.max(...new_array);

  //scale functions
  var xScale = d3
    .scaleLinear()
    .domain([0, maxX])
    .range([padding, w - padding * 2]);

  var yScale = d3
    .scaleLinear()
    .domain([0, maxY])
    .range([h - padding, padding]);

  svg
    .selectAll("circle")
    .attr("fill", "red")
    .attr("cx", function (d) {
      return xScale(d["data"][fileX][year]);
    })
    .attr("cy", function (d) {
      return yScale(d["data"][fileY][year]);
    })
    // Tooltips
    .on("mouseover", function (d) {
      console.log(d);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          d["name"] +
            "<br/>X Axis: " +
            d["data"][fileX][year] +
            "<br/>Y Axis: " +
            d["data"][fileY][year]
        )
        .style("left", d3.event.pageX + 5 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}
