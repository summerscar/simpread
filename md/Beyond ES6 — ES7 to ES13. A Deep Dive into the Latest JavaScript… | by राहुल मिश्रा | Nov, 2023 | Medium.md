> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [rahuulmiishra.medium.com](https://rahuulmiishra.medium.com/beyond-es6-es7-to-es13-3f98f6202fd2)

> A Deep Dive into the Latest JavaScript Features (ES7 to ES13)

A Deep Dive into the Latest JavaScript Features (ES7 to ES13)
-------------------------------------------------------------

[

![](https://miro.medium.com/v2/resize:fill:88:88/1*xhr7DXoeBh9weQkRyNDBHA.jpeg)

](https://rahuulmiishra.medium.com/?source=post_page-----3f98f6202fd2--------------------------------)![](https://miro.medium.com/v2/resize:fit:1400/1*nJ20pBWM_pUaF32ybCsERw.png)

1. Exponentiation Operator
--------------------------

It returns the first argument raised to the power of the second argument. Does the same thing as Math.pow()

```
2 ** 3 = 8

5 **

 4 = 625

```

2. Array.prototype.includes()
-----------------------------

Use to check if particular value exists in array or not. Return `true` if match found, otherwise returns `false` .

```
["a", "b", "c"].includes("a"); 
["a", "b", "c"].includes("g"); 
["ab", "b", "c"].includes("a"); 

```

3. Trailing Commas in Function Parameters
-----------------------------------------

In arrays we can have a trailing comma like [1,2,]. just to make uniformity, no we can have trailing comman in function parameters and arguments.

```
const test = (x,y,z,)=> console.log(x,y,z)
test(0,1,2)    

```

1. Async Functions
------------------

We can add `async` keyword before function to make then asynchronous. And then we can use `await` keyword inside it.

By using `async await` , we can make our code look like synchronous.

```
async function test() {
    const result = await fetch();
}

```

2. padStart and padEnd
----------------------

We can add any character at start of string and end of string, to make string of specific length.

```
const str = "hello";

```

```
str.padStart(10); // "     hello"str.padEnd(10); // "hello     "str.padStart(10, "*"); // "*****hello"str.padEnd(10, "$"); // "hello*****""2".padStart(2, "0"); // 02

```

3. Object.entries()
-------------------

It accepts a object, and returns an array container array (tuples). Where at 0 index Object Key will be there and at index 1, corresponding value will be there.

```
const obj = {name:'JS', lib: 'React'};

console.log(Object.entries(obj));

[ ['name', 'JS'] ,  ['lib', 'React'] ] 

```

4. Object.values()
------------------

It accepts a object, and returns an array containing only the values inside object, separated by comma.

```
const obj = {name:'JS', lib: 'React'};

console.log(Object.values(obj));

['JS', 'React'] 

```

5. **Object.getOwnPropertyDescriptors()**
-----------------------------------------

It takes object as argument, and returns an object, which contains all the property description information about the keys, in passed object.

```
const obj = {name:'JS', lib: 'React'};
Object.getOwnPropertyDescriptors(obj)

```

![](https://miro.medium.com/v2/resize:fit:1112/1*5IMvKICz9_sbliLYLbCSnw@2x.png)

**Asynchronous Iteration**
--------------------------

```
function fetcher(task,time) {
    return new Promise(function(res) {
        setTimeout(function() {
            res(`${task} Done`);
        }, time);
    })
}

const tasks = [1,2,3,4].map(d => {
    return fetcher(d, 1000* d);
});

(async () => {
    for await (const value of tasks) {
      console.log(value);
    }
  })();

```

**Promise.prototype.finally()**
-------------------------------

Promises now have a finally block, which will be exuected after `then` or `catch` block.  
If we have any task that needs to be done in both `then` and `catch` block, we can now simply do that in `finally` block.

For example: Hiding the loader.

```
task().then().catch().finally();

```

`1. Array.prototype.flat()`
---------------------------

The `flat()` method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth. If no depth is provided, it defaults to 1.

```
const nestedArray = [1, [2, [3, 4, [5]]]];

const flatArray = nestedArray.flat();

console.log(flatArray); 


const deeplyFlatArray = nestedArray.flat(2);

console.log(deeplyFlatArray); 

```

`2. Array.prototype.flatMap()`
------------------------------

The `flatMap()` method first maps each element using a mapping function, then flattens the result into a new array. It is essentially a combination of `map()` and `flat()`.

```
const array = [1, 2, 3, 4];

const doubledAndFlattened = array.flatMap(num => [num * 2]);

console.log(doubledAndFlattened); 

```

The power of `flatMap()` becomes more evident when dealing with arrays of objects:

```
const people = [
  { name: 'John', hobbies: ['reading', 'coding'] },
  { name: 'Alice', hobbies: ['music', 'painting'] }
];

const allHobbies = people.flatMap(person => person.hobbies);

console.log(allHobbies); 

```

Here, `flatMap()` is used to extract all hobbies from an array of objects, resulting in a flat array of hobbies.

Both `flat()` and `flatMap()` provide convenient ways to work with nested arrays and simplify the code for array transformations.

3. Object.fromEntries()
-----------------------

Transforms a list of key-value pairs into an object

```
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'New York']
];

const personObject = Object.fromEntries(entries);

console.log(personObject);


```

**4. String.prototype.trimStart()**
-----------------------------------

The `trimStart()` method removes whitespace characters from the beginning (start) of a string and returns the resulting string.

```
const stringWithWhitespace = "   Hello, world!   ";

const trimmedStart = stringWithWhitespace.trimStart();

console.log(trimmedStart);


```

5. String.prototype.trimEnd()
-----------------------------

The `trimEnd()` method removes whitespace characters from the end of a string and returns the resulting string.

```
const stringWithWhitespace = "   Hello, world!   ";

const trimmedEnd = stringWithWhitespace.trimEnd();

console.log(trimmedEnd);


```

**6. Symbol.prototype.description**
-----------------------------------

*   read-only property
*   It returns a string that provides a description of the symbol. This description is the one that was provided when the symbol was created.

```
const mySymbol = Symbol('This is a custom symbol');


const symbolDescription = mySymbol.description;

console.log(symbolDescription);


```

if no description was provided when creating the symbol, or if the symbol was created before the `description` property was introduced, the result will be `undefined`.

```
const anotherSymbol = Symbol();


const anotherSymbolDescription = anotherSymbol.description;

console.log(anotherSymbolDescription);


```

This property is useful when you want to associate additional information or metadata with a symbol, making it more human-readable or providing context about its purpose. It’s important to use the `description` property judiciously, as it's mainly intended for debugging and development purposes and not for critical program logic.

1. Private Class Variables
--------------------------

with use of `**#**` we can now have private variables inside class.

```
class Person {
    #name = 'JS';

    getName() {
        return this.#name;
    }
}

const person = new Person();

console.log(person.getName()); 


```

**2. Static Fields**
--------------------

```
class Person {
    static name = 'JS';

    getName() {
        return Person.name;
    }
}

const person = new Person();

console.log(person.getName()); 
console.log(Person.name);

```

2. Promise.allSettled
---------------------

used to handle multiple promises concurrently. Unlike `Promise.all`, which rejects immediately if any promise in the array rejects, `Promise.allSettled` waits for all promises to either fulfill or reject before resolving. This makes it useful when you want to know the result of all promises, regardless of whether they fulfilled or rejected.

Returns an array of result for each rejected and resolved promise.

```
const promises = [
  Promise.resolve('Resolved Promise 1'),
  Promise.reject('Rejected Promise 2'),
  Promise.resolve('Resolved Promise 3'),
];

Promise.allSettled(promises)
  .then((results) => {
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        console.log('Fulfilled:', result.value);
      } else if (result.status === 'rejected') {
        console.log('Rejected:', result.reason);
      }
    });
  })
  .catch((error) => {
    console.error('Error in Promise.allSettled:', error);
  });

```

3. Optional Chaining Operator
-----------------------------

Used for dealing with situations where you want to access properties or call methods on nested objects, but you’re not sure if the intermediate properties or objects exist. It helps to avoid `TypeError` errors that might occur when trying to access properties or methods on `null` or `undefined`.

**Syntax**

```
object?.property
object?.method()
object?.[expression]

```

```
const user = {
  id: 1,
  name: 'John',
  address: {
    city: 'New York',
    postalCode: '10001',
  },
};


const postalCodeWithoutOptionalChaining = user.address.postalCode; 


const postalCodeWithOptionalChaining = user.address?.postalCode; 

console.log(postalCodeWithoutOptionalChaining); 
console.log(postalCodeWithOptionalChaining); 

```

4. Nullish Coalescing
---------------------

It provides a concise way to handle default values in situations where `null` or `undefined` are considered falsy values.

```
const result = valueToCheck ?? defaultValue;

```

The `??` operator returns the right-hand operand (`defaultValue`) when the left-hand operand (`valueToCheck`) is `null` or `undefined`. Otherwise, it returns the left-hand operand.

Consider a scenario where you want to assign a default value to a variable only if the current value is `null` or `undefined`

```
let userInput = null; 

let username = userInput !== null && userInput !== undefined ? userInput : 'Guest';

console.log(username); 


let userInput = null;

let username = userInput ?? 'Guest';

console.log(username); 

```

5. Dynamic Import
-----------------

Dynamic import is a feature in JavaScript that allows you to import modules conditionally or on-demand during runtime. It is implemented using the `import()` function, which returns a Promise that resolves to the module namespace object.

Here’s an example of dynamic import:

```
const mathModulePromise = import('./mathFunctions');


mathModulePromise.then((mathModule) => {
  const result1 = mathModule.add(5, 3);
  const result2 = mathModule.subtract(8, 4);

  console.log('Result of addition:', result1);
  console.log('Result of subtraction:', result2);
})
.catch((error) => {
  console.error('Error during dynamic import:', error);
});

```

In this example:

1.  The `import('./mathFunctions')` statement is used to dynamically import the module named 'mathFunctions'. The path provided to `import()` is relative to the location of the module importing it.
2.  The result is a Promise (`mathModulePromise`) that resolves to the module namespace object when the module is successfully loaded.
3.  The `then` block is executed when the module is successfully imported, and you can then use the functions or variables defined in the imported module.

This feature is particularly useful when you want to load modules conditionally or when you only need them in specific parts of your code. It can help improve performance by deferring the loading of certain modules until they are actually needed.

6. BigInt
---------

data type that allows you to work with very large integers beyond the limits of the standard `Number` type. It is useful when you need to represent and perform operations on integers that are larger than what can be accurately represented with regular JavaScript numbers.

```
const regularNumber = 9007199254740991;
console.log(regularNumber + 1); 

const beyondLimit = 9007199254740992;
console.log(beyondLimit + 1); 


const bigIntNumber = BigInt(9007199254740991);
console.log(bigIntNumber + BigInt(1)); 

const beyondLimitBigInt = BigInt(9007199254740992);
console.log(beyondLimitBigInt + BigInt(1)); 

```

7. globalThis
-------------

`globalThis` is a JavaScript global object that provides a standardized way to access the global object in any environment (including browsers and Node.js). The specific global object varies depending on the context in which the JavaScript code is running:

*   In a browser environment, the global object is `window`.
*   In a Node.js environment, the global object is `global`.

`globalThis` provides a consistent way to access the global object across different JavaScript environments, making code more portable and avoiding environment-specific code.

Here’s an example to illustrate its usage:

```
console.log(globalThis === window); 


console.log(globalThis === global); 

```

By using `globalThis`, you can write code that works across different environments without explicitly referring to `window` or `global`. This can be especially useful in scenarios where your code needs to run in various contexts, such as shared libraries or modules that may be used in both browser and server-side environments.

```
globalThis.setTimeout(() => {
  console.log('Timeout completed!');
}, 1000);

```

This usage ensures that the `setTimeout` function is accessed from the global object, regardless of the environment, making the code more portable.

1. String.prototype.replaceAll()
--------------------------------

replaceAll method on string replaces all occurrence of particular string with passed string.  
It returns a new string, it does not modify the original string.

```
const str = "hello there, hello mr, hello how?";
const newStr = str.replaceAll("hello", "bye");

console.log(newStr); 

```

2. Promise.any
--------------

It takes an iterable of Promises and returns a single Promise. This new Promise is fulfilled with the value of the first fulfilled Promise from the iterable.

If any promise get rejected in between, if waits for other promises to get resolve.

If all Promises in the iterable are rejected, it returns a single rejected Promise with an `AggregateError` containing an array of rejection reasons.

```
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Promise 1 resolved'), 1000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => reject('Promise 2 rejected'), 500);
});

const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Promise 3 resolved'), 1500);
});

Promise.any([promise1, promise2, promise3])
  .then(result => {
    console.log('Fulfilled:', result);
  })
  .catch(error => {
    console.log('Rejected:', error);
  });

```

In this example, `Promise.any()` is used to handle an array of three Promises. `promise1` and `promise3` will be resolved, but `promise2` will be rejected. Since `Promise.any()` returns a Promise that is fulfilled with the value of the first fulfilled Promise, it will log `'Fulfilled: Promise 1 resolved'` to the console.

**3. WeakRef**
--------------

In JavaScript, a `WeakRef` is an object that holds a weak reference to another object. A weak reference is a reference that does not prevent the object it references from being garbage-collected. This is in contrast to a strong reference, which keeps an object alive as long as the reference exists.

it provides a way to create weak references in JavaScript. The primary use case for `WeakRef` is to avoid memory leaks by allowing objects to be garbage-collected when they are no longer in use.

```
const obj = { data: 'example' };
const weakRef = new WeakRef(obj);

const objFromWeakRef = weakRef.deref();
console.log(objFromWeakRef); 

```

Example with Garbage Collection

```
let weakRef;

{
  const localObj = { data: 'local' };
  weakRef = new WeakRef(localObj);
}

const retrievedObj = weakRef.deref();
console.log(retrievedObj); 

```

4. `&&=`, `||=` and `??=`
-------------------------

`&&= (Logical AND Assignment)`
------------------------------

This operator assigns the right operand to the left operand if the left operand is truthy.

```
let x = 5;
let y = 10;

x &&= y;

console.log(x); 

```

`||= (Logical OR Assignment)`
-----------------------------

This operator assigns the right operand to the left operand if the left operand is falsy.

```
let a = 0;
let b = 20;

a ||= b;

console.log(a); 

```

`??= (Nullish Coalescing Assignment)`
-------------------------------------

This operator assigns the right operand to the left operand if the left operand is `null` or `undefined`, but not for other falsy values.

```
let p = null;
let q = 42;

p ??= q;

console.log(p); 

```

5. Numeric separators
---------------------

It allow you to use underscores (_) as separators within numeric literals to improve readability. This feature is particularly useful when dealing with large numbers.

```
const billionWithSeparators = 1_000_000_000; 
const trillionWithSeparators = 1_000_000_000_000; 


const invalid1 = 1_000_; 
const invalid2 = _1000; 
const invalid3 = 1.0_0; 
const invalid4 = 0x_1A; 

```

1. Top-level await
------------------

Top-level `await` is a feature in JavaScript that allows you to use the `await` keyword at the top level of your modules. Traditionally, the `await` keyword could only be used inside an `async` function, but with top-level `await`, you can use it directly at the top level of your module.

```


const result = await fetchData();

console.log(result);

```

It’s important to note that top-level `await` is only allowed at the top level of modules. **If you try to use it in other contexts, such as in a regular script, it will result in a syntax error.**

```
const result = await fetchData();

```

`2. at()` method for `Strings`, `Arrays`
----------------------------------------

It allows you to access the character at a specified index in a String or the element at a specified index in an Array.

The key feature of `at()` is that _it supports negative indices_, making it easier to access elements from the end of the String or Array.

```
const str = 'Hello, World!';

console.log(str.at(1));     
console.log(str.at(-1));    
console.log(str.at(1000));  

const arr = ['apple', 'banana', 'orange'];

console.log(arr.at(0));    
console.log(arr.at(-1));   
console.log(arr.at(5));    

```

`3. Object.hasOwn` Method
-------------------------

Previously we had two methods to check if a property exists in object or not.  
Obj.hasOwnProperty() and in operator.  
But both of these methods has some downside.

**Downside of hasOwnProperty**

1.  The `Object.prototype.hasOwnProperty()` method is not safeguarded; it can be redefined by creating a custom `hasOwnProperty()` method within a class, potentially leading to entirely different functionality compared to `Object.prototype.hasOwnProperty()`.

```
class Vehicle {
  model = 'sedan';
  year = 2022;

  
  
  hasOwnProperty() {
    return true; 
  }
}

const vehicle = new Vehicle();

console.log(vehicle.hasOwnProperty('year')); 
console.log(vehicle.hasOwnProperty('type')); 

```

2. Another concern arises when dealing with objects created with a null prototype, such as those generated using Object.create(null). Attempting to invoke this method on such objects may result in an error.

```
const customObject = Object.create(null);
customObject.type = 'vehicle';
customObject.year = 2022;


console.log(customObject.hasOwnProperty('type'));

```

**Downside of in operator**

The `in` operator checks for the existence of a property not only in the object itself but also in its prototype chain. This might lead to unexpected results if you're not careful, especially when dealing with inherited properties.

```
const parentObject = { sharedProperty: 'I am shared' };
const childObject = Object.create(parentObject);

console.log('sharedProperty' in childObject); 

```

We can use `hasOwn` method to resolve such issues.

```
const customObject = Object.create(null);
customObject.type = 'vehicle';
customObject.year = 2022;
customObject.hasOwnProperty = () => true; 

console.log(Object.hasOwn(customObject, 'type')); 
console.log(Object.hasOwn(customObject, 'brand')); 

```

`4. RegExp` match indices
-------------------------

This new functionality enables us to explicitly request both the starting and ending indices of matches for a RegExp object within a specified string.

In the past, obtaining the starting index of a regex match within a string was the only option available.

```
const str = 'jack and jill';

const regex = /and/;

const matchObj = regex.exec(str);


console.log(matchObj);

```

In ECMAScript 2023 (ES13), it is now possible to use a `d` regex flag to obtain both the starting and ending indices of a match.

```
const str = 'jack and jill';

const regex = /and/d;

const matchObj = regex.exec(str);


console.log(matchObj);

```

When the `d` flag is enabled, the returned object will include an `indices` property, encompassing both the starting and ending indices.

5. Class Field Declarations
---------------------------

Before ES13, class fields could only be declared in the constructor. Unlike in many other languages, we could not declare or define them in the outermost scope of the class.

```
class Car {
  constructor() {
    this.color = 'blue';
    this.age = 2;
  }
}

const car = new Car();
console.log(car.color); 
console.log(car.age); 

```

ES2022 removes this limitation. Now we can write code like this:

```
class Car {
  color = 'blue';
  age = 2;
}

const car = new Car();
console.log(car.color); 
console.log(car.age); 

```

6. Class static Block
---------------------

ES13 allows the definition of `static` blocks that will be executed only once, at the creation of the **class**. This is similar to static constructors in other languages with support for object-oriented programming, like C# and Java.

A class can have any number of `static {}` initialization blocks in its class body. They will be executed, along with any interleaved static field initializers, in the order they are declared. We can use the `super` property in a `static` block to access properties of the super class.

```
class Vehicle {
  static defaultColor = 'blue';
}

class Car extends Vehicle {
  static colors = [];
  static {
    this.colors.push(super.defaultColor, 'red');
  }
  static {
    this.colors.push('green');
  }
}
console.log(Car.colors); 

```

7. Ergonomic Brand Checks for Private Fields
--------------------------------------------

We can use this new ES2022 feature to check if an object has a particular private field in it, using the `in` operator.

```
class Car {
  #color; 

    hasColor() {
    return #color in this;
  }
}

const car = new Car();
console.log(car.hasColor()); 

```

The `in` operator is able to correctly distinguish private fields with the same names from different classes:

```
class Car {
#color;
hasColor() {
    return #color in this;
  }
}

class House {
  #color;
  hasColor() {
    return #color in this;
  }
}

const car = new Car();
const house = new House();

console.log(car.hasColor()); 
console.log(car.hasColor.call(house)); 

console.log(house.hasColor()); 
console.log(house.hasColor.call(car)); 

```

8. Error Cause
--------------

The `cause` data property of an `[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)` instance indicates the specific original cause of the error.

It is used when catching and re-throwing an error with a more-specific or useful error message in order to still have access to the original error.

Useful when we have nested blocks, and we want to distinguish between between which error we have thrown, we can simply check error.cause property

```
try {
  connectToDatabase();
} catch (err) {
  throw new Error("Connecting to database failed.", { cause: err });
}

```

9. Array Find from Last
-----------------------

The `findLast()` method of `[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)` instances iterates the array in reverse order and returns the value of the first element that satisfies the provided testing function. If no elements satisfy the testing function, `[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)` is returned.

```
const array1 = [5, 12, 50, 130, 44];

const found = array1.findLast((element) => element > 45);

console.log(found);


```

The `findLastIndex()` method of `[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)` instances iterates the array in reverse order and returns the index of the first element that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.

```
const array1 = [5, 12, 50, 130, 44];

const isLargeNumber = (element) => element > 45;

console.log(array1.findLastIndex(isLargeNumber));



```