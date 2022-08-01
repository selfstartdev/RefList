import objectPath from 'object-path';

import {
    StringOrNumber,
    ListNode,
    FilterFn,
    IteratorFn,
    ComparatorFn,
} from '../types/types';

import add from './methods/add';
import deleteNode from './methods/delete';

export class RefList<KeyType extends StringOrNumber, DataType extends Object> {
    private readonly _keyPath: string;

    private _head: KeyType;
    private _tail: KeyType;
    private _size: number = 0;
    private _nodes: Record<KeyType, ListNode<KeyType, DataType>> = {} as Record<KeyType, ListNode<KeyType, DataType>>;

    constructor(keyPath: string, dataArray: DataType[] | RefList<KeyType, DataType> = []) {
        this._keyPath = keyPath;

        dataArray.forEach((item: DataType) => this.add(item));
    }

    /** Getters and Setters */

    public get keyPath(): string {
        return this._keyPath;
    }

    public get head(): KeyType {
        return this._head;
    }

    private set head(newHead: KeyType) {
        this._head = newHead;
    }

    public get tail(): KeyType {
        return this._tail;
    }

    private set tail(newTail: KeyType) {
        this._tail = newTail;
    }

    public get size(): number {
        return this._size;
    }

    private set size(newSize: number) {
        this._size = newSize;
    }

    public get nodes(): Record<KeyType, ListNode<KeyType, DataType>> {
        return this._nodes;
    }

    private set nodes(newNodes: Record<KeyType, ListNode<KeyType, DataType>>) {
        this._nodes = newNodes;
    }

    /** Chain-able Methods */

    add = add<KeyType, DataType>.bind(this);
    delete = deleteNode<KeyType, DataType>.bind(this);

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

        if (node.next) {
            this.update(node.next, {prev: newItemId});
        } else {
            this.tail = newItemId;
        }

        this.update(nodeKey, { next: newItemId });

        this.size++;

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

        if (node.prev) {
            this.update(node.prev, { next: newItemId });
        } else {
            this.head = newItemId;
        }

        this.update(nodeKey, { prev: newItemId });

        this.size++;

        return this;
    }

    addAt(index: number, item: DataType): RefList<KeyType, DataType> {
        const prevNode = this.at(index);

        this.addAfter(this.getIdOfItem(prevNode), item);

        return this;
    }

    slice(start: number, end: number = this.size): RefList<KeyType, DataType> {
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

    splice(start: number, end: number = this.size): RefList<KeyType, DataType> {
        let currentNode = this.at(0);
        let i = 0;

        while (currentNode) {
            if ((i < start || i >= end)) {
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

    /** non-Chain-able methods */

    get(nodeKey: KeyType): ListNode<KeyType, DataType> {
        return this.nodes[nodeKey];
    }

    getHead(): ListNode<KeyType, DataType> {
        return this.get(this.head);
    }

    getTail(): ListNode<KeyType, DataType> {
        return this.get(this.tail);
    }

    at(index: number): ListNode<KeyType, DataType> {
        let currentNode = this.nodes[this.head];
        for (let i = 0; i <= index; i++) {
            if (i === index) {
                return currentNode;
            }

            currentNode = this.nodes[currentNode.next];
        }
    }

    getIdOfItem(item: DataType): KeyType {
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

    /** Sort Management Methods */

    /**
     * Employs a merge sort operation on a list
     */
    sort(compareFn: ComparatorFn<DataType>): RefList<KeyType, DataType> {
        const sortedList = this._handleSort(compareFn, this);

        this.nodes = sortedList.nodes;
        this.head = sortedList.head;
        this.tail = sortedList.tail;

        return this;
    }

    _handleSort(compareFn: ComparatorFn<DataType>, list: RefList<KeyType, DataType> = this): RefList<KeyType, DataType> {
        if (list.size <= 1) {
            return list;
        }

        const middle = Math.floor(list.size / 2);
        const leftList = list.slice(0, middle);
        const rightList = list.slice(middle);

        return this.merge(
            compareFn,
            this._handleSort(compareFn, leftList),
            this._handleSort(compareFn, rightList)
        );
    }

    merge(compareFn: ComparatorFn<DataType>,
          leftList: RefList<KeyType, DataType>,
          rightList: RefList<KeyType, DataType>): RefList<KeyType, DataType> {
        let result = new RefList<KeyType, DataType>(this.keyPath),
            indexLeft = 0,
            indexRight = 0;

        while (indexLeft < leftList.size && indexRight < rightList.size) {
            let leftNode = leftList.at(indexLeft),
                rightNode = rightList.at(indexRight);
            if(compareFn(leftNode, rightNode)) {
                result.add(leftNode);
                indexLeft++;
            } else {
                result.add(rightNode);
                indexRight++;
            }
        }

        return result.concat(leftList.slice(indexLeft)).concat(rightList.slice(indexRight));
    }

    mergeAndSort(compareFn: ComparatorFn<DataType>, list: RefList<KeyType, DataType> | DataType[]): RefList<KeyType, DataType> {
        return this.concat(list).sort(compareFn);
    }
}

