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

goog.provide('goog.testing.ContinuationTestCaseTest');
goog.setTestOnly('goog.testing.ContinuationTestCaseTest');

goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.MockClock');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.TestCase');
goog.require('goog.testing.jsunit');

/**
 * @fileoverview This test file uses the ContinuationTestCase to test itself,
 * which is a little confusing. It's also difficult to write a truly effective
 * test, since testing a failure causes an actual failure in the test runner.
 * All tests have been manually verified using a sophisticated combination of
 * alerts and false assertions.
 */

var testCase = new goog.testing.ContinuationTestCase('Continuation Test Case');
testCase.autoDiscoverTests();

// Standalone Closure Test Runner.
if (typeof G_testRunner != 'undefined') {
  G_testRunner.initialize(testCase);
}


var clock = new goog.testing.MockClock();
var count = 0;
var stubs = new goog.testing.PropertyReplacer();


function setUpPage() {
  count = testCase.getCount();
}


/**
 * Resets the mock clock. Includes a wait step to verify that setUp routines
 * can contain continuations.
 */
function setUp() {
  waitForTimeout(function() {
    // Pointless assertion to verify that setUp methods can contain waits.
    assertEquals(count, testCase.getCount());
  }, 0);

  clock.reset();
}


/**
 * Uninstalls the mock clock if it was installed, and restores the Step timeout
 * functions to the default window implementations.
 */
function tearDown() {
  clock.uninstall();
  stubs.reset();

  waitForTimeout(function() {
    // Pointless assertion to verify that tearDown methods can contain waits.
    assertTrue(testCase.now() >= testCase.startTime_);
  }, 0);
}


/**
 * Installs the Mock Clock and replaces the Step timeouts with the mock
 * implementations.
 */
function installMockClock() {
  clock.install();

  // Overwrite the "protected" setTimeout and clearTimeout with the versions
  // replaced by MockClock. Normal tests should never do this, but we need to
  // test the ContinuationTest itself.
  stubs.set(
      goog.testing.ContinuationTestCase.Step, 'protectedClearTimeout_',
      window.clearTimeout);
  stubs.set(
      goog.testing.ContinuationTestCase.Step, 'protectedSetTimeout_',
      window.setTimeout);
}


/**
 * @return {goog.testing.ContinuationTestCase.Step} A generic step in a
 *     continuation test.
 */
function getSampleStep() {
  return new goog.testing.ContinuationTestCase.Step('test', function() {});
}


/**
 * @return {goog.testing.ContinuationTestCase.ContinuationTest} A simple
 *     continuation test with generic setUp, test, and tearDown functions.
 */
function getSampleTest() {
  var setupStep = new goog.testing.TestCase.Test('setup', function() {});
  var testStep = new goog.testing.TestCase.Test('test', function() {});
  var teardownStep = new goog.testing.TestCase.Test('teardown', function() {});

  return new goog.testing.ContinuationTestCase.ContinuationTest(
      setupStep, testStep, teardownStep);
}


function testStepWaiting() {
  var step = getSampleStep();
  assertTrue(step.waiting);
}


function testStepSetTimeout() {
  installMockClock();
  var step = getSampleStep();

  var timeoutReached = false;
  step.setTimeout(function() {
    timeoutReached = true;
  }, 100);

  clock.tick(50);
  assertFalse(timeoutReached);
  clock.tick(50);
  assertTrue(timeoutReached);
}


function testStepClearTimeout() {
  var step = new goog.testing.ContinuationTestCase.Step('test', function() {});

  var timeoutReached = false;
  step.setTimeout(function() {
    timeoutReached = true;
  }, 100);

  clock.tick(50);
  assertFalse(timeoutReached);
  step.clearTimeout();
  clock.tick(50);
  assertFalse(timeoutReached);
}


function testTestPhases() {
  var test = getSampleTest();

  assertEquals('setup', test.getCurrentPhase()[0].name);
  test.cancelCurrentPhase();

  assertEquals('test', test.getCurrentPhase()[0].name);
  test.cancelCurrentPhase();

  assertEquals('teardown', test.getCurrentPhase()[0].name);
  test.cancelCurrentPhase();

  assertNull(test.getCurrentPhase());
}


