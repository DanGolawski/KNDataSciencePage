window.onload = () => {

    const TEXT_CLASS = 'elementText';
    const IMAGE_CLASS = 'elementImage';
    const CONTAINER_CLASS = 'elementContainer';

    const firebaseClient = new FirebaseClient(firebase);

    if (sessionStorage.getItem('loggedIn') === 'true') {
        startApplication();
    }
    else {
        signIn();
    }


    function signIn() {
        const signInButton = document.querySelector('#signInButton');
        signInButton.addEventListener('click', () => {
            let login = document.querySelector('#loginField').value;
            let password = document.querySelector('#passwordField').value;
            let result = firebaseClient.signIn(login, password);
            result.then(res => {
                if (res) {
                    sessionStorage.setItem("loggedIn", 'true');
                    startApplication();
                }
            })
        });
    }



    function startApplication() {
        document.querySelector('#loginContainer').classList.toggle('loggedIn');

        const promiseEvents = firebaseClient.getElementsFromFolder('Events');
        const promiseProjects = firebaseClient.getElementsFromFolder('Projects');

        promiseEvents.then(elements => displayElements(elements, 'eventsContainer', 'Events'));
        promiseProjects.then(elements => displayElements(elements, 'projectsContainer', 'Projects'));
    }


    function displayElements(elements, containerName, folder) {
        let container = document.querySelector(`#${containerName}`);
        for (const element of elements) {
            let elementStruct = createElementStruct(element, folder);
            container.appendChild(elementStruct);
        }
    }

    function createElementStruct(object, folder) {
        let container = document.createElement('div');
        container.classList.add(CONTAINER_CLASS);

        let deleteButton = createDeleteButton(object, folder);
        let downloadButton = createDownloadButton(object);
        let titleField = createTextField(object.values.title);
        let dateField = createTextField(object.values.date);
        let image = createImage(object.values.imageURL)
        let description = createDescription(object.values.description)

        container.appendChild(image);
        container.appendChild(titleField);
        container.appendChild(dateField);
        container.appendChild(description)
        container.appendChild(deleteButton);
        container.appendChild(downloadButton);
        return container;
    }

    function createDeleteButton(object, folder) {
        let deleteButton = document.createElement('div');
        deleteButton.classList.add('deleteButton');
        const imageUrl = object.values.imageURL;
        deleteButton.addEventListener('click', () => {
            firebaseClient.deleteElement(folder, object.key, imageUrl);
            let parentNode = deleteButton.parentNode;
            parentNode.style.opacity = 0;
            setTimeout(() => { parentNode.remove() }, 500);
        });
        return deleteButton;
    }

    function createDownloadButton(object) {
        let downloadButton = document.createElement('div');
        downloadButton.classList.add('downloadButton');
        const imageUrl = object.values.imageURL;
        downloadButton.addEventListener('click', () => {
            downloadURI(object.values.imageURL);
        });
        return downloadButton;
    }

    function downloadURI(uri) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }

    function createTextField(titleText) {
        let titleField = document.createElement('h4');
        titleField.classList.add(TEXT_CLASS);
        titleField.innerHTML = titleText;
        return titleField;
    }

    function createImage(imageUrl) {
        let image = document.createElement('img');
        image.classList.add(IMAGE_CLASS);
        image.setAttribute('src', imageUrl);
        image.onerror = function () {
            this.style.opacity = 0;
        }
        return image;
    }

    function createDescription(text) {
        let field = document.createElement('h4');
        field.classList.add(TEXT_CLASS);
        const subText = text.substring(0, 16);
        field.innerHTML = `${subText}...`;
        field.setAttribute('text', text);
        return field;
    }

}