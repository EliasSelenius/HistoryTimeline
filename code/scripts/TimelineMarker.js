
class TimelineMarker extends HTMLElement {

    year = 0;

    constructor() {
        super();

    }

    connectedCallback() {
        if (this.hasAttribute("year")) this.year = Number.parseInt(this.getAttribute("year"));

        this.updateLocation();
    }

    updateLocation() {
        const p = calcRelPos(this.year);
        this.style.left = p + '%';
    }

}

customElements.define('time-line-marker', TimelineMarker);


