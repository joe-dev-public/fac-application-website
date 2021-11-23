'use strict';

/*

    Todo:
        - Integrate the Objects (week 08 prompts) into the page somehow.

        Low priority:
            - Tweak stringToObject, shoppingList string wrangling to handle ~less well-formed~ user input?

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



function windowLoaded() {

/*
    console.log(capitaliseKeys({ a: 1, b: 2, c: 3, hello: 'hi', Foo: 'bar' }));

    console.log(stringToObject("foo:bar,baz:42,qux:nice"));

    console.log(shoppingList("4 peppers, 3 oats, 2 onions, 18 tomatoes"));

    console.log(mapObject({ a: 42, b: 99 }, (n) => n / 2));
    console.log(mapObject({ shout: 'hey u good?', yell: 'yeah just grand thanks' }, (s) => s.toUpperCase() ));
*/

    const squarifyElement = document.getElementById('squarify');

    squarifyElement.addEventListener('input', makeGallerySquare);

    //makeGallerySquare();


} // end of function windowLoaded