import { ListNode, StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

/**
 * Appends a given data-node to the tail of the linked list.
 *
 * @typeParam KeyType, DataType - string or number, type describing content of {@link ListNode}.
 * @param item - Data-node to be appended to list. Can be object matching DataType,
 *               or a matching {@link ListNode}
 * @returns the {@link RefList} that the node was just added to.
 */
export default function add<KeyType extends StringOrNumber , DataType>
                        (item: DataType | ListNode<KeyType, DataType>): RefList<KeyType, DataType> {
    const itemId = this.getIdOfItem(item);

    let newNode = {
        ...item,
        prev: this.tail || null,
        next: null
    };

    // item with given id already exists
    if (this.nodes[itemId]) {
        this.nodes[itemId] = {
            ...newNode,
            prev: this.nodes[itemId].prev,
            next: this.nodes[itemId].next
        };
        return this;
    }

    /**
     * If head is not initialized, initialize head
     */
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