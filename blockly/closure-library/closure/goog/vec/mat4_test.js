// Copyright 2011 The Closure Library Authors. All Rights Reserved.
// Use of this source code is governed by the Apache License, Version 2.0.

goog.provide('goog.vec.Mat4Test');
goog.setTestOnly('goog.vec.Mat4Test');

goog.require('goog.testing.jsunit');
goog.require('goog.vec.Mat4');
goog.require('goog.vec.Vec3');
goog.require('goog.vec.Vec4');

var randomMat4 = goog.vec.Mat4.createFloat32FromValues(
    0.8025078773498535,
    0.7559120655059814,
    0.15274643898010254,
    0.19196106493473053,
    0.0890120416879654,
    0.15422114729881287,
    0.09754583984613419,
    0.44862601161003113,
    0.9196512699127197,
    0.5310639142990112,
    0.8962187170982361,
    0.280601441860199,
    0.594650387763977,
    0.4134795069694519,
    0.06632178276777267,
    0.8837796449661255);

function testDeprecatedConstructor() {
  var m0 = goog.vec.Mat4.create();
  assertElementsEquals([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], m0);

  var m1 = goog.vec.Mat4.createFromArray(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m1);

  var m2 = goog.vec.Mat4.clone(m1);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m1);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m2);

  var m3 = goog.vec.Mat4.createFromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m3);

  var m4 = goog.vec.Mat4.createIdentity();
  assertElementsEquals([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], m4);
}

function testConstructor() {
  var m0 = goog.vec.Mat4.createFloat32();
  assertElementsEquals([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], m0);

  var m1 = goog.vec.Mat4.createFloat32FromArray(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m1);

  var m2 = goog.vec.Mat4.clone(m1);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m1);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m2);

  var m3 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m3);

  var m4 = goog.vec.Mat4.createIdentity();
  assertElementsEquals([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], m4);
}

function testSet() {
  var m0 = goog.vec.Mat4.createFloat32();
  var m1 = goog.vec.Mat4.createFloat32FromArray(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  goog.vec.Mat4.setFromArray(m0, m1);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);

  goog.vec.Mat4.setFromValues(
      m0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
  assertElementsEquals(
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], m0);
}

function testSetDiagonal() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setDiagonalValues(m0, 1, 2, 3, 4);
  assertElementsEquals(
      [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4], m0);

  goog.vec.Mat4.setDiagonal(m0, [4, 5, 6, 7]);
  assertElementsEquals(
      [4, 0, 0, 0, 0, 5, 0, 0, 0, 0, 6, 0, 0, 0, 0, 7], m0);
}

