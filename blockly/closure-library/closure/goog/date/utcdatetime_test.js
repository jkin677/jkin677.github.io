// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.date.UtcDateTimeTest');
goog.setTestOnly('goog.date.UtcDateTimeTest');

goog.require('goog.date.Interval');
goog.require('goog.date.UtcDateTime');
goog.require('goog.date.month');
goog.require('goog.date.weekDay');
goog.require('goog.testing.jsunit');

function testConstructor() {
  goog.now = function() { return new Date(2001, 2, 3, 4).getTime(); };

  var d = new goog.date.UtcDateTime();
  assertTrue('default constructor', d.equals(new Date(goog.now())));

  var d = new goog.date.UtcDateTime(2001);
  assertTrue('year only', d.equals(new Date(Date.UTC(2001, 0, 1, 0, 0, 0))));

  var d = new goog.date.UtcDateTime(2001, 2, 3, 4, 5, 6, 7);
  assertTrue(
      'full date/time', d.equals(new Date(Date.UTC(2001, 2, 3, 4, 5, 6, 7))));

  var d = new goog.date.UtcDateTime(new Date(0));
  assertTrue(
      'copy constructor', d.equals(new Date(Date.UTC(1970, 0, 1, 0, 0, 0))));
}

function testClone() {
  var d = new goog.date.UtcDateTime(2001, 2, 3, 4, 5, 6, 7);
  assertTrue('clone of UtcDateTime', d.equals(d.clone()));
}

function testAdd() {
  var date = new goog.date.UtcDateTime(2007, goog.date.month.OCT, 5);
  date.add(new goog.date.Interval(-1, 2));
  var expected = new goog.date.UtcDateTime(2006, goog.date.month.DEC, 5);
  assertTrue('UTC date + years + months', expected.equals(date));

  var date = new goog.date.UtcDateTime(2007, goog.date.month.OCT, 1);
  date.add(new goog.date.Interval(0, 0, 60));
  var expected = new goog.date.UtcDateTime(2007, goog.date.month.NOV, 30);
  assertTrue('UTC date + days', expected.equals(date));

  var date = new goog.date.UtcDateTime(2007, goog.date.month.OCT, 1);
  date.add(new goog.date.Interval(0, 0, 0, 60 * 24 - 12, -30, -30.5));
  var expected =
      new goog.date.UtcDateTime(2007, goog.date.month.NOV, 29, 11, 29, 29, 500);
  assertTrue('UTC date + time, daylight saving ignored', expected.equals(date));
}

function testGetYear() {
  var date = new goog.date.UtcDateTime(2000, goog.date.month.JAN, 1);
  assertEquals('year of 2000-01-01 00:00:00', 2000, date.getYear());

  var date = new goog.date.UtcDateTime(1999, goog.date.month.DEC, 31, 23, 59);
  assertEquals('year of 1999-12-31 23:59:00', 1999, date.getYear());
}

function testGetDay() {
  var date = new goog.date.UtcDateTime(2000, goog.date.month.JAN, 1);
  assertEquals(
      '2000-01-01 00:00:00 is Saturday (UTC + ISO)', goog.date.weekDay.SAT,
      date.getUTCIsoWeekday());
  assertEquals(
      '2000-01-01 00:00:00 is Saturday (ISO)', goog.date.weekDay.SAT,
      date.getIsoWeekday());
  assertEquals('2000-01-01 00:00:00 is Saturday (UTC)', 6, date.getUTCDay());
  assertEquals('2000-01-01 00:00:00 is Saturday', 6, date.getDay());

  var date = new goog.date.UtcDateTime(2000, goog.date.month.JAN, 1, 23, 59);
  assertEquals(
      '2000-01-01 23:59:00 is Saturday (UTC + ISO)', goog.date.weekDay.SAT,
      date.getUTCIsoWeekday());
  assertEquals(
      '2000-01-01 23:59:00 is Saturday (ISO)', goog.date.weekDay.SAT,
      date.getIsoWeekday());
  assertEquals('2000-01-01 23:59:00 is Saturday (UTC)', 6, date.getUTCDay());
  assertEquals('2000-01-01 23:59:00 is Saturday', 6, date.getDay());
}

function testFromIsoString() {
  var dateString = '2000-01-02';
  var date = goog.date.UtcDateTime.fromIsoString(dateString);
  var exp = new goog.date.UtcDateTime(2000, goog.date.month.JAN, 2);
  assertTrue('parsed ISO date', exp.equals(date));

  var dateTimeString = '2000-01-02 03:04:05';
  var dateTime = goog.date.UtcDateTime.fromIsoString(dateTimeString);
  var exp = new goog.date.UtcDateTime(2000, goog.date.month.JAN, 2, 3, 4, 5);
  assertTrue('parsed ISO date/time', exp.equals(dateTime));
}

function testToIsoString() {
  var date = new goog.date.UtcDateTime(2000, goog.date.month.JAN, 2, 3, 4, 5);
  assertEquals(
      'serialize date/time', '2000-01-02 03:04:05', date.toIsoString(true));
  assertEquals('serialize time only', '03:04:05', date.toIsoTimeString(true));
  assertEquals(
      'serialize date/time to XML', '2000-01-02T03:04:05',
      date.toXmlDateTime());
}

function testIsMidnight() {
  assertTrue(new goog.date.UtcDateTime(2000, 0, 1).isMidnight());
  assertFalse(new goog.date.UtcDateTime(2000, 0, 1, 0, 0, 0, 1).isMidnight());
}

function testFromTimestamp() {
  assertEquals(0, goog.date.UtcDateTime.fromTimestamp(0).getTime());
  assertEquals(1234, goog.date.UtcDateTime.fromTimestamp(1234).getTime());
}
