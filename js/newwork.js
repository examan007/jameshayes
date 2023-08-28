var ResumeOutput = function () {
    var consolex = {
        log: function(msg) {},
        error: function(msg) {},
    }
    const LogMgr = LoginManager().getData(
        "data/resume.json",
        (data)=> {
            const jsonContainer = document.getElementById('json-container');
            try {
                var index = 0
                Object.keys(data).forEach(key => {
                    const value = data[key]
                    function createNewSection(itemElement, name, convert) {
                        itemElement.setAttribute("id", name)
                        const itemTemplate = document.getElementById(name + "-template")
                        itemElement.innerHTML = itemTemplate.innerHTML
                        return convert(itemElement)
                    }
                    function createSection(name, convert) {
                        return createNewSection(document.createElement('div'), name, convert)
                    }
                    function createSpanSection(name, convert) {
                        return createNewSection(document.createElement('span'), name, convert)
                    }
                    function addNewSection(itemElement) {
                        itemElement.innerHTML = eval('`' + itemElement.innerHTML + '`')
                        jsonContainer.appendChild(itemElement)
                        return itemElement
                    }
                    function addSection(name) {
                        return createSection(name, addNewSection)
                    }
                    if (index < 5) {
                        addSection("profile");
                    } else
                    if (key === "experience") {
                        const itemElement = addSection("experience")
                        try {
                            const array = data[key]
                            array.forEach(exper => {
                                function getItemValue(rawvalue, key, offset) {
                                    function getLink(index) {
                                        try {
                                            const element = exper.links[index]
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
                                    function getElement() {
                                        const ivalue = getItemValueLog(exper[name], name, -1)
                                        function convertHTML(itemExElement) {
                                            itemExElement.classList.add('column');
                                            itemExElement.innerHTML = eval('`' + itemExElement.innerHTML + '`')
                                            itemFlexElement.appendChild(itemExElement);
                                        }
                                        if (count < 3) {
                                            createSection("role", convertHTML)
                                        } else
                                        if (count < 4) {
                                            createSection("role-end", convertHTML)
                                        } else
                                        if (name === "responsibilities") {
                                            const itemExElement = document.createElement('div')
                                            itemElement.appendChild(itemExElement)
                                            const array = exper[name]
                                            console.log("Array: " + JSON.stringify(array))
                                            var index = 0
                                            array.forEach((elementstr) => {
                                                console.log("Element:")
                                                console.log(elementstr)
                                                const ivalue = getItemValue(elementstr, "responsibilities", index )
                                                index += 1
                                                createSpanSection("acheivement", (itemContentElement)=> {
                                                    itemContentElement.classList.add('content-element');
                                                    itemContentElement.innerHTML = eval('`' + itemContentElement.innerHTML + '`')
                                                    itemExElement.appendChild(itemContentElement);
                                                })
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
                        createSection("education", (itemExElement) => {
                            try {
                                const obj = data[key]
                                Object.keys(obj).forEach(name => {
                                      const ivalue = obj[name]
                                      createSpanSection("acheivement", (itemElement) => {
                                          itemElement.innerHTML = eval('`' + itemElement.innerHTML + '`')
                                          itemExElement.appendChild(itemElement)
                                      })
                                })
                            } catch (e) {
                                console.log(e.stack.toString())
                            }
                            jsonContainer.appendChild(itemExElement)
                        })
                   } else {
                        addSection(key)
                   }
                  index += 1
                });

            } catch (e) {
                alert(e.stack.toString())
            }
        })

        Scaler()

    return {
        status: 0
    }
}