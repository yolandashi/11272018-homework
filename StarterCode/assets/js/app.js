// @TODO: YOUR CODE HERE!
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

let chosenXAxis = "poverty";

function xScale(healthData, chosenXAxis) {
    // create scales
    const xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

let chosenYAxis = "obesity";
function yScale(healthData, chosenYAxis) {
  // create scales
  const yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, healthData => healthData[chosenYAxis]) * 0.8,
      d3.max(healthData, healthData => healthData[chosenYAxis]) * 1.2
    ])
    .range([0, height]);

  return yLinearScale;

}


  function renderAxes(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", healthData=> newXScale(healthData[chosenXAxis]));
  
    return circlesGroup;
  }
  
  function updateToolTip(chosenXAxis, circlesGroup) {

    let label = "state";
    if (chosenXAxis === "poverty") {
      label = "Poverty : "
    }
    else if (chosenXAxis === "age"){
      label = "Age : "
    }
    else {
      label = "Income : "
    };
  
    const toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(healthData) {
        return (`${healthData.state}<br>${label} ${healthData[chosenXAxis]}<br> ${healthData[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(healthData) {
      toolTip.show(healthData, this);
    })
      // onmouseout event
      .on("mouseout", function(healthData, index) {
        toolTip.hide(healthData);
      });
  
    return circlesGroup;
  }

  d3.csv("assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;
  

  healthData.forEach(function(healthData) {
    healthData.poverty = +healthData.poverty;
    healthData.healthcare = +healthData.healthcare;
    healthData.age = +healthData.age;
    healthData.smokes =+healthData.smokes;
    healthData.obesity = +healthData.obesity;
    healthData.income =+healthData.income;
    healthData.abbr =+healthData.abbr;
    });

    // chartGroup.selectAll("circle")
    //   .data(healthData)
    //   .enter()
    //   .append("circle")
    //   .attr("x", function (healthData) {
    //       return xScale(healthData[chosenXAxis]);
    //   })
    //   .attr("y", function (healthData) {
    //       return yScale(healthData[chosenYAxis]);
    //   })


    // chartGroup.append("text")
    //     .text(function(healthData) {
    //       return healthData.abbr;
    //     })
    //     .attr("x", function (healthData) {
    //       return xScale(healthData[chosenXAxis]);
    //   })
    //     .attr("y", function (healthData) {
    //         return yScale(healthData[chosenYAxis]);
    //     })



    console.log(healthData)

    let xLinearScale = xScale(healthData, chosenXAxis);
    let yLinearScale = yScale(healthData, chosenYAxis);

    
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    let xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    let yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(0, ${width})`)
      .call(leftAxis);

    let circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", healthData => xLinearScale(healthData[chosenXAxis]))
      .attr("cy", healthData => yLinearScale(healthData[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", "lightskyblue")
      .attr("opacity", "0.5");

    const labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    const povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") 
      .classed("active", true)
      .text("Poverty");

    const ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age");

    const incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .classed("inactive", true)
      .text("Income");

    // append y axis
    const obesityLable = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("active", true)
      .classed("axis-text", true)
      .text("Obesity");

    const smokesLable = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "2em")
      .classed("inactive", true)
      .classed("axis-text", true)
      .text("Smokes");

    const healthcareLabel = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "3em")
      .classed("inactive", true)
      .classed("axis-text", true)
      .text("Healthcare");


    

    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
    // replaces chosenXaxis with value
    chosenXAxis = value;


    circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        const inactive = d3.select(this).classed("inactive");
        if (inactive !== chosenYAxis) {
  
    chosenYAxis = inactive;

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(healthData, chosenXAxis);
    yLinearScale = yScale(healthData, chosenYAxis);

    // updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);
    yAxis = renderAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
    circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "Poverty") {
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLable
        .classed("active", true)
        .classed("inactive", false);
      smokesLable
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      }

    else if (chosenXAxis === "Age") {
      ageLabel
        .classed("active", true)
        .classed("inactive", false);
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLable
        .classed("active", false)
        .classed("inactive", true);
      smokesLable
        .classed("active", true)
        .classed("inactive", false);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
     
    }
    else {
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", true)
        .classed("inactive", false);
      obesityLable
        .classed("active", false)
        .classed("inactive", true);
      smokesLable
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);  
    }

    
}})
}})
})