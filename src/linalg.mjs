import Matrix from './Matrix.mjs';
import Vector from './Vector.mjs';

class SingularMatrixError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, SingularMatrixError.prototype);
        this.name = this.constructor.name;
    }
};

const luDecomp = {
    pivotPrepare: (...args) => {
        if (!Matrix.isMatrix(args[0])) {
            throw new TypeError(`A is not Matrix.`);
        };
        if (args[0].dimention.row !== args[0].dimention.col) {
            throw new Error(`A is not square.`);
        }
        let coefficients = args[0];
        let amax,
            ip,
            size = coefficients.dimention.row,
            eps = Math.pow(2, -50),
            result = coefficients.copy(),
            pivots = Vector.zeros(size);
        if (typeof(args[1]) == 'number' && args[1] > 0) {
            eps = args[1];
        }
        for (let k = 0; k < size - 1; k++) {
            amax = Math.abs(result[k][k]);
            ip = k;
            for (let i = k + 1; i < size; i++) {
                if (Math.abs(result[i][k]) > amax) {
                    amax = Math.abs(result[i][k]);
                    ip = i;
                }
            }
            if (amax < eps) {
                throw new SingularMatrixError(`matrix is singular.`);
            }
            pivots[k] = ip;
            if (k !== ip) {
                for (let j = k; j < size; j++) {
                    let temp = result[k][j];
                    result[k][j] = result[ip][j];
                    result[ip][j] = temp;
                }
            }
            for (let i = k + 1; i < size; i++) {
                let alpha = -1 * result[i][k] / result[k][k];
                result[i][k] = alpha;
                for (let j = k + 1; j < size; j++) {
                    result[i][j] += alpha * result[k][j];
                }
            }
        }
        return {decomposed: result, pivotedIndex: pivots.toArray()};
    },
    pivotSolve: (b, pivotedCoefficients, pivotedIndex) => {
        let result;
        if (Array.isArray(b)) {
            result = new Vector(b);
        } else if (Vector.isVector(b)) {
            result = b;
        } else if (Matrix.isMatrix(b)) {
            if (b.dimention.row === 1) {
                result = new Vector(b.toArray()[0]);
            } else if (b.dimention.col === 1) {
                result = new Vector(b.T().toArray()[0]);
            } else {
                throw new TypeError(`b has too many rows or cols.`);
            }
        } else {
            throw new TypeError(`b is not valid.`);
        }
        if (!Matrix.isMatrix(pivotedCoefficients) || pivotedCoefficients.dimention.row !== pivotedCoefficients.dimention.col) {
            throw new TypeError(`pivotedCoefficients is not square Matrix.`);
        }
        let coefficients = pivotedCoefficients.copy();
        let pivots = new Vector(pivotedIndex);
        let size = coefficients.dimention.row;
        if (size !== b.length) {
            throw new TypeError(`b is not match size.`);
        }
        if (size !== pivots.length) {
            throw new TypeError(`pivotedIndex is not match size.`);
        }
        for (let k = 0; k < size - 1; k++) {
            let temp = result[k];
            result[k] = result[pivots[k]];
            result[pivots[k]] = temp;
            for (let i = k + 1; i < size; i++) {
                result[i] += coefficients[i][k] * result[k];
            }
        }
        result[size - 1] /= coefficients[size - 1][size - 1];
        for (let k = size - 2; k >= 0; k--) {
            let temp = result[k];
            for (let j = k + 1; j < size; j++) {
                temp -= coefficients[k][j] * result[j];
            }
            result[k] = temp / coefficients[k][k];
        }
        return result;
    },
    pivotSolveMatrix: (B, pivotedCoefficients, pivotedIndex) => {
        let result = Matrix.zeros(B.dimention.row, B.dimention.col);
        for (let i = 0; i < result.dimention.col; i++) {
            let vec = B.col(i).toArray();
            let solved = luDecomp.pivotSolve(vec, pivotedCoefficients, pivotedIndex);
            result.splice('col', i, 1, new Matrix(solved.toArray()).T().toArray())
        }
        return result;
    }
}

const sweepOutMethod = (...args) => {
    if (!Matrix.isMatrix(args[0])) {
        throw new TypeError(`matrix is not Matrix.`);
    };
    if (args[0].dimention.row !== args[0].dimention.col) {
        throw new Error(`coefficient matrix is not square.`);
    }
    let swep = args[0].copy(),
        det = 1.0,
        p = 1.0,
        size = swep.dimention.row,
        eps = Math.pow(2, -50),
        amax,
        ip;
    swep.splice('col', size, 0, Matrix.eye(size).toArray());
    if (typeof(args[1]) == 'number' && args[1] > 0) {
        eps = args[1];
    }
    for (let k = 0; k < size; k++) {
        amax = Math.abs(swep[k][k]);
        ip = k;
        for (let i = k + 1; i < size; i++) {
            if (Math.abs(swep[i][k]) > amax) {
                amax = Math.abs(swep[i][k]);
                ip = i;
            }
        }
        if (amax < eps) {
            throw new SingularMatrixError(`matrix is singular.`);
        }
        if (k !== ip) {
            let temp = swep[k];
            swep[k] = swep[ip];
            swep[ip] = temp;
            p *= -1;
        }
        det *= swep[k][k];
        let alpha = 1 / swep[k][k];
        for (let j = k; j < size * 2; j++) {
            swep[k][j] *= alpha;
        }
        for (let i = 0; i < size; i++) {
            if (i !== k) {
                let beta = swep[i][k];
                for (let j = k; j < size * 2; j++) {
                    swep[i][j] = swep[i][j] - beta * swep[k][j];
                }
            }
        }
    }
    det *= p;
    return {
        det,
        inv: swep.slice(0, size, size, size * 2)
    }
}
const inv = (...args) => {
    return sweepOutMethod(...args).inv;
}
const det = (...args) => {
    return sweepOutMethod(...args).det;
}
const isNonSingular = (...args) => {
    try {
        sweepOutMethod(...args);
    } catch (e) {
        if (e instanceof SingularMatrixError) {
            return false;
        }
    }
    return true;
}
const solve = (A, b) => {
    /*
        A * x = b or A * X = B
    */
    let prepared = luDecomp.pivotPrepare(A);

    let result;
    if (Matrix.isMatrix(b) && b.dimention.row !== 1 && b.dimention.col !== 1) {
        result = luDecomp.pivotSolve(b, prepared.decomposed, prepared.pivotedIndex);
    } else {
        result = luDecomp.pivotSolveMatrix(b, prepared.decomposed, prepared.pivotedIndex);
    }
    return result;
};
export default {
    luDecomp,
    sweepOutMethod,
    inv,
    det,
    isNonSingular,
    solve,
    SingularMatrixError
};
