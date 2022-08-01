import { StringOrNumber } from '../../types/types';
import { RefList } from '../RefList';

export default function concat<KeyType extends StringOrNumber, DataType>
                        (data: RefList<KeyType, DataType> | DataType[]): RefList<KeyType, DataType> {
    data.forEach((item) => {
        this.add(item);
    });

    return this;
}
