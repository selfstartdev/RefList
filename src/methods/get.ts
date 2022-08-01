import { ListNode, StringOrNumber } from '../../types/types';

export default function get<KeyType extends StringOrNumber, DataType>
                        (nodeKey: KeyType): ListNode<KeyType, DataType> {
    return this.nodes[nodeKey];
}