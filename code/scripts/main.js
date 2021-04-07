
console.log("Hello World");


let leftView = 1600, rightView = 1900;

class TimelineComponent extends HTMLElement {
    constructor() {
        super();

    }

    connectedCallback() {
        for (let i = 0; i < 60; i++) {
            let e = document.createElement('div');
            
        }
    }
}
customElements.define('time-line', TimelineComponent);

class EpochComponent extends HTMLElement {
    constructor() {
        super();

    }
}

customElements.define('epoch-comp', EpochComponent);