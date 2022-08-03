export type ListNodeExtension<KeyType> = {
    prev: KeyType | null;
    next: KeyType | null;
};

export type ListNode<KeyType, DataType> = DataType & ListNodeExtension<KeyType>;

export type StringOrNumber = string | number;

export type FilterFn<DataType> = (item: DataType) => boolean;
export type IteratorFn<DataType> = (item: DataType, i: number) => void;
export type ComparatorFn<DataType> = (itemA: DataType, itemB: DataType) => boolean;

export type RefListConfig<KeyType extends StringOrNumber, DataType> = {
    _size: number;
    _head: KeyType;
    _tail: KeyType;
    _keyPath: string;
    _nodes: Record<KeyType, ListNode<KeyType, DataType>>;
};