function testGetDiagonal() {
  var v0 = goog.vec.Vec4.create();
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setFromArray(
      m0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

  goog.vec.Mat4.getDiagonal(m0, v0);
  assertElementsEquals([0, 5, 10, 15], v0);

  goog.vec.Vec4.setFromArray(v0, [0, 0, 0, 0]);
  goog.vec.Mat4.getDiagonal(m0, v0, 1);
  assertElementsEquals([4, 9, 14, 0], v0);

  goog.vec.Vec4.setFromArray(v0, [0, 0, 0, 0]);
  goog.vec.Mat4.getDiagonal(m0, v0, 2);
  assertElementsEquals([8, 13, 0, 0], v0);

  goog.vec.Vec4.setFromArray(v0, [0, 0, 0, 0]);
  goog.vec.Mat4.getDiagonal(m0, v0, 3);
  assertElementsEquals([12, 0, 0, 0], v0);

  goog.vec.Vec4.setFromArray(v0, [0, 0, 0, 0]);
  goog.vec.Mat4.getDiagonal(m0, v0, 4);
  assertElementsEquals([0, 0, 0, 0], v0);

  goog.vec.Vec4.setFromArray(v0, [0, 0, 0, 0]);
  goog.vec.Mat4.getDiagonal(m0, v0, -1);
  assertElementsEquals([1, 6, 11, 0], v0);

  goog.vec.Vec4.setFromArray(v0, [0, 0, 0, 0]);
  goog.vec.Mat4.getDiagonal(m0, v0, -2);
  assertElementsEquals([2, 7, 0, 0], v0);

  goog.vec.Vec4.setFromArray(v0, [0, 0, 0, 0]);
  goog.vec.Mat4.getDiagonal(m0, v0, -3);
  assertElementsEquals([3, 0, 0, 0], v0);

  goog.vec.Vec4.setFromArray(v0, [0, 0, 0, 0]);
  goog.vec.Mat4.getDiagonal(m0, v0, -4);
  assertElementsEquals([0, 0, 0, 0], v0);
}

function testSetGetColumn() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setColumn(m0, 0, [1, 2, 3, 4]);
  goog.vec.Mat4.setColumn(m0, 1, [5, 6, 7, 8]);
  goog.vec.Mat4.setColumn(m0, 2, [9, 10, 11, 12]);
  goog.vec.Mat4.setColumn(m0, 3, [13, 14, 15, 16]);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);

  var v0 = [0, 0, 0, 0];
  goog.vec.Mat4.getColumn(m0, 0, v0);
  assertElementsEquals([1, 2, 3, 4], v0);
  goog.vec.Mat4.getColumn(m0, 1, v0);
  assertElementsEquals([5, 6, 7, 8], v0);
  goog.vec.Mat4.getColumn(m0, 2, v0);
  assertElementsEquals([9, 10, 11, 12], v0);
  goog.vec.Mat4.getColumn(m0, 3, v0);
  assertElementsEquals([13, 14, 15, 16], v0);
}

function testSetGetColumns() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setColumns(
      m0, [1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);

  var v0 = [0, 0, 0, 0], v1 = [0, 0, 0, 0];
  var v2 = [0, 0, 0, 0], v3 = [0, 0, 0, 0];
  goog.vec.Mat4.getColumns(m0, v0, v1, v2, v3);
  assertElementsEquals([1, 2, 3, 4], v0);
  assertElementsEquals([5, 6, 7, 8], v1);
  assertElementsEquals([9, 10, 11, 12], v2);
  assertElementsEquals([13, 14, 15, 16], v3);
}

function testSetGetRow() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setRow(m0, 0, [1, 2, 3, 4]);
  goog.vec.Mat4.setRow(m0, 1, [5, 6, 7, 8]);
  goog.vec.Mat4.setRow(m0, 2, [9, 10, 11, 12]);
  goog.vec.Mat4.setRow(m0, 3, [13, 14, 15, 16]);
  assertElementsEquals(
      [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16], m0);

  var v0 = [0, 0, 0, 0];
  goog.vec.Mat4.getRow(m0, 0, v0);
  assertElementsEquals([1, 2, 3, 4], v0);
  goog.vec.Mat4.getRow(m0, 1, v0);
  assertElementsEquals([5, 6, 7, 8], v0);
  goog.vec.Mat4.getRow(m0, 2, v0);
  assertElementsEquals([9, 10, 11, 12], v0);
  goog.vec.Mat4.getRow(m0, 3, v0);
  assertElementsEquals([13, 14, 15, 16], v0);
}

function testSetGetRows() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setRows(
      m0, [1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]);
  assertElementsEquals(
      [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16], m0);

  var v0 = [0, 0, 0, 0], v1 = [0, 0, 0, 0];
  var v2 = [0, 0, 0, 0], v3 = [0, 0, 0, 0];
  goog.vec.Mat4.getRows(m0, v0, v1, v2, v3);
  assertElementsEquals([1, 2, 3, 4], v0);
  assertElementsEquals([5, 6, 7, 8], v1);
  assertElementsEquals([9, 10, 11, 12], v2);
  assertElementsEquals([13, 14, 15, 16], v3);
}

