//The vector values
var numbers = Symbol();

//The vecor size
var size = Symbol();

/**
 * Represents a vecotr of numbers
 *
 * @author Simon Osterlehner
 */
class Vector {
  /**
   * Create a new vector
   *
   * @param {array|int} content Size of the vector or the array values
   */
  constructor(content) {
    //Check if content is an array
    if (Array.isArray(content)) {
      //Set the array as the current vector
      this[size] = content.length;
      this[numbers] = content;
    } else {
      if (content < 0) throw "Vector size must not be negative.";

      //create a new empty vector
      this[size] = content;
      this[numbers] = [];
    }
  }

  /**
   * Adds the values of a second {@link Vector} to the values of
   * this.
   *
   * @param {Vector} secondVector the vector to add
   */
  add(secondVector) {
    if (!(secondVector instanceof Vector)) throw "A vector to add is required.";
    if (secondVector.size != this.size)
      throw "Vector sizes must be equal when adding them.";

    for (var i = 0; i < this.size; i++) {
      this[numbers][i] += secondVector.get(i);
    }
  }

  /**
   * Scales this {@link Vector} with a given factor.
   *
   * @param {number} factor the scaling factor
   */
  scale(factor) {
    if (typeof factor != "number")
      throw "A vector can only be scaled with a number.";

    for (var i = 0; i < this.size; i++) {
      this[numbers][i] *= factor;
    }
  }

  /**
   * Sums up the scalar product with a second vector of the same dimension.
   *
   * @param {Vector} secondVector
   * @return the calculated scalar product value
   */
  scalarProduct(secondVector) {
    if (!(secondVector instanceof Vector))
      throw "A vector is required for calculating the scalar product.";
    if (secondVector.size != this.size)
      throw "Vector sizes must be equal for calculating the scalar product.";

    var sum = 0;
    for (var i = 0; i < this.size; i++) {
      sum += this.get(i) * secondVector.get(i);
    }
    return sum;
  }

  get(position) {
    if (this.size < position) throw "Vector index out of bounds.";
    return this[numbers][position];
  }

  /**
   * Sets a value of this {@link Vector} at a given position.
   *
   * @param {number} position the position to set the value
   * @param {number} value		the new value
   */
  set(position, value) {
    if (this.size < position) throw "Vector index out of bounds.";
    this[numbers][position] = value;
  }

  get size() {
    return this[size];
  }

  get numbers() {
    return this[numbers];
  }

  /**
   * Calculates the sum of all values in this {@link Vector}.
   *
   * @return the calculated sum
   */
  get sum() {
    var sum = 0;

    for (var i = 0; i < this.size; i++) {
      sum += this.get(i);
    }
    return sum;
  }

  /**
   * Return the vector in a human readable form
   */
  toString() {
    var output = "(";
    for (var i = 0; i < this.size; i++) {
      output += this.get(i);
      if (i != this.size - 1) output += ", ";
    }
    output += ")";
    return output;
  }
}

module.exports = Vector;
