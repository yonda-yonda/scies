import Matrix from '../src/Matrix.mjs';
import Vector from '../src/Vector.mjs';
import chai from 'chai';
const expect = chai.expect;
describe('Matrix Class', function() {
  describe('constructor:', function() {
    it('has dimention.', function() {
      let mat = new Matrix([
        1, 2, 3
      ], [10, 20, 30]);
      expect(mat.dimention.row).to.equal(2);
      expect(mat.dimention.col).to.equal(3);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [10, 20, 30]
      ]);
    });

    it('create from array.', function() {
      let mat = new Matrix([
        [
          1, 2, 3
        ],
        [10, 20, 30]
      ]);
      expect(mat.dimention.row).to.equal(2);
      expect(mat.dimention.col).to.equal(3);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [10, 20, 30]
      ]);
    });

    it('can be passed Infinity.', function() {
      let mat = new Matrix([
        1, 2, 3
      ], [10, 20, Infinity]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [10, 20, Infinity]
      ]);
    });

    it('must be passed only Number.', function() {
      expect(function() {
        new Matrix([
          1, 2, 3
        ], ['10', 20, 30]);
      }).to.throw('argument(1,0) is not number.');
    });
  });
  describe('toArray:', function() {
    it('converts to array.', function() {
      let mat = new Matrix([
        1, 2, 3
      ], [10, 20, 30]);
      let converted = mat.toArray();
      expect(Array.isArray(converted)).to.equal(true);
      expect(converted.length).to.equal(mat.dimention.row);
      expect(Array.isArray(converted[0])).to.equal(true);
      expect(converted[0].length).to.equal(mat.dimention.col);
    });
  });

  describe('toString:', function() {
    it('converts to string.', function() {
      let mat = new Matrix([
        1, 2, 3
      ], [10, 20, 30]);
      expect(mat.toString()).to.equal('[[1, 2, 3], [10, 20, 30]]');
    });
  });

  describe('copy:', function() {
    it('duplicate oneself.', function() {
      let mat = new Matrix([
        1, 2, 3
      ], [10, 20, 30]);
      let clone = mat.copy();
      clone[0][0] = 100;
      expect(clone.toArray()).to.deep.equal([
        [
          100, 2, 3
        ],
        [10, 20, 30]
      ]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [10, 20, 30]
      ]);
    });
  });

  describe('row:', function() {
    let mat;
    beforeEach(function() {
      mat = new Matrix([
        1, 2, 3
      ], [10, 20, 30]);
    });

    it('create Vector object.', function() {
      expect(Vector.isVector(mat.row(1))).to.equal(true);
    });

    it('is passed (1).', function() {
      expect(mat.row(1).toArray()).to.deep.equal([10, 20, 30]);
    });

    it('is passed (length).', function() {
      expect(mat.row(mat.dimention.row).toArray()).to.deep.equal([]);
    });

    it('is passed (-1).', function() {
      expect(mat.row(-1).toArray()).to.deep.equal([10, 20, 30]);
    });

    it('is passed (1.7).', function() {
      expect(mat.row(1.7).toArray()).to.deep.equal([10, 20, 30]);
    });

    it('is passed (-1.2).', function() {
      expect(mat.row(-1.2).toArray()).to.deep.equal([10, 20, 30]);
    });

    it('is passed (-10).', function() {
      expect(mat.row(-10).toArray()).to.deep.equal([]);
    });
  });

  describe('col:', function() {
    let mat;
    beforeEach(function() {
      mat = new Matrix([
        1, 2, 3
      ], [10, 20, 30]);
    });

    it('create Vector object.', function() {
      expect(Vector.isVector(mat.col(1))).to.equal(true);
    });

    it('is passed (1).', function() {
      expect(mat.col(1).toArray()).to.deep.equal([2, 20]);
    });

    it('is passed (length).', function() {
      expect(mat.col(mat.dimention.col).toArray()).to.deep.equal([]);
    });

    it('is passed (-1).', function() {
      expect(mat.col(-1).toArray()).to.deep.equal([3, 30]);
    });

    it('is passed (1.6).', function() {
      expect(mat.col(1.6).toArray()).to.deep.equal([2, 20]);
    });

    it('is passed (-1.5).', function() {
      expect(mat.col(-1.5).toArray()).to.deep.equal([3, 30]);
    });

    it('is passed (-10).', function() {
      expect(mat.col(-10).toArray()).to.deep.equal([]);
    });
  });

  describe('rows:', function() {
    let mat;
    beforeEach(function() {
      mat = new Matrix([
        1, 2, 3, 4
      ], [
        10, 20, 30, 40
      ], [
        100, 200, 300, 400
      ], [1000, 2000, 3000, 4000]);
    });

    it('create arraylike object.', function() {
      let rows = mat.rows(2);

      for (let row of rows) {
        expect(Vector.isVector(row)).to.equal(true);
      }

      let expectedIndex = 0,
        target = 'is treated as "this" in callback.';
      rows.forEach((value, index, inner) => {
        expect(Vector.isVector(value)).to.equal(true);
        expect(index).to.equal(expectedIndex++);
        expect(inner).to.deep.equal(rows);
      });

      rows.forEach(function(value, index, inner) {
        expect(this).to.deep.equal(undefined);
      });

      rows.forEach(function(value, index, inner) {
        expect(this).to.deep.equal(target);
      }, target);
    });

    it('is passed (2).', function() {
      let rows = mat.rows(2);
      expect(rows[0].toArray()).to.deep.equal([100, 200, 300, 400]);
      expect(rows[1].toArray()).to.deep.equal([1000, 2000, 3000, 4000]);
      expect(rows.length).to.equal(2);
    });

    it('is passed (2, 3).', function() {
      let rows = mat.rows(2, 3);
      expect(rows[0].toArray()).to.deep.equal([100, 200, 300, 400]);
      expect(rows.length).to.equal(1);
    });

    it('is passed (2, 10).', function() {
      let rows = mat.rows(2, 10);
      expect(rows[0].toArray()).to.deep.equal([100, 200, 300, 400]);
      expect(rows[1].toArray()).to.deep.equal([1000, 2000, 3000, 4000]);
      expect(rows.length).to.equal(2);
    });

    it('is passed (-1).', function() {
      let rows = mat.rows(-1);
      expect(rows[0].toArray()).to.deep.equal([1000, 2000, 3000, 4000]);
      expect(rows.length).to.equal(1);
    });

    it('is passed (1, -2).', function() {
      let rows = mat.rows(1, -2);
      expect(rows[0].toArray()).to.deep.equal([10, 20, 30, 40]);
      expect(rows.length).to.equal(1);
    });

    it('is passed (-10).', function() {
      let rows = mat.rows(-10);
      expect(rows[0].toArray()).to.deep.equal([1, 2, 3, 4]);
      expect(rows[1].toArray()).to.deep.equal([10, 20, 30, 40]);
      expect(rows[2].toArray()).to.deep.equal([100, 200, 300, 400]);
      expect(rows[3].toArray()).to.deep.equal([1000, 2000, 3000, 4000]);
      expect(rows.length).to.equal(4);
    });

    it('is passed (-1, 0).', function() {
      let rows = mat.rows(-1, 0);
      expect(rows[0]).to.equal(undefined);
      expect(rows.length).to.equal(0);
    });

    it('is passed (1.7, 2.7).', function() {
      let rows = mat.rows(1.7, 2.7);
      expect(rows[0].toArray()).to.deep.equal([10, 20, 30, 40]);
      expect(rows.length).to.equal(1);
    });

    it('is passed (1.3, -2.7).', function() {
      let rows = mat.rows(1.3, -2.7);
      expect(rows[0].toArray()).to.deep.equal([10, 20, 30, 40]);
      expect(rows.length).to.equal(1);
    });

  });

  describe('cols:', function() {
    let mat;
    beforeEach(function() {
      mat = new Matrix([
        1, 2, 3, 4
      ], [
        10, 20, 30, 40
      ], [
        100, 200, 300, 400
      ], [1000, 2000, 3000, 4000]);
    });

    it('create arraylike object.', function() {
      let cols = mat.cols(2);

      for (let col of cols) {
        expect(Vector.isVector(col)).to.equal(true);
      }

      let expectedIndex = 0,
        target = 'is treated as "this" in callback.';
      cols.forEach((value, index, inner) => {
        expect(Vector.isVector(value)).to.equal(true);
        expect(index).to.equal(expectedIndex++);
        expect(inner).to.deep.equal(cols);
      });

      cols.forEach(function(value, index, inner) {
        expect(this).to.deep.equal(undefined);
      });

      cols.forEach(function(value, index, inner) {
        expect(this).to.deep.equal(target);
      }, target);
    });

    it('is passed (2).', function() {
      let cols = mat.cols(2);
      expect(cols[0].toArray()).to.deep.equal([3, 30, 300, 3000]);
      expect(cols[1].toArray()).to.deep.equal([4, 40, 400, 4000]);
      expect(cols.length).to.equal(2);
    });

    it('is passed (2, 3).', function() {
      let cols = mat.cols(2, 3);
      expect(cols[0].toArray()).to.deep.equal([3, 30, 300, 3000]);
      expect(cols.length).to.equal(1);
    });

    it('is passed (2, 10).', function() {
      let cols = mat.cols(2, 10);
      expect(cols[0].toArray()).to.deep.equal([3, 30, 300, 3000]);
      expect(cols[1].toArray()).to.deep.equal([4, 40, 400, 4000]);
      expect(cols.length).to.equal(2);
    });

    it('is passed (1, -2).', function() {
      let cols = mat.cols(1, -2);
      expect(cols[0].toArray()).to.deep.equal([2, 20, 200, 2000]);
      expect(cols.length).to.equal(1);
    });

    it('is passed (-1).', function() {
      let cols = mat.cols(-1);
      expect(cols[0].toArray()).to.deep.equal([4, 40, 400, 4000]);
      expect(cols.length).to.equal(1);
    });

    it('is passed (-10).', function() {
      let cols = mat.cols(-10);
      expect(cols[0].toArray()).to.deep.equal([1, 10, 100, 1000]);
      expect(cols[1].toArray()).to.deep.equal([2, 20, 200, 2000]);
      expect(cols[2].toArray()).to.deep.equal([3, 30, 300, 3000]);
      expect(cols[3].toArray()).to.deep.equal([4, 40, 400, 4000]);
      expect(cols.length).to.equal(4);
    });

    it('is passed (-1, 0).', function() {
      let cols = mat.cols(-1, 0);
      expect(cols[0]).to.equal(undefined);
      expect(cols.length).to.equal(0);
    });

    it('is passed (1.2, 2.7).', function() {
      let cols = mat.cols(1.2, 2.7);
      expect(cols[0].toArray()).to.deep.equal([2, 20, 200, 2000]);
      expect(cols.length).to.equal(1);
    });

    it('is passed (1.2, -2.7).', function() {
      let cols = mat.cols(1.2, -2.7);
      expect(cols[0].toArray()).to.deep.equal([2, 20, 200, 2000]);
      expect(cols.length).to.equal(1);
    });
  });

  describe('sum:', function() {
    it('calcurate sum of Matrixes.', function() {
      let mat1 = new Matrix([3, -9], [6, -12]);
      let mat2 = new Matrix([-10, -12], [-1, -6]);
      let mat3 = Matrix.ones(2, 2);

      expect(Matrix.sum(mat1, mat2, mat3).toArray()).to.deep.equal([
        [-6, -20],
        [6, -17]
      ]);
    });

    it('must be passed only Matix.', function() {
      let mat1 = new Matrix([3, -9], [6, -12]);

      expect(function() {
        Matrix.sum(mat1, [
          [-10, -12],
          [-1, -6]
        ])
      }).to.throw('the 1-th argument is not matrix.');
    });

    it('don\'t allow different size vector.', function() {
      let mat1 = new Matrix([3, -9], [6, -12]);
      let mat2 = new Matrix([-10, -12], [-1, -6]);
      let mat3 = Matrix.ones(3, 2);

      expect(function() {
        Matrix.sum(mat1, mat2, mat3)
      }).to.throw('the 2-th matrix don\'t match size.');
    });
  });

  describe('product with Matrix:', function() {
    it('product Matrix(2 * 2) and Matrix(2 * 2).', function() {
      let mat1 = new Matrix([1, 3], [2, 4]);
      let mat2 = new Matrix([4, 1], [3, 2]);

      expect(Matrix.product(mat1, mat2).toArray()).to.deep.equal([
        [13, 7],
        [20, 10]
      ]);
    });

    it('product Matrix(2 * 2) and Vector(2).', function() {
      let mat = new Matrix([1, 3], [2, 4]);
      let vec = new Vector([1, 2]);

      expect(Matrix.product(mat, vec).toArray()).to.deep.equal([7, 10]);
    });

    it('product Matrix(2 * 2) and Matrix(2 * 1).', function() {
      let mat1 = new Matrix([1, 3], [2, 4]);
      let mat2 = new Matrix([
        [1],
        [2]
      ]);

      expect(Matrix.product(mat1, mat2).toArray()).to.deep.equal([
        [7],
        [10]
      ]);
    });

    it('product Matrix(1 * 2) and Matrix(2 * 2).', function() {
      let mat1 = new Matrix([1, 0, 2]);
      let mat2 = new Matrix([
        [1, 0, 1],
        [2, 1, 0],
        [0, 0, 2]
      ]);

      expect(Matrix.product(mat1, mat2).toArray()).to.deep.equal([
        [1, 0, 5]
      ]);
    });

    it('0-th arguments must be Matix.', function() {
      let vec = new Vector([1, 2]);

      expect(function() {
        Matrix.product([
          [1, 3],
          [2, 4]
        ], vec)
      }).to.throw('the argument(mat) must be Matrix.');
    });

    it('1-th arguments must be Matix or Vector.', function() {
      let mat = new Matrix([1, 3], [2, 4]);

      expect(function() {
        Matrix.product(mat, [1, 2])
      }).to.throw('the argument(other) must be Matrix or Vector.');
    });

    it('don\'t allow different size vector.', function() {
      let mat = new Matrix([1, 3], [2, 4]);
      let vec = new Vector([1, 2, 3]);

      expect(function() {
        Matrix.product(mat, vec)
      }).to.throw('don\'t match dimentions.');
    });

    it('don\'t allow different size matrix.', function() {
      let mat1 = new Matrix([1, 3], [2, 4]);
      let mat2 = new Matrix([
        [1, 0, 1],
        [2, 1, 0],
        [0, 0, 2]
      ]);

      expect(function() {
        Matrix.product(mat1, mat2)
      }).to.throw('don\'t match dimentions.');
    });
  });

  describe('splice:', function() {
    let mat;
    beforeEach(function() {
      mat = new Matrix([
        1, 2, 3
      ], [
        10, 20, 30
      ], [
        100, 200, 300
      ], [1000, 2000, 3000]);
    });

    it('is passed ("row", 2,0,[-1,-2,-3],[-10,-20,-30]).', function() {
      let removed = mat.splice("row", 2, 0, [
        -1, -2, -3
      ], [-10, -20, -30]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          -1, -2, -3
        ],
        [
          -10, -20, -30
        ],
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 6,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("row", 1,2,[-1,-2,-3]).', function() {
      let removed = mat.splice("row", 1, 2, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 3,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('is passed ("row", 0,10,[-1,-2,-3]).', function() {
      let removed = mat.splice("row", 0, 10, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [-1, -2, -3]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 1,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
    });

    it('is passed ("row", length,0,[-1,-2,-3]).', function() {
      let removed = mat.splice("row", mat.dimention.row, 0, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [
          1000, 2000, 3000
        ],
        [-1, -2, -3]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 5,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("row", -1, 0, [-1,-2,-3]).', function() {
      let removed = mat.splice("row", -1, 0, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 5,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("row", -3, 2, [-1,-2,-3]).', function() {
      let removed = mat.splice("row", -3, 2, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 3,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('is passed ("row", 1.2,2,[-1,-2,-3]).', function() {
      let removed = mat.splice("row", 1.2, 2, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 3,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('is passed ("row", 1.9,2,[-1,-2,-3]).', function() {
      let removed = mat.splice("row", 1.9, 2, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 3,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('is passed ("row", 1.2,2.1,[-1,-2,-3]).', function() {
      let removed = mat.splice("row", 1.2, 2.1, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 3,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('is passed ("row", -3.2, 2, [-1,-2,-3]).', function() {
      let removed = mat.splice("row", -3.2, 2, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 3,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('is passed ("row", -3.9, 2, [-1,-2,-3]).', function() {
      let removed = mat.splice("row", -3.9, 2, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 3,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('is passed ("row", -3.9, 2.8, [-1,-2,-3]).', function() {
      let removed = mat.splice("row", -3.9, 2.8, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          -1, -2, -3
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 3,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('is passed ("row", 2).', function() {
      let removed = mat.splice("row", 2);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [10, 20, 30]

      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 2,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
    });

    it('is passed ("row", -10).', function() {
      let removed = mat.splice("row", -10);
      expect(mat.toArray()).to.deep.equal([]);
      expect(mat.dimention).to.deep.equal({
        'row': 0,
        'col': 0
      });
      expect(removed.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
    });

    it('is passed ("row", -10,undefined).', function() {
      let removed = mat.splice("row", -10);
      expect(mat.toArray()).to.deep.equal([]);
      expect(mat.dimention).to.deep.equal({
        'row': 0,
        'col': 0
      });
      expect(removed.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
    });

    it('is passed ("row", 0, null, [-1,-2,-3]).', function() {
      let removed = mat.splice("row", 0, null, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          -1, -2, -3
        ],
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 5,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("row", 10, 0, [-1,-2,-3]).', function() {
      let removed = mat.splice("row", 10, 0, [-1, -2, -3]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [
          1000, 2000, 3000
        ],
        [-1, -2, -3]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 5,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("col", 2,0,[-1,-2],[-10,-20],[-100,-200],[-1000,-2000]).', function() {
      let removed = mat.splice("col", 2, 0, [
        -1, -2
      ], [
        -10, -20
      ], [
        -100, -200
      ], [-1000, -2000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, -1, -2, 3
        ],
        [
          10, 20, -10, -20, 30
        ],
        [
          100, 200, -100, -200, 300
        ],
        [1000, 2000, -1000, -2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 5
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("col", 1,2,[-1],[-10],[-100],[-1000]).', function() {
      let removed = mat.splice("col", 1, 2, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, -1
        ],
        [
          10, -10
        ],
        [
          100, -100
        ],
        [1000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 2
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", 0,10,[-1],[-10],[-100],[-1000]).', function() {
      let removed = mat.splice("col", 0, 10, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [-1],
        [-10],
        [-100],
        [-1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 1
      });
      expect(removed.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
    });

    it('is passed ("col", mat.dimention.col, 0, [-1], [-10], [-100], [-1000]).', function() {
      let removed = mat.splice("col", mat.dimention.col, 0, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3, -1
        ],
        [
          10, 20, 30, -10
        ],
        [
          100, 200, 300, -100
        ],
        [1000, 2000, 3000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 4
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("col", -1, 0, [-1], [-10], [-100], [-1000]).', function() {
      let removed = mat.splice("col", -1, 0, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, -1, 3
        ],
        [
          10, 20, -10, 30
        ],
        [
          100, 200, -100, 300
        ],
        [1000, 2000, -1000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 4
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("col", -2, 2, [-1], [-10], [-100], [-1000]).', function() {
      let removed = mat.splice("col", -2, 2, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, -1
        ],
        [
          10, -10
        ],
        [
          100, -100
        ],
        [1000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 2
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", 1.2,2,[-1],[-10],[-100],[-1000]).', function() {
      let removed = mat.splice("col", 1.2, 2, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, -1
        ],
        [
          10, -10
        ],
        [
          100, -100
        ],
        [1000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 2
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", 1.9,2,[-1],[-10],[-100],[-1000]).', function() {
      let removed = mat.splice("col", 1.9, 2, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, -1
        ],
        [
          10, -10
        ],
        [
          100, -100
        ],
        [1000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 2
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", 1.9,2.8,[-1],[-10],[-100],[-1000]).', function() {
      let removed = mat.splice("col", 1.9, 2.8, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, -1
        ],
        [
          10, -10
        ],
        [
          100, -100
        ],
        [1000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 2
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", -2.2, 2, [-1], [-10], [-100], [-1000]).', function() {
      let removed = mat.splice("col", -2.2, 2, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, -1
        ],
        [
          10, -10
        ],
        [
          100, -100
        ],
        [1000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 2
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", -2.9, 2, [-1], [-10], [-100], [-1000]).', function() {
      let removed = mat.splice("col", -2.9, 2, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, -1
        ],
        [
          10, -10
        ],
        [
          100, -100
        ],
        [1000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 2
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", -2.2, 2.4, [-1], [-10], [-100], [-1000]).', function() {
      let removed = mat.splice("col", -2.2, 2, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, -1
        ],
        [
          10, -10
        ],
        [
          100, -100
        ],
        [1000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 2
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", 2).', function() {
      let removed = mat.splice("col", 1);
      expect(mat.toArray()).to.deep.equal([
        [1],
        [10],
        [100],
        [1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 1
      });
      expect(removed.toArray()).to.deep.equal([
        [
          2, 3
        ],
        [
          20, 30
        ],
        [
          200, 300
        ],
        [2000, 3000]
      ]);
    });

    it('is passed ("col", -10).', function() {
      let removed = mat.splice("col", -10);
      expect(mat.toArray()).to.deep.equal([]);
      expect(mat.dimention).to.deep.equal({
        'row': 0,
        'col': 0
      });
      expect(removed.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
    });

    it('is passed ("col", -10,undefined).', function() {
      let removed = mat.splice("col", -10, undefined);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [
          10, 20, 30
        ],
        [
          100, 200, 300
        ],
        [1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 3
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("col", 0, null, [-1], [-10], [-100], [-1000]).', function() {
      let removed = mat.splice("col", 0, null, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          -1, 1, 2, 3
        ],
        [
          -10, 10, 20, 30
        ],
        [
          -100, 100, 200, 300
        ],
        [-1000, 1000, 2000, 3000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 4
      });
      expect(removed.toArray()).to.deep.equal([]);
    });

    it('is passed ("col", 10, 0, [-1,-2,-3]).', function() {
      let removed = mat.splice("col", 10, 0, [-1], [-10], [-100], [-1000]);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3, -1
        ],
        [
          10, 20, 30, -10
        ],
        [
          100, 200, 300, -100
        ],
        [1000, 2000, 3000, -1000]
      ]);
      expect(mat.dimention).to.deep.equal({
        'row': 4,
        'col': 4
      });
      expect(removed.toArray()).to.deep.equal([]);
    });
  });

  describe('operator methods:', function() {
    let mat;
    beforeEach(function() {
      mat = new Matrix([
        1, 2, 3
      ], [10, 20, 30]);
    });

    it('validate arguments.', function() {
      expect(function() {
        mat.ope(true, 1)
      }).to.throw('operator is not string.');

      expect(function() {
        mat.ope('@', 1)
      }).to.throw('operator is not valid symbol.');

      expect(function() {
        mat.ope('+', '1')
      }).to.throw('scalar is not number.');
    });

    it('don\'t change ownself.', function() {
      mat.ope('+', 1);
      expect(mat.toArray()).to.deep.equal([
        [
          1, 2, 3
        ],
        [10, 20, 30]
      ]);
    });

    it('add', function() {
      let result = mat.add(1);
      expect(result.toArray()).to.deep.equal([
        [
          2, 3, 4
        ],
        [11, 21, 31]
      ]);
    });

    it('sub', function() {
      let result = mat.sub(1);
      expect(result.toArray()).to.deep.equal([
        [
          0, 1, 2
        ],
        [9, 19, 29]
      ]);
    });

    it('mul', function() {
      let result = mat.mul(10);
      expect(result.toArray()).to.deep.equal([
        [
          10, 20, 30
        ],
        [100, 200, 300]
      ]);
    });

    it('div', function() {
      let result = mat.div(10);
      expect(result.toArray()).to.deep.equal([
        [
          0.1, 0.2, 0.3
        ],
        [1, 2, 3]
      ]);
    });
  });

  describe('slice:', function() {
    let mat;
    beforeEach(function() {
      mat = new Matrix([
        1, 2, 3
      ], [
        10, 20, 30
      ], [
        100, 200, 300
      ], [1000, 2000, 3000]);
    });

    it('is passed (2,1,4,2).', function() {
      let sliced = mat.slice(2, 1, 4, 2);
      expect(sliced.dimention).to.deep.equal({
        'row': 2,
        'col': 1
      });
      expect(sliced.toArray()).to.deep.equal([
        [
          200
        ],
        [2000]
      ]);
    });

    it('is passed (1,1,-1,-1).', function() {
      let sliced = mat.slice(1, 1, -1, -1);
      expect(sliced.dimention).to.deep.equal({
        'row': 2,
        'col': 1
      });
      expect(sliced.toArray()).to.deep.equal([
        [
          20
        ],
        [200]
      ]);
    });

    it('is passed (-3,-2,-1,-1).', function() {
      let sliced = mat.slice(-3, -2, -1, -1);
      expect(sliced.dimention).to.deep.equal({
        'row': 2,
        'col': 1
      });
      expect(sliced.toArray()).to.deep.equal([
        [
          20
        ],
        [200]
      ]);
    });

    it('is passed (1.2,1.9,-1.8,-1.4).', function() {
      let sliced = mat.slice(1.2, 1.9, -1.8, -1.4);
      expect(sliced.dimention).to.deep.equal({
        'row': 2,
        'col': 1
      });
      expect(sliced.toArray()).to.deep.equal([
        [
          20
        ],
        [200]
      ]);
    });

    it('is passed (-3.6,-2.2,-1.4,-1.9).', function() {
      let sliced = mat.slice(-3.6, -2.2, -1.4, -1.9);
      expect(sliced.dimention).to.deep.equal({
        'row': 2,
        'col': 1
      });
      expect(sliced.toArray()).to.deep.equal([
        [
          20
        ],
        [200]
      ]);
    });
  });

  describe('transpose:', function() {
    it('create (j * i) matrix.', function() {
      expect(new Matrix([
        1, 2, 3
      ], [10, 20, 30]).transpose().toArray()).to.deep.equal([
        [
          1, 10
        ],
        [
          2, 20
        ],
        [3, 30]
      ]);
    });
  });

  describe('static zeros:', function() {
    it('make matrix filled by 0.', function() {
      expect(Matrix.zeros(2).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [0, 0]
      ]);
      expect(Matrix.zeros(3, 2).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [
          0, 0
        ],
        [0, 0]
      ]);

      expect(function() {
        Matrix.zeros(3, '2')
      }).to.throw('col is not number.');

      expect(function() {
        Matrix.zeros('3', 2)
      }).to.throw('row is not number.');
    });

    it('round down argument.', function() {
      expect(Matrix.zeros(2.8).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [0, 0]
      ]);
      expect(Matrix.zeros(3, 2.3).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [
          0, 0
        ],
        [0, 0]
      ]);
    });
  });

  describe('static ones:', function() {
    it('make matrix filled by 1.', function() {
      expect(Matrix.ones(2).toArray()).to.deep.equal([
        [
          1, 1
        ],
        [1, 1]
      ]);
      expect(Matrix.ones(3, 2).toArray()).to.deep.equal([
        [
          1, 1
        ],
        [
          1, 1
        ],
        [1, 1]
      ]);

      expect(function() {
        Matrix.ones(3, '2')
      }).to.throw('col is not number.');

      expect(function() {
        Matrix.ones('3', 2)
      }).to.throw('row is not number.');
    });

    it('round down argument.', function() {
      expect(Matrix.ones(2.1).toArray()).to.deep.equal([
        [
          1, 1
        ],
        [1, 1]
      ]);
      expect(Matrix.ones(3, 2.7).toArray()).to.deep.equal([
        [
          1, 1
        ],
        [
          1, 1
        ],
        [1, 1]
      ]);
    });
  });

  describe('static eye:', function() {
    it('make matrix that diagonal elements are 1.', function() {
      expect(Matrix.eye(3).toArray()).to.deep.equal([
        [
          1, 0, 0
        ],
        [
          0, 1, 0
        ],
        [0, 0, 1]
      ]);
      expect(Matrix.eye(3, 2).toArray()).to.deep.equal([
        [
          1, 0
        ],
        [
          0, 1
        ],
        [0, 0]
      ]);

      expect(Matrix.eye(3, 2, 1).toArray()).to.deep.equal([
        [
          0, 1
        ],
        [
          0, 0
        ],
        [0, 0]
      ]);

      expect(Matrix.eye(3, 2, -1).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [
          1, 0
        ],
        [0, 1]
      ]);

      expect(Matrix.eye(3, 2, 10).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [
          0, 0
        ],
        [0, 0]
      ]);

      expect(Matrix.eye(3, 2, -10).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [
          0, 0
        ],
        [0, 0]
      ]);

      expect(function() {
        Matrix.eye(3, '2')
      }).to.throw('col is not number.');

      expect(function() {
        Matrix.eye('3', 2)
      }).to.throw('row is not number.');

      expect(function() {
        Matrix.eye(3, 2, '1')
      }).to.throw('pos is not number.');
    });

    it('round down argument.', function() {
      expect(Matrix.eye(3.3, 2, 10.8).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [
          0, 0
        ],
        [0, 0]
      ]);

      expect(Matrix.eye(3, 2.5, -10.2).toArray()).to.deep.equal([
        [
          0, 0
        ],
        [
          0, 0
        ],
        [0, 0]
      ]);
    });
  });

  describe('static hstack:', function() {
    it('make expanded matrix.', function() {
      let addMat1 = new Matrix([
        -1, -2
      ], [-10, -20]);
      let addMat2 = new Matrix([-3], [-30]);
      expect(Matrix.hstack(addMat1, addMat2).toArray()).to.deep.equal([
        [
          -1, -2, -3
        ],
        [-10, -20, -30]
      ]);
    });

    it('must be passed only Matrix.', function() {
      let addMat1 = [
        [
          -1, -2
        ],
        [-10, -20]
      ];
      let addMat2 = new Matrix([-3], [-30]);
      expect(function() {
        Matrix.hstack(addMat1, addMat2)
      }).to.throw('the 0-th argument is not Matrix.');
    });

    it('don\'t match row length.', function() {
      let addMat1 = new Matrix([
        -1, -2
      ], [-10, -20]);
      let addMat2 = new Matrix([-3], [-30], [-40]);
      expect(function() {
        Matrix.hstack(addMat1, addMat2)
      }).to.throw('don\'t match row length.');
    });
  });

  describe('static vstack:', function() {
    it('make expanded matrix.', function() {
      let addMat1 = new Matrix([
        -1, -2
      ], [-10, -20]);
      let addMat2 = new Matrix([
        -100, -200
      ], [-1000, -2000]);
      expect(Matrix.vstack(addMat1, addMat2).toArray()).to.deep.equal([
        [
          -1, -2
        ],
        [
          -10, -20
        ],
        [
          -100, -200
        ],
        [-1000, -2000]
      ]);
    });

    it('must be passed only Matrix.', function() {
      let addMat1 = [
        [
          -1, -2
        ],
        [-10, -20]
      ];
      let addMat2 = new Matrix([
        -100, -200
      ], [-1000, -2000]);
      expect(function() {
        Matrix.vstack(addMat1, addMat2)
      }).to.throw('the 0-th argument is not Matrix.');
    });

    it('don\'t match row length.', function() {
      let addMat1 = new Matrix([
        -1, -2
      ], [-10, -20]);
      let addMat2 = new Matrix([
        -100, -200, 1
      ], [-1000, -2000, 2]);
      expect(function() {
        Matrix.vstack(addMat1, addMat2)
      }).to.throw('don\'t match col length.');
    });
  });
});
