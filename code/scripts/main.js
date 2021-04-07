
console.log("Hello World");


let leftView = 1600, rightView = 1900;

class TimelineComponent extends HTMLElement {
    constructor() {
        super();
        /*this.addEventListener('onscroll', (el, e) => {
            console.log("sc");
        });*/

        this.onwheel = e => {
            this.zoomTimeline(e.deltaY / 10);
        }

        this.onmousedown = e => {
            this._draging = true;
        }

        this.onmouseup = e => this._draging = false;
        this.onmouseleave = e => this._draging = false;
        

        this.onmousemove = e => {
            if (this._draging) {
                this.panTimeline(e.movementX);
            }
        }
    }

    zoomTimeline(zoomlevel) {
        leftView -= zoomlevel;
        rightView += zoomlevel;
        this.updateView();
    }

    panTimeline(pan) {

        const scale = (rightView - leftView) / 1000;

        leftView -= pan * scale;
        rightView -= pan * scale;
        this.updateView();
    }

    updateView() {
        if (leftView > rightView) {
            leftView = rightView = (leftView + rightView) / 2;
            leftView -= 1; rightView += 1;
            return;
        }

        const markers = this.getElementsByTagName('time-line-marker');
        for (let i = 0; i < markers.length; i++) {
            markers.item(i).updateLocation();
        }
    }

    connectedCallback() {
        this.updateView(1500, 1750);

        fetch('../data/events.json').then(x => x.json()).then(x => {
            for (let i = 0; i < x.length; i++) {
                const event = x[i];
                this.createMarker(event.year, event.name);
            }
        });

    }


    createMarker(year, name) {
        var marker = document.createElement('time-line-marker');
        marker.year = year;
        marker.innerText = name;
        this.appendChild(marker);

    }


}
customElements.define('time-line', TimelineComponent);




class TimelineMarker extends HTMLElement {
    constructor() {
        super();

        this.year = 0;

    }

    connectedCallback() {
        if (this.hasAttribute("year")) this.year = Number.parseInt(this.getAttribute("year"));

        this.updateLocation();
    }

    updateLocation() {
        const p = (this.year - leftView) / (rightView - leftView) * 100;
        this.style.left = p + '%';
    }

}

customElements.define('time-line-marker', TimelineMarker);