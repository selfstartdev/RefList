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

list.add({ name: 'purple', value: '#f0f' });
```
