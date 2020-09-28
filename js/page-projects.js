window.onload = () => {

    const main = document.querySelector('main');
    const observable = new Observable();
    const firebaseClient = new FirebaseClient(firebase);
    let objectsPromise = firebaseClient.getElementsFromFolder('Projects');
    createContentItems(objectsPromise);
    observable.notifyScrolling(main.scrollTop);
    window.addEventListener('resize', () => {
        observable.notifyWindowChange(window.innerHeight, main.scrollTop);
    });

    main.addEventListener('scroll', () => observable.notifyScrolling(main.scrollTop));

    function createContentItems(objectsPromise) {
        objectsPromise.then(array => {

            let contentContainer = document.querySelector('#contentContainer');
            for (let arrItem of array) {
                let item = createContentItem(arrItem);
                contentContainer.appendChild(item);
                let contentItem = new ContentItem(item, window.innerHeight)
                observable.addObserver(contentItem);
            }

        });
    }

    function createContentItem(object) {
        let contentItem = createElement('div', 'contentItem');
        let itemYear = createElement('span', 'itemYear');
        itemYear.innerHTML = object.values.date.split('-')[2];
        let imgWrap = createElement('div', 'imgWrap');
        let itemImage = createElement('div', 'itemImage');
        let itemTitle = createElement('h2', 'itemTitle');
        itemTitle.innerHTML = object.values.title;
        let itemDescription = createElement('p', 'itemDescription');
        itemDescription.innerHTML = object.values.description;
        contentItem.appendChild(itemYear);
        imgWrap.appendChild(itemImage);
        contentItem.appendChild(imgWrap);
        contentItem.appendChild(itemTitle);
        contentItem.appendChild(itemDescription);
        return contentItem;
    }

    function createElement(type, className) {
        let element = document.createElement(type);
        element.classList.add(className);
        return element;
    }
}


class Observable {
    constructor() { this.observers = [] }

    addObserver(element) { this.observers.push(element) }

    addObservers(elements) { this.observers = this.observers.concat(elements) }

    notifyScrolling(value) { this.observers.forEach(observer => observer.checkPosition(value)) }

    notifyWindowChange(windowHeight, mainScrollTop) {
        this.observers.forEach(observer => {
            observer.updateValues(windowHeight);
            observer.checkPosition(mainScrollTop)
        })

    }
}


class ContentItem {
    constructor(DOMelement, windowHeight) {
        this.DOMelement = DOMelement;
        // contentItem's distance to the top edge of the screen
        // this.distanceTop = this.DOMelement.offsetTop;

        this.DOMelementImage = DOMelement.querySelector('.itemImage');
        // this.elemImageHeight = this.DOMelementImage.offsetHeight;

        this.DOMelementTitle = this.DOMelement.querySelector('.itemTitle');
        // this.elemTitleHeight = this.DOMelementTitle.offsetHeight;
        // title's distance to the top edge of its contentItem
        // this.elemTitleDistanceTop = this.distanceTop + this.DOMelementTitle.offsetTop;

        // this.windowHeight = windowHeight;

        this.updateValues(windowHeight);
    }

    updateValues(currentHeight) {
        this.windowHeight = currentHeight;
        // contentItem's distance to the top edge of the screen
        this.distanceTop = this.DOMelement.offsetTop;
        this.elemImageHeight = this.DOMelementImage.offsetHeight;
        this.elemTitleHeight = this.DOMelementTitle.offsetHeight;
        // title's distance to the top edge of its contentItem
        this.elemTitleDistanceTop = this.distanceTop + this.DOMelementTitle.offsetTop;
    }

    checkPosition(currentDistance) {
        // fire an image animation if image is on the screen
        if (this.isWithinScreen(currentDistance, this.elemImageHeight, this.distanceTop)) {
            const scale = this.calculateScale(currentDistance);
            this.handleImageAction(scale);
        }
        // fire a title animation if image is on the screen
        if (this.isWithinScreen(currentDistance, this.elemTitleHeight, this.elemTitleDistanceTop)) {
            const translation = this.calculateTranslation(currentDistance);
            console.log(translation);
            this.handleTitleAction(translation);
        }
    }

    handleImageAction(scale) {
        this.DOMelementImage.style.transform = `scale3d(${scale}, ${scale}, 1)`;
    }



    // isWithinScreen(currentDistance) {
    //     const distanceDelta = this.distanceTop - currentDistance;
    //     return -this.elemImageHeight < distanceDelta && distanceDelta < this.windowHeight;
    // }

    isWithinScreen(currDist, elemHeight, distTop) {
        const distanceDelta = distTop - currDist;
        return -elemHeight < distanceDelta && distanceDelta < this.windowHeight;
    }

    calculateScale(currentDistance) {
        const distanceDelta = this.distanceTop - currentDistance;
        return (this.windowHeight - distanceDelta) / this.windowHeight / 3.5 + 1;
    }

    handleTitleAction(translation) {
        this.DOMelementTitle.style.transform = `translate3d(0, ${translation}vh, 0)`
    }

    calculateTranslation(currentDistance) {
        const distanceDelta = this.elemTitleDistanceTop - currentDistance;
        return -100 * ((this.windowHeight - distanceDelta) / this.windowHeight / 2);
    }
}