1. What is the difference between getElementById, getElementsByClassName, and querySelector / querySelectorAll?

getElementById("idName")

Selects one element only by its unique id.

Returns a single element (or null if not found).

Example:document.getElementById("title");

getElementsByClassName("className")

Selects all elements that share the same class.

Returns an HTMLCollection (like an array, but not exactly).

Example:document.getElementsByClassName("box");
querySelector("CSS selector")

Selects the first element that matches a CSS selector.

Very flexible (can select by id, class, tag, attribute, etc.).

Example:document.querySelectorAll("p");
querySelectorAll("CSS selector")

Selects all elements that match a CSS selector.

Returns a NodeList (array-like and can use forEach).

Example:document.querySelectorAll("p");

2. How do you create and insert a new element into the DOM?

To create and insert a new element into the DOM, you can follow these steps:

Create a new element – First, make the element you want (such as a div, p, or li).

Add content or attributes – Give it text, classes, an id, or any other properties you need.

Select the parent element – Choose the place in the DOM where the new element will be added.

Insert the element – Place it inside the parent using one of these methods:

Add at the end (append).

Add at the beginning (prepend).

Insert before a specific element (insert before).

3. What is Event Bubbling and how does it work?

Event Bubbling means that when an event happens on an element, it first runs the handlers on that element, then “bubbles up” to its parent, then to the grandparent, and so on, until it reaches the root (document).

Example: Clicking a button inside a <div> will trigger the button’s click handler, then the <div>’s click handler, and so on.

This allows parent elements to listen for events from their child elements without attaching handlers to every child.

4. What is Event Delegation in JavaScript? Why is it useful?

Event Delegation is a technique where instead of adding an event listener to many child elements, you add a single listener to a parent element and use event bubbling to catch events from children.

Inside the handler, you check which child triggered the event using event.target.

Example:document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("You clicked:", e.target.textContent);
  }
});

5. What is the difference between preventDefault() and stopPropagation() methods?

preventDefault()

Prevents the default browser action for an event.

Example: Stops a link from navigating, stops a form from submitting.

Example:document.querySelector("a").addEventListener("click", (e) => {
  e.preventDefault(); // stops the link from opening
});
stopPropagation()

Prevents the event from bubbling up (or capturing down) to parent elements.

Example:button.addEventListener("click", (e) => {
  e.stopPropagation(); // parent won't hear this click
});
