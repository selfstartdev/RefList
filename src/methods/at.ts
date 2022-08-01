import { ListNode, StringOrNumber } from '../../types/types';

export default function at<KeyType extends StringOrNumber, DataType>
                        (index: number): ListNode<KeyType, DataType> {
    let currentNode = this.nodes[this.head];
    for (let i = 0; i <= index; i++) {
        if (i === index) {
            return currentNode;
        }

        currentNode = this.nodes[currentNode.next];
    }
}