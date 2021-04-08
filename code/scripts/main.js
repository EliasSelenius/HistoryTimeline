
console.log("Hello World");


class TimelineComponent extends HTMLElement {

    _draging = false;
    leftView = 1600;
    rightView = 1900;

    get range() { return this.rightView - this.leftView; }

    static instance;

    constructor() {
        super();

        TimelineComponent.instance = this;


        this.onwheel = e => {
            this.zoomTimeline(e.deltaY / this.range * 10);
        }

        this.onmousedown = e => {
            this._draging = true;
        }

        this.onmouseup = e => this._draging = false;
        this.onmouseleave = e => this._draging = false;
        

        this.onmousemove = e => {
            if (this._draging) {
                this.panTimeline(-e.movementX * this.range / 1000);
            }
        }
    }

    zoomTimeline(years) {
        if (this.range < 0 && years < 0) return;

        this.leftView -= years;
        this.rightView += years;
        this.updateView();
    }

    panTimeline(years) {
        this.leftView += years;
        this.rightView += years;
        this.updateView();
    }

    updateView() {

        document.body.querySelector('#title').innerText = 'Timeline from ' + 
            Math.round(this.leftView) + ' to ' + Math.round(this.rightView) + 
            ', a period of ' + Math.round(this.range) + ' years'; 

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

        let d = document.createElement('div');
        d.innerText = name;
        marker.appendChild(d);

        this.appendChild(marker);

    }


}
customElements.define('time-line', TimelineComponent);




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
        const p = (this.year - TimelineComponent.instance.leftView) / (TimelineComponent.instance.range) * 100;
        this.style.left = p + '%';
    }

}

customElements.define('time-line-marker', TimelineMarker);