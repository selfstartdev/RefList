import { MappedList } from '../RefList';
import { StringOrNumber } from '../../types/types';

export default function toMap<KeyType extends StringOrNumber, DataType>
                        (): MappedList<KeyType, DataType> {
    return {
        keyPath: this.keyPath,
        size: this.size,
        head: this.head,
        tail: this.tail,
        nodes: this.nodes
    };
};