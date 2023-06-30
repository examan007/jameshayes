TimelineApplication = function () {
     var consolex = {
         log: function(msg) {},
         error: function(msg) {},
     }
     const testDates = [
        new Date(1990, 1, 1, 12, 0, 0),
        new Date(1990, 1, 2, 12, 0, 0),

        new Date(2012, 11, 1, 12, 0, 0),
        new Date(),

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
      function timelineRectNoAxis(timelineid, color, data, nolabel, index, scale) {
        const chart = d3.timelines().showTimeAxis();

        const svg = d3.select('#' + timelineid)
            .append("svg")
            .attr("width", width)
            .datum(data).call(chart);

        const height = scale / 4
        const transY = index * ( height + scale / 8)
        svg.selectAll('rect')
            .style("fill", color)
            .style("height", "" + height + "px")
            .style("transform", "translateY(" + transY + "px)")

        if (!nolabel) {
            var index = 0
            svg.selectAll('.textlabels')
            .text(function () {
                index++
                if (index == 1 || index == gradDates.length) {
                    return ""
                } else {
                    return gradDates[index-1]
                }
            })
            .style("font-size", function (d) {
                const size = height - height * (110 - scale) / 100
                console.log("Font-size is: [" + size + "]")
                return "" + size + "px"
            })
           .style("transform", "translateY(" + transY + "px)")

        }
        return {
            chart: chart,
            svg: svg
        }
      }
      function registerRectEvents(timeline) {
        try {
            const svg = d3.select("#timeline2 svg");
            const rects = svg.selectAll("rect")
            console.log("rects found [" + rects.size() + "]")
            rects.on("mouseover", function (d) {
                 // Handle mouseover event
                 console.log(JSON.stringify(d))
               })
        } catch (e) {
            console.log(e.stack.toString())
        }
      }
    return {
        Scale: 100,
        Objects: {},
        createTimeline: function (scale) {
          this.Scale = scale
          //timelineRectNoAxis('timeline2', '#ff7f0e', testData, true, 2, scale)
          timelineRectNoAxis('timeline1', '#1f77b4', scaleData, false, 1, scale)
          //timelineRectNoAxis('timeline2', '#1f77b4', testData, true, 2, scale)
        },
        updateRoles: function (times, color, flag, scale) {
            if (typeof(times) === 'undefined') {
                return
            }
            if (times.length <= 0) {
                return
            }
            if (flag) {
                const dates = [
                    new Date(1990, 1, 1, 12, 0, 0),
                    new Date(1990, 1, 2, 12, 0, 0)
                ]
                function setDate(index) {
                    if (index < times.length) {
                        try {
                            console.log(JSON.stringify(times[index]))
                            const pair = times[index].split("-")
                            dates.push(moment(pair[0],"MMM'YY").toDate())
                            dates.push(moment(pair[1],"MMM'YY").toDate())
                        } catch (e) {
                            console.log(e.stack.toString())
                        }
                        setDate(index + 1)
                    }
                }
                setDate(0)
                dates.push(new Date(2025, 1, 1, 12, 0, 0))
                dates.push(new Date(2025, 1, 2, 12, 0, 0))
                const updateData = [{ times: [] }]
                pushDate(0, dates, updateData)
                //chart.setItems(updateData);
                //chart.redraw();
                try {
                    d3.select("#timeline2 svg").remove();
                } catch (e) {
                    console.log(s.stack.toString())
                }
                Objects = timelineRectNoAxis('timeline2', color, updateData, true, 2, this.Scale)
                registerRectEvents('timeline2')

                console.log(JSON.stringify(updateData))
            }
        }
    }
}