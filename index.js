'use strict';

/*

    Todo:
        - Tweak the squarify thing so that images take up as much width as they can? (i.e. they grow to fit the <li>, width-wise.)
            - This isn't necessarily "trivial", you'll need to think about the approach in detail. Think of some cases:
                - All images share the same width and height. They're not necessarily square, but can all get handled the same way.
                - All images share the same width, but not the same height. One will be the tallest.
                - Same height, but not the same width. One will be widest.
                - Different widths and heights. One will be tallest, one will be widest (could be the same or different images).
        - Integrate the Objects (week 08 prompts) into the page somehow.

        Low priority:
            - Tweak stringToObject, shoppingList string wrangling to handle ~less well-formed~ user input?


    Notes:
        - Why does HTMLElement.style.blah and dot notation like this in general work, and why am I struggling to find documentation for it?
            - Is it just that you're literally accessing the object, using dot notation? (Would bracket notation work? Presumably.)
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

    let enable = event.target.checked;

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


function windowLoaded() {

/*
    console.log(capitaliseKeys({ a: 1, b: 2, c: 3, hello: 'hi', Foo: 'bar' }));

    console.log(stringToObject("foo:bar,baz:42,qux:nice"));

    console.log(shoppingList("4 peppers, 3 oats, 2 onions, 18 tomatoes"));

    console.log(mapObject({ a: 42, b: 99 }, (n) => n / 2));
    console.log(mapObject({ shout: 'hey u good?', yell: 'yeah just grand thanks' }, (s) => s.toUpperCase() ));
*/

    makeMainNavCollapsible();

    const squarifyElement = document.getElementById('squarify');
    squarifyElement.addEventListener('input', makeGallerySquare);

} // end of function windowLoaded