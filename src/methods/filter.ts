import { FilterFn, StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function filter<KeyType extends StringOrNumber, DataType>
                        (fn: FilterFn<DataType>): RefList<KeyType, DataType> {
    let currentNode = this.nodes[this.head];

    while (currentNode) {
        if (!fn(currentNode)) {
            this.delete(this.getIdOfItem(currentNode));
        }

        currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
    }

    return this;
}