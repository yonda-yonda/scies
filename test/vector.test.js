import Vector from '../src/Vector.mjs';
import chai from 'chai';
const expect = chai.expect;
describe('Vector Class', function() {
    describe('constructor:', function() {
        it('create arraylike object.', function() {
            let vec = new Vector(1, 1, 1);
            expect(vec.toArray()).to.deep.equal([1, 1, 1]);
            expect(vec.length).to.equal(3);
        });

        it('create from array.', function() {
            let vec = new Vector([1, 1, 1]);
            expect(vec.toArray()).to.deep.equal([1, 1, 1]);
        });

        it('can be passed Infinity.', function() {
            let vec = new Vector(1, Infinity, 1);
            expect(vec.toArray()).to.deep.equal([1, Infinity, 1]);
        });

        it('must be passed only Number.', function() {
            expect(function() {
                new Vector(1, 1, '1')
            }).to.throw('the 2-th argument is not number.');
        });
    });

    describe('iteratable:', function() {
        let vec;
        beforeEach(function() {
            vec = new Vector(1, 2, 3)
        });
        it('for of', function() {
            let expected = 0;
            for (let value of vec) {
                expect(value).to.equal(++expected);
            }
        });
        it('forEach', function() {
            let expectedValue = 0,
                expectedIndex = 0,
                target = 'is treated as "this" in callback.';
            vec.forEach((value, index, innerVec) => {
                expect(value).to.equal(++expectedValue);
                expect(index).to.equal(expectedIndex++);
                expect(vec).to.deep.equal(innerVec);
            });

            vec.forEach(function(value, index, innerVec) {
                expect(this).to.deep.equal(undefined);
            });

            vec.forEach(function(value, index, innerVec) {
                expect(this).to.deep.equal(target);
            }, target);
        });
    });
    describe('splice:', function() {
        let vec,
            expected;
        beforeEach(function() {
            vec = new Vector(1, 2, 3, 4, 5);
            expected = [1, 2, 3, 4, 5]
        });
        it('is passed (2,0,10,20).', function() {
            let removed = vec.splice(2, 0, 10, 20);
            let removedFromExpected = expected.splice(2, 0, 10, 20)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (2,2,10).', function() {
            let removed = vec.splice(2, 2, 10);
            let removedFromExpected = expected.splice(2, 2, 10)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (0,10,10).', function() {
            let removed = vec.splice(0, 10, 10);
            let removedFromExpected = expected.splice(0, 10, 10)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (length,0,10).', function() {
            let removed = vec.splice(vec.length, 0, 10);
            let removedFromExpected = expected.splice(expected.length, 0, 10)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (-1, 0, 10).', function() {
            let removed = vec.splice(-1, 0, 10);
            let removedFromExpected = expected.splice(-1, 0, 10)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (-3, 2, 10).', function() {
            let removed = vec.splice(-3, 2, 10);
            let removedFromExpected = expected.splice(-3, 2, 10)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (2).', function() {
            let removed = vec.splice(2);
            let removedFromExpected = expected.splice(2)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (-10).', function() {
            let removed = vec.splice(-10);
            let removedFromExpected = expected.splice(-10)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (-10,undefined).', function() {
            let removed = vec.splice(-10, undefined);
            let removedFromExpected = expected.splice(-10, undefined)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (0, null, 10).', function() {
            let removed = vec.splice(0, null, 10);
            let removedFromExpected = expected.splice(0, null, 10)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });

        it('is passed (10, 0, 10).', function() {
            let removed = vec.splice(10, 0, 10);
            let removedFromExpected = expected.splice(10, 0, 10)
            expect(vec.toArray()).to.deep.equal(expected);
            expect(removed.toArray()).to.deep.equal(removedFromExpected);
        });
    });

    describe('add or remove methods:', function() {
        let vec;
        beforeEach(function() {
            vec = new Vector(1, 2, 3);
        });
        it('unshift', function() {
            let length = vec.unshift(10);
            expect(vec.toArray()).to.deep.equal([10, 1, 2, 3]);
            expect(length).to.equal(4);

            expect(function() {
                vec.unshift('10')
            }).to.throw('value is not number.');
        });
        it('shift', function() {
            let value = vec.shift();
            expect(vec.toArray()).to.deep.equal([2, 3]);
            expect(value).to.equal(1);
        });
        it('push', function() {
            let length = vec.push(10);
            expect(vec.toArray()).to.deep.equal([1, 2, 3, 10]);
            expect(length).to.equal(4);

            expect(function() {
                vec.push('10')
            }).to.throw('value is not number.');
        });
        it('pop', function() {
            let value = vec.pop();
            expect(vec.toArray()).to.deep.equal([1, 2]);
            expect(value).to.equal(3);
        });
    });

    describe('toArray:', function() {
        it('converts to array.', function() {
            let vec = new Vector(1, 2, 3);
            expect(Array.isArray(vec.toArray())).to.equal(true);
        });
    });

    describe('toString:', function() {
        it('converts to string.', function() {
            let vec = new Vector(1, 2, 3);
            expect(vec.toString()).to.equal('[1, 2, 3]');
        });
    });

    describe('copy:', function() {
        it('duplicate oneself.', function() {
            let vec = new Vector(1, 2, 3);
            let clone = vec.copy();
            clone[0] = 100;
            expect(clone.toArray()).to.deep.equal([100, 2, 3]);
            expect(vec.toArray()).to.deep.equal([1, 2, 3]);
        });
    });

    describe('slice:', function() {
        let vec,
            expected;
        beforeEach(function() {
            vec = new Vector(1, 2, 3, 4, 5);
            expected = [1, 2, 3, 4, 5]
        });

        it('don\'t change ownself.', function() {
            let result = vec.slice(2);
            expect(vec.toArray()).to.deep.equal(expected);
        });

        it('is passed (2).', function() {
            let result = vec.slice(2);
            let expectedResult = expected.slice(2);
            expect(result.toArray()).to.deep.equal(expectedResult);
        });

        it('is passed (-2, 2).', function() {
            let result = vec.slice(-2, 2);
            let expectedResult = expected.slice(-2, 2);
            expect(result.toArray()).to.deep.equal(expectedResult);
        });

        it('is passed (10).', function() {
            let result = vec.slice(10);
            let expectedResult = expected.slice(10);
            expect(result.toArray()).to.deep.equal(expectedResult);
        });

        it('is passed (-10).', function() {
            let result = vec.slice(-10);
            let expectedResult = expected.slice(-10);
            expect(result.toArray()).to.deep.equal(expectedResult);
        });

        it('is passed (3,3).', function() {
            let result = vec.slice(3, 3);
            let expectedResult = expected.slice(3, 3);
            expect(result.toArray()).to.deep.equal(expectedResult);
        });
    });

    describe('operator methods:', function() {
        let vec,
            expected;
        beforeEach(function() {
            vec = new Vector(1, 2);
            expected = [1, 2]
        });

        it('validate arguments.', function() {
            expect(function() {
                vec.ope(true, 1)
            }).to.throw('operator is not string.');

            expect(function() {
                vec.ope('@', 1)
            }).to.throw('operator is not valid symbol.');

            expect(function() {
                vec.ope('+', '1')
            }).to.throw('scolor is not number.');
        });

        it('don\'t change ownself.', function() {
            vec.ope('+', 1);
            expect(vec.toArray()).to.deep.equal(expected);
        });

        it('add', function() {
            let result = vec.add(1);
            expect(result.toArray()).to.deep.equal([2, 3]);
        });

        it('sub', function() {
            let result = vec.sub(1);
            expect(result.toArray()).to.deep.equal([0, 1]);
        });

        it('mul', function() {
            let result = vec.mul(10);
            expect(result.toArray()).to.deep.equal([10, 20]);
        });

        it('div', function() {
            let result = vec.div(10);
            expect(result.toArray()).to.deep.equal([0.1, 0.2]);
        });
    });

    describe('norm:', function() {
        it('calcurate Euclidean distance.', function() {
            let vec = new Vector(1, -2, 3);
            let expected = Math.sqrt(Math.pow(1, 2) + Math.pow(-2, 2) + Math.pow(3, 2));
            expect(vec.norm()).to.equal(expected);
        });
    });

    describe('unit:', function() {
        it('calcurate unit vector.', function() {
            let vec = new Vector(1, -2, 3);
            let size = Math.sqrt(Math.pow(1, 2) + Math.pow(-2, 2) + Math.pow(3, 2));
            let expected = [
                1 / size,
                -2 / size,
                3 / size
            ];
            expect(vec.unit().toArray()).to.deep.equal(expected);
        });
    });

    describe('reverse:', function() {
        it('make reversed vector.', function() {
            let vec = new Vector(1, 2, 3);
            expect(vec.reverse().toArray()).to.deep.equal([3, 2, 1]);
        });
    });

    describe('static zeros:', function() {
        it('make vector filled by 0.', function() {
            expect(Vector.zeros(3).toArray()).to.deep.equal([0, 0, 0]);
        });
    });

    describe('static range:', function() {
        it('is passed (1,8).', function() {
            expect(Vector.range(1, 8).toArray()).to.deep.equal([
                1,
                2,
                3,
                4,
                5,
                6,
                7
            ]);
        });

        it('is passed (2, 3, 0.5).', function() {
            expect(Vector.range(2, 3, 0.5).toArray()).to.deep.equal([2, 2.5]);
        });

        it('is passed (5, 2, -1).', function() {
            expect(Vector.range(5, 2, -1).toArray()).to.deep.equal([5, 4, 3]);
        });

        it('is passed (4.5).', function() {
            expect(Vector.range(4.5).toArray()).to.deep.equal([0, 1, 2, 3, 4]);
        });

        it('is passed (-10).', function() {
            expect(Vector.range(-10).toArray()).to.deep.equal([]);
        });

        it('don\'t nallow 0 step.', function() {
            expect(function() {
                Vector.range(1, 10, 0)
            }).to.throw('step must not be zero.');
        });
    });

    describe('static isVector:', function() {
        it('check whether it is Vector.', function() {
            expect(Vector.isVector(new Vector())).to.equal(true);
            expect(Vector.isVector([])).to.equal(false);
        });
    });
    describe('concat:', function() {
        it('joins Vectors.', function() {
            let vec1 = new Vector(1, 2);
            let vec2 = new Vector(3, 4);
            let vec3 = new Vector(5, 6);

            expect(Vector.concat(vec1, vec2, vec3).toArray()).to.deep.equal([
                1,
                2,
                3,
                4,
                5,
                6
            ]);
        });

        it('must be passed only Vector.', function() {
            let vec1 = new Vector(1, 2);

            expect(function() {
                Vector.sum(vec1, [-1, -2])
            }).to.throw('the 1-th argument is not vector.');
        });
    });
    describe('sum:', function() {
        it('calcurate sum of Vectors.', function() {
            let vec1 = new Vector(1, 2, 3);
            let vec2 = new Vector(10, 20, 30);
            let vec3 = new Vector(100, 200, 300);

            expect(Vector.sum(vec1, vec2, vec3).toArray()).to.deep.equal([111, 222, 333]);
        });

        it('must be passed only Vector.', function() {
            let vec1 = new Vector(1, 2, 3);

            expect(function() {
                Vector.sum(vec1, [-1, -2, -3])
            }).to.throw('the 1-th argument is not vector.');
        });

        it('don\'t allow different size vector.', function() {
            let vec1 = new Vector(1, 2, 3);
            let vec2 = new Vector(10, 20, 30);
            let vec3 = new Vector(100, 200);

            expect(function() {
                Vector.sum(vec1, vec2, vec3)
            }).to.throw('the 2-th vector don\'t match size.');
        });
    });

    describe('static dot:', function() {
        it('calcurate inner product.', function() {
            let vec1 = new Vector(1, 2, 3);
            let vec2 = new Vector(10, 20, 30);

            expect(Vector.dot(vec1, vec2)).to.equal(140);
        });

        it('must be passed only Vector.', function() {
            let vec1 = new Vector(1, 2, 3);
            expect(function() {
                Vector.dot(vec1, [-1, -2, -3])
            }).to.throw('the 1-th argument is not Vector.');
        });

        it('don\'t allow different size vector.', function() {
            let vec1 = new Vector(1, 2, 3);
            let vec2 = new Vector(10, 20);

            expect(function() {
                Vector.dot(vec1, vec2)
            }).to.throw('don\'t match Vector size.');
        });
    });

    describe('static cross:', function() {
        it('calcurate cross product.', function() {
            let vec1 = new Vector(1, 2, 0);
            let vec2 = new Vector(0, 1, -1);

            expect(Vector.cross(vec1, vec2).toArray()).to.deep.equal([-2, 1, 1]);
        });

        it('must be passed only Vector.', function() {
            let vec1 = new Vector(1, 2, 3);
            expect(function() {
                Vector.cross([
                    -1, -2, -3
                ], vec1)
            }).to.throw('the 0-th argument is not Vector(3-dim).');
        });

        it('must be passed only 3-dim vector.', function() {
            let vec1 = new Vector(1, 2, 3);
            let vec2 = new Vector(10, 20);

            expect(function() {
                Vector.cross(vec1, vec2)
            }).to.throw('the 1-th argument is not Vector(3-dim).');
        });
    });
});
