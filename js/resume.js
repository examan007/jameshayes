var ResumeOutput = function () {
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
                      itemElement.innerHTML = `
                        <span class="profile-name">${key}</span>
                        <h1>Experience:</h1>
                         `
                        jsonContainer.appendChild(itemElement);
                        try {
                            const array = data[key]
                            array.forEach(exper => {
                                var count = 0
                                const itemFlexElement = document.createElement('div')
                                itemFlexElement.classList.add('flex-container');
                                itemElement.appendChild(itemFlexElement);
                                Object.keys(exper).forEach(name => {
                                    const ivalue = exper[name]
                                    const itemExElement = document.createElement('div')
                                    function getElement() {
                                        if (count < 3) {
                                            itemExElement.classList.add('column');
                                            itemFlexElement.appendChild(itemExElement);
                                          itemExElement.innerHTML = `
                                            <span class="profile-name">${name}</span>
                                            <p class="span-fit" wrap="wrap">${ivalue}</p>
                                            `
                                        } else
                                        if (count < 4) {
                                            itemExElement.classList.add('column');
                                            itemFlexElement.appendChild(itemExElement);
                                          itemExElement.innerHTML = `
                                            <span class="span-right profile-name">${name}</span>
                                            <p class="span-fit" wrap="wrap">${ivalue}</p>
                                            `
                                        } else
                                        if (name === "responsibilities") {
                                            itemElement.appendChild(itemExElement)
                                            const array = ivalue
                                            console.log(JSON.stringify(array))
                                            array.forEach(element => {
                                            const itemContentElement = document.createElement('span')
                                            itemContentElement.classList.add('experience-content');
                                            itemExElement.appendChild(itemContentElement);
                                            itemContentElement.innerHTML = `
                                              <span class="profile-name">${name}</span>
                                              <span class="content-element">${element}</span>
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
        if (typeof window.print === 'function') {
            var printButton = document.getElementById('print-button');
            printButton.addEventListener('click', function() {
              this.setAttribute("style", "display: none")
              window.print();
              this.setAttribute("style", "display: block")
            });
        } else {
            console.log("No print button.")
        }
    return {
        status: 0
    }
}