function testSetRowMajorArray() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setFromRowMajorArray(
      m0, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  assertElementsEquals(
      [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16], m0);
}

function testMakeZero() {
  var m0 = goog.vec.Mat4.createFloat32FromArray(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);
  goog.vec.Mat4.makeZero(m0);
  assertElementsEquals(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], m0);
}

function testMakeIdentity() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeIdentity(m0);
  assertElementsEquals(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], m0);
}

function testSetGetElement() {
  var m0 = goog.vec.Mat4.createFloat32();
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      var value = c * 4 + r + 1;
      goog.vec.Mat4.setElement(m0, r, c, value);
      assertEquals(value, goog.vec.Mat4.getElement(m0, r, c));
    }
  }
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);
}

function testAddMat() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var m1 = goog.vec.Mat4.createFloat32FromValues(
      9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8);
  var m2 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.addMat(m0, m1, m2);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);
  assertElementsEquals(
      [9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8], m1);
  assertElementsEquals(
      [10, 12, 14, 16, 18, 20, 22, 24, 10, 12, 14, 16, 18, 20, 22, 24], m2);

  goog.vec.Mat4.addMat(m0, m1, m0);
  assertElementsEquals(
      [9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8], m1);
  assertElementsEquals(
      [10, 12, 14, 16, 18, 20, 22, 24, 10, 12, 14, 16, 18, 20, 22, 24], m0);
}

function testSubMat() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var m1 = goog.vec.Mat4.createFloat32FromValues(
      9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8);
  var m2 = goog.vec.Mat4.createFloat32();

  goog.vec.Mat4.subMat(m0, m1, m2);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);
  assertElementsEquals(
      [9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4, 5, 6, 7, 8], m1);
  assertElementsEquals(
      [-8, -8, -8, -8, -8, -8, -8, -8, 8, 8, 8, 8, 8, 8, 8, 8], m2);

  goog.vec.Mat4.subMat(m1, m0, m1);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);
  assertElementsEquals(
      [8, 8, 8, 8, 8, 8, 8, 8, -8, -8, -8, -8, -8, -8, -8, -8], m1);
}

function testMultScalar() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var m1 = goog.vec.Mat4.createFloat32();

  goog.vec.Mat4.multScalar(m0, 2, m1);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m0);
  assertElementsEquals(
      [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32], m1);

  goog.vec.Mat4.multScalar(m0, 5, m0);
  assertElementsEquals(
      [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80], m0);
}

function testMultMat() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var m1 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var m2 = goog.vec.Mat4.createFloat32();

  goog.vec.Mat4.multMat(m0, m1, m2);
  assertElementsEquals(
      [90, 100, 110, 120, 202, 228, 254, 280,
       314, 356, 398, 440, 426, 484, 542, 600], m2);

  goog.vec.Mat4.multScalar(m1, 2, m1);
  goog.vec.Mat4.multMat(m1, m0, m1);
  assertElementsEquals(
      [180, 200, 220, 240, 404, 456, 508, 560,
       628, 712, 796, 880, 852, 968, 1084, 1200], m1);
}

function testTranspose() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var m1 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.transpose(m0, m1);
  assertElementsEquals(
      [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16], m1);

  goog.vec.Mat4.transpose(m1, m1);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], m1);
}

function testDeterminant() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
  assertEquals(0, goog.vec.Mat4.determinant(m0));
  assertElementsEquals(
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], m0);

  goog.vec.Mat4.setFromValues(
      m0, 1, 2, 3, 4, 2, 3, 4, 1, 3, 4, 1, 2, 4, 1, 2, 3);
  assertEquals(160, goog.vec.Mat4.determinant(m0));
  assertElementsEquals(
      [1, 2, 3, 4, 2, 3, 4, 1, 3, 4, 1, 2, 4, 1, 2, 3], m0);
}

