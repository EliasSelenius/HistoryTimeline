
console.log("Hello World");

const lerp = (x, y, t) => (1 - t) * x + t * y;


let leftView = 1600, rightView = 1900;

class TimelineComponent extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('scroll', (el, e) => {
            console.log("sc");
        });
    }

    updateView(min, max) {
        leftView = min;
        rightView = max;

        
    }

    connectedCallback() {
        //this.updateView(1500, 1750);



        fetch('../data/events.json').then(x => x.json()).then(x => {
            

            for (let i = 0; i < x.length; i++) {
                const event = x[i];

                var marker = document.createElement('time-line-marker');
                marker.year = event.year;
                marker.innerText = event.name;
                this.appendChild(marker);
        
            }

        })

    }


    


}
customElements.define('time-line', TimelineComponent);




class TimelineMarker extends HTMLElement {
    constructor() {
        super();


        this.year = 0;

    }

    connectedCallback() {
        this.updateLocation();
    }

    updateLocation() {
        const p = (this.year - leftView) / (rightView - leftView) * 100;
        this.style.left = p + '%';
    }

}

customElements.define('time-line-marker', TimelineMarker);