import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { RefList } from '../src/RefList';
import { ListNode } from '../types/types';
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
            expect(testList.getTail().color).to.eql(newColor.color);
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
    describe('filter', () => {});
    describe('concat', () => {});
    describe('forEach', () => {});

    describe('Chainable Methods', () => {
        it('should be chainable from the given methods', () => {
            expect(testList.delete(testList.head)).to.be.instanceOf(RefList);
            expect(testList.update('yellow', { value: 'lightPurple' } as ColorData)).to.be.instanceOf(RefList);
            expect(testList.addAfter('yellow', { color: 'purple' })).to.be.instanceOf(RefList);
            expect(testList.addBefore('yellow', { color: 'purple' })).to.be.instanceOf(RefList);
            expect(testList.addAt(0, { color: 'purple' })).to.be.instanceOf(RefList);
            expect(testList.slice(0, 1)).to.be.instanceOf(RefList);
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

    describe('at', () => {});
    describe('getIdOfItem', () => {});
    describe('toArray', () => {});

    /** sort functionality */
    describe('sort', () => {});
    describe('merge', () => {});
    describe('mergeAndSort', () => {});
});