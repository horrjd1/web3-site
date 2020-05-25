$(document).ready(function () {
  
  $.get("/api/countries", function (data) {
    // If successful make the graph

    // Width and height
    var w = 600;
    var h = 400;
    var padding = 40;

    // Setting the data to be used
    var dataset = data;
    var fileIncomeName = 'income_per_person_gdppercapita_ppp_inflation_adjusted'
    var selectedYear = 2010

    //scale functions
    var xScale = d3
      .scaleLinear()
      .domain([
        //lowest
        0,
        //highest
        d3.max(dataset, function (d) {
          console.log(d)
          return d["data"][fileIncomeName][selectedYear];
        }),
      ])
      .range([padding, w - padding * 2]);

    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataset, function (d) {
          return d['data'][fileIncomeName]['2010'];
        }),
      ])
      .range([h - padding, padding]);

    var xAxis = d3.axisBottom().scale(xScale).ticks(5);
    var yAxis = d3.axisLeft().scale(yScale).ticks(5);

    //Create the svg
    var svg = d3
      .select("#d3_graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Draw the circles on the graph
    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d['data'][fileIncomeName]['2010']);
      })
      .attr("cy", function (d) {
        return yScale(d['data'][fileIncomeName]['2010']);
      })
      .attr("r", 5)
      .attr("fill", "green");

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

    
  }).fail(function () {
    alert("No Data Found");
  });
});

/*

Get single item
change <country name>

$.get('/api/countries/<country_name>', function (data) {
    console.log("Ajax testing")
    console.log(JSON.stringify(data))
}).fail(function () {
    alert("No Data Found")
});


Post

$.post()

*/
