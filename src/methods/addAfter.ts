import { StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function addAfter<KeyType extends StringOrNumber, DataType>
                        (nodeKey: KeyType, item: DataType): RefList<KeyType, DataType> {
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