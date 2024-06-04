// Function to populate the metadata panel with the selected sample's data
function buildMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then((data) => {
      // Extract metadata
      var metadata = data.metadata;
  
      // Find metadata for the chosen sample
      var result = metadata.filter(obj => obj.id === parseInt(sample))[0];
  
      // Select the panel where the metadata will be displayed
      var metadataPanel = d3.select("#sample-metadata");
  
      // Clear existing metadata
      metadataPanel.html("");
  
      // Add each key-value pair to the panel
      Object.entries(result).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
      });
    });
  }
  
  // Function to create the charts for the selected sample
  function buildCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then((data) => {
      // Extract samples data
      var samples = data.samples;
  
      // Filter for the selected sample's data
      var result = samples.filter(obj => obj.id === sample)[0];
  
      // Get the necessary data for the charts
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Define the trace for the bubble chart
      var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      };
  
      // Data and layout for the bubble chart
      var dataBubble = [trace1];
      var layoutBubble = {
        xaxis: { title: "OTU ID" },
        hovermode: "closest"
      };
  
      // Plot the bubble chart
      Plotly.newPlot('bubble', dataBubble, layoutBubble);
  
      // Create yticks for the bar chart
      var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
  
      // Define the trace for the bar chart
      var trace2 = {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      };
  
      // Data and layout for the bar chart
      var dataBar = [trace2];
      var layoutBar = {
        title: 'Top 10 OTUs Found',
        margin: { t: 30, l: 150 }
      };
  
      // Plot the bar chart
      Plotly.newPlot('bar', dataBar, layoutBar);
    });
  }
  
  // Initial function to load the dashboard
  function init() {
    d3.json("https://static.bc-edx.com/data/dla-1-2/m14/lms/starter/samples.json").then((data) => {
      // Get sample names
      var names = data.names;
  
      // Select the dropdown menu
      var dropdown = d3.select("#selDataset");
  
      // Add options to the dropdown menu
      names.forEach((sample) => {
        dropdown.append("option").text(sample).property("value", sample);
      });
  
      // Use the first sample to build initial charts and metadata
      var firstSample = names[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Function to handle change in dropdown selection
  function optionChanged(newSample) {
    // Update charts and metadata when a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Call the init function to set up the dashboard
  init();
  