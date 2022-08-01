import { RefList } from '../RefList';
import { StringOrNumber } from '../../types/types';

export default function update<KeyType extends StringOrNumber, DataType>(nodeKey: KeyType, updated: Object): RefList<KeyType, DataType> {
    for (let key in updated) {
        this.nodes[nodeKey][key] = updated[key];
    }

    return this;
}