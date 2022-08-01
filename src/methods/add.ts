import { ListNode, StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function add<KeyType extends StringOrNumber , DataType>(item: DataType | ListNode<KeyType, DataType>): RefList<KeyType, DataType> {
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