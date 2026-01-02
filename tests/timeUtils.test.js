/**
 * Tests for timeUtils functions
 * These tests verify timestamp parsing and time formatting functionality
 */

// Import the functions from the actual source file
import { parseISTTimestamp, getHoursAgo } from '../src/lib/timeUtils.ts';

// Test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  run() {
    console.log('🧪 Running Time Utils Tests\n');

    for (const { name, testFn } of this.tests) {
      try {
        testFn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}\n`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);

    if (this.failed > 0) {
      console.log('❌ Some tests failed!');
      process.exit(1);
    } else {
      console.log('✅ All tests passed!');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}: Expected "${expected}", got "${actual}"`);
    }
  }

  assertNotEqual(actual, expected, message) {
    if (actual === expected) {
      throw new Error(`${message}: Expected not "${expected}", got "${actual}"`);
    }
  }

  assertTrue(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
}

// Create test runner
const runner = new TestRunner();

// Tests for parseISTTimestamp
runner.test('parseISTTimestamp should handle null/undefined', () => {
  const result = parseISTTimestamp(null);
  runner.assertTrue(result instanceof Date, 'Should return a Date object');
});

runner.test('parseISTTimestamp should handle IST timestamps with Z suffix', () => {
  const timestamp = '2026-01-02T09:10:16.000Z';
  const result = parseISTTimestamp(timestamp);

  // The parsed date should have the correct hours and minutes regardless of timezone
  // When we remove 'Z' from '2026-01-02T09:10:16.000Z', we get '2026-01-02T09:10:16.000'
  // This should be interpreted as local time, so the hours should be 9 and minutes should be 10
  const hours = result.getHours();
  const minutes = result.getMinutes();

  runner.assertTrue(
    hours === 9 && minutes === 10,
    `Should have 9:10 as local time, got ${hours}:${minutes.toString().padStart(2, '0')}`
  );

  // Additional check: verify the date components are correct
  runner.assertTrue(
    result.getFullYear() === 2026 && result.getMonth() === 0 && result.getDate() === 2,
    `Should have correct date (2026-01-02), got ${result.getFullYear()}-${(result.getMonth() + 1).toString().padStart(2, '0')}-${result.getDate().toString().padStart(2, '0')}`
  );

  // Verify it's not showing UTC time (which would be different)
  // UTC time would be 3:40:16, so local time should NOT be 3:40
  runner.assertTrue(
    !(hours === 3 && minutes === 40),
    `Should not show UTC time (3:40), got ${hours}:${minutes.toString().padStart(2, '0')}`
  );
});

runner.test('parseISTTimestamp should handle timestamps without Z suffix', () => {
  const timestamp = '2026-01-02T15:30:00.000';
  const result = parseISTTimestamp(timestamp);
  runner.assertTrue(result instanceof Date, 'Should return a Date object');
});

runner.test('parseISTTimestamp should handle custom format', () => {
  const timestamp = '2026-01-02 15:30:00';
  const result = parseISTTimestamp(timestamp);
  runner.assertTrue(result instanceof Date, 'Should return a Date object');
});

runner.test('parseISTTimestamp should handle invalid timestamps gracefully', () => {
  const timestamp = 'invalid-timestamp';
  const result = parseISTTimestamp(timestamp);
  runner.assertTrue(result instanceof Date, 'Should return a Date object even for invalid input');
});

// Tests for getHoursAgo
runner.test('getHoursAgo should return "Just now" for current time', () => {
  const now = new Date();
  const result = getHoursAgo(now);
  runner.assertEqual(result, 'Just now', 'Should return "Just now" for current time');
});

runner.test('getHoursAgo should return minutes for times under 1 hour', () => {
  const now = new Date();
  const testDate = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
  const result = getHoursAgo(testDate);
  runner.assertEqual(result, '5 minutes ago', 'Should return "5 minutes ago"');
});

runner.test('getHoursAgo should handle singular minute', () => {
  const now = new Date();
  const testDate = new Date(now.getTime() - 1 * 60 * 1000); // 1 minute ago
  const result = getHoursAgo(testDate);
  runner.assertEqual(result, '1 minute ago', 'Should return "1 minute ago" (singular)');
});

runner.test('getHoursAgo should return exact hour', () => {
  const now = new Date();
  const testDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
  const result = getHoursAgo(testDate);
  runner.assertEqual(result, '1 hour ago', 'Should return "1 hour ago"');
});

runner.test('getHoursAgo should return hours and minutes', () => {
  const now = new Date();
  const testDate = new Date(now.getTime() - (1 * 60 + 15) * 60 * 1000); // 1 hour 15 minutes ago
  const result = getHoursAgo(testDate);
  runner.assertEqual(result, '1h 15m ago', 'Should return "1h 15m ago"');
});

runner.test('getHoursAgo should return multiple hours with minutes', () => {
  const now = new Date();
  const testDate = new Date(now.getTime() - (2 * 60 + 30) * 60 * 1000); // 2 hours 30 minutes ago
  const result = getHoursAgo(testDate);
  runner.assertEqual(result, '2h 30m ago', 'Should return "2h 30m ago"');
});

runner.test('getHoursAgo should return exact hours', () => {
  const now = new Date();
  const testDate = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
  const result = getHoursAgo(testDate);
  runner.assertEqual(result, '3 hours ago', 'Should return "3 hours ago"');
});

runner.test('getHoursAgo should return days for times over 24 hours', () => {
  const now = new Date();
  const testDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
  const result = getHoursAgo(testDate);
  runner.assertEqual(result, '1 day ago', 'Should return "1 day ago"');
});

runner.test('getHoursAgo should handle plural days', () => {
  const now = new Date();
  const testDate = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 2 days ago
  const result = getHoursAgo(testDate);
  runner.assertEqual(result, '2 days ago', 'Should return "2 days ago"');
});

// Integration test
runner.test('Integration: parseISTTimestamp and getHoursAgo work together', () => {
  const apiTimestamp = '2026-01-02T09:10:16.000Z';
  const parsedDate = parseISTTimestamp(apiTimestamp);
  const timeAgo = getHoursAgo(parsedDate);

  runner.assertTrue(typeof timeAgo === 'string', 'Should return a string');
  runner.assertTrue(timeAgo.includes('ago'), 'Should include "ago" in the result');
});

// Run all tests
runner.run();