function testInvert() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
  assertFalse(goog.vec.Mat4.invert(m0, m0));
  assertElementsEquals(
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], m0);

  goog.vec.Mat4.setFromValues(
      m0, 1, 2, 3, 4, 2, 3, 4, 1, 3, 4, 1, 2, 4, 1, 2, 3);
  assertTrue(goog.vec.Mat4.invert(m0, m0));
  assertElementsRoughlyEqual(
      [-0.225, 0.025, 0.025, 0.275, 0.025, 0.025, 0.275, -0.225,
       0.025, 0.275, -0.225, 0.025, 0.275, -0.225, 0.025, 0.025], m0,
       goog.vec.EPSILON);

  goog.vec.Mat4.makeScale(m0, .01, .01, .01);
  assertTrue(goog.vec.Mat4.invert(m0, m0));
  var m1 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeScale(m1, 100, 100, 100);
  assertElementsEquals(m1, m0);
}

function testEquals() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var m1 = goog.vec.Mat4.clone(m0);
  assertTrue(goog.vec.Mat4.equals(m0, m1));
  assertTrue(goog.vec.Mat4.equals(m1, m0));
  for (var i = 0; i < 16; i++) {
    m1[i] = 18;
    assertFalse(goog.vec.Mat4.equals(m0, m1));
    assertFalse(goog.vec.Mat4.equals(m1, m0));
    m1[i] = i + 1;
  }
}

function testMultVec3() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var v0 = [1, 2, 3];
  var v1 = [0, 0, 0];

  goog.vec.Mat4.multVec3(m0, v0, v1);
  assertElementsEquals([1, 2, 3], v0);
  assertElementsEquals([51, 58, 65], v1);

  goog.vec.Mat4.multVec3(m0, v0, v0);
  assertElementsEquals([51, 58, 65], v0);
}

function testMultVec3NoTranslate() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var v0 = [1, 2, 3];
  var v1 = [0, 0, 0];

  goog.vec.Mat4.multVec3NoTranslate(m0, v0, v1);
  assertElementsEquals([1, 2, 3], v0);
  assertElementsEquals([38, 44, 50], v1);

  goog.vec.Mat4.multVec3NoTranslate(m0, v0, v0);
  assertElementsEquals([38, 44, 50], v0);
}

function testMultVec3Projective() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var v0 = [1, 2, 3];
  var v1 = [0, 0, 0];
  var invw = 1 / 72;

  goog.vec.Mat4.multVec3Projective(m0, v0, v1);
  assertElementsEquals([1, 2, 3], v0);
  assertElementsEquals(
      [51 * invw, 58 * invw, 65 * invw], v1);

  goog.vec.Mat4.multVec3Projective(m0, v0, v0);
  assertElementsEquals(
      [51 * invw, 58 * invw, 65 * invw], v0);
}

function testMultVec4() {
  var m0 = goog.vec.Mat4.createFloat32FromValues(
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
  var v0 = [1, 2, 3, 4];
  var v1 = [0, 0, 0, 0];

  goog.vec.Mat4.multVec4(m0, v0, v1);
  assertElementsEquals([90, 100, 110, 120], v1);
  goog.vec.Mat4.multVec4(m0, v0, v0);
  assertElementsEquals([90, 100, 110, 120], v0);
}

function testSetValues() {
  var a0 = goog.vec.Mat4.createFloat32();
  assertElementsEquals(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], a0);
  a0 = goog.vec.Mat4.createFloat32FromArray(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], a0);

  var a1 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setDiagonalValues(a1, 1, 2, 3, 4);
  assertElementsEquals(
      [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4], a1);

  goog.vec.Mat4.setColumnValues(a1, 0, 2, 3, 4, 5);
  goog.vec.Mat4.setColumnValues(a1, 1, 6, 7, 8, 9);
  goog.vec.Mat4.setColumnValues(a1, 2, 10, 11, 12, 13);
  goog.vec.Mat4.setColumnValues(a1, 3, 14, 15, 16, 1);
  assertElementsEquals(
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1], a1);

  goog.vec.Mat4.setRowValues(a1, 0, 1, 5, 9, 13);
  goog.vec.Mat4.setRowValues(a1, 1, 2, 6, 10, 14);
  goog.vec.Mat4.setRowValues(a1, 2, 3, 7, 11, 15);
  goog.vec.Mat4.setRowValues(a1, 3, 4, 8, 12, 16);
  assertElementsEquals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], a1);
}

