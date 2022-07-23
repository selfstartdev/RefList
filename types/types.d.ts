export type ListNodeExtension<KeyType> = {
    prev: KeyType | null;
    next: KeyType | null;
};

export type ListNode<KeyType, DataType> = DataType & ListNodeExtension<KeyType>;

export interface IListState<KeyType extends (string | number), DataType> {
    head: KeyType;
    tail: KeyType;
    nodes: Record<KeyType, ListNode<KeyType, DataType>>;
    size: number;
}

export type StringOrNumber = string | number;

export type FilterFn<DataType> = (item: DataType) => boolean;
export type IteratorFn<DataType> = (item: DataType, i: number) => void;