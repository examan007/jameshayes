function createBubbleChart(error, countries, continentNames) {
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
      };
    }
  var width = getWindowDimensions().width,
      height = getWindowDimensions().height - 100;
    function getCircleSizes() {
        if (height < 600) {
            return { min: 10, med: 25, max: 50 }
        } else
        if (height < 800) {
            return { min: 20, med: 50, max: 100 };
        } else {
            return { min: 30, med: 75, max: 133 };
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
        .attr("height", height);
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
        offScreenYOffset = 100;
    var keyElementSize = (keyElementWidth / 8)  + "px"

    if (d3.select(".continent-key").empty()) {
      createContinentKey();
    }
    var continentKey = d3.select(".continent-key");

    if (showContinentKey) {
      translateContinentKey("translate(0," + (height - onScreenYOffset) + ")");
    } else {
      translateContinentKey("translate(0," + (height + offScreenYOffset) + ")");
    }

    function createContinentKey() {
      var keyWidth = keyElementWidth * continents.values().length;
      var continentKeyScale = d3.scaleBand()
        .domain(continents.values())
        .range([(width - keyWidth) / 2, (width + keyWidth) / 2]);

      svg.append("g")
        .attr("class", "continent-key")
        .attr("transform", "translate(0," + (height + offScreenYOffset) + ")")
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
          .attr("fill", function(d) { return continentColorScale(d); });

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
            console.log(JSON.stringify(d))
            d.Population = 10000
            return circleSize.min
        })
        createForceSimulation()
        updateCircles()
  }
  function processClickCircle(d, clickedCircle) {
        const curradius = Number(clickedCircle.attr("r"))
        minimizeAllCircles()
        function getNewRadius(newradius) {
            if (curradius == circleSize.max) {
                return {
                    radius: circleSize.min,
                    population: 10000
                }
            } else
            if (curradius == circleSize.min) {
                return {
                    radius: circleSize.med,
                    population: 33000
                }
            } else
            if (curradius == circleSize.med) {
                 return {
                    radius: circleSize.max,
                    population: 100000
                 }
            } else
            if (newradius > circleSize.max) {
                return {
                    radius: circleSize.max,
                    population: 100000
                }
            } else {
                console.log("Current radius [" + curradius + "]")
                return {
                    radius: circleSize.max,
                    population: 100000
                }
            }
        }
        const newradius = getNewRadius(curradius + circleSize.max / 20)
        clickedCircle.attr("r", newradius.radius.toString())
        console.log(JSON.stringify(d))
        d.Population = newradius.population
        createForceSimulation()
        updateCircles()
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
          updateCountryInfo(d);
        })
        .on("mouseout", function(d) {
          updateCountryInfo();
        })
        .on("click", function (d) {
           const group = d3.select(this);
           processClickCircle(d, group.select("circle"))
        })


    const circle = group
        .append("circle")
        .attr("r", function(d) { return circleRadiusScale(d.Population); })
        .attr("class", "neod3circle")

        function addText(index) {
            var exitflag = true
            group.append("text")
                .style("display", "none")
                .attr("class", "label")
                .text(function (d) {
                    const text = d.CountryName.split(/ |\//)[index]
                   console.log("CountryName=[" + text + "] index=[" + index + "]")
                   if (typeof(text) === 'undefined') {
                        return ""
                    } else {
                        exitflag = false
                        return text
                    }

                })
                .attr('alignment-baseline', 'middle')
            if (!exitflag) {
                addText(index + 1)
            }
        }
        addText(0)
        updateCircles()
  }

    function updateCountryInfo(country) {
      var info = "";
      if (country) {
        //info = [country.CountryName, formatPopulation(country.Population)].join(": ");
        info = country.CountryName
          d3.select("#country-info").html(info);
      }
    }

  function updateCirclesReal(display) {
    svg.selectAll(".neod3group").each(function () {
      const group = d3.select(this)
      const circle = group.select("circle").attr("fill", function(d) {
        console.log(JSON.stringify(this))
        return flagFill() ? "url(#" + d.CountryCode + ")" : continentColorScale(d.ContinentCode);
      })
      const r = +circle.attr("r")
      const x = +circle.attr("cx");
      const y = +circle.attr("cy");
      console.log("x:", x);
      console.log("y:", y);
      console.log("r:", r);
      console.log("r:", getCircleSizes().med);
      group.selectAll("text").each(function (element, i) {
         console.log("element=[" + JSON.stringify(element) + "]")
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
                    return y + (i - 0.5) * fontsize
                } else {
                    return y + (i - 1) * fontsize
                }
            }
            const fontsize = getMaxFontSize()
            text.style("font-size", fontsize.toString() + "px")
            .attr("x", x - getCircleSizes().max / 1.5 )
            .attr("y", getYOffset())
            .style("display", display)
            .style("font-family", "Copperplate Gothic, sans-serif")
            .style("color", "white")
            updateCountryInfo(element)
         } else
         if (r > getCircleSizes().min) {
            const fontsize = getCircleSizes().med / 4
            text.style("font-size", fontsize.toString() + "px")
            .attr("x", x - getCircleSizes().med / 2)
            .attr("y", y + (i - 1) * fontsize)
            .style("display", display)
         } else {
            text
            .style("display", "none")
         }
      })
    })
  }

  function updateCircles() {
    updateCirclesReal("none")
    function adjustText(index) {
        if (index < 50) {
            window.setTimeout((()=> {
                updateCirclesReal("block")
                adjustText(index + 1)
            }), 100)
        }
    }
    window.setTimeout(()=> { adjustText(0) }, 2000)
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
            return "flags/" + d.CountryCode + ".svg";
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
          offScreenYOffset = 100;

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
       updateCircles();
    }
  }
}