function testMakeTranslate() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeTranslate(m0, 3, 4, 5);
  assertElementsEquals(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 3, 4, 5, 1], m0);
}

function testMakeScale() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeScale(m0, 3, 4, 5);
  assertElementsEquals(
      [3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1], m0);
}

function testMakeRotate() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeRotate(m0, Math.PI / 2, 0, 0, 1);
  assertElementsRoughlyEqual(
      [0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      m0, goog.vec.EPSILON);

  var m1 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeRotate(m1, -Math.PI / 4, 0, 0, 1);
  goog.vec.Mat4.multMat(m0, m1, m1);
  assertElementsRoughlyEqual(
      [0.7071068, 0.7071068, 0, 0,
       -0.7071068, 0.7071068, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1],
      m1, goog.vec.EPSILON);
}

function testMakeRotateX() {
  var m0 = goog.vec.Mat4.createFloat32();
  var m1 = goog.vec.Mat4.createFloat32();

  goog.vec.Mat4.makeRotateX(m0, Math.PI / 7);
  goog.vec.Mat4.makeRotate(m1, Math.PI / 7, 1, 0, 0);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);
}

function testMakeRotateY() {
  var m0 = goog.vec.Mat4.createFloat32();
  var m1 = goog.vec.Mat4.createFloat32();

  goog.vec.Mat4.makeRotateY(m0, Math.PI / 7);
  goog.vec.Mat4.makeRotate(m1, Math.PI / 7, 0, 1, 0);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);
}

function testMakeRotateZ() {
  var m0 = goog.vec.Mat4.createFloat32();
  var m1 = goog.vec.Mat4.createFloat32();

  goog.vec.Mat4.makeRotateZ(m0, Math.PI / 7);
  goog.vec.Mat4.makeRotate(m1, Math.PI / 7, 0, 0, 1);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);
}


function testTranslate() {
  var m0 = goog.vec.Mat4.createIdentity();
  goog.vec.Mat4.translate(m0, 3, 4, 5);
  assertElementsEquals(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 3, 4, 5, 1], m0);

  goog.vec.Mat4.setFromValues(
      m0, 1, 2, 3, 4, 2, 3, 4, 1, 3, 4, 1, 2, 4, 1, 2, 3);

  var m1 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeTranslate(m1, 5, 6, 7);
  var m2 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.multMat(m0, m1, m2);
  goog.vec.Mat4.translate(m0, 5, 6, 7);
  assertElementsEquals(m2, m0);
}

function testScale() {
  var m0 = goog.vec.Mat4.createIdentity();
  goog.vec.Mat4.scale(m0, 3, 4, 5);
  assertElementsEquals([3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1], m0);
}

function testRotate() {
  var m0 = goog.vec.Mat4.createIdentity();
  goog.vec.Mat4.rotate(m0, Math.PI / 2, 0, 0, 1);
  assertElementsRoughlyEqual(
      [0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      m0, goog.vec.EPSILON);

  goog.vec.Mat4.rotate(m0, -Math.PI / 4, 0, 0, 1);
  assertElementsRoughlyEqual(
      [0.7071068, 0.7071068, 0, 0,
       -0.7071068, 0.7071068, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1],
      m0, goog.vec.EPSILON);
}

function testRotateX() {
  var m0 = goog.vec.Mat4.createFloat32();
  var m1 = goog.vec.Mat4.createFloat32FromArray(randomMat4);

  goog.vec.Mat4.makeRotateX(m0, Math.PI / 7);
  goog.vec.Mat4.multMat(m1, m0, m0);
  goog.vec.Mat4.rotateX(m1, Math.PI / 7);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);
}

