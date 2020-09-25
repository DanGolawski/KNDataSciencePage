window.onload = () => {

    const firebaseConfig = getFirebaseConfig();
    firebase.initializeApp(firebaseConfig);

    let ui = new firebaseui.auth.AuthUI(firebase.auth());


    let uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return true;
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: 'admin-delete.html',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>',
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    ui.start('#firebaseui-auth-container', uiConfig);

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // alert('User is signed in')
        } else {
            // alert('No user is signed in')
        }
    });

    function getFirebaseConfig() {
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

}