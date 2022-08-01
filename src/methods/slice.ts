import { StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function slice<KeyType extends StringOrNumber, DataType>
                        (start: number, end: number = this.size): RefList<KeyType, DataType> {
    const slicedList = new RefList<KeyType, DataType>(this.keyPath, []);
    let remainingNodes = end - start;
    let currentNode = this.at(start);

    while (currentNode && remainingNodes) {
        slicedList.add(currentNode);
        currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
        remainingNodes--;
    }

    return slicedList;
}