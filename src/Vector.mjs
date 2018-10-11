/** ベクトルクラス 数値のみを保持するArraylikeなオブジェクト */
class Vector {
    /**
     * コンストラクタ
     * @param {...*} args
     *     1, 2, 3 数字を複数
     *     または、
     *     [1, 2, 3] 数字だけの配列を1つ受け取る。
     */
    constructor(...args) {
        let elements;
        if (args.length === 1 && Array.isArray(args[0]))
            elements = args[0];
        else
            elements = args;

        let i = 0;
        elements.forEach((value, index) => {
            //Arrayは抜けがある可能性があるため詰める
            //[1, 2, 3, empty × 997, 1000] (length:1001)
            // -> [1, 2, 3, 10000] (length:4)
            if (typeof(value) !== 'number') {
                throw new TypeError(`the ${index}-th argument is not number.`);
            }
            this[i++] = value;
        });
        this.length = i;
    }

    /**
     * splice
     *     https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
     *     破壊的操作を行う。
     *
     * @param {...number} args
     *     vector.splice(index, [howMany, [element1][, ..., elementN]])
     *     index: 変化させ始める要素の添え字
     *     howMany: ベクトルから取り除く要素の数を示す整数。howMany引数が何も指定されなかったら、
     *          index以降の全ての要素が取り除かれる。
     *     element1, ..., elementN: ベクトルに追加する要素。[element1, ..., elementN]と配列の形でも良い。
     * @return {Vector} 取り除かれた部分のベクトル
     *
     */
    splice(...args) {
        let startIndex = 0;
        let removeLength = 0;
        if (typeof(args[0]) === 'number') {
            if (args[0] >= 0) {
                startIndex = args[0];
                if (startIndex > this.length) {
                    startIndex = this.length;
                }
            } else {
                startIndex = this.length + args[0];
                if (startIndex < 0) {
                    startIndex = 0;
                }
            }
        }
        if (args.length < 2) {
            removeLength = this.length - startIndex;
        } else if (typeof(args[1]) === 'number') {
            removeLength = args[1];
            if (startIndex + removeLength > this.length) {
                removeLength = this.length - startIndex;
            }
        }
        let items = args.slice(2);
        if (Array.isArray(items[0])) {
            items = items[0];
        }
        items.forEach((item, index) => {
            if (typeof(item) !== 'number') {
                throw new TypeError(`the ${index}-th item is not number.`);
            }
        });
        let removed = [];
        for (let i = startIndex; i < startIndex + removeLength; i++) {
            removed.push(this[i]);
        }
        let tails = [];
        for (let i = startIndex + removeLength; i < this.length; i++) {
            tails.push(this[i]);
        }
        let refillIndex = startIndex;
        for (let item of items) {
            this[refillIndex++] = item;
        }
        for (let item of tails) {
            this[refillIndex++] = item;
        }
        for (let i = refillIndex; i < this.length; i++) {
            delete this[i];
        }
        this.length = refillIndex;
        return new Vector(removed);
    }

    /**
     * unshift
     *     https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
     *     破壊的操作を行う。
     *
     * @param {number} value ベクトルの先頭に追加される数値
     *
     * @return {number} valueが追加された後のベクトルの長さ
     *
     */
    unshift(value) {
        if (typeof(value) !== 'number') {
            throw new TypeError(`value is not number.`);
        }
        this.splice(0, 0, value);
        return this.length;
    }

    /**
     * shift
     *     https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
     *     破壊的操作を行う。
     *
     * @return {number} ベクトルの先頭から取り除かれた値
     *
     */
    shift() {
        return this.splice(0, 1)[0];
    }

    /**
     * push
     *     https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push
     *     破壊的操作を行う。
     *
     * @param {number} value ベクトルの末尾に追加される数値
     *
     * @return {number} valueが追加された後のベクトルの長さ
     *
     */
    push(value) {
        if (typeof(value) !== 'number') {
            throw new TypeError(`value is not number.`);
        }
        this.splice(this.length, 0, value);
        return this.length;
    }

    /**
     * pop
     *     https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
     *     破壊的操作を行う。
     *
     * @return {number} ベクトルの末尾から取り除かれた値
     *
     */
    pop() {
        return this.splice(-1, 1)[0];
    }

    /**
     * イタレータ
     */
    [Symbol.iterator]() {
        let index = 0;
        const self = this;
        return {
            next: () => ({
                value: self[index],
                done: !(index++ < self.length)
            })
        };
    }

    /**
     * forEach
     *     https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    forEach(...args) {
        const callback = args[0];
        if (typeof callback !== 'function') {
            throw new TypeError('callback is not a function');
        }
        let target;
        if (args.length > 1) {
            target = args[1];
        }

        for (let i = 0; i < this.length; i++) {
            callback.call(target, this[i], i, this);
        }
    }

    /**
     * toArray
     *     Arrayオブジェクトに変換する。
     *
     * @return {Array} 数値のみの配列
     *
     */
    toArray() {
        let arr = [];
        for (let val of this) {
            arr.push(val)
        }
        return arr;
    }

