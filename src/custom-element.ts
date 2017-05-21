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

export const CustomElement = <T extends CustomElementConstructor>(args: CustomElementMetadata): ClassDecorator => {

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