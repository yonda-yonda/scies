import Vector from './Vector.mjs';
function toIterable(items) {
    if (typeof(items.length) === 'undefined') {
        throw new TypeError(`items must be arraylike object(has length).`);
    }
    let self = items;
    self[Symbol.iterator] = () => {
        let index = 0;
        return {
            next: () => ({
                value: self[index],
                done: !(index++ < self.length)
            })
        };
    };
    self['forEach'] = (...args) => {
        const callback = args[0];
        if (typeof callback !== 'function') {
            throw new TypeError('callback is not a function');
        }
        let target;
        if (args.length > 1) {
            target = args[1];
        }
        for (let i = 0; i < self.length; i++) {
            callback.call(target, self[i], i, self);
        }
    };
    return self;
}
class Matrix {
    constructor(...args) {
        let matArr;
        if (args.length === 1 && Array.isArray(args[0]) && Array.isArray(args[0][0]))
            matArr = args[0];
        else
            matArr = args
        const colLengths = Array.from(new Set(matArr.map((arr) => {
            return arr.length
        })));
        if (colLengths.length !== 1) {
            throw new TypeError('don\'t match column length.');
        }
        let rowIndex = 0,
            colIndex = 0;
        if (matArr.length > 0 && colLengths[0] > 0) {
            matArr.forEach((row, argRowIndex) => {
                row.forEach((value, argColIndex) => {
                    if (typeof(value) !== 'number') {
                        throw new TypeError(`argument(${argRowIndex},${argColIndex}) is not number.`);
                    }
                });
            });
            //Arrayは抜けがある可能性があるため詰める
            matArr.forEach((row) => {
                this[rowIndex] = {};
                colIndex = 0;
                row.forEach((value) => {
                    this[rowIndex][colIndex++] = value;
                });
                ++rowIndex;
            });
        }
        this.dimention = {
            row: rowIndex,
            col: colIndex
        }
    };
    splice(...args) {
        let direction;
        let startIndex = 0;
        let removeLength = 0;
        if (args[0] !== 'row' && args[0] !== 'col') {
            throw new TypeError(`direction must be row or col.`);
        }
        if (args[0] === 'row') {
            direction = 'row';
        } else {
            direction = 'col';
        }
        if (typeof(args[1]) === 'number') {
            if (args[1] >= 0) {
                startIndex = args[1];
                if (startIndex > this.dimention[direction]) {
                    startIndex = this.dimention[direction];
                }
            } else {
                startIndex = this.dimention[direction] + args[1];
                if (startIndex < 0) {
                    startIndex = 0;
                }
            }
        }
        if (args.length < 3) {
            removeLength = this.dimention[direction] - startIndex;
        } else if (typeof(args[2]) === 'number') {
            removeLength = args[2];
            if (startIndex + removeLength > this.dimention[direction]) {
                removeLength = this.dimention[direction] - startIndex;
            }
        }
        let items = args.slice(3);
        if (Array.isArray(items[0]) && Array.isArray(items[0][0])) {
            items = items[0];
        }
        let removed = [];
        if (direction === 'row') {
            items.forEach((row, rowIndex) => {
                if (!Array.isArray(row)) {
                    throw new TypeError(`the ${rowIndex}-th item is not Array.`);
                }
                if (row.length !== this.dimention.col) {
                    throw new TypeError(`don\'t match col length.`);
                }
                row.forEach((val, colIndex) => {
                    if (typeof(val) !== 'number') {
                        throw new TypeError(`item(${rowIndex}, ${colIndex}) is not number.`);
                    }
                });
            });
            for (let i = startIndex; i < startIndex + removeLength; i++) {
                let row = []
                for (let j = 0; j < this.dimention.col; j++) {
                    row.push(this[i][j]);
                }
                removed.push(row);
            }
            let tails = [];
            for (let i = startIndex + removeLength; i < this.dimention.row; i++) {
                tails.push(this[i]);
            }
            let refillIndex = startIndex;
            for (let item of items) {
                let row = {},
                    index = 0;
                for (let val of item) {
                    row[index++] = val;
                };
                this[refillIndex++] = row;
            }
            for (let item of tails) {
                this[refillIndex++] = item;
            }
            for (let i = refillIndex; i < this.dimention.row; i++) {
                delete this[i];
            }
            this.dimention.row = refillIndex;
            if (refillIndex === 0)
                this.dimention.col = 0;
            }
        else {
            if (items.length > 0 && items.length !== this.dimention.row) {
                throw new TypeError(`don\'t match row length.`);
            }
            items.forEach((row, rowIndex) => {
                if (!Array.isArray(row)) {
                    throw new TypeError(`the ${rowIndex}-th item is not Array.`);
                }
                row.forEach((val, colIndex) => {
                    if (typeof(val) !== 'number') {
                        throw new TypeError(`item(${rowIndex}, ${colIndex}) is not number.`);
                    }
                });
            });
            for (let i = 0; i < this.dimention.row; i++) {
                let row = []
                for (let j = startIndex; j < startIndex + removeLength; j++) {
                    row.push(this[i][j]);
                }
                removed.push(row);
            }
            let tails = [];
            for (let i = 0; i < this.dimention.row; i++) {
                let row = [];
                for (let j = startIndex + removeLength; j < this.dimention.col; j++) {
                    row.push(this[i][j]);
                }
                tails.push(row);
            }
            let refillIndex;
            for (let i = 0; i < this.dimention.row; i++) {
                let row = {};
                for (let j = 0; j < startIndex; j++) {
                    row[j] = this[i][j];
                }
                refillIndex = startIndex;
                if (Array.isArray(items[i])) {
                    for (let val of items[i]) {
                        row[refillIndex++] = val;
                    }
                }

                if (Array.isArray(tails[i])) {
                    for (let val of tails[i]) {
                        row[refillIndex++] = val;
                    }
                }
                this[i] = row;
            }
            this.dimention.col = refillIndex;
            if (refillIndex === 0)
                this.dimention.row = 0;
            }
        return new Matrix(removed);
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
        for (let i = 0; i < this.dimention.row; i++) {
            for (let j = 0; j < this.dimention.col; j++) {
                switch (operator) {
                    case "+":
                        arr[i][j] += scolor;
                        break;
                    case "-":
                        arr[i][j] -= scolor;
                        break;
                    case "*":
                        arr[i][j] *= scolor;
                        break;
                    case "/":
                        arr[i][j] /= scolor;
                        break;
                    default:
                        throw new TypeError(`operator is not valid symbol.`);
                }
            }
        }
        return new Matrix(arr);
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
    slice(startRow, startCol, endRow, endCol) {
        let rowIndex = {
            start: 0,
            end: this.dimention.row
        };
        let colIndex = {
            start: 0,
            end: this.dimention.col
        };
        if (typeof(startRow) === 'number') {
            if (startRow >= 0) {
                rowIndex.start = startRow;
                if (rowIndex.start > this.dimention.row) {
                    rowIndex.start = this.dimention.row;
                }
            } else {
                rowIndex.start = this.dimention.row + startRow;
                if (rowIndex.start < 0) {
                    rowIndex.start = 0;
                }
            }
        }
        if (typeof(endRow) === 'number') {
            if (endRow > 0) {
                rowIndex.end = endRow;
                if (rowIndex.end > this.dimention.row) {
                    rowIndex.end = this.dimention.row;
                }
            } else {
                rowIndex.end = this.dimention.row + endRow;
                if (rowIndex.end < 0) {
                    rowIndex.end = 0;
                }
            }
            if (rowIndex.start > rowIndex.end) {
                rowIndex.end = rowIndex.start
            }
        }
        if (typeof(startCol) === 'number') {
            if (startCol >= 0) {
                colIndex.start = startCol;
                if (colIndex.start > this.dimention.col) {
                    colIndex.start = this.dimention.col;
                }
            } else {
                colIndex.start = this.dimention.col + startCol;
                if (colIndex.start < 0) {
                    colIndex.start = 0;
                }
            }
        }
        if (typeof(endCol) === 'number') {
            if (endCol > 0) {
                colIndex.end = endCol;
                if (colIndex.end > this.dimention.col) {
                    colIndex.end = this.dimention.col;
                }
            } else {
                colIndex.end = this.dimention.col + endCol;
                if (colIndex.end < 0) {
                    colIndex.end = 0;
                }
            }
            if (colIndex.start > colIndex.end) {
                colIndex.end = colIndex.start
            }
        }
        let rowArr = [];
        for (let i = rowIndex.start; i < rowIndex.end; i++) {
            let colArr = [];
            for (let j = colIndex.start; j < colIndex.end; j++) {
                colArr.push(this[i][j]);
            }
            rowArr.push(colArr);
        }
        return new Matrix(rowArr);
    };
    toArray() {
        let matArr = [];
        for (let rowVector of this.rows()) {
            let row = [];
            for (let value of rowVector) {
                row.push(value)
            }
            matArr.push(row);
        }
        return matArr;
    };
    toString() {
        let message = '[';
        for (let i = 0; i < this.dimention.row; i++) {
            message += this.row(i).toString();
            if (i !== this.dimention.row - 1) {
                message += ', ';
            }
        }
        return message + ']';
    };
    copy() {
        return new Matrix(this.toArray());
    };
    row(index) {
        let row;
        if (typeof(index) === 'number') {
            if (index >= 0) {
                row = index;
                if (row >= this.dimention.row) {
                    return new Vector([]);
                }
            } else {
                row = this.dimention.row + index;
                if (row < 0) {
                    return new Vector([]);
                }
            }
        }
        let rowArr = [];
        for (let i = 0; i < this.dimention.col; i++) {
            rowArr.push(this[row][i]);
        }
        return new Vector(rowArr);
    };
    col(index) {
        let col;
        if (typeof(index) === 'number') {
            if (index >= 0) {
                col = index;
                if (col >= this.dimention.col) {
                    return new Vector([]);
                }
            } else {
                col = this.dimention.col + index;
                if (col < 0) {
                    return new Vector([]);
                }
            }
        }
        let colArr = [];
        for (let i = 0; i < this.dimention.row; i++) {
            colArr.push(this[i][col]);
        }
        return new Vector(colArr);
    };
    rows(start, end) {
        let startIndex = 0;
        let endIndex = this.dimention.row;
        if (typeof(start) === 'number') {
            if (start >= 0) {
                startIndex = start;
                if (startIndex > this.dimention.row) {
                    startIndex = this.dimention.row;
                }
            } else {
                startIndex = this.dimention.row + start;
                if (startIndex < 0) {
                    startIndex = 0;
                }
            }
        }
        if (typeof(end) === 'number') {
            if (end >= 0) {
                endIndex = end;
                if (endIndex > this.dimention.row) {
                    endIndex = this.dimention.row;
                }
            } else {
                endIndex = this.dimention.row + end;
                if (endIndex < 0) {
                    endIndex = 0;
                }
            }
            if (startIndex > endIndex) {
                endIndex = startIndex
            }
        }
        let items = {};
        items['length'] = 0;
        for (let i = startIndex; i < endIndex; i++) {
            items[items.length++] = this.row(i);
        }
        return toIterable(items);
    };
    cols(start, end) {
        let startIndex = 0;
        let endIndex = this.dimention.col;
        if (typeof(start) === 'number') {
            if (start >= 0) {
                startIndex = start;
                if (startIndex > this.dimention.col) {
                    startIndex = this.dimention.col;
                }
            } else {
                startIndex = this.dimention.col + start;
                if (startIndex < 0) {
                    startIndex = 0;
                }
            }
        }
        if (typeof(end) === 'number') {
            if (end >= 0) {
                endIndex = end;
                if (endIndex > this.dimention.col) {
                    endIndex = this.dimention.col;
                }
            } else {
                endIndex = this.dimention.col + end;
                if (endIndex < 0) {
                    endIndex = 0;
                }
            }
            if (startIndex > endIndex) {
                endIndex = startIndex
            }
        }
        let items = {};
        items['length'] = 0;
        for (let i = startIndex; i < endIndex; i++) {
            items[items.length++] = this.col(i);
        }
        return toIterable(items);
    };
    transpose() {
        let mat = Matrix.zeros(this.dimention.col, this.dimention.row)
        for (let i = 0; i < this.dimention.row; i++) {
            for (let j = 0; j < this.dimention.col; j++) {
                mat[j][i] = this[i][j];
            }
        }
        return mat;
    };
    T() {
        return this.transpose()
    };
    static zeros(...args) {
        let row,
            col;
        row = args[0];
        col = typeof(args[1]) === 'undefined'
            ? args[0]
            : args[1];
        if (typeof(row) !== 'number') {
            throw new TypeError(`row is not number.`);
        }
        if (typeof(col) !== 'number') {
            throw new TypeError(`col is not number.`);
        }
        let matArr = []
        for (let i = 0; i < row; i++) {
            let rowArr = [];
            for (let j = 0; j < col; j++) {
                rowArr.push(0);
            }
            matArr.push(rowArr);
        }
        return new Matrix(matArr);
    };
    static ones(...args) {
        return Matrix.zeros(...args).add(1);
    };
    static eye(...args) {
        let row,
            col,
            pos;
        row = args[0];
        col = typeof(args[1]) === 'undefined'
            ? args[0]
            : args[1];
        pos = typeof(args[2]) === 'undefined'
            ? 0
            : args[2];
        if (typeof(row) !== 'number') {
            throw new TypeError(`row is not number.`);
        }
        if (typeof(col) !== 'number') {
            throw new TypeError(`col is not number.`);
        }
        if (typeof(pos) !== 'number') {
            throw new TypeError(`pos is not number.`);
        }
        let mat = Matrix.zeros(row, col);
        const size = row > col
            ? row
            : col;
        if (pos >= 0) {
            if (pos > mat.dimention.col)
                pos = mat.dimention.col;
            for (let i = 0; i < size; i++) {
                if (typeof(mat[i]) === 'undefined' || typeof(mat[i][i + pos]) === 'undefined')
                    break;
                mat[i][i + pos] = 1;
            }
        } else {
            pos *= -1;
            if (pos > mat.dimention.row)
                pos = mat.dimention.row;
            for (let i = 0; i < size; i++) {
                if (typeof(mat[i + pos]) === 'undefined' || typeof(mat[i + pos][i]) === 'undefined')
                    break;
                mat[i + pos][i] = 1;
            }
        }
        return mat;
    };
    static isMatrix(obj) {
        return obj.constructor.name === 'Matrix';
    };
    static hstack(...mats) {
        mats.forEach((mat, index) => {
            if (!Matrix.isMatrix(mat)) {
                throw new TypeError(`the ${index}-th argument is not Matrix.`);
            }
        });
        if (Array.from(new Set(mats.map((mat) => {
            return mat.dimention.row
        }))).length !== 1) {
            throw new TypeError('don\'t match row length.');
        }
        let result = mats[0].copy();
        for (let i = 1; i < mats.length; i++) {
            result.splice('col', result.dimention.col, 0, mats[i].toArray());
        }
        return result;
    };
    static vstack(...mats) {
        mats.forEach((mat, index) => {
            if (!Matrix.isMatrix(mat)) {
                throw new TypeError(`the ${index}-th argument is not Matrix.`);
            }
        });
        if (Array.from(new Set(mats.map((mat) => {
            return mat.dimention.col
        }))).length !== 1) {
            throw new TypeError('don\'t match col length.');
        }
        let result = mats[0].copy();
        for (let i = 1; i < mats.length; i++) {
            result.splice('row', result.dimention.row, 0, mats[i].toArray());
        }
        return result;
    };
};
export default Matrix;
