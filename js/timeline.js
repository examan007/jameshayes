TimelineApplication = function () {
     const MAX_ROLES = 99
     const ThisApp = this
     var updateRole = function (roleid, event) {}
     var console = {
         log: function(msg) {},
         error: function(msg) {},
     }
     const testDates = [
        {
            start: new Date(1990, 1, 1, 12, 0, 0),
            end: new Date(1990, 1, 2, 12, 0, 0),
            role: 0
        },
        {
            start: new Date(2012, 11, 1, 12, 0, 0),
            end: new Date(),
            role: 0
        },
        {
            start: new Date(2025, 1, 1, 12, 0, 0),
            end: Date(2025, 1, 2, 12, 0, 0),
            role: 0
        }
      ]
      const testData = [{times: [ ]}]
      const gradDates = [ 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025]
      const scaleDates = []
      function createScaleDates(index) {
        if (index < gradDates.length) {
           scaleDates.push({
            start: new Date(gradDates[index], 1, 1, 12, 0, 0),
             end: new Date(gradDates[index], 1, 5, 12, 0, 0),
             role: 0
           })
           createScaleDates(index + 1)
        }
      }
      createScaleDates(0)
      const scaleData = [{ times: [] }]
      function pushDate(index, data, output) {
        if (index < data.length)
        {
            try {
                const entry = {
                    starting_time: data[index].start.getTime(),
                    ending_time: data[index].end.getTime(),
                    role_identifier: data[index].role
                }
                output[0].times.push(entry)
            } catch (e) {
                console.log(e.stack.toString())
            }
            pushDate(index + 1, data, output)
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
            .datum(data).call(chart)

        const height = scale / 4
        const transY = index * ( height + scale / 8)
        svg.selectAll('rect')
            .style("fill", color)
            .style("height", "" + height + "px")
            .style("transform", "translateY(" + transY + "px)")
            .style("z-index", 2000)
            .on("mouseover", function (d) {
                 // Handle mouseover event
                 console.log(JSON.stringify(d))
                 updateRole(d.role_identifier, "mouseover")
                 d3.select(this).attr("opacity", 0.7)
             })
            .on("mouseout", function (d) {
                 // Handle mouseover event
                 console.log(JSON.stringify(d))
                 updateRole(d.role_identifier, "mouseout")
                 d3.select(this).attr("opacity", 1)
             })
            .on("click", function (d) {
                 // Handle mouseover event
                 console.log(JSON.stringify(d))
                 updateRole(d.role_identifier, "click")
             })

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
        createTimeline: function (scale, newupdateRole) {
          updateRole = newupdateRole
          this.Scale = scale
          //timelineRectNoAxis('timeline2', '#ff7f0e', testData, true, 2, scale)
          timelineRectNoAxis('timeline1', '#1f77b4', scaleData, false, 1, scale)
          //timelineRectNoAxis('timeline2', '#1f77b4', testData, true, 2, scale)
        },
        updateTime: function (roleid, event) {
            console.log("role=[" + roleid + "] event=[" + event + "]")
            try {
                const svg = d3.select("#timeline2 svg");
                const rects = svg.selectAll("rect")
                .attr("opacity", function(d) {
                    if (d.role_identifier == roleid) {
                       console.log(JSON.stringify(d))
                       if (event === "mouseover") {
                           return 0.7
                       }
                    }
                    return 1
                })
            } catch (e) {
                console.log(e.stack.toString())
            }
        },
        updateRoles: function (times, color, flag, scale) {
            if (typeof(times) === 'undefined') {
                return
            }
            if (times.length <= 0) {
                return
            }
            if (flag) {
                const dates = [{
                    start: new Date(1990, 1, 1, 12, 0, 0),
                    end: new Date(1990, 1, 2, 12, 0, 0),
                    role: -1
                }
                ]
                function setDate(index) {
                    if (times.length > 0)
                    if (index < times.length) {
                        try {
                            console.log(JSON.stringify(times[index].dates))
                            const pair = times[index].dates.split("-")
                            const roleid = times[index].role
                            dates.push({
                                start: moment(pair[0],"MMM'YY").toDate(),
                                end: moment(pair[1],"MMM'YY").toDate(),
                                role: roleid
                            })
                        } catch (e) {
                            console.log(e.stack.toString())
                        }
                        setDate(index + 1)
                    }
                }
                setDate(0)
                dates.push({
                    start: new Date(2025, 1, 1, 12, 0, 0),
                    end: new Date(2025, 1, 2, 12, 0, 0),
                    role: MAX_ROLES
                })
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
                //registerRectEvents('timeline2')

                console.log(JSON.stringify(updateData))
            }
        }
    }
}