function testTestSetError() {
  var test = getSampleTest();

  var error1 = new Error('Oh noes!');
  var error2 = new Error('B0rken.');

  assertNull(test.getError());
  test.setError(error1);
  assertEquals(error1, test.getError());
  test.setError(error2);
  assertEquals(
      'Once an error has been set, it should not be overwritten.', error1,
      test.getError());
}


function testAddStep() {
  var test = getSampleTest();
  var step = getSampleStep();

  // Try adding a step to each phase and then cancelling the phase.
  for (var i = 0; i < 3; i++) {
    assertEquals(1, test.getCurrentPhase().length);
    test.addStep(step);

    assertEquals(2, test.getCurrentPhase().length);
    assertEquals(step, test.getCurrentPhase()[1]);
    test.cancelCurrentPhase();
  }

  assertNull(test.getCurrentPhase());
}


function testCancelTestPhase() {
  var test = getSampleTest();

  test.cancelTestPhase();
  assertEquals('teardown', test.getCurrentPhase()[0].name);

  test = getSampleTest();
  test.cancelCurrentPhase();
  test.cancelTestPhase();
  assertEquals('teardown', test.getCurrentPhase()[0].name);

  test = getSampleTest();
  test.cancelTestPhase();
  test.cancelTestPhase();
  assertEquals('teardown', test.getCurrentPhase()[0].name);
}


function testWaitForTimeout() {
  var reachedA = false;
  var reachedB = false;
  var reachedC = false;

  waitForTimeout(function a() {
    reachedA = true;

    assertTrue('A must be true at callback a.', reachedA);
    assertFalse('B must be false at callback a.', reachedB);
    assertFalse('C must be false at callback a.', reachedC);
  }, 10);

  waitForTimeout(function b() {
    reachedB = true;

    assertTrue('A must be true at callback b.', reachedA);
    assertTrue('B must be true at callback b.', reachedB);
    assertFalse('C must be false at callback b.', reachedC);
  }, 20);

  waitForTimeout(function c() {
    reachedC = true;

    assertTrue('A must be true at callback c.', reachedA);
    assertTrue('B must be true at callback c.', reachedB);
    assertTrue('C must be true at callback c.', reachedC);
  }, 20);

  assertFalse('a', reachedA);
  assertFalse('b', reachedB);
  assertFalse('c', reachedC);
}


function testWaitForEvent() {
  var et = new goog.events.EventTarget();

  var eventFired = false;
  goog.events.listen(et, 'testPrefire', function() {
    eventFired = true;
    et.dispatchEvent('test');
  });

  waitForEvent(et, 'test', function() { assertTrue(eventFired); });

  et.dispatchEvent('testPrefire');
}


function testWaitForCondition() {
  var counter = 0;

  waitForCondition(
      function() { return ++counter >= 2; },
      function() { assertEquals(2, counter); }, 10, 200);
}


function testOutOfOrderWaits() {
  var counter = 0;

  // Note that if the delta between the timeout is too small, two
  // continuation may be invoked at the same timer tick, using the
  // registration order.
  waitForTimeout(function() { assertEquals(3, ++counter); }, 200);
  waitForTimeout(function() { assertEquals(1, ++counter); }, 0);
  waitForTimeout(function() { assertEquals(2, ++counter); }, 100);
}


/*
 * Any of the test functions below (except the condition check passed into
 * waitForCondition) can raise an assertion successfully. Any level of nested
 * test steps should be possible, in any configuration.
 */

var testObj;


function testCrazyNestedWaitFunction() {
  testObj = {lock: true, et: new goog.events.EventTarget(), steps: 0};

  waitForTimeout(handleTimeout, 10);
  waitForEvent(testObj.et, 'test', handleEvent);
  waitForCondition(condition, handleCondition, 1);
}

function handleTimeout() {
  testObj.steps++;
  assertEquals('handleTimeout should be called first.', 1, testObj.steps);
  waitForTimeout(fireEvent, 10);
}

function fireEvent() {
  testObj.steps++;
  assertEquals('fireEvent should be called second.', 2, testObj.steps);
  testObj.et.dispatchEvent('test');
}

function handleEvent() {
  testObj.steps++;
  assertEquals('handleEvent should be called third.', 3, testObj.steps);
  testObj.lock = false;
}

function condition() {
  return !testObj.lock;
}

function handleCondition() {
  assertFalse(testObj.lock);
  testObj.steps++;
  assertEquals('handleCondition should be called last.', 4, testObj.steps);
}
