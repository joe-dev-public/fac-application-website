'use strict';

/*

    Todo:
        - Tweak the squarify thing so that images take up as much width as they can? (i.e. they grow to fit the <li>, width-wise.)
            - This isn't necessarily "trivial", you'll need to think about the approach in detail. Think of some cases:
                - All images share the same width and height. They're not necessarily square, but can all get handled the same way.
                - All images share the same width, but not the same height. One will be the tallest.
                - Same height, but not the same width. One will be widest.
                - Different widths and heights. One will be tallest, one will be widest (could be the same or different images).
        - Basic validation on the objects stuff inputs.

        Low priority:
            - Tweak stringToObject, shoppingList string wrangling to handle ~less well-formed~ user input?
            - There may be unnecessary use of ".children" in prompts; remember you can use ELEMENT.getElementsByBlah, not just DOCUMENT.getElementsByBlah!


    Notes:
        - Why does HTMLElement.style.blah and dot notation like this in general work, and why am I struggling to find documentation for it?
            - Is it just that you're literally accessing the object, using dot notation? (Would bracket notation work? One test below suggests: yes!)
            - And that you have access to whatever properties it has, in the DOM/CSSOM/whatever, regardless of what you can find documented?
            - (Or, these properties will be documented somewhere, but not in the most "obvious" place?)
        - Sigh. This just makes debugging a bit less fun, y'know? https://bugzilla.mozilla.org/show_bug.cgi?id=1615206

*/


/*
    -------------------------------------------------------
    Object stuff
    -------------------------------------------------------
*/

function capitaliseKeys(obj) {

    let newObj = {};

    for (const [key, value] of Object.entries(obj)) {

        /*
        Object.defineProperty(newObj, key.toUpperCase(), {
            enumerable: true,
            value: val
        });
        */

        // This does roughly the same thing; possibly exactly the same thing!
        newObj[key.toUpperCase()] = value;

    }

    return newObj;

} // end of function capitaliseKeys



function stringToObject(str) {

    let newObj = {};

    // A basic approach is to assume that commas *only* appear when delimiting pairs, and colons *only appear when separating a key from a value.
    // Of course, this is extremely error-prone :)
    let pairs = str.split(',');

    pairs.forEach( element => {
        let [key, value] = element.split(':');
        newObj[key] = value;
    });

    return newObj;

} // end of function stringToObject



function shoppingList(str) {

    let newObj = {};

    let pairs = str.split(', ');

    pairs.forEach( element => {
        let [value, key] = element.split(' '); // Extremely rudimentary, will break easily.
        newObj[key] = value; // You could do Number(value), if you really want it to be a number.
    });

    return newObj;

} // end of function shoppingList



function mapObject(obj, fn) {

    let newObj = {};

    for (const [key, value] of Object.entries(obj)) {
        newObj[key] = fn(value);
    }

    return newObj;

} // end of function mapObject

/*
    -------------------------------------------------------
    End of Object stuff
    -------------------------------------------------------
*/




function makeGallerySquare(event) {

    let enable = event["target"]["checked"]; // or dot notation: event.target.checked. Either works, it seems!

    const squareGalleryElement = document.getElementById('gallery-square');

    let images = squareGalleryElement.getElementsByTagName('img');

    let tallest = 0;

    for (let j = 0; j < images.length; j++){

        let styles = window.getComputedStyle(images[j]);

        let heightString = styles.getPropertyValue('height');

        let height = Number(heightString.split('px')[0]);

        if (height > tallest) { tallest = height; }

    } // end of images loop

    // Dunno if this is necessary..
    //let tallestRoundedUp = Math.ceil(tallest);
    let tallestRoundedUp = tallest;

    // set the width of each gallery element to the same value as the height of the tallest image
    let listItems = squareGalleryElement.getElementsByTagName('li');

    if (enable === true){
        for (let j = 0; j < listItems.length; j++){
            // todo: why does HTMLElement.style(.width) work?
            listItems[j].style.width = `${tallestRoundedUp}px`;
            listItems[j].style.height = `${tallestRoundedUp}px`;
        }
    } else {
        for (let j = 0; j < listItems.length; j++){
            listItems[j].style.width = '';
            listItems[j].style.height = '';
        }
    }

}


// Wee helper function to "stop things doing stuff".
function doNothing(event) { event.preventDefault(); }


