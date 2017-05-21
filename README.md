# TypeScript Custom Element 🎉
This is a WIP to see how I can use decorators to handle the shadow dom (that is, inserting the styles and HTML) without have to do it everytime.

## Future
There's still a lot of things I would want this to do. But for now, this is just a proof of concept.
Although, I would like this to also handle querying and updating the html. Hopefully 😁

## How to use
Using `@CustomElement` automatically creates the shadowRoot and applies the specified template and style.
```typescript
@CustomElement({
    template: `
        <span>Bonjour! 👋🏻</span>
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

}
customElements.define('my-custom-element', MyCustomElement);
```

Once that's done, just compile and use like any Web Component!