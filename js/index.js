window.onload = function () {
    let hexagonController = new HexagonController();
    hexagonController.control();

    let popupLaunchers = document.querySelectorAll(".popupLauncher");
    for (let launcher of popupLaunchers) {
        const popupName = launcher.getAttribute('popup');
        launcher.addEventListener('click', () => showPopup(popupName));
    }

    function showPopup(popupName) {
        let popupComponent = document.querySelector(`#${popupName}Popup`);
        popupComponent.style.opacity = 0.8;
        popupComponent.style.zIndex = 1;
        popupComponent.style.top = '10vh';
        popupComponent.querySelector('.closeButton').addEventListener('click', () => closePopup(popupComponent));
    }

    function closePopup(component) {
        component.style.top = '0';
        component.style.opacity = 0;
        component.style.zIndex = 0;
    }

}