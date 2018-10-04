import Matrix from '../src/Matrix.mjs';
import Vector from '../src/Vector.mjs';
import linalg from '../src/linalg.mjs';
import chai from 'chai';
const expect = chai.expect;
describe('linalg methods', function() {
    describe('A * x = b', function() {
        it('luDecomp solve: A=[[2, 4, 2], [1, 3, 4], [3, 8, 11]], b=[4, 7, 18]', function() {
            let prepared = linalg.luDecomp.pivotPrepare(new Matrix([
                2, 4, 2
            ], [
                1, 3, 4
            ], [3, 8, 11]));
            let result = linalg.luDecomp.pivotSolve([
                4, 7, 18
            ], prepared.decomposed, prepared.pivotedIndex);

            let expected = [-3, 2, 1];

            for (let i = 0; i < expected.length; i++) {
                expect(Math.abs(expected[i] - result[i]) < Math.pow(10, -6)).to.equal(true);
            }
        });

        it('luDecomp solve: A=[[2, 4, 1, -3], [-1, -2, 2, 4], [4, 2, -3, 5], [5, -4, -3, 1]], b=[0, 10, 2, 6]', function() {
            let prepared = linalg.luDecomp.pivotPrepare(new Matrix([
                [
                    2, 4, 1, -3
                ],
                [
                    -1, -2, 2, 4
                ],
                [
                    4, 2, -3, 5
                ],
                [5, -4, -3, 1]
            ]));
            let result = linalg.luDecomp.pivotSolve([
                0, 10, 2, 6
            ], prepared.decomposed, prepared.pivotedIndex);

            let expected = [2, -1, 3, 1];

            for (let i = 0; i < expected.length; i++) {
                expect(Math.abs(expected[i] - result[i]) < Math.pow(10, -6)).to.equal(true);
            }
        });
    });

    describe('A * X = B', function() {
        it('luDecomp solve: A=[[2, 4, 2], [1, 3, 4], [3, 8, 11]], B=[[2,4,3], [-1,7,0], [5,18,-2]]', function() {
            let prepared = linalg.luDecomp.pivotPrepare(new Matrix([
                2, 4, 2
            ], [
                1, 3, 4
            ], [3, 8, 11]));
            let result = linalg.luDecomp.pivotSolveMatrix(new Matrix([
                [
                    2, 4, 3
                ],
                [
                    -1, 7, 0
                ],
                [5, 18, -2]
            ]), prepared.decomposed, prepared.pivotedIndex);

            let expected = [
                [
                    20, -3, -4.25
                ],
                [
                    -11, 2, 3.75
                ],
                [3, 1, -1.75]
            ];

            for (let i = 0; i < expected.length; i++) {
                for (let j = 0; j < expected.length; j++) {
                    expect(Math.abs(expected[i][j] - result[i][j]) < Math.pow(10, -6)).to.equal(true);
                }
            }
        });
    });

    describe('inverse: ', function() {
        it('A=[[1, 1, 1, -1], [1, 1, -1, 1], [1, -1, 1, 1], [-1, 1, 1, 1]]', function() {
            let result = linalg.inv(new Matrix([
                [
                    1, 1, 1, -1
                ],
                [
                    1, 1, -1, 1
                ],
                [
                    1, -1, 1, 1
                ],
                [-1, 1, 1, 1]
            ]));

            let expected = [
                [
                    0.25, 0.25, 0.25, -0.25
                ],
                [
                    0.25, 0.25, -0.25, 0.25
                ],
                [
                    0.25, -0.25, 0.25, 0.25
                ],
                [-0.25, 0.25, 0.25, 0.25]
            ];

            for (let i = 0; i < expected.length; i++) {
                for (let j = 0; j < expected.length; j++) {
                    expect(Math.abs(expected[i][j] - result[i][j]) < Math.pow(10, -6)).to.equal(true);
                }
            }
        });
    });

    describe('isNonSingular: ', function() {
        it('A=[[2, 4, 2], [1, 3, 4], [3, 8, 11]] is non-singular', function() {
            let result = linalg.isNonSingular(new Matrix([
              [2, 4, 2], [1, 3, 4], [3, 8, 11]
            ]));
            expect(result).to.equal(true);
        });

        it('A=[[0, 0, 0], [0, 0, 0], [0, 0, 0]] is Singular', function() {
            let result = linalg.isNonSingular(new Matrix([
                [
                    0, 0, 0
                ],
                [
                    0, 0, 0
                ],
                [0, 0, 0]
            ]));
            expect(result).to.equal(false);
        });
    });

});