    /**
     * toString
     *     文字列に変換する。例：[1, 2, 3]
     *
     * @return {string} 数値とデリミタを連結した文字列を返す。
     *
     */
    toString() {
        let message = '[';
        let self = this;
        self.forEach((value, index) => {
                message += value;
                if (index !== self.length - 1)
                    message += ', ';
            }
        );
        return message + ']';
    }

    /**
     * copy
     *     自身を複製する。
     *
     * @return {Vector} 自身を複製したベクトル
     *
     */
    copy() {
        return new Vector(this.toArray());
    }

    /**
     * slice
     *     https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
     *
     * @param {number} start どこから取り出すかを示す 0 から始まる添字
     *     省略した場合は、0番目の要素から開始する。
     * @param {number} end どこまで取り出すかを示す 0 から始まる添字
     * @return {Vector} 指定された範囲の値を持つベクトル
     *
     */
    slice(start, end) {
        let startIndex = 0;
        let endIndex = this.length;
        if (typeof(start) === 'number') {
            if (start >= 0) {
                startIndex = start;
                if (startIndex > this.length) {
                    startIndex = this.length;
                }
            } else {
                startIndex = this.length + start;
                if (startIndex < 0) {
                    startIndex = 0;
                }
            }
        }
        if (typeof(end) === 'number') {
            if (end > 0) {
                endIndex = end;
                if (endIndex > this.length) {
                    endIndex = this.length;
                }
            } else {
                endIndex = this.length + end;
                if (endIndex < 0) {
                    endIndex = 0;
                }
            }
            if (startIndex > endIndex) {
                endIndex = startIndex
            }
        }
        let arr = [];
        for (let i = startIndex; i < endIndex; i++) {
            arr.push(this[i]);
        }
        return new Vector(arr);
    }

    /**
     * ope
     *     ベクトルの値すべてに四則演算を行う。
     *
     * @param {string} operator 四則演算記号("+", "-", "*", "/")のいずれか。
     * @param {number} scalar 四則演算される数値
     * @return {Vector} 四則演算された値のベクトル
     *
     */
    ope(operator, scolor) {
        const operators = ["+", "-", "*", "/"];
        if (typeof(operator) !== 'string') {
            throw new TypeError(`operator is not string.`);
        }
        if (typeof(scolor) !== 'number') {
            throw new TypeError(`scolor is not number.`);
        }
        let arr = this.toArray();
        for (let i = 0; i < arr.length; i++) {
            switch (operator) {
                case "+":
                    arr[i] += scolor;
                    break;
                case "-":
                    arr[i] -= scolor;
                    break;
                case "*":
                    arr[i] *= scolor;
                    break;
                case "/":
                    arr[i] /= scolor;
                    break;
                default:
                    throw new TypeError(`operator is not valid symbol.`);
            }
        }
        return new Vector(arr);
    }

    /**
     * add
     *     ベクトルの値すべてに足し算を行う。
     *
     * @param {number} scalar 足し算される数値
     * @return {Vector} 足し算された値のベクトル
     *
     */
    add(scolor) {
        return this.ope("+", scolor);
    }

    /**
     * sub
     *     ベクトルの値すべてに引き算を行う。
     *
     * @param {number} scalar 引き算される数値
     * @return {Vector} 引き算された値のベクトル
     *
     */
    sub(scolor) {
        return this.ope("-", scolor);
    }

    /**
     * mul
     *     ベクトルの値すべてにかけ算を行う。
     *
     * @param {number} scalar かけ算される数値
     * @return {Vector} かけ算された値のベクトル
     *
     */
    mul(scolor) {
        return this.ope("*", scolor);
    }

    /**
     * div
     *     ベクトルの値すべてに割り算を行う。
     *
     * @param {number} scalar 割り算される数値
     * @return {Vector} 割り算された値のベクトル
     *
     */
    div(scolor) {
        return this.ope("/", scolor);
    }

    /**
     * norm
     *     ベクトルの長さ（ノルム）を計算する。
     *
     * @return {number} 長さ
     *
     */
    norm() {
        let norm2 = 0;
        for (let val of this) {
            norm2 += val ** 2;
        }
        return Math.sqrt(norm2)
    }

    /**
     * unit
     *     単位ベクトルを返す。
     *
     * @return {Vector} 単位ベクトル
     *
     */
    unit() {
        return this.copy().div(this.norm());
    }

    /**
     * reverse
     *     保持する値の順番を逆にしたベクトルを返す。
     *
     * @return {Vector} 値の並び順が逆になったベクトル
     *
     */
    reverse() {
        return new Vector(this.toArray().reverse());
    }

