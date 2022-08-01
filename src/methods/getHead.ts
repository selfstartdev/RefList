import { ListNode, StringOrNumber } from '../../types/types';

export default function getHead<KeyType extends StringOrNumber, DataType>
                        (): ListNode<KeyType, DataType> {
    return this.get(this.head);
}