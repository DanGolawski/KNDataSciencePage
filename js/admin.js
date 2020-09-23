window.onload = () => {
    // firebase is from a script downloaded via <script> tag
    const firebaseClient = new FirebaseClient(firebase);
    const cardSelector = document.querySelector('#cardSelector');
    const titleInput = document.querySelector('#title');
    const dateInput = document.querySelector('#date');
    const descriptionInput = document.querySelector('#description');
    const submitButton = document.querySelector('#submitButton');
    const fileInput = document.querySelector('#fileInput');


    initializeButtons();

    function initializeButtons() {
        submitButton.addEventListener('click', () => sendData())
        fileInput.addEventListener('change',
            event => setImage(event.target.files[0]));
    }

    function setImage(file) {
        firebaseClient.image = file;
    }

    function sendData() {
        let proceed = validateForm();
        if (!proceed) {
            alert('Please add required content');
            return;
        }
        const fileData = createFileData();
        firebaseClient.sendFile(fileData);
    }

    function validateForm() {
        switch ('') {
            case cardSelector.value: return false;
            case titleInput.value: return false;
            case dateInput.value: return false;
            case descriptionInput.value: return false;
            case fileInput.value: return false;
            default: return true;
        }
    }

    function createFileData() {
        return {
            title: titleInput.value,
            card: cardSelector.value,
            date: dateInput.value,
            description: descriptionInput.value,
        }
    }

}

