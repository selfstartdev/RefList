import { IteratorFn, StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function forEach<KeyType extends StringOrNumber, DataType>
                        (fn: IteratorFn<DataType>): RefList<KeyType, DataType> {
    let currentNode = this.nodes[this.head];
    let index = 0;

    while (currentNode) {
        fn(currentNode, index);
        currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
        index++;
    }

    return this;
}