class Vector {
    constructor(...args) {
        let elements;
        if (args.length === 1 && Array.isArray(args[0]))
            elements = args[0];
        else
            elements = args
        let i = 0;
        elements.forEach((value, index) => {
            //Arrayは抜けがある可能性があるため詰める
            //[1, 2, 3, empty × 997, 1000] length 1001
            // -> [1, 2, 3, 10000] lenght 4
            if (typeof(value) !== 'number') {
                throw new TypeError(`the ${index}-th argument is not number.`);
            }
            this[i++] = value;
        });
        this.length = i;
    };
    splice(...args) {
        //https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
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
    };
    unshift(value) {
        if (typeof(value) !== 'number') {
            throw new TypeError(`value is not number.`);
        }
        this.splice(0, 0, value);
        return this.length;
    };
    shift() {
        return this.splice(0, 1)[0];
    };
    push(value) {
        if (typeof(value) !== 'number') {
            throw new TypeError(`value is not number.`);
        }
        this.splice(this.length, 0, value);
        return this.length;
    };
    pop() {
        return this.splice(-1, 1)[0];
    };
    [Symbol.iterator]() {
        let index = 0;
        const self = this;
        return {
            next: () => ({
                value: self[index],
                done: !(index++ < self.length)
            })
        };
    };
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
    };
    toArray() {
        let arr = [];
        for (let val of this) {
            arr.push(val)
        }
        return arr;
    };
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
    };
    copy() {
        return new Vector(this.toArray());
    };
    slice(start, end) {
        //https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
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
    };
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
    };
    add(scolor) {
        return this.ope("+", scolor);
    };
    sub(scolor) {
        return this.ope("-", scolor);
    };
    mul(scolor) {
        return this.ope("*", scolor);
    };
    div(scolor) {
        return this.ope("/", scolor);
    };
    norm() {
        let norm2 = 0;
        for (let val of this) {
            norm2 += val ** 2;
        }
        return Math.sqrt(norm2)
    };
    unit() {
        return this.copy().div(this.norm());
    };
    reverse() {
        return new Vector(this.toArray().reverse());
    };
    static zeros(length) {
        if (typeof(length) !== 'number') {
            throw new TypeError(`length is not number.`);
        }
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(0);
        }
        return new Vector(arr);
    };
    static ones(length) {
        return Vector.zeros(length).add(1);
    };
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
    };
    static isVector(obj) {
        return obj.constructor.name === 'Vector';
    };
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
    };
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
    };
};
export default Vector
