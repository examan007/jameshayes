const Scaler = function () {
        if (typeof window.print === 'function') {
            registerEvents(document.getElementById('print-button'), (element)=> {
              element.parentNode.setAttribute("style", "visibility: hidden")
              window.setTimeout(()=> {
                 window.print();
                  window.setTimeout(()=> {
                     element.parentNode.setAttribute("style", "visibility: visible")
                  }, 100)
              }, 100)
            })
        } else {
            console.log("No print button.")
        }
        function scaleEm(element, scalingFactor) {
            //const element = document.getElementById(elementId);
            const computedFontSize = window.getComputedStyle(element).fontSize;
            const fontSizeValue = parseFloat(computedFontSize);
            const scaledValue = fontSizeValue * scalingFactor;
            element.style.fontSize = scaledValue + "px";
        }
        function adjustTextScaleBySelector(selector, callback) {
            const elementsWithFontSize = document.querySelectorAll(selector);
            elementsWithFontSize.forEach(element => {
                callback(element)
            });
        }
        function adjustTextScale(callback) {
            adjustTextScaleBySelector('#json-container div div', callback)
            adjustTextScaleBySelector('h1', callback)
            adjustTextScaleBySelector('.profile-value', callback)
       }

        function registerEvents(element, clickMethod) {
            element.addEventListener("click", function(event) {
                 clickMethod(element)
            })
            element.addEventListener("mouseover", function(event) {
                  element.classList.add("scale-selected")
            })
            element.addEventListener("mouseout", function(event) {
                  element.classList.remove("scale-selected")
            })
        }
        registerEvents(document.getElementById("scale-up-print"), (element)=> {
            console.log("Up: " + element)
            adjustTextScale((element)=> {
                scaleEm(element, 1.01)
            })
        })
        registerEvents(document.getElementById("scale-down-print"), (element)=> {
            console.log("Down: " + element)
            adjustTextScale((element)=> {
                scaleEm(element, 0.99)
            })
        })

    return {

    }
}