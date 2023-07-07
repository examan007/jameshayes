createBubbleChart = function (getScaling, error, countries, continentNames,
     getTechnology,
     testExperience,
     updateRoles,
     getDescription,
     updateTime
     ) {
    var console = {
        log: function(msg) {},
        error: function(msg) {},
    }
  var populations = countries.map(function(country) { return +country.Population; });
  var meanPopulation = d3.mean(populations),
      populationExtent = d3.extent(populations),
      populationScaleX,
      populationScaleY;

  var continents = d3.set(countries.map(function(country) { return country.ContinentCode; }));
  var continentColorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(continents.values());

    function getWindowDimensions() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      return {
        width: width,
        height: height,
      }
    }
  var width = getWindowDimensions().width,
      height = getWindowDimensions().height;
    function getCircleSizes() {
        return getScaling()
    }
    function setRadius(radius, data) {
        if (radius == getCircleSizes().med) {
            data.Population = 50000
            return getCircleSizes().med
        } else
        if (radius == getCircleSizes().max) {
            data.population =100000
            return circleSize.max
        } else {
           data.Population = 10000
           return getCircleSizes().min
        }
    }
  var svg,
      circleSize = getCircleSizes()
//      circleSize = { min: 10, med: 25, max: 50 };
  var circleRadiusScale = d3.scaleSqrt()
    .domain(populationExtent)
    .range([circleSize.min, circleSize.max]);

  var forces,
      forceSimulation;

  createSVG();
  toggleContinentKey(!flagFill());
  createCircles();
  createForces();
  createForceSimulation();
  addFlagDefinitions();
  addFillListener();
  addGroupingListeners();

  function createSVG() {
    svg = d3.select("#bubble-chart")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "hidden")
        .style("position", "fixed")
  }

  function toggleContinentKey(showContinentKey) {
    function getKeyWidth() {
        const width = getWindowDimensions().width
        if (width > 500) {
            return 500
        }
        return width
    }
    var keyElementWidth = getKeyWidth() / continents.values().length,
        keyElementHeight = keyElementWidth / 5;
    var onScreenYOffset = keyElementHeight*1.5,
        offScreenYOffset = -(height * 20 / 100)
    var keyElementSize = (keyElementWidth / 8)  + "px"

    if (d3.select(".continent-key").empty()) {
      createContinentKey();
    }
    var continentKey = d3.select(".continent-key");


    if (true) { //showContinentKey) {
 //     translateContinentKey("translate(0," + (height - onScreenYOffset) + ")");
    } else {
      translateContinentKey("translate(0," + (height + offScreenYOffset) + ")");
    }

    function createContinentKey() {
      var keyWidth = keyElementWidth * (continents.values().length);
      var continentKeyScale = d3.scaleBand()
        .domain(continents.values())
        .range([(width - keyWidth) / 2, (width + keyWidth) / 2]);

      svg.append("g")
        .attr("class", "continent-key")
        .selectAll("g")
        .data(continents.values())
        .enter()
          .append("g")
            .attr("class", "continent-key-element");

      d3.selectAll("g.continent-key-element")
        .append("rect")
          .attr("width", keyElementWidth)
          .attr("height", keyElementHeight)
          .attr("x", function(d) { return continentKeyScale(d); })
          .attr("fill", function(d) {
                console.log("key fill: " + JSON.stringify(d))
                if (d == "SA") {
                    console.log(JSON.stringify(d3.select(this)))
                    return '#ffffff'
                } else {
                    return continentColorScale(d)
                }
          })

      d3.selectAll("g.continent-key-element")
        .append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", keyElementSize)
          .attr("x", function(d) { return continentKeyScale(d) + keyElementWidth/2; })
          .text(function(d) { return continentNames[d]; });

      // The text BBox has non-zero values only after rendering
      d3.selectAll("g.continent-key-element text")
          .attr("y", function(d) {
            var textHeight = this.getBBox().height;
            // The BBox.height property includes some extra height we need to remove
            var unneededTextHeight = 4;
            return ((keyElementHeight + textHeight) / 2) - unneededTextHeight;
          });
        try {
            const continents = d3.selectAll("g.continent-key")
            const continentsArray = continents.nodes()
            const element = continentsArray[continentsArray.length - 1]
            console.log(element)
            const array = element.children
            const lastElement = array[array.length - 1]
            const rect = lastElement.firstElementChild
            console.log(rect)
            const x = rect.getAttribute("x")
            const position = rect.getBoundingClientRect()
            const search = document.getElementById('search-input');
            search.setAttribute("style",
                 "display: block;" +
                 "position: fixed;" +
                 "left: " + position.left + "px;" +
                 "width: " + position.width + "px;" +
                 "height: " + position.height + "px;"
                 )
            search.addEventListener("keypress", function(event) {
               if (event.key !== 'Enter') {
                const thisvalue = this.value + event.key
                console.log("Keypress event:", thisvalue);
                showAllObjects(thisvalue)
               }
            });
            search.addEventListener('keydown', function(event) {
              if (event.key === 'Enter') {
                const thisvalue = this.value
                console.log("Keypress event:", thisvalue);
                showAllObjects(thisvalue)
              }
            });
            console.log("setting search position: x=[" + x + "] : " + JSON.stringify(position))
        } catch (e) {
            console.log(e.stack.toString())
        }

    }

    function translateContinentKey(translation) {
      continentKey
        .transition()
        .duration(500)
        .attr("transform", translation);
    }
  }

  function flagFill() {
    return isChecked("#flags");
  }

  function isChecked(elementID) {
    return d3.select(elementID).property("checked");
  }
  function minimizeAllCircles() {
        svg.selectAll("circle")
        .attr("r", function (d) {
            //console.log(JSON.stringify(d))
            d.Population = 10000
            return circleSize.min
        })
        .style("visibility", "hidden")
        createForceSimulation()
        updateCircles()
  }

  const DefaultMinRollCount = 24
  const DefaultMaxRollCount = 24
  var MaxRollCount = DefaultMinRollCount
  function processClickCircle(data, clickedCircle) {
        const curradius = Number(clickedCircle.attr("r"))
        minimizeAllCircles()
        function getNewRadius(newradius) {
           function getAllCountryCodeObjects(code) {
                var rolecount = 0
                const activeroles = []
                svg.selectAll("circle")
                .attr("r", function (d) {
                    const element = d3.select(this)
                    if (data.ContinentCode === "AF") {
                        if (d.ContinentCode === "AS" && rolecount < MaxRollCount) {
                            rolecount += 1
                            element.style("visibility", "visible")
                            element.style("display", "block")
                            activeroles.push({
                                dates: d.CenterLongitude,
                                role: d.CountryCode
                            })
                            return setRadius(getCircleSizes().med, d)
                        } else {
                            element.style("visibility", "hidden")
                            element.style("display", "none")
                           return setRadius(getCircleSizes().min, d)
                        }
                    } else
                    if (d.CountryCode === code || d.ContinentCode === "AF") {
                            element.style("visibility", "visible")
                            return setRadius(getCircleSizes().med, d)
                    } else {
                            return setRadius(getCircleSizes().min, d)
                    }
                })
                .on("end", function() {
                     console.log("end")
                     updateRoles(activeroles, '#1f77b4', true, getCircleSizes().max)
                })
                window.setTimeout(function () {
                      console.log("end")
                      updateRoles(activeroles, '#1f77b4', true, getCircleSizes().max)
                }, 1000)
            }
            function getAllRoleObjects(tech) {
                const activeroles = []
                if (data.ContinentCode === "NA") {
                    svg.selectAll("circle")
                    .attr("r", function (d) {
                        const element = d3.select(this)
                        function select() {
                            element.style("visibility", "visible")
                            element.style("display", "block")
                            return setRadius(getCircleSizes().med, d)
                        }
                        if (d.ContinentCode === "AF") {
                            return select()
                        } else
                        if (d.ContinentCode === "AS") {
                            if (testExperience(d.CountryCode, d.ContinentCode, tech)) {
                                activeroles.push({
                                    dates: d.CenterLongitude,
                                    role: d.CountryCode
                                })
                                return select()
                            }
                        }
                        return d.r
                    })
                    .on("end", function() {
                         console.log("end")
                         updateRoles(activeroles, '#d62728', true, getCircleSizes().max)
                    })
                    window.setTimeout(function () {
                          console.log("end")
                          updateRoles(activeroles, '#d62728', true, getCircleSizes().max)
                    }, 1000)
                }
            }
            function maximize() {
                 //data.x = (getWindowDimensions().width / 2) // - (getCircleSizes().max / 2)
                 //data.y = (getWindowDimensions().height / 2) // - (getCircleSizes().max / 2)
                 clickedCircle.style("visibility", "visible")
                 getAllCountryCodeObjects(data.CountryCode)
                 getAllRoleObjects(data.CountryName)
                 return {
                    radius: circleSize.max,
                    population: 100000
                 }
            }
            if (curradius >= circleSize.max) {
                if (MaxRollCount == DefaultMaxRollCount) {
                    MaxRollCount = DefaultMinRollCount
                } else {
                    MaxRollCount = DefaultMaxRollCount
                }
                return maximize ()
            } else
            if (curradius == circleSize.min) {
                 return maximize ()
            } else
            if (curradius == circleSize.med) {
                return maximize()
             } else {
                console.log("Current radius [" + curradius + "]")
                return maximize()
            }
        }
        const newradius = getNewRadius(curradius) //+ circleSize.max / 20)
        clickedCircle.attr("r", newradius.radius.toString())
        console.log(JSON.stringify(data))
        data.Population = newradius.population
        console.log("getTechnology()")
        if (data.ContinentCode === "AS") {
            updateRoles([{
                dates: data.CenterLongitude,
                role: data.CountryCode
                }],
                '#ff7f0e', true, getCircleSizes().max)
        }
        getTechnology(data.CountryCode, data.ContinentCode, (techlist)=> {
            const newarray = []
            function isInTechList(country) {
                if (newarray.some(element=> element === country)) {
                    return false
                }
                function check(index) {
                    const test = techlist[index]
                    if (typeof(test) !== 'undefined') {
                        //console.log("checking: [" + test + "] [" + country + "]")
                        if (test == country) {
                            return true
                        } else
                        if (test == country.split(" ")[0]) {
                            return true
                        }
                        return check(index + 1)
                    }
                    return false
                }
                return check(0)
            }
            if (techlist != null) {
                svg.selectAll("circle")
                .attr("r", function (d) {
                    const element = d3.select(this)
                    if (d.ContinentCode === "NA")
                    if (isInTechList(d.CountryName)) {
                        newarray.push(d.CountryName)
                        element.style("visibility", "visible")
                        return setRadius(getCircleSizes().med, d)
                    }
                    return element.attr("r")
                })
            }
           createForceSimulation()
            updateCircles()
        })
    }
    var timerobj = null
    function showAllObjects(search) {
        const activeobjects = []
        const circles = svg.selectAll("circle")
        .attr("r", function(d) {
            const element = d3.select(this)
            function select() {
               element.style("visibility", "visible")
               element.style("display", "block")
               CurrentCountryContext.data.CountryName = d.CountryName
               FadedFlag = true
               return setRadius(getCircleSizes().med, d)
            }
            if (JSON.stringify(d).toLowerCase().includes(search.toLowerCase())) {
                console.log(JSON.stringify(d))
                return select()
            } else {
                element.style("visibility", "hidden")
                element.style("display", "none")
               return setRadius(getCircleSizes().min, d)
            }
        })
        if (timerobj != null) {
            window.clearTimeout(timerobj)
        }
        timerobj = window.setTimeout(function () {
           createForceSimulation()
           updateCircles()
        }, 1000)
    }
    function showAllTest() {
        circles.each(function (d) {
            if (JSON.stringify(d).toLowerCase().includes(search.toLowerCase())) {
                //activeobjects.push(d)
                //console.log(JSON.stringify(d))
            }
        })
        .on('end', function (d) {
            console.log("End: " + JSON.stringify(d))
        })
        window.setTimeout(function () {
              console.log("end: " + JSON.stringify(activeobjects))
        }, 500)
   }
    var FadedFlag = false
    var NotBlocked = true
    var CurrentCountryContext = {
        circle: null,
        data: {
            CountryName: countries[0].CountryName,
            CountryCode: countries[0].CountryCode
        }
    }
    function fadeOut(d, circle, completion) {
      const element = document.getElementById("bubble-menu");
      const search = document.getElementById("search-input");
      var opacity = FadedFlag ? 1 : 1;
      function executeFading() {
          var timer = setInterval(function() {
            NotBlocked = false
            if (FadedFlag == true) {
                if (opacity >= 0.75) {
                  clearInterval(timer);
                  element.style.visibility = "visible";
                  search.style.visibility = "visible";
                  opacity = 1
                  FadedFlag = false;
                  NotBlocked = true
                }
                element.style.opacity = opacity;
                opacity += opacity * 0.1;
            } else {
                if (opacity <= 0.25) {
                  clearInterval(timer);
                  element.style.visibility = "hidden"
                  opacity = 0.15
                  FadedFlag = true;
                  NotBlocked = true
                }
                search.style.visibility = "hidden"
                element.style.opacity = opacity;
                opacity -= opacity * 0.25;
            }
          }, 250);
      }
      function executeFadingCondition() {
          const curradius = Number(circle.attr("r"))
          if (curradius !== getCircleSizes().max) {
            FadedFlag = true
          }
          executeFading()

      }
      if (NotBlocked == true)
      if (CurrentCountryContext.data.CountryName === d.CountryName) {
         CurrentCountryContext.circle = circle
         CurrentCountryContext.data = d
         executeFadingCondition()
      } else
      if (FadedFlag == false) {
         CurrentCountryContext.circle = circle
         CurrentCountryContext.data = d
      } else {
          if (CurrentCountryContext.circle == null) {
             CurrentCountryContext.circle = circle
             CurrentCountryContext.data = d
          }
          executeFadingCondition()
      }
      console.log("completion(" + JSON.stringify(CurrentCountryContext.data) + ") [" + JSON.stringify(d) + "]")
      completion(CurrentCountryContext.data, CurrentCountryContext.circle)

    }
    function createCircles() {
        var formatPopulation = d3.format(",");
        const circlegroups = svg.selectAll(".neod3group")
          .data(countries)

        const group = circlegroups
      .enter()
        .append("g")
        .attr("class", "neod3group")
       .on("mouseover", function(d) {
          if (!FadedFlag && NotBlocked) {
              d3.select(this).attr("opacity", 0.7)
              updateCountryInfo(d);
              if (d.ContinentCode === "AS") {
                  updateTime(d.CountryCode, "mouseover")
              }
          }
        })
        .on("mouseout", function(d) {
             d3.select(this).attr("opacity", 1)
              updateCountryInfo();
              if (d.ContinentCode === "AS") {
                  updateTime(d.CountryCode, "mouseout")
              }
        })
        .on("click", function (d) {
           const group = d3.select(this);
           const circle = group.select("circle")
           fadeOut(d, circle, function (curdata, curcircle) {
               processClickCircle(curdata, curcircle)
           })
        })


    const circle = group
        .append("circle")
        .attr("r", function(d) { return circleRadiusScale(d.Population); })
        .attr("class", "neod3circle")
        .style("visibility", "hidden")

        function addText(index) {
            var exitflag = true
            group.append("text")
                .style("display", "none")
                .attr("class", "label")
                .text(function (d) {
                    const text = d.CountryName.split(/ |\//)[index]
                   //console.log("CountryName=[" + text + "] index=[" + index + "]")
                   if (typeof(text) === 'undefined') {
                        return ""
                    } else {
                        exitflag = false
                        return text
                    }

                })
                .attr('alignment-baseline', 'middle')
                .style("font-family", "'Didot', 'Bodoni', 'Trajan', 'Garamond', 'Copperplate Gothic', serif")
                .style("fill", "white");
            if (!exitflag) {
                addText(index + 1)
            }
        }
        addText(0)
        updateCircles()
  }

    function updateCountryInfo(country) {
      function getInfo() {
          try {
              if (country) {
                if (country.ContinentCode === "AF") {
                    return getDescription(country.CountryCode, country.ContinentCode)
                } else {
                    info = [country.CountryName, country.CenterLongitude,
                    getDescription(country.CountryCode, country.ContinentCode)].join(" ");
                    //info = country.CountryName // + ":" + JSON.stringify(getWindowDimensions())
                    return info
                }
              }

          } catch (e) {
              return info + e.toString()
          }
      }
      if (country) {
          d3.select("#country-info").html(getInfo());
      }
    }

  function updateCirclesReal(display, index) {
    svg.selectAll(".neod3group").each(function () {
      const group = d3.select(this)
      const circle = group.select("circle").attr("fill", function(d) {
        //console.log(JSON.stringify(this))
        return flagFill() ? "url(#" + d.CountryCode + ")" : continentColorScale(d.ContinentCode);
      })
      const r = +circle.attr("r")
      if (r > getCircleSizes().min) {
        circle.style("visibility", "visible")
        circle.style("display", "block")
      } else {
        circle.style("visibility", "hidden")
        circle.style("display", "none")
      }
      const x = +circle.attr("cx");
      const y = +circle.attr("cy");
      //console.log("x:", x);
      //console.log("y:", y);
      //console.log("r:", r);
      //console.log("r:", getCircleSizes().med);
      var numlines = 0
      group.selectAll("text").each(function (element, i) {
         const text = d3.select(this)
         if (text.text().length > 0) {
            numlines = numlines + 1
         }
      })
      group.selectAll("text").each(function (element, i) {
         //console.log("numlines=[" + numlines + "] element=[" + JSON.stringify(element) + "]")
         const offset = (4 - numlines)/2
         const text = d3.select(this)
         if (r == getCircleSizes().max) {
            function getMaxFontSize() {
                if (element.ContinentCode === "AF") {
                    return getCircleSizes().max / 2
                } else {
                    return getCircleSizes().max / 4
                }
            }
            function getYOffset() {
                if (element.ContinentCode === "AF") {
                    return y + (i - 1.5 + offset) * fontsize
                } else {
                    return y + (i - 1.5 + offset) * fontsize
                }
            }
            const fontsize = getMaxFontSize()
            text.style("font-size", fontsize.toString() + "px")
            .attr("x", x - getCircleSizes().max / 1.5 )
            .attr("y", getYOffset())
            .style("display", display)
            .style("font-family", "Copperplate Gothic, sans-serif")
            .style("color", "white")
            if (index < 5) {
                updateCountryInfo(element)
            }
         } else
         if (r > getCircleSizes().min) {
            const fontsize = getCircleSizes().med / 4
            text.style("font-size", fontsize.toString() + "px")
            .attr("x", x - getCircleSizes().med / 2)
            .attr("y", y + (i - 1.5 + offset) * fontsize)
            .style("display", display)
         } else {
            text
            .style("display", "none")
         }
      })
    })
  }

  var timerhandle = null
  function updateCircles() {
    try {
        window.clearTimeout(timerhandle)
    } catch (e) {
        console.log(e.stack.toString())
    }
    updateCirclesReal("none")
    function adjustText(index) {
        if (index < 100) {
            timerhandle = window.setTimeout((()=> {
                updateCirclesReal("block", index)
                adjustText(index + 1)
            }), 100)
        }
    }
    window.setTimeout(()=> { adjustText(0) }, 500)
  }
  function createForces() {
    var forceStrength = 0.05;

    forces = {
      combine:        createCombineForces(),
      countryCenters: createCountryCenterForces(),
      continent:      createContinentForces(),
      population:     createPopulationForces()
    };

    function createCombineForces() {
      return {
        x: d3.forceX(width / 2).strength(forceStrength),
        y: d3.forceY(height / 2).strength(forceStrength)
      };
    }

    function createCountryCenterForces() {
      var projectionStretchY = 0.25,
          projectionMargin = circleSize.max,
          projection = d3.geoEquirectangular()
            .scale((width / 2 - projectionMargin) / Math.PI)
            .translate([width / 2, height * (1 - projectionStretchY) / 2]);

      return {
        x: d3.forceX(function(d) {
            return projection([d.CenterLongitude, d.CenterLatitude])[0];
          }).strength(forceStrength),
        y: d3.forceY(function(d) {
            return projection([d.CenterLongitude, d.CenterLatitude])[1] * (1 + projectionStretchY);
          }).strength(forceStrength)
      };
    }

    function createContinentForces() {
      return {
        x: d3.forceX(continentForceX).strength(forceStrength),
        y: d3.forceY(continentForceY).strength(forceStrength)
      };

      function continentForceX(d) {
        console.log("ForceX: executing ...")
        if (d.ContinentCode === "EU") {
          return left(width);
        } else if (d.ContinentCode === "AF") {
          return left(width);
        } else if (d.ContinentCode === "AS") {
          return right(width);
        } else if (d.ContinentCode === "NA" || d.ContinentCode === "SA") {
          return right(width);
        }
        return center(width);
      }

      function continentForceY(d) {
        if (d.ContinentCode === "EU") {
          return top(height);
        } else if (d.ContinentCode === "AF") {
          return bottom(height);
        } else if (d.ContinentCode === "AS") {
          return top(height);
        } else if (d.ContinentCode === "NA" || d.ContinentCode === "SA") {
          return bottom(height);
        }
        return center(height);
      }

      function left(dimension) { return dimension / 4; }
      function center(dimension) { return dimension / 2; }
      function right(dimension) { return dimension / 4 * 3; }
      function top(dimension) { return dimension / 4; }
      function bottom(dimension) { return dimension / 4 * 3; }
    }

    function createPopulationForces() {
      var continentNamesDomain = continents.values().map(function(continentCode) {
        return continentNames[continentCode];
      });
      var scaledPopulationMargin = circleSize.max;

      populationScaleX = d3.scaleBand()
        .domain(continentNamesDomain)
        .range([scaledPopulationMargin, width - scaledPopulationMargin*2]);
      populationScaleY = d3.scaleLog()
        .domain(populationExtent)
        .range([height - scaledPopulationMargin, scaledPopulationMargin*2]);

      var centerCirclesInScaleBandOffset = populationScaleX.bandwidth() / 2;
      return {
        x: d3.forceX(function(d) {
            return populationScaleX(continentNames[d.ContinentCode]) + centerCirclesInScaleBandOffset;
          }).strength(forceStrength),
        y: d3.forceY(function(d) {
          return populationScaleY(d.Population);
        }).strength(forceStrength)
      };
    }

  }

  function createForceSimulation() {
    forceSimulation = d3.forceSimulation()
      .force("x", forces.combine.x)
      .force("y", forces.combine.y)
      .force("collide", d3.forceCollide(forceCollide));
    forceSimulation.nodes(countries)
      .on("tick", function() {
        svg.selectAll(".neod3circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      });
  }

  function forceCollide(d) {
    return countryCenterGrouping() || populationGrouping() ? 0 : circleRadiusScale(d.Population) + 1;
  }

  function countryCenterGrouping() {
    return isChecked("#country-centers");
  }

  function populationGrouping() {
    return isChecked("#population");
  }

  function addFlagDefinitions() {
    var defs = svg.append("defs");
    defs.selectAll(".flag")
      .data(countries)
      .enter()
        .append("pattern")
        .attr("id", function(d) { return d.CountryCode; })
        .attr("class", "flag")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("width", 1)
          .attr("height", 1)
          // xMidYMid: center the image in the circle
          // slice: scale the image to fill the circle
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("xlink:href", function(d) {
            if (d.ContinentCode == "NA") {
                return "flags/defaulttech.svg"
            } else {
               return "flags/" + d.CountryCode + ".svg";
            }
          });
  }

  function addFillListener() {
    d3.selectAll('input[name="fill"]')
      .on("change", function() {
        toggleContinentKey(!flagFill() && !populationGrouping());
        updateCircles();
      });
  }

  function addGroupingListeners() {
    addListener("#combine",         forces.combine);
    addListener("#country-centers", forces.countryCenters);
    addListener("#continents",      forces.continent);
    addListener("#population",      forces.population);

    function addListener(selector, forces) {
      d3.select(selector).on("click", function() {
        updateForces(forces);
        toggleContinentKey(!flagFill() && !populationGrouping());
        togglePopulationAxes(populationGrouping());
      });
    }

    function updateForces(forces) {
      forceSimulation
        .force("x", forces.x)
        .force("y", forces.y)
        .force("collide", d3.forceCollide(forceCollide))
        .alphaTarget(0.5)
        .restart();
    }

    function togglePopulationAxes(showAxes) {
      var onScreenXOffset = 40,
          offScreenXOffset = -40;
      var onScreenYOffset = 40,
          offScreenYOffset = 0;

      if (d3.select(".x-axis").empty()) {
        createAxes();
      }
      var xAxis = d3.select(".x-axis"),
          yAxis = d3.select(".y-axis");

      if (showAxes) {
        translateAxis(xAxis, "translate(0," + (height - onScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + onScreenXOffset + ",0)");
      } else {
        translateAxis(xAxis, "translate(0," + (height + offScreenYOffset) + ")");
        translateAxis(yAxis, "translate(" + offScreenXOffset + ",0)");
      }

      function createAxes() {
        var numberOfTicks = 10,
            tickFormat = ".0s";

        var xAxis = d3.axisBottom(populationScaleX)
          .ticks(numberOfTicks, tickFormat);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
          .call(xAxis)
          .selectAll(".tick text")
            .attr("font-size", "16px");

        var yAxis = d3.axisLeft(populationScaleY)
          .ticks(numberOfTicks, tickFormat);
        svg.append("g")
          .attr("class", "y-axis")
          .attr("transform", "translate(" + offScreenXOffset + ",0)")
          .call(yAxis);
      }

      function translateAxis(axis, translation) {
        axis
          .transition()
          .duration(500)
          .attr("transform", translation);
      }
    }
  }
  return {
    updateCircles: function () {
       updateCircles()
    },
    getCircleSizes: function () {
        return getCircleSizes()
    },
    updateRole: function (roleid, event) {
        console.log("scripts.updateRole()")
        svg.selectAll('circle')
        .attr("opacity", function (d) {
            if (d.ContinentCode === "AS" && d.CountryCode == roleid) {
                console.log(JSON.stringify(d))
                if (event === "mouseover") {
                    updateCountryInfo(d);
                    return 0.7
                } else
                if (event === "mouseout") {

                } else
                if (event === "click") {
                    console.log(JSON.stringify(d))
                    processClickCircle(d, d3.select(this))
                }
            }
        })
    }
  }
}
