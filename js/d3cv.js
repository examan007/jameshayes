d3Application = function () {
    var console = {
        log: function(msg) {},
        error: function(msg) {},
    }
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
            { title: "Project", filter: "Project" },
            { title: "Technology", filter: "Technology" },
            { title: "Role", filter: "Title"  },
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
        function mapCountries(continents_map, static_countries) {
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
                    for (let i = 0; i < numberofjobs; i++) {
                        const bias  = 1000 / i + 2 ^ i // - i * 200
                        const value = 1000 / i + 2 ^ i // ( i + 1) ^ 2 //100 + (i ^ 2 * 1000)
                        function getTechnology() {
                            return "test"
                        }
                        function getDegrees(ix) {
                            return ((360 / numberofjobs) * ix - 180).toString()
                        }
                        function getLatitude(ix) {
                            const degrees = Number(getDegrees(ix))
                            return (degrees + 180 - 100) / 2 + ix * 50
                        }
                        function getObject() {
                            if (filter_code === "Company") {
                                return {
                                    "CountryName":jsonData.experience.company,
                                    "CountryCode":jsonData.experience.company,
                                    "ContinentCode": continent_code,
                                    "CenterLongitude": getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": value.toString()
                                }
                            } else
                            if (filter_code === "Title") {
                                return {
                                    "CountryName":jsonData.experience.title,
                                    "CountryCode":jsonData.experience.company,
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": value.toString()
                                }
                            } else
                            if (filter_code === "Technology") {
                                return {
                                    "CountryName":getTechnology(),
                                    "CountryCode":jsonData.experience.company,
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": bias
                                }
                            } else
                            if (filter_code === "Date") {
                                return {
                                    "CountryName":getTechnology(),
                                    "CountryCode":jsonData.experience.company,
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": bias
                                }
                            } else
                            if (filter_code === "Responsibility") {
                                return {
                                    "CountryName":getTechnology(),
                                    "CountryCode":jsonData.experience.company,
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": bias
                                }
                            } else {
                                return {
                                    "CountryName":jsonData.experience.title,
                                    "CountryCode":jsonData.experience.company,
                                    "ContinentCode": continent_code,
                                    "CenterLongitude":getDegrees(i),
                                    "CenterLatitude": getLatitude(index),
                                    "Population": value.toString()
                                }
                            }
                        }
                        const newobject = getObject()
                        console.log("newobject=[" + JSON.stringify(newobject) + "]")
                        newarray.push(newobject)
                    }
                    return mapCountriesByContinents(static_countries, index + 1)
                } catch (e) {
                    console.log(e.stack.toString())
                }
                return newarray
            }
            return mapCountriesByContinents(static_countries, 0)
        }
      d3.queue()
        .defer(d3.csv, "../d3-country-bubble-chart/countries.csv")
        .defer(d3.json, "../d3-country-bubble-chart/continent-names.json")
        .await((error, countries, continents)=> {
            console.log(JSON.stringify(countries[0]))
            const continents_map = mapContinents(continents)
            const countries_map = mapCountries(continents_map, countries)
            createBubbleChart(error, countries_map, continents_map)
            console.log("Done.")
        })
    }
  )
  return {
    status: 0
  }
}