interface CustomElementConstructor {
    new (...args: any[]): CustomElement;
}

interface CustomElementMetadata {
    tag?: string;
    template?: string;
    styles?: string;
}

interface CustomElement extends HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    attributeChangedCallback?(attributeName: string, oldValue: any, newValue: any, namespace?: any): void;
}

const CustomElement = <T extends CustomElementConstructor>(args: CustomElementMetadata): ClassDecorator => {

    const template = document.createElement('template');
    template.innerHTML = `
    <style>${args.styles ? args.styles : ''}</style>
    ${args.template ? args.template : ''}
    `

    return (target: T) => {
        const customElement = class extends target {

            /**
             * Used to extend Custom Elements to add convenience creating shadow root and adding scoped styles
             * and templates
             */
            constructor(...args: any[]) {
                super(...args);
                if (!this.shadowRoot) {
                    this.attachShadow({ mode: 'open' });
                }
            }

            connectedCallback() {
                super.shadowRoot!.appendChild(document.importNode(template.content, true));
                super.connectedCallback && super.connectedCallback();
            }
        }
        // window.customElements.define(args.tag, customElement);
        return customElement;
    };
}

@CustomElement({
    template: `
        <span id="name"></span>
    `,
    styles: `
        :host {
            display: flex;
            width: 100px;
            height: 100px;
            background-color: royalblue;
            border-radius: 6px;
            justify-content: center;
            align-items: center;
        }
        
    `
})
class MyCustomElement extends HTMLElement {
    static get observedAttributes() {
        return ['name']
    }

    /**
     *
     */
    constructor() {
        super();
        this.addEventListener('click', (e) => {
            this.changeName('Jonathan');
        })
    }

    get name() {
        return this.getAttribute('name')!;
    }

    set name(value: string) {
        this.setAttribute('name', value);
    }


    connectedCallback() {
        this.showName();
    }

    disconnectedCallback() { }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name == 'name' && oldValue != newValue) {
            this.changeName(newValue);
        }
    }

    changeName(name: string) {
        this.name = name;
        this.showName();
    }

    showName() {
        const name = this.shadowRoot!.querySelector('#name');
        if (name) {
            name.innerHTML = `Hola ${this.name ? this.name : ''}! 👋🏻`;
        }
    }
}
customElements.define('my-custom-element', MyCustomElement);
