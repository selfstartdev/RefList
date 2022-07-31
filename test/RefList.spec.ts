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

    });
});