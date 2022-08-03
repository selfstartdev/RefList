# RefList

[![npm version](https://badge.fury.io/js/reflist.svg)](https://badge.fury.io/js/reflist)
![GitHub Build](https://github.com/selfstartdev/reflist/actions/workflows/ci-build.yml/badge.svg)
[![codecov](https://codecov.io/gh/selfstartdev/RefList/branch/main/graph/badge.svg?token=7TZ2A2F52Y)](https://codecov.io/gh/selfstartdev/RefList)

RefList is a lightweight, reference-based implementation of a [Doubly Linked List](https://en.wikipedia.org/wiki/Doubly_linked_list). It's meant to be used as a "ready to use" solution for problems where a list data-structure would be useful. This package includes robust type-support, so should allow you to utilize any object-type you'd like for the linked list. 

### Install Instructions

Run the following command to add RefList to your project:

```
npm install reflist --save
```

Then, in your project, simply `import` the package wherever it's needed:
```typescript
import { RefList } from 'reflist';
```
**Note**: If you're not using typescript, you still should be able to import this package into your JS project. However, the primary support for this package is TypeScript, and imports to ESX projects are not actively supported.

### Implementation
Since RefList supports strong typing, it's recommended to pass in proper types so that the package knows what to do with the objects you pass it. 

```typescript
import { RefList } from 'reflist';

type Color = {
    name: string,
    value: string
};

const colors: Color[] = [{
    name: "red",
    value: "#f00"
},
    {
        name: "green",
        value: "#0f0"
    },
    {
        name: "blue",
        value: "#00f"
    }];

/**
 * RefList Takes two typeParams, a KeyType and a DataType.
 * The KeyType refers to string or number, depending on how
 * you'd like to index your list. The DataType refers to the
 * type that the data the list.
 */
const list = new RefList<string, Color>('name', colors);

/**
 * Given the above approach, you can then implement any
 * of the following methods of the RefList
 */

/**
 * The following methods return the instance (or an instance) of
 * RefList, and therefore you can chain the following methods.
 */

// appends item to end of list
list.add({ name: 'purple', value: '#f0f' });

// deletes item with given id
list.delete('purple');

// update item with given id, based on object with
// values to change
list.update('purple', { value: '#000' });

// add item to list after node with given id
list.addAfter('purple', { name: 'orange', value: 'orange'});

// add item to list before node with given id
list.addBefore('purple', { name: 'fuchsia', value: 'fuchsia'});

// add item at the index position given
list.addAt(4, { name: 'lavender', value: 'lavender' });

// same implementation as Array.slice
// returns a new list, does not alter original list
list.slice(0, 2);

// similar to Array.splice, alters the original list and returns it
list.splice(0, 3);

// takes a function that returns a bool, if bool returned is false, returns
// new list that has those items missing
list.filter((a, i) => a.color);

// takes a function that will run once for each item in the list
list.forEach((a, i) => console.log(a, i));

// adds the given list (or array) to the end of the current list
// returns the current list newly updated;
list.concat(new RefList('color', [ {
    color: 'burgundy',
    value: 'burgundy'
} ]));

/**
 * The following items are not chain-able, they return various other
 * value types
 */

//returns list-node with id of purple
list.get('purple');

//returns the list node that matches the head
list.getHead();

//returns the list node that matches the head
list.getTail();

// returns the list node at the given position
list.at(1);

// gets the id field of a given list-node (can also be used on raw datatype)
list.getIdOfItem(list.at(5));

// returns an array that matches position of the items
list.toArray();

// implements a merge sort in O(log(n) * n) time complexity
// takes a sort function which should return a bool depending on if a
// should be in front of b
list.sort((a, b) => a.color < b.color);

// same as the above, but takes a second param of an array or list to
// concat to the current list before sorting
list.mergeAndSort((a, b) => a.color < b.color, []);

```