function testRotateY() {
  var m0 = goog.vec.Mat4.createFloat32();
  var m1 = goog.vec.Mat4.createFloat32FromArray(randomMat4);

  goog.vec.Mat4.makeRotateY(m0, Math.PI / 7);
  goog.vec.Mat4.multMat(m1, m0, m0);
  goog.vec.Mat4.rotateY(m1, Math.PI / 7);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);
}

function testRotateZ() {
  var m0 = goog.vec.Mat4.createFloat32();
  var m1 = goog.vec.Mat4.createFloat32FromArray(randomMat4);

  goog.vec.Mat4.makeRotateZ(m0, Math.PI / 7);
  goog.vec.Mat4.multMat(m1, m0, m0);
  goog.vec.Mat4.rotateZ(m1, Math.PI / 7);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);
}

function testGetTranslation() {
  var mat = goog.vec.Mat4.createFloat32FromArray(randomMat4);
  var translation = goog.vec.Vec3.createFloat32();
  goog.vec.Mat4.getTranslation(mat, translation);
  assertElementsRoughlyEqual(
      [0.59465038776, 0.413479506969, 0.0663217827677],
      translation, goog.vec.EPSILON);
}

function testMakeFrustum() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeFrustum(m0, -1, 2, -2, 1, .1, 1.1);
  assertElementsRoughlyEqual(
      [0.06666666, 0, 0, 0,
       0, 0.06666666, 0, 0,
       0.33333333, -0.33333333, -1.2, -1,
       0, 0, -0.22, 0], m0, goog.vec.EPSILON);
}

function testMakePerspective() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makePerspective(m0, 90 * Math.PI / 180, 2, 0.1, 1.1);
  assertElementsRoughlyEqual(
      [0.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1.2, -1, 0, 0, -0.22, 0],
      m0, goog.vec.EPSILON);
}

function testMakeOrtho() {
  var m0 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeOrtho(m0, -1, 2, -2, 1, 0.1, 1.1);
  assertElementsRoughlyEqual(
      [0.6666666, 0, 0, 0,
       0, 0.6666666, 0, 0,
       0, 0, -2, 0,
       -0.333333, 0.3333333, -1.2, 1], m0, goog.vec.EPSILON);

}

function testMakeEulerZXZ() {
  var m0 = goog.vec.Mat4.createFloat32();
  var roll = 0.200982 * 2 * Math.PI;
  var tilt = 0.915833 * Math.PI;
  var yaw = 0.839392 * 2 * Math.PI;

  goog.vec.Mat4.makeRotate(m0, roll, 0, 0, 1);
  goog.vec.Mat4.rotate(m0, tilt, 1, 0, 0);
  goog.vec.Mat4.rotate(m0, yaw, 0, 0, 1);

  var m1 = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeEulerZXZ(m1, roll, tilt, yaw);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);


  var euler = [0, 0, 0];
  goog.vec.Mat4.toEulerZXZ(m0, euler);

  assertRoughlyEquals(roll, euler[0], goog.vec.EPSILON);
  assertRoughlyEquals(tilt, euler[1], goog.vec.EPSILON);
  assertRoughlyEquals(yaw, euler[2], goog.vec.EPSILON);

  // Test negative tilt now.
  goog.vec.Mat4.makeRotate(m0, roll, 0, 0, 1);
  goog.vec.Mat4.rotate(m0, -tilt, 1, 0, 0);
  goog.vec.Mat4.rotate(m0, yaw, 0, 0, 1);

  goog.vec.Mat4.makeEulerZXZ(m1, roll, -tilt, yaw);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);

  var euler = [0, 0, 0];
  goog.vec.Mat4.toEulerZXZ(m0, euler, true);

  assertRoughlyEquals(roll, euler[0], goog.vec.EPSILON);
  assertRoughlyEquals(-tilt, euler[1], goog.vec.EPSILON);
  assertRoughlyEquals(yaw, euler[2], goog.vec.EPSILON);
}

