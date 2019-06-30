const Vector = require("../vector/vector");

//The matrix values
var numbers = Symbol();

//The matrix width
var matrixWidth = Symbol();

//The matrix height
var matrixHeight = Symbol();

/**
 * Represents a table of double values with a given width and height.
 *
 * @author Simon Osterlehner
 */
class Matrix {
  /**
   * Create a new {@link Matrix}
   *
   * @param {array|number} contentOrWidth Width of the matrix or the array values
   * @param {number} height Height of the matrix
   */
  constructor(contentOrWidth, height) {
    //Check if content is an array
    if (Array.isArray(contentOrWidth)) {
      //Set the array as the current matrix
      this[matrixHeight] = contentOrWidth.length;
      this[matrixWidth] = contentOrWidth[0].length;
      this[numbers] = contentOrWidth;
    } else {
      if (contentOrWidth < 0 || height < 0)
        throw new Error("Matrix size must not be negative.");

      //create a new empty matrix
      this[matrixWidth] = contentOrWidth;
      this[matrixHeight] = height;
      this[numbers] = Array.from(
        Array(contentOrWidth),
        () => new Array(height)
      );
    }
  }

  /**
   * Adds the values of a second {@link Matrix} with the same bounds to this.
   *
   * @param {Matrix} secondMatrix the matrix to adds
   */
  add(secondMatrix) {
    if (!(secondMatrix instanceof Matrix))
      throw new Error("A Matrix to add is required.");
    if (secondMatrix.width != this.width || secondMatrix.height != this.height)
      throw new Error("Matrix sizes must be equal when adding them.");

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this.set(x, y, this.get(x, y) + secondMatrix.get(x, y));
      }
    }
  }

  /**
   * Adds the values of a {@link Vector} to a given row of this {@link Matrix}.
   *
   * @param {number} row  	the number of the row in this matrix to access
   * @param {Vector} vector the vector to add to this row
   */
  addToRow(row, vector) {
    if (row < 0 || row >= this.height)
      throw new Error("The row " + row + " does not match the matrix bounds.");

    if (vector.size != this.width)
      throw new Error("The row to add does not match the matrix bounds.");

    for (var x = 0; x < vector.size; x++) {
      this[numbers][row][x] += vector.get(x);
    }
  }

  /**
   * Adds the values of a {@link Vector} to a given column of this {@link Matrix}.
   *
   * @param {number} column	the number of the column in this matrix to access
   * @param {vector} vector	the vector to add to this column
   */
  addToColumn(column, vector) {
    if (column < 0 || column >= this.width)
      throw new Error(
        "The column " + column + " does not match the matrix bounds."
      );

    if (vector.size != this.height)
      throw new Error("The column to add does not match the matrix bounds.");

    for (var y = 0; y < vector.size; y++) {
      this[numbers][y][column] += vector.get(y);
    }
  }

  /**
   * Calculates the matrix multiplication with a second {@link Matrix}.
   *
   * @param {Matrix} secondMatrix the second matrix to multiply
   * @returns The product of both matrices
   */
  multiply(secondMatrix) {
    if (secondMatrix.height != this.width)
      throw new Error(
        "The second Matrix must be as tall as this is wide when multiplicating them."
      );

    var result = new Matrix(secondMatrix.width, this.height);

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < secondMatrix.width; x++) {
        result.set(
          x,
          y,
          this.getRow(y).scalarProduct(secondMatrix.getColumn(x))
        );
      }
    }

    return result;
  }

  /**
   * Scales all numbers of a given row of this {@link Matrix} with a given factor.
   *
   * @param {number} row			the y position
   * @param {number} factor	the scaling factor
   */
  scaleRow(row, factor) {
    if (row < 0 || row >= this.height)
      throw new Error(
        "The row " + row + " cannot be scaled, it's outside of this matrix."
      );

    for (var x = 0; x < this.width; x++) {
      this[numbers][row][x] *= factor;
    }
  }

  /**
   * Scales all numbers of a given column of this {@link Matrix} with a given factor.
   *
   * @param {number} column the x position
   * @param {number} factor the scaling factor
   */
  scaleColumn(column, factor) {
    if (column < 0 || column >= this.height)
      throw new Error(
        "The column " +
          column +
          " cannot be scaled, it's outside of this matrix."
      );

    for (var y = 0; y < this.height; y++) {
      this[numbers][y][column] *= factor;
    }
  }

  /**
   * Scales all numbers of this {@link Matrix} with the given factor.
   *
   * @param {number} factor the scaling factor
   */
  scale(factor) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        this[numbers][y][x] *= factor;
      }
    }
  }

  /**
   * Resizes this {@link Matrix} to a new given size, adding zeros if size increases and
   * deleting numbers if size decreases.
   *
   * @param {*} width		the new width of this matrix
   * @param {*} height	the new height of this matrix
   */
  resize(width, height) {
    var result = new Matrix(
      Array.from(Array(height), () => new Array(width).fill(0))
    );

    for (var y = 0; y < result.height && y < this.height; y++) {
      for (var x = 0; x < result.width && x < this.width; x++) {
        result.set(x, y, this.get(x, y));
      }
    }

    return result;
  }

  /**
   * Copies an area of this matrix to another {@link Matrix} instance, failing if the given area
   * is not completely contained by this matrix.
   *
   * @param {number} x the x value of the start position for the copy
   * @param {number} y the y value of the start position for the copy
   * @param {number} w the width of the area to copy
   * @param {number} h the height of the area to copy
   * @returns the copied area of this matrix
   */
  copy(x, y, w, h) {
    if (x < 0 || y < 0 || x + w > this.width || y + h > this.height)
      throw new Error(
        "The given area does not match the bounds of the matrix to copy."
      );

    var result = new Matrix(w, h);

    for (var py = 0; py < h; py++) {
      for (var px = 0; px < w; px++) {
        result.set(px, py, this.get(x + px, y + py));
      }
    }

    return result;
  }

  /**
   * Filles this {@link Matrix} at a given offset with the numbers of a second matrix, failing
   * if this matrix is too small.
   *
   * @param {Matrix} secondMatrix the matrix to paste in this matrix
   * @param {number} x the x offset
   * @param {number} y the y offset
   */
  paste(secondMatrix, x, y) {
    if (
      x < 0 ||
      y < 0 ||
      x + secondMatrix.width > this.width ||
      y + secondMatrix.height > this.height
    )
      throw new Error(
        "The bounds of the matrix to paste are outside of this matrix."
      );

    for (var py = 0; py < secondMatrix.height; py++) {
      for (var px = 0; px < secondMatrix.width; px++) {
        this.set(x + px, y + py, secondMatrix.get(px, py));
      }
    }
  }

  /**
   * Pastes a {@link Vector} as a row into this {@link Matrix}.
   *
   * @param {number} row the number of the row in this matrix to access
   * @param {Vector} vector the vector to paste
   */
  pasteRow(row, vector) {
    if (row < 0 || row >= this.height)
      throw new Error("The row " + row + " does not match the matrix bounds.");
    if (vector.size != this.width)
      throw new Error(
        "The row vector to paste does not match the matrix bounds."
      );

    for (var x = 0; x < vector.size; x++) {
      this[numbers][row][x] = vector.get(x);
    }
  }

  /**
   * Pastes a {@link Vector} as a column into this {@link Matrix}.
   *
   * @param {number} column the number of the column in this matrix to access
   * @param {Vector} vector the vector to paste
   */
  pasteColumn(column, vector) {
    if (column < 0 || column >= this.width)
      throw new Error(
        "The column " + column + " does not match the matrix bounds."
      );
    if (vector.size != this.height)
      throw new Error(
        "The column vector to paste does not match the matrix height."
      );

    for (var y = 0; y < vector.size; y++) {
      this[numbers][y][column] = vector.get(y);
    }
  }

  /**
   * Appends a second {@link Matrix} on the right of this matrix, failing if the height is
   * different.
   *
   * @param {Matrix} secondMatrix the matrix to concatenate with this
   */
  concatenate(secondMatrix) {
    if (secondMatrix.height != this.height)
      throw new Error(
        "Matrices must have the same height when concatenating them."
      );

    var oldWidth = this.width;

    this.resize(oldWidth + secondMatrix.width, this.height);
    this.paste(secondMatrix, oldWidth, 0);
  }

  /**
   * Creates the identity matrix with the given size.
   *
   * @param {number} size the width and height of this identity matrix
   * @returns the created identity matrix
   */
  static identity(size) {
    if (size < 0)
      throw new Error("The size of the identity matrix must not be negative.");

    return new Matrix(Array.from(Array(size), () => new Array(size).fill(1)));
  }

  get(x, y) {
    if (this.width < x || this.height < y)
      throw new Error("Matrix index out of bounds.");
    return this[numbers][x][y];
  }

  set(x, y, value) {
    if (this.width < x || this.height < y)
      throw new Error("Matrix index out of bounds.");
    this[numbers][x][y] = value;
  }

  getRow(row) {
    if (this.width < row) throw new Error("Matrix index out of bounds.");

    return new Vector(this[numbers][row]);
  }

  getColumn(column) {
    if (this.height < column) throw new Error("Matrix index out of bounds.");

    var result = new Vector(this.height);

    for (var y = 0; y < this.height; y++) {
      result.set(y, this.get(column, y));
    }

    return result;
  }

  get width() {
    return this[matrixWidth];
  }

  get height() {
    return this[matrixHeight];
  }

  get numbers() {
    return this[numbers];
  }

  /**
   * Returns the matrix in a human readable form
   */
  toString() {
    var output = "";
    for (var i = 0; i < this.height; i++) {
      output += "(";
      for (var j = 0; j < this.width; j++) {
        output += this.get(i, j);
        if (j != this.width - 1) output += ", ";
      }
      output += ")";
      if (i != this.height - 1) output += "\n";
    }
    return output;
  }
}

module.exports = Matrix;
