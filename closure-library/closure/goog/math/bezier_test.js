// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('goog.math.BezierTest');
goog.setTestOnly('goog.math.BezierTest');

goog.require('goog.math');
goog.require('goog.math.Bezier');
goog.require('goog.math.Coordinate');
goog.require('goog.testing.jsunit');

function testEquals() {
  var input = new goog.math.Bezier(1, 2, 3, 4, 5, 6, 7, 8);

  assert(input.equals(input));
}

function testClone() {
  var input = new goog.math.Bezier(1, 2, 3, 4, 5, 6, 7, 8);

  assertNotEquals('Clone returns a new object', input, input.clone());
  assert('Contents of clone match original', input.equals(input.clone()));
}

function testFlip() {
  var input = new goog.math.Bezier(1, 1, 2, 2, 3, 3, 4, 4);
  var compare = new goog.math.Bezier(4, 4, 3, 3, 2, 2, 1, 1);

  var flipped = input.clone();
  flipped.flip();
  assert('Flipped behaves as expected', compare.equals(flipped));

  flipped.flip();
  assert('Flipping twice gives original', input.equals(flipped));
}

function testGetPoint() {
  var input = new goog.math.Bezier(0, 1, 1, 2, 2, 3, 3, 4);

  assert(
      goog.math.Coordinate.equals(
          input.getPoint(0), new goog.math.Coordinate(0, 1)));
  assert(
      goog.math.Coordinate.equals(
          input.getPoint(1), new goog.math.Coordinate(3, 4)));
  assert(
      goog.math.Coordinate.equals(
          input.getPoint(0.5), new goog.math.Coordinate(1.5, 2.5)));
}

function testGetPointX() {
  var input = new goog.math.Bezier(0, 1, 1, 2, 2, 3, 3, 4);

  assert(goog.math.nearlyEquals(input.getPointX(0), 0));
  assert(goog.math.nearlyEquals(input.getPointX(1), 3));
  assert(goog.math.nearlyEquals(input.getPointX(0.5), 1.5));
}

function testGetPointY() {
  var input = new goog.math.Bezier(0, 1, 1, 2, 2, 3, 3, 4);

  assert(goog.math.nearlyEquals(input.getPointY(0), 1));
  assert(goog.math.nearlyEquals(input.getPointY(1), 4));
  assert(goog.math.nearlyEquals(input.getPointY(0.5), 2.5));
}

function testSubdivide() {
  var input = new goog.math.Bezier(0, 1, 1, 2, 2, 3, 3, 4);

  input.subdivide(1 / 3, 2 / 3);

  assert(goog.math.nearlyEquals(1, input.x0));
  assert(goog.math.nearlyEquals(2, input.y0));
  assert(goog.math.nearlyEquals(2, input.x3));
  assert(goog.math.nearlyEquals(3, input.y3));
}

function testSolvePositionFromXValue() {
  var eps = 1e-6;
  var bezier = new goog.math.Bezier(0, 0, 0.25, 0.1, 0.25, 1, 1, 1);
  var pt = bezier.getPoint(0.5);
  assertRoughlyEquals(0.3125, pt.x, eps);
  assertRoughlyEquals(0.5375, pt.y, eps);
  assertRoughlyEquals(
      0.321, bezier.solvePositionFromXValue(bezier.getPoint(0.321).x), eps);
}

function testSolveYValueFromXValue() {
  var eps = 1e-6;
  // The following example is taken from
  // http://www.netzgesta.de/dev/cubic-bezier-timing-function.html.
  // The timing values shown in that page are 1 - <value> so the
  // bezier curves in this test are constructed with 1 - ctrl points.
  // E.g. ctrl points (0, 0, 0.25, 0.1, 0.25, 1, 1, 1) become
  // (1, 1, 0.75, 0, 0.75, 0.9, 0, 0) here. Since chanding the order of
  // the ctrl points does not affect the shape of the curve, once can also
  // have (0, 0, 0.75, 0.9, 0.75, 0, 1, 1).

  // netzgesta example.
  var bezier = new goog.math.Bezier(1, 1, 0.75, 0.9, 0.75, 0, 0, 0);
  assertRoughlyEquals(0.024374631, bezier.solveYValueFromXValue(0.2), eps);
  assertRoughlyEquals(0.317459494, bezier.solveYValueFromXValue(0.6), eps);
  assertRoughlyEquals(0.905205002, bezier.solveYValueFromXValue(0.9), eps);

  // netzgesta example with ctrl points in the reverse order so that 1st and
  // last ctrl points are (0, 0) and (1, 1). Note the result is exactly the
  // same.
  bezier = new goog.math.Bezier(0, 0, 0.75, 0, 0.75, 0.9, 1, 1);
  assertRoughlyEquals(0.024374631, bezier.solveYValueFromXValue(0.2), eps);
  assertRoughlyEquals(0.317459494, bezier.solveYValueFromXValue(0.6), eps);
  assertRoughlyEquals(0.905205002, bezier.solveYValueFromXValue(0.9), eps);

  // Ease-out css animation timing in webkit.
  bezier = new goog.math.Bezier(0, 0, 0, 0, 0.58, 1, 1, 1);
  assertRoughlyEquals(0.308366667, bezier.solveYValueFromXValue(0.2), eps);
  assertRoughlyEquals(0.785139061, bezier.solveYValueFromXValue(0.6), eps);
  assertRoughlyEquals(0.982973389, bezier.solveYValueFromXValue(0.9), eps);
}
