import { StringOrNumber } from '../../types/types';

export default function toArray<KeyType extends StringOrNumber, DataType>
                        (): DataType[] {
    let currentNode = this.nodes[this.head];
    const dataArray = [];

    while (currentNode) {
        let dataToPush = { ...currentNode };
        delete dataToPush.next;
        delete dataToPush.prev;
        dataArray.push(dataToPush);
        currentNode = currentNode.next ? this.nodes[currentNode.next] : null;
    }

    return dataArray;
}