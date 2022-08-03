import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { RefList } from '../src/RefList';
import { FilterFn, ListNode, IteratorFn } from '../types/types';
import colors, { ColorData } from './test-cases/colors';

const expect = chai.expect;
chai.use(sinonChai);

describe('RefList', () => {
    let testData = colors,
        testList;

    beforeEach(() => {
        testList = new RefList<string, typeof colors[0]>('color', testData);
    });

    describe('constructor', () => {
        it('should set the keyPath properly', () => {
            let testKeyPath = 'test.testPattern.value',
                testList = new RefList(testKeyPath);

            expect(testList.keyPath).to.equal(testKeyPath);
        });

        it('should set nodes from an array in order', () => {
            let testKeyPath = 'test.testPattern.value',
                testData = [{ test: { testPattern: { value: 'testId'}} },
                    { test: { testPattern: { value: 'testId2'}} }],
                testList = new RefList(testKeyPath, testData);

            expect(testList.getIdOfItem(testList.at(0))).to.eql(testData[0].test.testPattern.value);
            expect(testList.getIdOfItem(testList.at(1))).to.eql(testData[1].test.testPattern.value);
        });

        it('should set nodes from another RefList in order', () => {
            let testKeyPath = 'test.testPattern.value',
                testData = new RefList(testKeyPath, [{ test: { testPattern: { value: 'testId'}} },
                    { test: { testPattern: { value: 'testId2'}} }]),
                testList = new RefList(testKeyPath, testData);

            expect(testList.getIdOfItem(testList.at(0))).to.eql(testData.at(0).test.testPattern.value);
            expect(testList.getIdOfItem(testList.at(1))).to.eql(testData.at(1).test.testPattern.value);
        });
    });

    describe('add', () => {
        it ('should be able to add raw data', () => {
            let newColor: ColorData = {
                color: 'purple',
                value: 'purple'
            };

            testList.add(newColor);

            expect(testList.at(testList.size - 1).color).to.eql(newColor.color);
            expect(testList.getTail().color).to.equal(newColor.color);
            expect(testList.tail).to.eql(testList.getIdOfItem(testList.getTail()));
            expect(testList.at(testList.size - 2).next).to.eql(testList.getIdOfItem(testList.getTail()));
        });

        it('should be able to add a ListNode', () => {
            let newColor: ColorData = {
                color: 'purple',
                value: 'purple'
            },
                colorNode: ListNode<string, ColorData> = {
                    ...newColor,
                    next: null,
                    prev: null
                };

            testList.add(colorNode);

            expect(testList.at(testList.size - 1).color).to.eql(newColor.color);
            expect(testList.getTail().color).to.eql(newColor.color);
            expect(testList.tail).to.eql(testList.getIdOfItem(testList.getTail()));
            expect(testList.at(testList.size - 2).next).to.eql(testList.getIdOfItem(testList.getTail()));
        });

        it('should overwrite an item if the item already exists', () => {
            const initTail = testList.tail;
            const initHead = testList.head;
            const initSize = testList.size;

            testList.add({
                color: 'red',
                value: 'red-ish'
            });

            expect(testList.head).to.equal(initHead);
            expect(testList.tail).to.equal(initTail);
            expect(testList.size).to.equal(initSize);

            expect(testList.get('red').value).to.equal('red-ish');
        });
    });

    describe('delete', () => {
        it('should unset a node with a given key', () => {
            const sizeRef = testList.size;
            testList.delete('black');
            expect(testList.get('black')).to.equal(undefined);
            expect(testList.size).to.equal(sizeRef - 1);
        });

        it('should change the head if head is deleted', () => {
            const oldHeadRef = testList.getIdOfItem(testList.at(0));
            const newHeadRef = testList.getIdOfItem(testList.at(1));
            testList.delete(oldHeadRef);
            expect(testList.head).to.equal(newHeadRef);
            expect(testList.getIdOfItem(testList.at(0))).to.equal(testList.head);
            expect(testList.at(1).prev).to.equal(testList.head);
            expect(testList.getHead().next).to.equal(testList.getIdOfItem(testList.at(1)));
        });

        it('should change the tail if tail is deleted', () => {
            const oldTailRef = testList.getIdOfItem(testList.at(testList.size - 1));
            const newTailRef = testList.getIdOfItem(testList.at(testList.size - 2));
            testList.delete(oldTailRef);
            expect(testList.tail).to.equal(newTailRef);
            expect(testList.getIdOfItem(testList.at(testList.size - 1))).to.equal(testList.tail);
            expect(testList.at(testList.size - 2).next).to.equal(testList.tail);
            expect(testList.getTail().prev).to.equal(testList.getIdOfItem(testList.at(testList.size - 2)));
        });
    });

    describe('update', () => {
        it('should change values of the given object', () => {
            testList.update('yellow', { value: 'lightPurple' } as ColorData);

            expect(testList.get('yellow').value).to.equal('lightPurple');
        });
    });

    describe('addAfter', () => {
        it('should properly put a node in the middle of a list', () => {
            let newColor: ColorData = {
                    color: 'purple',
                    value: 'purple'
                },
                middlePos = Math.floor(testList.size / 2),
                middleNode = testList.at(middlePos),
                sizeRef = testList.size;

            testList.addAfter(testList.getIdOfItem(middleNode), newColor);

            expect(testList.get(testList.getIdOfItem(middleNode)).next).to.equal(newColor.color);
            expect(testList.at(middlePos + 2).prev).to.equal(newColor.color);
            expect(testList.at(middlePos + 1).color).to.equal(newColor.color);
            expect(testList.size).to.equal(sizeRef + 1);
        });

        it('should properly put a node at the end of a list', () => {
            let newColor: ColorData = {
                    color: 'purple',
                    value: 'purple'
                };

            testList.addAfter(testList.tail, newColor);

            expect(testList.at(testList.size - 1).color).to.equal(newColor.color);
            expect(testList.tail).to.equal(newColor.color);
            expect(testList.at(testList.size - 2).next).to.equal(newColor.color);
        });
    });

    describe('addBefore', () => {
        it('should properly put a node in the middle of a list', () => {
            let newColor: ColorData = {
                    color: 'purple',
                    value: 'purple'
                },
                middlePos = Math.floor(testList.size / 2),
                middleNode = testList.at(middlePos),
                sizeRef = testList.size;

            testList.addBefore(testList.getIdOfItem(middleNode), newColor);

            expect(testList.get(testList.getIdOfItem(middleNode)).prev).to.equal(newColor.color);

            expect(testList.at(middlePos - 1).next).to.equal(newColor.color);
            expect(testList.at(middlePos).color).to.equal(newColor.color);
            expect(testList.size).to.equal(sizeRef + 1);
        });

        it('should properly put a node at the start of a list', () => {
            let newColor: ColorData = {
                color: 'purple',
                value: 'purple'
            };

            testList.addBefore(testList.head, newColor);

            expect(testList.at(0).color).to.equal(newColor.color);
            expect(testList.head).to.equal(newColor.color);
            expect(testList.at(1).prev).to.equal(newColor.color);
        });
    });

    describe('addAt', () => {
        it('should add properly in the middle of a list', () => {
            let newColor: ColorData = {
                    color: 'purple',
                    value: 'purple'
                },
                middlePos = Math.floor(testList.size / 2),
                middleNode = testList.at(middlePos),
                sizeRef = testList.size;

            testList.addAt(middlePos, newColor);

            expect(testList.get(testList.getIdOfItem(middleNode)).next).to.equal(newColor.color);
            expect(testList.at(middlePos + 2).prev).to.equal(newColor.color);
            expect(testList.at(middlePos + 1).color).to.equal(newColor.color);
            expect(testList.size).to.equal(sizeRef + 1);
        });

        it('should add properly to the end of a list', () => {
            let newColor: ColorData = {
                    color: 'purple',
                    value: 'purple'
                },
                sizeRef = testList.size;

            testList.addAt(testList.size - 1, newColor);

            expect(testList.getTail().color).to.equal(newColor.color);
            expect(testList.at(testList.size - 2).next).to.equal(newColor.color);
            expect(testList.size).to.equal(sizeRef + 1);
        });
    });

    describe('slice', () => {
        it('should slice a list with two params', () => {
            const slicedList = testList.slice(3, 5);
            expect(slicedList.at(0).color).to.equal(testList.at(3).color);
            expect(slicedList.at(slicedList.size - 1).color).to.equal(testList.at(4).color);
            expect(slicedList.head).to.equal(testList.at(3).color);
            expect(slicedList.tail).to.equal(testList.at(4).color);
        });

        it('should slice a list with one param', () => {
            const slicedList = testList.slice(3);
            expect(slicedList.at(0).color).to.equal(testList.at(3).color);
            expect(slicedList.at(slicedList.size - 1).color).to.equal(testList.at(testList.size - 1).color);
            expect(slicedList.head).to.equal(testList.at(3).color);
            expect(slicedList.tail).to.equal(testList.at(testList.size - 1).color);
        });
    });

    describe('splice', () => {
        it('should splice a list with two params', () => {
            const headRef = testList.at(3);
            const tailRef = testList.at(4);
            testList.splice(3, 5);
            expect(testList.at(0).color).to.equal(headRef.color);
            expect(testList.head).to.equal(headRef.color);
            expect(testList.at(testList.size - 1).color).to.equal(tailRef.color);
            expect(testList.tail).to.equal(tailRef.color);
        });

        it('should splice a list with one param', () => {
            const headRef = testList.at(3);
            const tailRef = testList.getTail();
            testList.splice(3);
            expect(testList.at(0).color).to.equal(headRef.color);
            expect(testList.head).to.equal(headRef.color);
            expect(testList.at(testList.size - 1).color).to.equal(tailRef.color);
            expect(testList.tail).to.equal(tailRef.color);
        });
    });

    describe('filter', () => {
        it('should remove nodes that do not match filter function', () => {
            const filterFn: FilterFn<ColorData> = (item) => !item.color.includes('y');

            testList.filter(filterFn);

            expect(testList.get('yellow')).to.be.undefined;
        });
    });

    describe('forEach', () => {
        it('should call once per item', () => {
            const fnSpy: IteratorFn<ColorData> = sinon.spy((item: ColorData, i: number) => {
                expect(item.color).to.equal(colors[i].color);
            });

            testList.forEach(fnSpy);

            expect(fnSpy).to.have.been.callCount(colors.length);
        });
    });

    describe('concat', () => {
        it('should concatenate an array', () => {
            testList.concat([{
                color: 'fuschia',
                value: 'fuschia'
            }, {
                color: 'lavender',
                value: 'lavender'
            }]);

            expect(testList.size).to.equal(colors.length + 2);
            expect(testList.tail).to.equal('lavender');
            expect(testList.at(testList.size - 1).color).to.equal('lavender');
            expect(testList.at(testList.size - 2).color).to.equal('fuschia');
        });

        it('should concatenate another reflist', () => {
            const concatendatedList = new RefList<string, ColorData>('color', [{
                color: 'fuschia',
                value: 'fuschia'
            }, {
                color: 'lavender',
                value: 'lavender'
            }]);

            testList.concat(concatendatedList);

            expect(testList.size).to.equal(colors.length + 2);
            expect(testList.tail).to.equal('lavender');
            expect(testList.at(testList.size - 1).color).to.equal('lavender');
            expect(testList.at(testList.size - 2).color).to.equal('fuschia');
        });
    });

    /** non-chainable */
    describe('get', () => {
        it('should be able to get every node', () => {
            colors.forEach(color => expect(testList.get(color.color)).to.be.not.equal(undefined));
        });
    });

    describe('getHead', () => {
        it('should be able to get the head', () => {
            expect(testList.getHead()).to.be.not.equal(undefined);
        });
    });

    describe('getTail', () => {
        it('should be able to get the tail', () => {
            expect(testList.getTail()).to.be.not.equal(undefined);
        });
    });

    describe('at', () => {
        it('should be able to get a node in various positions', () => {
            colors.forEach((color, i) => {
                expect(testList.at(i).color).to.equal(color.color);
            });
        });
    });

    describe('getIdOfItem', () => {
        it('should be able to get the id of every item', () => {
            colors.forEach((color, i) => {
                expect(testList.getIdOfItem(testList.at(i))).to.equal(color.color);
            });
        });
    });

    describe('toArray', () => {
        it('should map to an array properly', () => {
            const newArray = testList.toArray();

            newArray.forEach((color, i) => {
                expect(color.color).to.equal(colors[i].color);
            });

            expect(newArray).to.be.instanceOf(Array);
        });
    });

    /** sort functionality */
    describe('sort', () => {
        let compareFn1,
            compareFn2;

        beforeEach(() => {
            compareFn1 = sinon.spy((a, b) => a.color <= b.color);
            compareFn2 = sinon.spy((a, b) => a.color > b.color);
        });

        it('should handle sorting items forwards', () => {
            const sortedArray = colors;
            sortedArray.sort((a, b) => a.color <= b.color ? -1 : 1);
            testList.sort(compareFn1);

            sortedArray.forEach((color, i) => {
                expect(color.color).to.equal(testList.at(i).color);
            });

            expect(compareFn1).to.be.have.been.called;
        });

        it('should handle sorting items in reverse', () => {
            const sortedArray = colors;
            sortedArray.sort((a, b) => a.color > b.color ? -1 : 1);
            testList.sort(compareFn2);

            sortedArray.forEach((color, i) => {
                expect(color.color).to.equal(testList.at(i).color);
            });

            expect(compareFn2).to.be.have.been.called;
        });
    });

    describe('_handleSort', () => {
        let mergeSpy, handleSortSpy, compareFn;

        beforeEach(() => {
            mergeSpy = sinon.spy(testList, 'merge');
            handleSortSpy = sinon.spy(testList, '_handleSort');
            compareFn = sinon.spy((a, b) => a.color < b.color);
        });

        it('should call merge', () => {
            testList._handleSort(compareFn);
            expect(mergeSpy).to.have.been.called;
        });

        it('should divide the proper amounts of times (logarithmic)', () => {
            const expectedDivideCount = Math.log(testList.size) * testList.size;
            testList._handleSort(compareFn);
            expect(handleSortSpy.callCount).be.be.lessThanOrEqual(expectedDivideCount);
        });

        it('should handle sorting items forwards', () => {
            const sortedArray = colors;
            sortedArray.sort((a, b) => a.color <= b.color ? -1 : 1);

            testList._handleSort(compareFn).forEach((node, i) => {
                expect(node.color).to.equal(sortedArray[i].color);
            });

            expect(compareFn).to.be.have.been.called;
        });

        it('should handle sorting items in reverse', () => {
            const sortedArray = colors;
            sortedArray.sort((a, b) => a.color > b.color ? -1 : 1);

            testList._handleSort(compareFn).forEach((node, i) => {
                expect(node.color).to.equal(sortedArray[sortedArray.length - 1 - i].color);
            });

            expect(compareFn).to.be.have.been.called;
        });
    });

    /** TODO: Need to consider a good way of properly testing the merge functionality */
    describe('merge', () => {
        let compareFn;

        beforeEach(() => {
            compareFn = sinon.spy((a, b) => a.color < b.color);
        });
    });

    describe('mergeAndSort', () => {
        let compareFn;

        beforeEach(() => {
            compareFn = sinon.spy((a, b) => a.color < b.color);
        });

        it('should put a concatenated node at the start', () => {
            const newColor = { color: 'avocado', value: 'avocado' };
            testList.mergeAndSort(compareFn, [newColor]);
            expect(testList.at(0).color).to.equal(newColor.color);
            expect(testList.head).to.equal(newColor.color);
            expect(testList.at(1).prev).to.equal(newColor.color);
        });

        it('should put a concatenated node at the end', () => {
            const newColor = { color: 'zucchini', value: 'zucchini' };
            testList.mergeAndSort(compareFn, [newColor]);
            expect(testList.at(testList.size - 1).color).to.equal(newColor.color);
            expect(testList.tail).to.equal(newColor.color);
            expect(testList.at(testList.size - 2).next).to.equal(newColor.color);
        });

        it('should handle putting multiple nodes', () => {
            const newColors = [
                { color: 'avocado', value: 'avocado' },
                { color: 'zucchini', value: 'zucchini' },
                { color: 'fuschia', value: 'fuschia' }
            ];
            const sortedArray = colors.concat(newColors);
            sortedArray.sort((a, b) => a.color < b.color ? -1 : 1);
            testList.mergeAndSort(compareFn, newColors);

            testList.forEach((node, i) => {
                expect(node.color).to.equal(sortedArray[i].color);
            });
        });
    });

    describe('Chainable Methods', () => {
        it('should be chainable from the given methods', () => {
            expect(testList.delete(testList.head)).to.be.instanceOf(RefList);
            expect(testList.update('red', { value: 'lightPurple' } as ColorData)).to.be.instanceOf(RefList);
            expect(testList.addAfter('red', { color: 'purple' })).to.be.instanceOf(RefList);
            expect(testList.addBefore('red', { color: 'purple' })).to.be.instanceOf(RefList);
            expect(testList.addAt(0, { color: 'purple' })).to.be.instanceOf(RefList);
            expect(testList.slice(0, 1)).to.be.instanceOf(RefList);
            expect(testList.splice(0, 2)).to.be.instanceOf(RefList);
            expect(testList.filter(item => true)).to.be.instanceOf(RefList);
            expect(testList.forEach(() => {})).to.be.instanceOf(RefList);
            expect(testList.concat([])).to.be.instanceOf(RefList);
        });
    });
});