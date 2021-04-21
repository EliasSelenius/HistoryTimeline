
console.log("Hello World");


class TimelineComponent extends HTMLElement {

    _draging = false;
    leftView = 1683;
    rightView = 1700;

    get range() { return this.rightView - this.leftView; }

    static instance;

    constructor() {
        super();

        TimelineComponent.instance = this;


        this.onwheel = e => {
            e.preventDefault();
            this.zoomTimeline((e.deltaY / Math.abs(e.deltaY)) * (this.range / 30));
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
        if (this.range < 1 && years < 0) return; // makes it impossible to scroll under one year

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
        this.updateView();

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
        d.classList.add('title');
        d.innerText = name;
        marker.appendChild(d);

        d = document.createElement('div');
        d.classList.add('year');
        d.innerText = year;
        marker.appendChild(d);

        this.appendChild(marker);

    }


}
customElements.define('time-line', TimelineComponent);



function getFromTemplate(templateID, el) {
    const t = document.getElementById(templateID);
    
}