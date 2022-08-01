import { StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function addBefore<KeyType extends StringOrNumber, DataType>
                        (nodeKey: KeyType, item: DataType): RefList<KeyType, DataType> {
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