import Matrix from './Matrix.mjs';
import Vector from './Vector.mjs';

/** 非正則行列エラー */
class SingularMatrixError extends Error {
    /**
     * コンストラクタ
     * @param {string} message エラーメッセージ
     *     https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel
     */
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, SingularMatrixError.prototype);
        this.name = this.constructor.name;
    }
}

/** LU分解 */
const luDecomp = {
    /**
     * pivotPrepare
     *     ピボット型LU分解により連立一次方程式(A * x = b)を解く事前準備
     *
     * @param {Matrix} A 係数行列
     * @param {number=} e 打ち切り誤差
     * @return {Object}
     *     decomposed: 連立一次方程式を解くのに用いる値の一時保持行列(Matrix)
     *     pivotedIndex: ピボットする添字配列(Array)
     *
     */
    pivotPrepare: (A, e) => {
        if (!Matrix.isMatrix(A)) {
            throw new TypeError(`A is not Matrix.`);
        }

        if (A.dimention.row !== A.dimention.col) {
            throw new Error(`A is not square.`);
        }
        let coefficients = A.copy();
        let amax,
            ip,
            size = coefficients.dimention.row,
            eps = Math.pow(2, -50),
            result = coefficients.copy(),
            pivots = Vector.zeros(size);
        if (typeof(e) == 'number' && e > 0) {
            eps = e;
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
    /**
     * pivotSolve
     *     ピボット型LU分解により連立一次方程式(A * x = b)を解く
     *
     * @param {Matrix|Vector|Array} b 連立一次方程式の右辺
     * @param {number} pivotedCoefficients
     *     連立一次方程式を解くのに用いる値の一時保持行列
     * @param {Array} pivotedIndex ピボットする添字配列
     * @return {Vector} 解
     *
     */
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
    /**
     * pivotSolveMatrix
     *     ピボット型LU分解により連立一次方程式(A * x = B)を解く
     *
     * @param {Matrix} B 連立一次方程式の右辺
     * @param {number} pivotedCoefficients
     *     連立一次方程式を解くのに用いる値の一時保持行列
     * @param {Array} pivotedIndex ピボットする添字配列
     * @return {Matrix} 解
     *
     */
    pivotSolveMatrix: (B, pivotedCoefficients, pivotedIndex) => {
        let result = Matrix.zeros(B.dimention.row, B.dimention.col);
        for (let i = 0; i < result.dimention.col; i++) {
            let vec = B.col(i).toArray();
            let solved = luDecomp.pivotSolve(vec, pivotedCoefficients, pivotedIndex);
            result.splice('col', i, 1, new Matrix(solved.toArray()).T().toArray())
        }
        return result;
    }
};

/**
 * sweepOutMethod
 *     掃き出し法による逆行列と行列式を求める。
 *
 * @param {Matrix} mat 正方行列
 * @param {number=} e 打ち切り誤差
 * @return {Object}
 *     det: 行列式
 *     inv: 逆行列
 *
 */
const sweepOutMethod = (mat, e) => {
    if (!Matrix.isMatrix(mat)) {
        throw new TypeError(`matrix is not Matrix.`);
    }

    if (mat.dimention.row !== mat.dimention.col) {
        throw new Error(`coefficient matrix is not square.`);
    }
    let swep = mat.copy(),
        det = 1.0,
        p = 1.0,
        size = swep.dimention.row,
        eps = Math.pow(2, -50),
        amax,
        ip;
    swep.splice('col', size, 0, Matrix.eye(size).toArray());
    if (typeof(e) == 'number' && e > 0) {
        eps = e;
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
};

/**
 * inv
 *     逆行列を求める。
 *
 * @param {...*} args 引数はsweepOutMethodに準拠
 * @return {Matrix} 行列式
 *
 */
const inv = (...args) => {
    return sweepOutMethod(...args).inv;
};

/**
 * det
 *     行列式を求める。
 *
 * @param {...*} args 引数はsweepOutMethodに準拠
 * @return {number} 行列式
 *
 */
const det = (...args) => {
    return sweepOutMethod(...args).det;
};

/**
 * isNonSingular
 *     正則行列か判定する。
 *
 * @param {...*} args 引数はsweepOutMethodに準拠
 * @return {boolean} 正則行列か否か
 *
 */
const isNonSingular = (...args) => {
    try {
        sweepOutMethod(...args);
    } catch (e) {
        if (e instanceof SingularMatrixError) {
            return false;
        }
    }
    return true;
};

/**
 * solve
 *     連立一次方程式(A * x = b or A * x = B)を解く
 *
 * @param {Matrix} A 係数行列
 * @param {Matrix|Vector|Array} b 右辺
 * @param {number=} e 打ち切り誤差
 * @return {Vector} 解
 *
 */
const solve = (A, b, e) => {
    let prepared = luDecomp.pivotPrepare(A);

    let result;
    if (Matrix.isMatrix(b) && b.dimention.row !== 1 && b.dimention.col !== 1) {
        result = luDecomp.pivotSolveMatrix(b, prepared.decomposed, prepared.pivotedIndex);
    } else {
        result = luDecomp.pivotSolve(b, prepared.decomposed, prepared.pivotedIndex);
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