function testEulerZXZExtrema() {
  var m0 = goog.vec.Mat4.createFloat32FromArray(
  [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
  var m1 = goog.vec.Mat4.createFloat32FromArray(
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  var euler = [0, 0, 0];
  goog.vec.Mat4.toEulerZXZ(m0, euler);
  assertElementsRoughlyEqual(
      [Math.PI, Math.PI / 2, Math.PI], euler, goog.vec.EPSILON);
  goog.vec.Mat4.makeEulerZXZ(m1, euler[0], euler[1], euler[2]);
  assertElementsRoughlyEqual(m0, m1, goog.vec.EPSILON);
}

function testLookAt() {
  var viewMatrix = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeLookAt(
    viewMatrix, [0, 0, 0], [1, 0, 0], [0, 1, 0]);
  assertElementsRoughlyEqual(
    [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1], viewMatrix,
    goog.vec.EPSILON);
}

function testToLookAt() {
  // This test does not use the default precision goog.vec.EPSILON due to
  // precision issues in some browsers leading to flaky tests.
  var EPSILON = 1e-4;

  var eyeExp = [0, 0, 0];
  var fwdExp = [1, 0, 0];
  var upExp = [0, 1, 0];

  var centerExp = [0, 0, 0];
  goog.vec.Vec3.add(eyeExp, fwdExp, centerExp);

  var view = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.makeLookAt(view, eyeExp, centerExp, upExp);

  var eyeRes = [0, 0, 0];
  var fwdRes = [0, 0, 0];
  var upRes = [0, 0, 0];
  goog.vec.Mat4.toLookAt(view, eyeRes, fwdRes, upRes);
  assertElementsRoughlyEqual(eyeExp, eyeRes, EPSILON);
  assertElementsRoughlyEqual(fwdExp, fwdRes, EPSILON);
  assertElementsRoughlyEqual(upExp, upRes, EPSILON);
}

function testLookAtDecomposition() {
  // This test does not use the default precision goog.vec.EPSILON due to
  // precision issues in some browsers leading to flaky tests.
  var EPSILON = 1e-4;

  var viewExp = goog.vec.Mat4.createFloat32();
  var viewRes = goog.vec.Mat4.createFloat32();

  // Get a valid set of random vectors eye, forward, up by decomposing
  // a random matrix into a set of lookAt vectors.
  var tmp = goog.vec.Mat4.createFloat32FromArray(randomMat4);
  var eyeExp = [0, 0, 0];
  var fwdExp = [0, 0, 0];
  var upExp = [0, 0, 0];
  var centerExp = [0, 0, 0];
  // Project the random matrix into a real modelview matrix.
  goog.vec.Mat4.toLookAt(tmp, eyeExp, fwdExp, upExp);
  goog.vec.Vec3.add(eyeExp, fwdExp, centerExp);

  // Compute the expected modelview matrix from a set of valid random vectors.
  goog.vec.Mat4.makeLookAt(viewExp, eyeExp, centerExp, upExp);

  var eyeRes = [0, 0, 0];
  var fwdRes = [0, 0, 0];
  var upRes = [0, 0, 0];
  var centerRes = [0, 0, 0];
  goog.vec.Mat4.toLookAt(viewExp, eyeRes, fwdRes, upRes);
  goog.vec.Vec3.add(eyeRes, fwdRes, centerRes);

  goog.vec.Mat4.makeLookAt(viewRes, eyeRes, centerRes, upRes);

  assertElementsRoughlyEqual(eyeExp, eyeRes, EPSILON);
  assertElementsRoughlyEqual(fwdExp, fwdRes, EPSILON);
  assertElementsRoughlyEqual(upExp, upRes, EPSILON);
  assertElementsRoughlyEqual(viewExp, viewRes, EPSILON);
}
