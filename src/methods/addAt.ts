import { StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function addAt<KeyType extends StringOrNumber, DataType>
                        (index: number, item: DataType): RefList<KeyType, DataType> {
    const prevNode = this.at(index);

    this.addAfter(this.getIdOfItem(prevNode), item);

    return this;
}