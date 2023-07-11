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
                        <h2>Summary:</h2>
                        <p class="content-value">${value[0]}</p>
                        <p class="content-value">${value[1]}</p>
                        <p class="content-value">${value[2]}</p>
                    `
                      jsonContainer.appendChild(itemElement);
                   } else
                   if (key === "objective") {
                      itemElement.innerHTML = `
                        <span class="profile-name">${key}</span>
                        <h2>Objective:</h2>
                        <p class="content-value">${value}</p>
                    `
                      jsonContainer.appendChild(itemElement);
                  } else
                   if (key === "experience") {
                      itemElement.innerHTML = `
                        <span class="profile-name">${key}</span>
                        <h2>Experience:</h2>
                         `
                        jsonContainer.appendChild(itemElement);
                        try {
                            const array = data[key]
                            array.forEach(exper => {
                                var count = 0
                                Object.keys(exper).forEach(name => {
                                function createElement() {
                                    if (count < 4) {
                                        return document.createElement('span')
                                    } else {
                                        return document.createElement('div')
                                    }
                                }
                                const itemExElement = createElement()
                                  const ivalue = exper[name]
                                  //console.log(name + " [" + ivalue + "]")
                                  itemExElement.innerHTML = `
                                    <span class="profile-name">${name}</span>
                                    <span class="content-element">${ivalue}</span>
                                    `
                                  itemElement.appendChild(itemExElement);
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
                        <h2>Education:</h2>
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
    return {
        status: 0
    }
}