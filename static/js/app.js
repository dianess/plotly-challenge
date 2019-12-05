function buildMetadata(sample) {

    // Build the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    var url = "/metadata/" + sample;
    d3.json(url).then(function(sample){
  
      // Use d3 to select the panel with id of `#sample-metadata`
      var sample_metadata = d3.select("#sample-metadata");
  
      // Use `.html("")` to clear any existing metadata
      sample_metadata.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Inside the loop, use d3 to append new tags for each key-value
      // in the metadata.
      Object.entries(sample).forEach(([key, value]) => {
        var row = sample_metadata.append("p");
        row.text(`${key}: ${value}`);
  
      })
    })
  };

  function buildBarChart(sample) {
     // Use `d3.json` to fetch the sample data for the bar chart
     var url = `/samples/${sample}`;
     d3.json(url).then(function(data) { 
      var ybar = data.otu_ids;
      var xbar = data.sample_values;
      var barHover = data.otu_labels;

        // Build a Bar Chart using the sample data
        var trace1 = {
          y: ybar.slice(0, 10).map(object => `OTU ${object}`).reverse(),
          x: xbar.slice(0, 10).reverse(),
          hovertext: barHover.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h"
        }
          var data = [trace1];
          
        // Apply the group bar mode to the layout
        var layout = {
            title: "Top 10 OTUs",
            margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 100
            }
          };
          
          // Render the plot to the div tag with id "plot"
          Plotly.newPlot("plot", data, layout);
  });
}

  function buildGaugeChart(sample) {
    
     // Use `d3.json` to fetch the sample data for the plots
     var url = `/metadata/${sample}`;
     d3.json(url).then(function(data) {
        console.log(data);
        var freqValues = data.WFREQ;
        console.log(freqValues);
        var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: freqValues,
          title: { text: "Belly Button Washing Frequency</b> <br> Scrubs per Week", font: { size: 18 } },
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
            bar: { color: "black" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "black",
            steps: [
              { range: [0, 1], color: "lightcoral" },
              { range: [1, 2], color: "lightpink" },
              { range: [2, 3], color: "yellowgreen" },
              { range: [3, 4], color: "lightgreen" },
              { range: [4, 5], color: "green" },
              { range: [5, 6], color: "lightblue" },
              { range: [6, 7], color: "cyan" },
              { range: [7, 8], color: "royalblue" },
              { range: [8, 9], color: "blue" }
            ],
            }
          }
        
      ];
      
      var layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
      };
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    //plot
    Plotly.newPlot("gauge", data, layout);
    });
}

  function buildCharts(sample) {
  
    // Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {
  
      // Build a Bubble Chart using the sample data
      var xValues = data.otu_ids;
      var yValues = data.sample_values;
      var tValues = data.otu_labels;
      var mSize = data.sample_values;
      var mClrs = data.otu_ids;
  
      var trace_bubble = {
        x: xValues,
        y: yValues,
        text: tValues,
        mode: 'markers',
        marker: {
          size: mSize,
          color: mClrs
        }
      };
  
      var data = [trace_bubble];
  
      var layout = {
        xaxis: {title: "OTU ID"}
      };
  
      Plotly.newPlot('bubble', data, layout);
  
    });
  }  
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildBarChart(firstSample);
      buildGaugeChart(firstSample);
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  };
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildBarChart(newSample);
    buildGaugeChart(newSample);
    buildCharts(newSample);
    buildMetadata(newSample);

  };
  
  // Initialize the dashboard
  init();