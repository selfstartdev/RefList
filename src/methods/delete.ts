import { StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function deleteNode<KeyType extends StringOrNumber, DataType>
                        (nodeKey: KeyType): RefList<KeyType, DataType> {
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