import objectPath from 'object-path';

import {
    StringOrNumber,
    IListState,
    ListNode,
    FilterFn,
    IteratorFn,
    ComparatorFn,
} from '../types/types';

export class RefList<KeyType extends StringOrNumber, DataType extends Object> implements IListState<KeyType, DataType> {
    readonly keyPath: string;

    head: KeyType;
    tail: KeyType;
    size: number = 0;
    nodes: Record<KeyType, ListNode<KeyType, DataType>> = {} as Record<KeyType, ListNode<KeyType, DataType>>;

    constructor(keyPath: string, dataArray: DataType[] = []) {
        this.keyPath = keyPath;

        dataArray.forEach((item: DataType) => this.add(item));
    }

    /** Curry-able Methods */

    add(item: DataType): RefList<KeyType, DataType> {
        const itemId = this.getIdOfItem(item);

        let newNode = {
            ...item,
            prev: this.tail || null,
            next: null
        };

        /** If head is not initialized, initialize head */
        if (!this.head) {
            this.head = itemId;
        }

        /**
         *  If tail exists, add next param to node
         */
        if (this.tail) {
            this.update(this.tail, { next: itemId} );
        }

        this.tail = itemId;

        this.nodes[itemId] = newNode;

        this.size++;

        return this;
    }

    delete(nodeKey: KeyType): RefList<KeyType, DataType> {
        const node = this.nodes[nodeKey];

        if (node.prev) {
            this.update(node.prev, {
                next: node.next
            });

            if (nodeKey === this.tail) {
                this.tail = node.prev;
            }
        }

        if (node.next) {
            this.update(node.next, {
                prev: node.prev
            });

            if (nodeKey === this.head) {
                this.head = node.next;
            }
        }

        this.size--;
        delete this.nodes[nodeKey];

        return this;
    }

    update(nodeKey: KeyType, updated: Object): RefList<KeyType, DataType> {
        for (let key in updated) {
            this.nodes[nodeKey][key] = updated[key];
        }

        return this;
    }

    addAfter(nodeKey: KeyType, item: DataType): RefList<KeyType, DataType> {
        const node = this.nodes[nodeKey];
        const newItemId = this.getIdOfItem(item);

        this.nodes[newItemId] = {
            prev: nodeKey,
            next: node.next || null,
            ...item
        };

        this.update(node.next, { prev: newItemId });
        this.update(nodeKey, { next: newItemId });

        return this;
    }

    addBefore(nodeKey: KeyType, item: DataType): RefList<KeyType, DataType> {
        const node = this.nodes[nodeKey];
        const newItemId = this.getIdOfItem(item);

        this.nodes[newItemId] = {
            next: nodeKey,
            prev: node.prev || null,
            ...item
        };

        this.update(node.prev, { next: newItemId });
        this.update(nodeKey, { prev: newItemId });

        return this;
    }


    /** non-curryable methods */
    at(index: number): ListNode<KeyType, DataType> {
        let currentNode = this.nodes[this.head];
        for (let i = 0; i <= index; i++) {
            if (i === index) {
                return currentNode;
            }

            currentNode = this.nodes[currentNode.next];
        }
    }

    addAt(index: number, item: DataType): RefList<KeyType, DataType> {
        const prevNode = this.at(index);

        this.addAfter(this.getIdOfItem(prevNode), item);

        return this;
    }

    /** Helper Methods */

    getIdOfItem(item: DataType) {
        return objectPath.get(item, this.keyPath);
    }

    toArray(): DataType[] {
        let currentNode = this.nodes[this.head];
        const dataArray = [];

        while (currentNode) {
            let dataToPush = { ...currentNode };
            delete dataToPush.next;
            delete dataToPush.prev;
            dataArray.push(dataToPush);
            currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
        }

        return dataArray;
    }

    slice(start: number, end: number): RefList<KeyType, DataType> {
        const slicedList = new RefList<KeyType, DataType>(this.keyPath, []);
        let remainingNodes = end - start;
        let currentNode = this.at(start);

        while (currentNode && remainingNodes) {
            slicedList.add(currentNode);
            currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
            remainingNodes--;
        }

        return slicedList;
    }

    splice(start: number, end: number): RefList<KeyType, DataType> {
        let currentNode = this.at(0);
        let i = 0;

        while (currentNode) {
            if (i < start || i >= end) {
                this.delete(this.getIdOfItem(currentNode));
            }

            currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
            i++;
        }

        return this;
    }

    filter(fn: FilterFn<DataType>): RefList<KeyType, DataType> {
        let currentNode = this.nodes[this.head];

        while (currentNode) {
            if (!fn(currentNode)) {
                this.delete(this.getIdOfItem(currentNode));
            }

            currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
        }

        return this;
    }

    forEach(fn: IteratorFn<DataType>): RefList<KeyType, DataType> {
        let currentNode = this.nodes[this.head];
        let index = 0;

        while (currentNode) {
            fn(currentNode, index);
            currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
            index++;
        }

        return this;
    }

    concat(data: RefList<KeyType, DataType> | DataType[]): RefList<KeyType, DataType> {
        data.forEach((item) => {
            this.add(item);
        });

        return this;
    }

    mergeSort(compFn: ComparatorFn<DataType>): RefList<KeyType, DataType> {
        return this._divideMergeSort(this, compFn);
    }

    _divideMergeSort(list: RefList<KeyType, DataType>, compFn: ComparatorFn<DataType>): RefList<KeyType, DataType> {
        const halfLength = Math.ceil(list.size / 2);
        let leftList = list.slice(0, halfLength);
        let rightList = list.slice(halfLength, list.size - 1);

        console.log('dividing:', list);

        if (halfLength > 1) {
            leftList = this._divideMergeSort(leftList, compFn);
            rightList = this._divideMergeSort(rightList, compFn);
        }

        return this._combineMergeSort(leftList, rightList, compFn);
    }

    _combineMergeSort(leftList: RefList<KeyType, DataType>,
                      rightList: RefList<KeyType, DataType>,
                      compFn: ComparatorFn<DataType>): RefList<KeyType, DataType> {
        let leftIndex = 0,
            rightIndex = 0,
            leftSize = leftList.size,
            rightSize = rightList.size,
            combinedList = new RefList<KeyType, DataType>(this.keyPath);

        while (leftIndex < leftSize || rightIndex < rightSize) {
            let leftItem = leftList[leftIndex],
                rightItem = rightList[rightIndex];

            if (leftItem !== undefined) {
                if (rightItem === undefined) {
                    combinedList.add(leftItem);
                    leftIndex++;
                } else {
                    if (compFn(leftItem, rightItem)) {
                        combinedList.add(leftItem);
                        leftIndex++;
                    } else {
                        combinedList.add(rightItem);
                        rightIndex++;
                    }
                }
            } else {
                if (rightItem !== undefined) {
                    combinedList.add(rightItem);
                    rightIndex++;
                }
            }
        }

        return combinedList;
    }

}

