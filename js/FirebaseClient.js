class FirebaseClient {

    constructor(firebase) {
        const firebaseConfig = this.getFirebaseConfig();
        firebase.initializeApp(firebaseConfig);
        this.database = firebase.database();
        this.storage = firebase.storage();


        this.image = undefined;

    }

    getFirebaseConfig() {
        return {
            apiKey: "AIzaSyA1rDc8kkhzfTdhDxkI5pSQYvK4IF6AIH8",
            authDomain: "testowabazadlaprojektowstron.firebaseapp.com",
            databaseURL: "https://testowabazadlaprojektowstron.firebaseio.com",
            projectId: "testowabazadlaprojektowstron",
            storageBucket: "testowabazadlaprojektowstron.appspot.com",
            messagingSenderId: "719959496684",
            appId: "1:719959496684:web:6eeb7d269bd798a8aad2c9"
        };
    }

    async signIn(login, password) {
        return firebase.auth().signInWithEmailAndPassword(login, password).then((value) => {
            return true;
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage, errorCode);
            return false;
        });
    }

    sendFile(fileData) {
        console.log('file upload')
        if (this.image) {
            const self = this;
            const task = this.storage.ref((new Date()) + '-' + self.image.name).put(self.image);
            task.then(snapshot => snapshot.ref.getDownloadURL()).then((url) => {
                this.completeRequest(fileData, url)
            })
                .catch(console.error);
        }
        else {
            alert('error - upload problem');
            return;
        }

    }

    completeRequest(fileData, url) {
        const request = {
            title: fileData.title,
            date: fileData.date.split('-').reverse().join('-'),
            description: fileData.description,
            imageURL: url,
            login: sessionStorage.getItem('login')
        }
        this.database.ref('content/' + fileData.card).push(request);
        alert('The process is completed')
    }



    getDatabaseElements() {
        let elements = [];
        const promiseEvents = this.getElementsFromFolder("Events");
        const promiseProjects = this.getElementsFromFolder("Projects");
        const promiseAboutUs = this.getElementsFromFolder("AboutUs");
        promiseEvents.then(val => elements.push(val));
        promiseProjects.then(val => elements.push(val));
        promiseAboutUs.then(val => elements.push(val));
        return elements;
    }

    async getElementsFromFolder(folderName) {
        const eventref = this.database.ref(`content/${folderName}`);
        const snapshot = await eventref.once('value');
        // returns a list of downloaded objects
        let elements = [];
        snapshot.forEach(child => {
            elements.push({ key: child.key, values: child.val() })
        });
        return elements;
    }

    deleteElement(folder, elementKey, imageUrl) {
        // removes the element from database
        let ref = this.database.ref(`content/${folder}`);
        ref.child(elementKey).remove().then(() => console.log('Remove succeeded.'))
            .catch(error => alert("Remove failed: " + error.message));
        // removes image of the element
        let httpsReference = this.storage.refFromURL(imageUrl);
        httpsReference.delete().then(() => console.log('Image removed successfully'))
            .catch(error => alert("Remove failed: " + error.message));
    }
}