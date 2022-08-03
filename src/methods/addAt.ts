import { StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function addAt<KeyType extends StringOrNumber, DataType>
                        (index: number, item: DataType): RefList<KeyType, DataType> {
    const prevNode = this.at(index);

    // item with id already exists, uncertain what to do so throw error
    if (this.nodes[this.getIdOfItem(item)]) {
        throw new Error(`Cannot execute addAfter, item with id of ${this.getIdOfItem(item)} already exists`);
    }

    this.addAfter(this.getIdOfItem(prevNode), item);

    return this;
}