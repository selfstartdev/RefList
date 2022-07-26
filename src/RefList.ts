import {
    StringOrNumber,
    ListNode,
    ComparatorFn,
    IMappedList,
} from '../types/types';

import add from './methods/add';
import deleteNode from './methods/delete';
import update from './methods/update';
import addAfter from './methods/addAfter';
import addBefore from './methods/addBefore';
import addAt from './methods/addAt';
import slice from './methods/slice';
import splice from './methods/splice';
import filter from './methods/filter';
import forEach from './methods/forEach';
import concat from './methods/concat';
import get from './methods/get';
import getHead from './methods/getHead';
import getTail from './methods/getTail';
import at from './methods/at';
import getIdOfItem from './methods/getIdOfItem';
import toArray from './methods/toArray';
import toMap from './methods/toMap';

export type MappedList<KeyType extends StringOrNumber, DataType> = IMappedList<KeyType, DataType>;

export class RefList<KeyType extends StringOrNumber, DataType extends Object> {
    private readonly _keyPath: string;

    private _head: KeyType;
    private _tail: KeyType;
    private _size: number = 0;
    private _nodes: Record<KeyType, ListNode<KeyType, DataType>> = {} as Record<KeyType, ListNode<KeyType, DataType>>;

    constructor(keyPathOrConfig: string | MappedList<KeyType, DataType>, dataArray: DataType[] | RefList<KeyType, DataType> = []) {
        if (typeof keyPathOrConfig !== 'string') {
            this._keyPath = keyPathOrConfig.keyPath;
            this._head = keyPathOrConfig.head;
            this._tail = keyPathOrConfig.tail;
            this._size = keyPathOrConfig.size;
            this._nodes = keyPathOrConfig.nodes;
        } else {
            this._keyPath = keyPathOrConfig;

            dataArray.forEach((item: DataType) => this.add(item));
        }
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

    public add = add<KeyType, DataType>.bind(this);
    public delete = deleteNode<KeyType, DataType>.bind(this);
    public update = update<KeyType, DataType>.bind(this);
    public addAfter = addAfter<KeyType, DataType>.bind(this);
    public addBefore = addBefore<KeyType, DataType>.bind(this);
    public addAt = addAt<KeyType, DataType>.bind(this);
    public slice = slice<KeyType, DataType>.bind(this);
    public splice = splice<KeyType, DataType>.bind(this);
    public filter = filter<KeyType, DataType>.bind(this);
    public forEach = forEach<KeyType, DataType>.bind(this);
    public concat = concat<KeyType, DataType>.bind(this);

    /** non-Chain-able methods */

    public get = get<KeyType, DataType>.bind(this);
    public getHead = getHead<KeyType, DataType>.bind(this);
    public getTail = getTail<KeyType, DataType>.bind(this);
    public at = at<KeyType, DataType>.bind(this);
    public getIdOfItem = getIdOfItem<KeyType, DataType>.bind(this);
    public toArray = toArray<KeyType, DataType>.bind(this);
    public toMap = toMap<KeyType, DataType>.bind(this);

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

