import { StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function splice<KeyType extends StringOrNumber, DataType>
                        (start: number, end: number = this.size): RefList<KeyType, DataType> {
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