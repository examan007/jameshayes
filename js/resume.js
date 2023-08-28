var ResumeOutput = function () {
    var console = {
        log: function(msg) {},
        error: function(msg) {},
    }
    const LogMgr = LoginManager().getData(
        "data/resume.json",
        (data)=> {
            const jsonContainer = document.getElementById('json-container');
            try {
                //const jsondata = JSON.parse(data)
                //console.log(JSON.stringify(data))
                var index = 0
                Object.keys(data).forEach(key => {
                  const value = data[key]
                   const itemElement = document.createElement('div');
                   if (key === "summary") {
                      itemElement.setAttribute("id", "summary")
                      itemElement.innerHTML = `
                        <span class="profile-name">${key}</span>
                        <h1>Summary:</h1>
                        <div class="profile-content">
                        <p class="content-value">${value[0]}</p>
                        <p class="content-value">${value[1]}</p>
                        <p class="content-value">${value[2]}</p>
                        </div>
                    `
                      jsonContainer.appendChild(itemElement);
                   } else
                   if (key === "objective") {
                      itemElement.innerHTML = `
                        <span class="profile-name">${key}</span>
                        <h1>Objective:</h1>
                        <div class="profile-content">
                        <p class="content-value">${value}</p>
                        </div>
                    `
                      jsonContainer.appendChild(itemElement);
                  } else
                   if (key === "experience") {
                      itemElement.setAttribute("id", "experience")
                     itemElement.innerHTML = `
                        <span class="profile-name">${key}</span>
                        <h1>Experience:</h1>
                         `
                        jsonContainer.appendChild(itemElement);
                        try {
                            const array = data[key]
                            array.forEach(exper => {
                                function getItemValue(rawvalue, key, offset) {
                                    function getLink(index) {
                                        try {
                                            const element = exper.links[index]
                                            console.log(JSON.stringify(element))
                                            console.log("[" + element.key + "] [" + key + "]")
                                            if (element.key === key) {
                                                if (Number(offset) < 0) {
                                                    return element.link
                                                } else
                                                if (Number(offset) == Number(element.index)) {
                                                    return element.link
                                                }
                                            }
                                            return getLink(index + 1)
                                        } catch (e) {
                                            console.log(e.toString())
                                        }
                                        return ""
                                    }
                                    const link = getLink(0)
                                    console.log(
                                    "raw=[" + rawvalue +
                                     "] key=[" + key +
                                      "] link=[" + link +
                                       "] index=[" + offset +
                                        "]")
                                    if (link.length > 0) {
                                        const retstr = `
                                        <a href="${link}">${rawvalue}</a>
                                            `
                                        return retstr
                                    } else {
                                        return rawvalue
                                    }
                                }
                                function getItemValueLog(rawvalue, key, index) {
                                    const value = getItemValue(rawvalue, key, index)
                                    console.log("value=[" + value + "]")
                                    return value
                                }
                                var count = 0
                                const itemFlexElement = document.createElement('div')
                                itemFlexElement.classList.add('flex-container');
                                itemElement.appendChild(itemFlexElement);
                                Object.keys(exper).forEach(name => {
                                    const itemExElement = document.createElement('div')
                                    function getElement() {
                                        if (count < 3) {
                                            const ivalue = getItemValueLog(exper[name], name, -1)
                                            itemExElement.classList.add('column');
                                            itemFlexElement.appendChild(itemExElement);
                                          itemExElement.innerHTML = `
                                            <span class="profile-name">${name}</span>
                                            <p class="span-fit" wrap="wrap">${ivalue}</p>
                                            `
                                        } else
                                        if (count < 4) {
                                            const ivalue = getItemValueLog(exper[name], name, -1)
                                            itemExElement.classList.add('column');
                                            itemFlexElement.appendChild(itemExElement);
                                          itemExElement.innerHTML = `
                                            <span class="span-right profile-name">${name}</span>
                                            <p class="span-fit" wrap="wrap">${ivalue}</p>
                                            `
                                        } else
                                        if (name === "responsibilities") {
                                            itemElement.appendChild(itemExElement)
                                            const array = exper[name]
                                            console.log("Array: " + JSON.stringify(array))
                                            var index = 0
                                            array.forEach((elementstr) => {
                                                console.log("Element:")
                                                console.log(elementstr)
                                                const ivalue = getItemValue(elementstr, "responsibilities", index )
                                                index += 1
                                                const itemContentElement = document.createElement('span')
                                                itemContentElement.classList.add('content-element');
                                                itemExElement.appendChild(itemContentElement);
                                                itemContentElement.innerHTML = `
                                                  <span class="profile-name">${name}</span>
                                                  <span class="content-element">${ivalue}</span>
                                                `
                                            })

                                        }
                                    }
                                    getElement()
                                    count += 1
                                })
                               const endElement = document.createElement('br');
                               itemElement.appendChild(endElement);
                            })
                        } catch (e) {
                            console.log(e.stack.toString())
                        }
                   } else
                   if (key === "education") {
                      itemElement.innerHTML = `
                        <span class="profile-name">${key}</span>
                        <h1>Education:</h1>
                         `
                        jsonContainer.appendChild(itemElement);
                        try {
                            const obj = data[key]
                            Object.keys(obj).forEach(name => {
                                const itemExElement = document.createElement('div');
                                  itemElement.setAttribute("id", "education")
                                  const ivalue = obj[name]
                                  console.log(name + " [" + ivalue + "]")
                                  itemExElement.innerHTML = `
                                    <span class="profile-name">${name}</span>
                                    <span class="content-element">${ivalue}</span>
                                    `
                                  itemElement.appendChild(itemExElement);
                                })
                        } catch (e) {
                            console.log(e.stack.toString())
                        }
                   } else
                   if (index < 5) {
                          itemElement.innerHTML = `
                            <span class="profile-name">${key}</span>
                            <a class="profile-value" href="${value.link}">${value.text}</a>
                            `
                          itemElement.setAttribute("id", "profile")
                          jsonContainer.appendChild(itemElement);
                   } else {
                      itemElement.innerHTML = `
                        <span class="profile-name">${key}</span>
                        <p class="content-value">${value}</p>
                        `
                       jsonContainer.appendChild(itemElement);
                  }
                  index += 1
                });

            } catch (e) {
                console.log(e.toString())
            }
        })

        Scaler()

    return {
        status: 0
    }
}