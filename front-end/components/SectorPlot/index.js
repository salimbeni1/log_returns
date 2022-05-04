
export default function SectorPlot(props) {
    
    const arr = props.data
    const counts = {};
    for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    var element = [["Element", "Density", { role: "style" } ]]
    for (const [key, value] of Object.entries(counts)) {
        
        element.push([key, value, "rgb("+props.map_sect_col[key].join()+")"])

    }
    
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable(element);

      var view = new google.visualization.DataView(data);
      

      var options = {
        width: "100%",
        height: "100%",
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
        orientation: "vertical",
        backgroundColor: 'transparent',
        vAxis:{ textStyle: {fontSize: 11}}
        
      };
      var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
      chart.draw(view, options);
  }

   
    return (

        <div id="columnchart_values" >
        </div>  
    )

  }