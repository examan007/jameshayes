d3Application = function () {
    var console = {
        log: function(msg) {},
        error: function(msg) {},
    }
  const InitialRoleCount = 8
  console.log("getData")
  LogMgr = LoginManager().getData(
    "data/resume.json",
    (jsonData)=> {
        function mapFromArray(array, defaults) {
            try {
                console.log(JSON.stringify(array[0]))
                const newjson = {}
                var index = 0
                const keys = Object.keys(defaults);
                for (let i = 0; i < array.length; i++) {
                  newjson[keys[i]] = array[i].title
                }
                return newjson
            } catch (e) {
                console.log(e.stack.toString())
            }
            return defaults
        }
        const defaultmapvalues = [
            { title: "Profile", filter: "Profile"},
            { title: "Role", filter: "Title"  },
            { title: "Project", filter: "Project" },
            { title: "Technology", filter: "Technology" },
            ]

        function mapContinents(static_countinents) {
            //return mapFromArray(jsonData.experience, static_countinents)
            return mapFromArray(defaultmapvalues, static_countinents)
        }
        function getKeyByValue(object, value) {
          for (const key in object) {
            if (object[key] === value) {
              return key;
            }
          }
          return null; // Return null if the value is not found in the object
        }
        function mapCountries(continents_map, static_countries, technology) {
            const newarray = []
            function mapCountriesByContinents(static_countries, index) {
                try {
                    const mapvalue = defaultmapvalues[index]
                    const continent_code = getKeyByValue(continents_map, mapvalue.title)
                    if (continent_code == null) {
                        return newarray
                    }
                    console.log("Continent code:" + JSON.stringify(continent_code))
                    const filter_code = defaultmapvalues[index].filter
                    const numberofjobs = jsonData.experience.length
                    if (filter_code != null)
                    if (filter_code === "Profile") {
                        newarray.push({
                            "CountryName":jsonData.name,
                            "CountryCode":jsonData.email,
                            "ContinentCode": continent_code,
                            "CenterLongitude": 0,
                            "CenterLatitude": 0,
                            "Population": 100000
                        })
                    } else
                    if (filter_code === "Technology") {
                        function addTech(index) {
                            const tech = technology[index]
                            if (typeof(tech) !== 'undefined') {
                                newarray.push({
                                    "CountryName": tech,
                                    "CountryCode": tech,
                                    "ContinentCode": continent_code,
                                    "CenterLongitude": 0,
                                    "CenterLatitude":  0,
                                    "Population": 10000
                                })
                                addTech(index + 1)
                            }
                        }
                        addTech(0)
                    } else
                    for (let i = 0; i < numberofjobs; i++) {
                        function getPopulationValue () {
                            if (filter_code  === "Title" && i < InitialRoleCount) {
                                return 50000
                            } else {
                                return 10000 // / i + 2 ^ i // ( i + 1) ^ 2 //100 + (i ^ 2 * 1000)
                            }
                        }
                        const bias  = getPopulationValue()
                        const value = getPopulationValue()
                        function getDegrees(ix) {
                            return ((360 / numberofjobs) * ix - 180).toString()
                        }
                        function getLatitude(ix) {
                            const degrees = Number(getDegrees(ix))
                            return (degrees + 180 - 100) / 2 + ix * 50
                        }
                        function getObject(object) {
                            if (filter_code === "Company") {
                                return {
                                    "CountryName":jsonData.experience[i].company,
                                    "CountryCode":i.toString(),
                                    "ContinentCode": continent_code,
                                    "CenterLongitude": getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": value.toString()
                                }
                            } else
                            if (filter_code === "Title") {
                                return {
                                    "CountryName":jsonData.experience[i].title,
                                    "CountryCode":i.toString(),
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": value.toString()
                                }
                            } else
                            if (filter_code === "Date") {
                                return {
                                    "CountryName":object.name,
                                    "CountryCode":i.toString(),
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": bias
                                }
                            } else
                            if (filter_code === "Responsibility") {
                                return {
                                    "CountryName": object.name,
                                    "CountryCode":i.toString(),
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": bias
                                }
                            } else {
                                return {
                                    "CountryName": "unknown",
                                    "CountryCode":i.toString(),
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": value.toString()
                                }
                            }
                        }
                        function createNewObject() {
                            const newobject = getObject()
                            console.log("newobject=[" + JSON.stringify(newobject) + "]")
                            newarray.push(newobject)
                        }
                        createNewObject()
                    }
                    return mapCountriesByContinents(static_countries, index + 1)
                } catch (e) {
                    console.log(e.stack.toString())
                }
                return newarray
            }
            return mapCountriesByContinents(static_countries, 0)
        }

        function getWindowDimensions() {
          const width = window.innerWidth;
          const height = window.innerHeight;
          return {
            width: width,
            height: height,
          };
        }

        function initializeResizing(d3module) {
            // Select the SVG container element
            const svgContainer = d3.select("svg");

            // Define the initial dimensions of the SVG
            let svgWidth = getWindowDimensions().width //svgContainer.node().getBoundingClientRect().width;
            let svgHeight = getWindowDimensions().height //svgContainer.node().getBoundingClientRect().height;

            // Create a function to update the SVG dimensions
            function scaleSizing() {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;

                // Calculate the scaling factors
                const scaleX = newWidth / svgWidth
                const scaleY = newHeight / svgHeight
                const scale = 2 //Math.min(scaleX, scaleY);

                console.log("scaling: scaleX=[" + scaleX + "] scaleY=[" + scaleY + "] scale=[" + scale + "]")

                if (scale != 1) {
                      svgWidth = newWidth;
                      svgHeight = newHeight;
                 }

                // Apply the scaling transformation to the diagram
                d3.select("svg")
                  .attr("transform", `scale(${scale})`);
            }
            function updateSVGDimensions() {
              // Get the new window size
              const newWidth = window.innerWidth;
              const newHeight = window.innerHeight;

             //scaleSizing()

                console.log("resize: width=[" + svgWidth + "] height=[" + svgHeight + "]")

              // Update the SVG attributes
              svgContainer.attr("width", svgWidth)
                          .attr("height", svgHeight);

                d3module.updateCircles()
            }

            // Attach an event listener to the window resize event
            window.addEventListener("resize", updateSVGDimensions);

            // Call the function initially to set the SVG dimensions
            updateSVGDimensions();
      }
      d3.queue()
        .defer(d3.csv, "data/countries.csv")
        .defer(d3.json, "data/continent-names.json")
        .defer(d3.json, "data/technology.json")
        .await((error, countries, continents, technology)=> {
            function testExperienceForTech(exptext, tech) {
             try {
                 const regex = new RegExp("\\b" + tech + "\\b", 'i');
                 if (regex.test(exptext)) {
                     return true
                 }
             } catch (e) {
                 console.log(e.stack.toString())
                 if (exptext.includes(tech)) {
                     return true
                 }
             }
             return false
            }
            function buildTechList(jsonobj) {
                const exptext = JSON.stringify(jsonobj)
                console.log("experience: [" + exptext + "]")
                const newarray = []
                function checkTech(index) {
                    const tech = technology[index]
                    if (typeof(tech) != 'undefined') {
                        function pushNewTech() {
                            if ( ! newarray.some(element => element === tech)) {
                                console.log("new tech = [" + tech + "]")
                                newarray.push(tech)
                            } else {
                                console.log("duplicate tech")
                            }
                        }
                        try {
                            const regex = new RegExp("\\b" + tech + "\\b", 'i');
                            if (regex.test(exptext)) {
                                pushNewTech()
                            }
                        } catch (e) {
                            console.log(e.stack.toString())
                            if (exptext.includes(tech)) {
                                pushNewTech()
                            }
                        }
                        checkTech(index + 1)
                    }
                }
                checkTech(0)
                return newarray
            }
            console.log(JSON.stringify(countries[0]))
            const continents_map = mapContinents(continents)
            const countries_map = mapCountries(continents_map, countries, technology)
            const d3module = createBubbleChart(error, countries_map, continents_map,
                (experindex, continent, callback)=> {
                    if (continent === "AS") {
                        console.log("getTechnology()")
                        callback(buildTechList(jsonData.experience[experindex]))
                    } else {
                        callback(null)
                    }
                },
                (experindex, continent, tech)=> {
                   console.log("getTechExperiences() continent code = [" + continent + "]")
                   if (continent === "AS") {
                        console.log("getTechExperiences()")
                        const expobj = jsonData.experience[experindex]
                        return testExperienceForTech(JSON.stringify(expobj), tech)
                    }
                    return false
                }
            )
            console.log("Done.")
                            d3.select("svg")
                              .attr("transform", `scale(1)`);

//            initializeResizing(d3module)
        })
    })
  return {
    status: 0
  }
}