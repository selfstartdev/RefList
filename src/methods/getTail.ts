import { ListNode, StringOrNumber } from '../../types/types';

export default function getTail<KeyType extends StringOrNumber, DataType>
                        (): ListNode<KeyType, DataType> {
    return this.get(this.tail);
}