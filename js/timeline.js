window.onload = function() {
      const testDates = [
        new Date(1990, 1, 1, 12, 0, 0),
        new Date(1990, 1, 2, 12, 0, 0),

        new Date(1993, 5, 29, 12, 0, 0),
        new Date(1996, 5, 29, 12, 0, 0),

        new Date(1998, 5, 29, 12, 0, 0),
        new Date(2023, 5, 29, 12, 0, 0),

        new Date(2025, 1, 1, 12, 0, 0),
        new Date(2025, 1, 2, 12, 0, 0)
        ]
      const testData = [{times: [ ]}]
      const gradDates = [ 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025]
      const scaleDates = []
      function createScaleDates(index) {
        if (index < gradDates.length) {
           scaleDates.push(new Date(gradDates[index], 1, 1, 12, 0, 0))
           scaleDates.push(new Date(gradDates[index], 1, 5, 12, 0, 0))
           createScaleDates(index + 1)
        }
      }
      createScaleDates(0)
      const scaleData = [{ times: [] }]
     function pushDate(index, dates, output) {
        if (index < dates.length - 1)
        {
            output[0].times.push({
                starting_time: dates[index].getTime(),
                ending_time: dates[index + 1].getTime()
            })
            pushDate(index + 2, dates, output)
        }
      }
      pushDate(0, testDates, testData)
      pushDate(0, scaleDates, scaleData)

      var width = window.innerWidth - window.innerWidth / 20;

      function timelineRectNoAxis(timelineid, color, data) {
        var chart = d3.timelines().showTimeAxis();

        var svg = d3.select('#' + timelineid)
            .append("svg")
            .attr("width", width)
            .datum(data).call(chart);

        svg.selectAll('rect')
            .style("fill", color)
      }
      timelineRectNoAxis('timeline1', 'blue', scaleData)
      timelineRectNoAxis('timeline2', 'orange', testData)
}