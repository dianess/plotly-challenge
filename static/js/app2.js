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
//   //function to build gauge chart
//     function buildGaugeChart(wfreq) {
//     //calculate wfreq as a fraction of 9
//     var fraction = wfreq/9;

//     //use trigonometry to calculate meter point
//     //var level = parseFloat(wfreq) * 20;
//     var level = fraction * 180;
//     var degrees = 180 - level, radius = .5;
//     var radians = degrees * Math.PI / 180;
//     var x = radius * Math.cos(radians);
//     var y = radius * Math.sin(radians);

//     //Path
//     var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//         pathX = String(x),
//         space = ' ',
//         pathY = String(y),
//         pathEnd = ' Z';
//     var path = mainPath.concat(pathX, space, pathY, pathEnd);

//     //create data object
//     var data = [{ 
//         type: 'scatter',
//         x: [0],
//         y: [0],
//         marker: {size: 28, color: '850000'},
//         showlegend: false,
//         name: ' wpw',
//         text: wfreq,
//         hoverinfo: 'text+name'},
//         {
//             values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
//             rotation: 90,
//             text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
//             textinfo: 'text',
//             textposition: 'inside',
//             marker: {
//                 colors: ['rgba(119, 170, 221, .5)', 
//                 'rgba(153, 221, 255, .5)', 
//                 'rgba(68, 187, 153, .5)', 
//                 'rgba(187, 204, 51, .5)', 'rgba(170, 170, 0, .5)', 
//                 'rgba(238, 221, 136, .5)', 'rgba(238, 136, 102, .5)', 
//                 'rgba(255, 170, 187, .5)', 'rgba(221, 221, 221, .5)', 
//                 'rgba(255, 255, 255, 0)']
//             },
//             labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
//             hoverinfo: 'label',
//             hole: .5,
//             type: 'pie',
//             showlegend: false
//     }];

//     //create layout object
//     var layout = {
//         shapes:[{
//             type: 'path',
//             path: path,
//             fillcolor: '850000',
//             line: {
//                 color: '850000'
//             }
//         }],
//         title: 'Belly Button Washing Frequency</b> <br> Scrubs per Week',
//         xaxis: {
//             zeroline: false, 
//             showticklabels: false,
//             showgrid: false,
//             range: [-1, 1]
//         },
//         yaxis: {
//             zeroline: false,
//             showticklabels: false,
//             showgrid: false,
//             range: [-1, 1]
//         }
//     };
  function buildGaugeChart(wfreq) {
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: 270,
            title: { text: "Belly Button Washing Frequency</b> <br> Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number"
        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

  }
    //plot
    Plotly.newPlot("gauge", data, layout);
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