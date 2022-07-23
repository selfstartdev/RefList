import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('test', () => {
    it('should be true', () => {
        expect(true).to.equal(true);
    });
});