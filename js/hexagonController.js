class HexagonController {

    id;


    control() {
        this.manageHexagons();
        this.actOnWindowResize();
    }

    manageHexagons() {
        const hexagonsList = document.querySelectorAll(".hex");
        const containerWidth = document.querySelector("#container").offsetWidth;
        // initial width of first row reduced by left margin of hexagon
        let rowWidth = 81;
        // variable so that the program knows whether should add a gap
        let currentElement = hexagonsList[0];

        // sets only hex class and sets gap for the first element
        this.resetElements(hexagonsList);

        hexagonsList.forEach(hexagon => {
            rowWidth += (hexagon.offsetWidth + 10);
            if (rowWidth > containerWidth) {
                // if previous element has not the gap, add it to current element
                if (!currentElement.classList.contains("hex-gap")) {
                    hexagon.classList.add("hex-gap");
                    rowWidth = 81 + (hexagon.offsetWidth + 10);
                } // else do not add the gap
                else rowWidth = (hexagon.offsetWidth + 10);

                currentElement = hexagon;
            }
        })
    }

    resetElements(list) {
        let zIndexCounter = list.length;
        list.forEach(hexagon => {
            hexagon.className = "hex";
            hexagon.style.zIndex = zIndexCounter--;
        })
        list[0].classList.add("hex-gap");
    }

    // acts manageHexagons() when window was resized
    actOnWindowResize() {
        self = this;
        window.addEventListener('resize', function () {
            clearTimeout(self.id);
            self.id = setTimeout(() => { self.manageHexagons() }, 100);
        });
    }
}