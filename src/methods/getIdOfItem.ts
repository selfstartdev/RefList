import { StringOrNumber } from '../../types/types';
import objectPath from 'object-path';

export default function getIdOfItem<KeyType extends StringOrNumber, DataType extends Object>
                        (item: DataType): KeyType {
    return objectPath.get(item, this.keyPath);
}