function makeMainNavCollapsible() {

    const mainNavMenuElement = document.getElementById('main-nav-menu');
    const mainNavMenuButtonElement = document.getElementById('main-nav-menu-button');

    // Perhaps OTT for this little script ;¬)
    const mainNavMenuElementHideClass = 'hide';
    const mainNavMenuButtonElementShowClass = 'show';

    // Make some markup and style changes that are only relevant if JS is active.
    mainNavMenuButtonElement.innerHTML += `<span id="main-nav-menu-button-arrow">&darr;</span>`;

    const mainNavMenuButtonArrowElement = document.getElementById('main-nav-menu-button-arrow');

    // Apply classes that will only have an effect if the relevant @media query is active
    mainNavMenuElement.classList.add(mainNavMenuElementHideClass);
    mainNavMenuButtonElement.classList.add(mainNavMenuButtonElementShowClass);

    function toggleMainNavMenuVisible(event) {

        // I think el.style.blah gives you the inline style, and at load we're not using an inline style, we're using one from style.css.
        // So we need a way to test the visibility of an element without checking its inline style (which may well be blank).

        let classes = mainNavMenuElement.classList;

        let hidden = false;

        // If the main nav menu has the "hide" class (which is the mechanism we use to hide it), then set the flag to true and leave the loop.
        for (let i = 0; i < classes.length; i++){
            if (classes[i] === mainNavMenuElementHideClass){
                hidden = true;
                break;
            }
        }

        // If the hidden flag is true, remove the hide class from the main nav menu. If it's false, add the class. Also change the button arrow ;)
        if (hidden === true){
            mainNavMenuElement.classList.remove(mainNavMenuElementHideClass);
            mainNavMenuButtonArrowElement.innerHTML = "&uarr;";
        } else if (hidden === false){
            mainNavMenuElement.classList.add(mainNavMenuElementHideClass);
            mainNavMenuButtonArrowElement.innerHTML = "&darr;";
        }

        doNothing(event);

    }

    mainNavMenuButtonElement.addEventListener('click', toggleMainNavMenuVisible);

}


// Another little helper function :)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
// Use window.Function() to do something similar to eval() but MUCH safer/better (apparently). Not sure how safe this is really, but look into that later.
function definitelyNotEval(string){
    return Function('"use strict"; return ' + string + ';')();
}


function handleDemoInput(event) {

    const functionToCall = event.target.value;

    const outputElement = event.target.parentElement.parentElement.getElementsByClassName('demo-output')[0];

    // todo: handle multiple lines, validation, etc.

    let input = event.target.parentElement.getElementsByTagName('textarea')[0].value;

    // It's a string.
    //console.log(typeof input);

    // Is this a reliable way to get each line of a <textarea>?
    let lines = input.split(/\n/);

    let html = '';

    lines.forEach( element => {

        if (functionToCall === 'capitaliseKeys'){

            /*
                Treat the string "literally" as an object, or an object + function, because that's what these functions expect as per FAC's spec. :¬)

                We want to interpret the user-entered string "literally", i.e. we want to pretend it's JS code.
                (Side-note: I'm pretty sure this isn't what "literals" are, I just can't think of a better word to describe this.)

                Once upon a time I think this might've been done with "eval", but that's a huge security risk (and also performance hit, it turns out!).
                So we use the window.Function() approach, implemented above.

                This allows us to use literal (aka initializer) notation to initialise the Object from the user's text input.
                (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)

                (Messing around with JSON.stringify and JSON.parse shouldn't be necessary.)

                Todo: is there a way to catch any errors here and report them in the output, not just console?
            */

            element = definitelyNotEval(element); // Don't like doing this >:¬/

        }

        let returnedObject = {};

        if (functionToCall === 'mapObject'){

            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
            // (via https://stackoverflow.com/questions/34628763/what-is-the-equivalent-of-pythons-in-javascript)
            let [, obj, fn] = element.match(/^(.*}), (.*)$/);

            obj = definitelyNotEval(obj);
            fn = definitelyNotEval(fn);

            returnedObject = window[functionToCall](obj, fn);

        } else {
            // Call a function where its name is a variable string by using bracket notation on the Window interface
            returnedObject = window[functionToCall](element);
        }

        //console.log(returnedObject);

        html += `Return type: ${typeof returnedObject}<br><br>`;

        for (const [key, value] of Object.entries(returnedObject)) {
            html += `${key}: ${value}<br>`;
        }

        html += '<br><br>';

    });

    outputElement.innerHTML = html;

}


function initWeek08() {

    const demoInputElements = document.getElementsByClassName('demo-input');

    for (let i = 0; i < demoInputElements.length; i++){

        demoInputElements[i].addEventListener('submit', doNothing);

        // Not best practice, as this could break if you add another button.
        const submitButtonElement = demoInputElements[i].getElementsByTagName('button')[0];

        submitButtonElement.addEventListener('click', handleDemoInput);

    }

}


function windowLoaded() {

/*
    console.log(capitaliseKeys({ a: 1, b: 2, c: 3, hello: 'hi', Foo: 'bar' }));

    console.log(stringToObject("foo:bar,baz:42,qux:nice"));

    console.log(shoppingList("4 peppers, 3 oats, 2 onions, 18 tomatoes"));

    console.log(mapObject({ a: 42, b: 99 }, (n) => n / 2));
    console.log(mapObject({ shout: 'hey u good?', yell: 'yeah just grand thanks' }, (s) => s.toUpperCase() ));
*/

    makeMainNavCollapsible();

    initWeek08();

    const squarifyElement = document.getElementById('squarify');
    squarifyElement.addEventListener('input', makeGallerySquare);

} // end of function windowLoaded