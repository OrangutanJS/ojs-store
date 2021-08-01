# OrantuganJS - oStore
### Simple way to manage your app state

---
recommended using with ojs-core - https://www.npmjs.com/package/ojs-core
#### Quick start
```
npm i ojs-store
```
Package on [npm](https://www.npmjs.com/package/ojs-store)

#### VanillaJS
```js
// function for oStore
const counterValueChange = () => {
    document.querySelector('button').innerText = `+${counterStore.counter}`;
}
// oStore in the common use need two arguments:
// - Object with data
// - function which will be run every time any of the values changes
const counterStore = oStore({
    counter: 0,
}, counterValueChange);

// declaring ours counter button
const button = document.createElement('button');
button.innerText = `+${counterStore.counter}`;
button.addEventListener('click',()=>counterStore.counter++);

document.body.appendChild(button);
```

The second argument can be an instance of the class, in which case the function should be called "rerender"

```js
import o from 'ojs-core';

class Counter {
    constructor(startValue) {
        this.store = oStore({
            counter: startValue
        }, this)

        this.html = o('div').id('counter').add([
            this.build()
        ]).init();
    }

    rerender() {
        const container = document.getElementById('counter');
        if(counter) {
            container.innerHTML = '';
            container.appendChild(this.build());
        }
    }

    build() {
        return o('button')
                .text(`+${this.store.counter}`)
                .click(()=>{this.store.counter++})
                .init()
    }
    init() {
        return this.html;
    }
}

const counter = new Counter(0);

document.body.appendChild(counter.init());
```

for advanced examples you can use third argument which should containt config Object;

this is default config:
```js
const defaultConfig = {
    // if true all fields will be debounced
    debounce: false,
    debounceTime: 1000,
    // You can specify which fields should be debounce. 
    // debounce: true will be automatically added
    debounceFields: [],
    // You can specify which fields should not be observed
    // it means that changing them doesn't run rerender
    unobservedFields: []
}
```
example with config (remember, in this case second argument is 'this', so it should be used in class with method rerender)
```js
const exampleDb = oStore({
        example: 'test',
        exampleDebounced: 'test',
    }, this,
    {
        debounceTime: 15000,
        debounceFields: [
            'exampleDebounced'
        ],
        unobservedFields: [
            'example'
        ]
    }
);
```
