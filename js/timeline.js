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
            end: new Date(2025, 1, 2, 12, 0, 0),
            role: 0
        }
      ]
      const testData = [{times: [ ]}]
      const gradDates = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025]
      const scaleDates = []
      function createScaleDates(index) {
        if (index < gradDates.length) {
           const newyear = Number(gradDates[index]) - 1
           scaleDates.push({
            start: new Date("" + newyear + "-12-28T12:00:00Z"),
             end: new Date("" + newyear + "-12-31T12:00:00Z"),
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
                console.log(JSON.stringify(data[index]))
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
      //pushDate(0, testDates, testData)
      pushDate(0, scaleDates, scaleData)

      var width = window.innerWidth;
      function timelineRectNoAxis(timelineid, color, data, nolabel, index, scale) {
        if (typeof(scale) === 'undefined') {
            console.log("Scale is not defined.")
            return
        }
        const chart = d3.timelines().showTimeAxis();
        const height = Number(scale) / 4
        console.log("scale=[" + scale + "] height=[" + height + "]")
        const svg = d3.select('#' + timelineid)
            .append("svg")
            .attr("width", width * 1.15)
            .attr("height", "75")
            .datum(data).call(chart)

        const transY = index * ( height + scale / 8) - height
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
                const size = height * 3 / 4
                console.log("Font-size is: [" + size + "]")
                return "" + size + "px"
            })
            .style("transform", function (d) {
                if (scale === 50) {
                    return "translateY(" + (transY - 10) + "px)"
                } else {
                    return "translateY(" + transY + "px)"
                }
            })

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
        Objects: {},
        createTimeline: function (scale, newupdateRole) {
          updateRole = newupdateRole
          this.Scale = scale
          //timelineRectNoAxis('timeline2', '#ff7f0e', testData, true, 2, scale)
          //timelineRectNoAxis('timeline1', '#1f77b4', scaleData, false, 1, scale)
          //timelineRectNoAxis('timeline2', '#1f77b4', testData, true, 2, scale)
          timelineRectNoAxis('timeline1', '#000000', scaleData, false, 0, scale)
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
            console.log(JSON.stringify(times))
            if (flag) {
                const dates = [scaleDates[0]]
                function setDate(index) {
                    if (times.length > 0)
                    if (index < times.length) {
                        try {
                            console.log(JSON.stringify(times[index].dates))
                            const pair = times[index].dates.split("-")
                            const roleid = times[index].role
                            function getDate(momobj, days) {
                                const year = momobj.year()
                                const month = String(momobj.month() + 1).padStart(2, '0')
                                const day = String(days).padStart(2, '0')
                                const newdate = "" + year + "-" + month + "-" + day + "T12:00:00Z"
                                console.log("new date is [" + newdate + "]")
                                return (new Date(newdate))
                            }
                            const newdate = {
                                start: getDate(moment(pair[0],"MMM'YY"), 1),
                                end: getDate(moment(pair[1],"MMM'YY"), 28),
                                role: roleid
                            }
                            console.log(JSON.stringify(newdate))
                            dates.push(newdate)
                        } catch (e) {
                            console.log(e.stack.toString())
                        }
                        setDate(index + 1)
                    }
                }
                setDate(0)
                dates.push(scaleDates[scaleDates.length - 1])
                const updateData = [{ times: [] }]
                pushDate(0, dates, updateData)
                //chart.setItems(updateData);
                //chart.redraw();
                try {
                    d3.select("#timeline2 svg").remove();
                } catch (e) {
                    console.log(s.stack.toString())
                }
                Objects = timelineRectNoAxis('timeline2', color, updateData, true, 1, scale)
                //registerRectEvents('timeline2')

                console.log(JSON.stringify(updateData))
            }
        }
    }
}