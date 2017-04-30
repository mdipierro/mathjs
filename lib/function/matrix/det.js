'use strict';

var util = require('../../utils/index');
var object = util.object;
var string = util.string;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  var add = load(require('../arithmetic/add'));
  var subtract = load(require('../arithmetic/subtract'));
  var multiply = load(require('../arithmetic/multiply'));
  var unaryMinus = load(require('../arithmetic/unaryMinus'));

  /**
   * Calculate the determinant of a matrix.
   *
   * Syntax:
   *
   *    math.det(x)
   *
   * Examples:
   *
   *    math.det([[1, 2], [3, 4]]); // returns -2
   *
   *    var A = [
   *      [-2, 2, 3],
   *      [-1, 1, 3],
   *      [2, 0, -1]
   *    ]
   *    math.det(A); // returns 6
   *
   * See also:
   *
   *    inv
   *
   * @param {Array | Matrix} x  A matrix
   * @return {number} The determinant of `x`
   */
  var det = typed('det', {
    'any': function (x) {
      return object.clone(x);
    },

    'Array | Matrix': function det (x) {
      var size;
      if (x && x.isMatrix === true) {
        size = x.size();
      }
      else if (Array.isArray(x)) {
        x = matrix(x);
        size = x.size();
      }
      else {
        // a scalar
        size = [];
      }

      switch (size.length) {
        case 0:
          // scalar
          return object.clone(x);

        case 1:
          // vector
          if (size[0] == 1) {
            return object.clone(x.valueOf()[0]);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')');
          }

        case 2:
          // two dimensional array
          var rows = size[0];
          var cols = size[1];
          if (rows == cols) {
            return _det(x.clone().valueOf(), rows, cols);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')');
          }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' +
          '(size: ' + string.format(size) + ')');
      }
    }
  });

  det.toTex = {1: '\\det\\left(${args[0]}\\right)'};

  return det;

  /**
   * Calculate the determinant of a matrix
   * @param {Array[]} matrix  A square, two dimensional matrix
   * @param {number} rows     Number of rows of the matrix (zero-based)
   * @param {number} cols     Number of columns of the matrix (zero-based)
   * @returns {number} det
   * @private
   */
  function _det (matrix, rows, cols) {
      let n = rows;
      let d = 1;
      let row = null;
      let tmp = null;
      let pivot = 1;
      // deal with particular cases
      if(n == 1) return m[0][0];
      if(n == 2) return m[0][0]*m[1][1]-m[0][1]*m[1][0];
      // work inplace
      m = Object.clone(m);
      for(let j=0; j<n; j++) {
          // find the row with largest pivot to decreast numerical error
          let k = j;
          for(let i=j+1; i<n; i++) {
              if(Math.abs(m[i][j]) > Math.abs(m[k][j])) k = i;
          }
          row = m[k];
          // swap rows
          if(!row[j]) return 0.0;
          if(k!=j) {
              d = -d;
              m[k]=m[j]; m[j]=row;
          }
          // divide row by the pivot
          pivot = row[j];
          d *= pivot;
          for(let i=j; i<n; i++)
              row[i] /= pivot;
          // subtract from all the other rows
          for(let k=j+1; k<n; k++) {
              tmp = m[k];
              pivot = tmp[j];
              for(let i=0; i<n; i++) 
                  tmp[i] -= pivot * row[i];
          }
      }
      return d;
  }
};

exports.name = 'det';
exports.factory = factory;

