

function calcRelPos(year) {
    return (year - TimelineComponent.instance.leftView) / (TimelineComponent.instance.range) * 100;
}



class TimelineComponent extends HTMLElement {

    _draging = false;
    leftView = 1683;
    rightView = 1700;
    yearMarkerContainer = null;

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

        { // year markers


            const yearMarkers = this.getElementsByClassName('time-line-year-markers').item(0).children;
        

            const yearsCount = Math.ceil(this.range);
            const leftYear = Math.floor(this.leftView);
            
            //const interval = Math.floor(yearsCount / 20);

            for (let i = 0; i < yearsCount; i += 1 ) {
                const y = leftYear + i;
                const relp = calcRelPos(y);
                const div = yearMarkers.item(i);
                div.style.left = relp + "%";
                div.innerText = y;
                //this.createMarker(y, "Test: " + y);
            } 
        }

    }

    connectedCallback() {
        
        { // year markers
            this.yearMarkerContainer = document.createElement('div');
            this.yearMarkerContainer.className = 'time-line-year-markers';
            this.appendChild(this.yearMarkerContainer);
            for (let i = 0; i < 50; i++) {
                const div = document.createElement('div');
                div.innerText = "Hello";
                this.yearMarkerContainer.appendChild(div);
            }        
        }

        

        fetch('../data/events.json').then(x => x.json()).then(x => {
            for (let i = 0; i < x.length; i++) {
                const event = x[i];
                this.createMarker(event.year, event.name);
            }
        });
        
        

        
        this.updateView();
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

function roundToDecade(year) {
    return Math.round(year / 10) * 10;
}

function floorToDecade(year) {
    return Math.floor(year / 10) * 10;
}