    /**
     * zeros
     *     値がすべてゼロのベクトルを作る。
     *
     * @param {number} length 作成するベクトルの長さ。
     * @return {Vector} new Vector(0, ..., 0)
     *
     */
    static zeros(length) {
        if (typeof(length) !== 'number') {
            throw new TypeError(`length is not number.`);
        }
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(0);
        }
        return new Vector(arr);
    }

    /**
     * ones
     *     値がすべて1のベクトルを作る。
     *
     * @param {number} length 作成するベクトルの長さ。
     * @return {Vector} new Vector(1, ..., 1)
     *
     */
    static ones(length) {
        return Vector.zeros(length).add(1);
    }

    /**
     * range
     *     Vector.range(start, stop, step)
     *     numpy.rangeを参考している。
     *
     * @param {...number} args
     *     start: The value of the start parameter (or 0 if the parameter was not supplied)
     *     stop: The value of the stop parameter
     *     step: The value of the step parameter (or 1 if the parameter was not supplied)列の形でも良い。
     * @return {Vector} startからstop未満（step刻み）の数値のベクトル
     *
     */
    static range(...args) {
        let arr = [],
            start,
            stop,
            step = 1;
        if (args.length > 1) {
            start = args[0];
            stop = args[1];
        } else {
            start = 0;
            stop = args[0];
            if (stop < 0)
                stop = 0;
        }
        if (args.length > 2) {
            step = args[2];
        }
        if (typeof(start) !== 'number') {
            throw new TypeError(`start is not number.`);
        }
        if (typeof(stop) !== 'number') {
            throw new TypeError(`stop is not number.`);
        }
        if (typeof(step) !== 'number') {
            throw new TypeError(`step is not number.`);
        }
        if (step === 0) {
            throw new TypeError(`step must not be zero.`);
        }
        if (step > 0) {
            for (let i = start; i < stop; i += step) {
                arr.push(i);
            }
        } else {
            for (let i = start; i > stop; i += step) {
                arr.push(i);
            }
        }

        return new Vector(arr);
    }

    /**
     * isVector
     *     引数がVectorか判定する。
     *
     * @param {*} obj 判定対象
     * @return {boolean} Vectorクラスか否か
     *
     */
    static isVector(obj) {
        return obj.constructor.name === 'Vector';
    }

    /**
     * concat
     *     ベクトルを連結する。
     *
     * @param {...Vector} vectors
     *     連結したいベクトル vec(1), vec(2), ..., vec(n)
     * @return {Vector} 連結されたベクトル
     *
     */
    static concat(...vectors) {
        vectors.forEach((vector, index) => {
            if (!Vector.isVector(vector)) {
                throw new TypeError(`the ${index}-th argument is not vector.`);
            }
        });
        let result = new Vector();
        for (let vec of vectors) {
            result.splice(result.length, 0, vec.toArray());
        }
        return result;
    }

    /**
     * sum
     *     ベクトルの各要素を足し算する。
     *
     * @param {...Vector} vectors
     *     足し合わせたいベクトル vec(1), vec(2), ..., vec(n)
     * @return {Vector} 足し算された値のベクトル
     *
     */
    static sum(...vectors) {
        vectors.forEach((vector, index) => {
            if (!Vector.isVector(vector)) {
                throw new TypeError(`the ${index}-th argument is not vector.`);
            }
        });
        let result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            if (result.length !== vectors[i].length) {
                throw new TypeError(`the ${i}-th vector don\'t match size.`);
            }
            let vec = vectors[i];
            for (let j = 0; j < result.length; j++) {
                result[j] += vec[j];
            }
        }
        return result;
    }

    /**
     * dot
     *     ベクトルの内積を計算する。
     *
     * @param {Vector} vec1 内積するベクトル1
     * @param {Vector} vec2 内積するベクトル2
     * @return {number} 内積の値
     *
     */
    static dot(vec1, vec2) {
        if (!Vector.isVector(vec1)) {
            throw new TypeError(`the 0-th argument is not Vector.`);
        }
        if (!Vector.isVector(vec2)) {
            throw new TypeError(`the 1-th argument is not Vector.`);
        }
        if (vec1.length !== vec2.length) {
            throw new TypeError(`don\'t match Vector size.`);
        }
        let result = 0;
        for (let i = 0; i < vec1.length; i++) {
            result += vec1[i] * vec2[i];
        }
        return result;
    }

    /**
     * cross
     *     ベクトルの外積を計算する。
     *
     * @param {Vector} vec1 外積するベクトル1（長さ3）
     * @param {Vector} vec2 外積するベクトル2（長さ3）
     * @return {Vector} 外積ベクトル
     *
     */
    static cross(vec1, vec2) {
        if (!Vector.isVector(vec1) || vec1.length !== 3) {
            throw new TypeError(`the 0-th argument is not Vector(3-dim).`);
        }
        if (!Vector.isVector(vec2) || vec2.length !== 3) {
            throw new TypeError(`the 1-th argument is not Vector(3-dim).`);
        }
        let arr = [
            vec1[1] * vec2[2] - vec1[2] * vec2[1],
            vec1[2] * vec2[0] - vec1[0] * vec2[2],
            vec1[0] * vec2[1] - vec1[1] * vec2[0]
        ];
        return new Vector(arr);
    }
}

export default Vector;
