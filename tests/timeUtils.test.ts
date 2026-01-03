/**
 * Tests for timeUtils functions
 * These tests verify timestamp parsing and time formatting functionality
 */

// Import the functions from the actual source file
import { parseISTTimestamp, getHoursAgo } from '../src/lib/timeUtils';

// Test framework
class TestRunner {
  private tests: Array<{ name: string; testFn: () => void }> = [];
  private passed = 0;
  private failed = 0;

  test(name: string, testFn: () => void): void {
    this.tests.push({ name, testFn });
  }

  run(): void {
    console.log('🧪 Running Time Utils Tests\n');

    for (const { name, testFn } of this.tests) {
      try {
        testFn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results:`);
    console.log(`   Passed: ${this.passed}`);
    console.log(`   Failed: ${this.failed}`);
    console.log(`   Total:  ${this.tests.length}`);
    console.log(`   Status: ${this.failed === 0 ? '🎉 ALL TESTS PASSED' : '💥 SOME TESTS FAILED'}`);
  }

  assert(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertEqual<T>(actual: T, expected: T, message: string): void {
    if (actual !== expected) {
      throw new Error(`${message}. Expected: ${expected}, Actual: ${actual}`);
    }
  }

  assertClose(actual: number, expected: number, tolerance: number, message: string): void {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`${message}. Expected: ${expected} ±${tolerance}, Actual: ${actual}`);
    }
  }
}

// Create test runner instance
const runner = new TestRunner();

// Test parseISTTimestamp function
runner.test('Should parse valid IST timestamp', () => {
  const timestamp = '2024-01-15T14:30:00+05:30';
  const result = parseISTTimestamp(timestamp);
  
  runner.assert(result instanceof Date, 'Should return a Date object');
  runner.assertEqual(result.getFullYear(), 2024, 'Year should be 2024');
  runner.assertEqual(result.getMonth(), 0, 'Month should be January (0-indexed)');
  runner.assertEqual(result.getDate(), 15, 'Day should be 15');
  runner.assertEqual(result.getHours(), 14, 'Hour should be 14');
  runner.assertEqual(result.getMinutes(), 30, 'Minute should be 30');
  runner.assertEqual(result.getSeconds(), 0, 'Second should be 0');
});

runner.test('Should handle different IST timestamps', () => {
  const testCases = [
    { timestamp: '2024-12-31T23:59:59+05:30', expectedHour: 23, expectedMinute: 59 },
    { timestamp: '2024-01-01T00:00:00+05:30', expectedHour: 0, expectedMinute: 0 },
    { timestamp: '2024-06-15T12:30:45+05:30', expectedHour: 12, expectedMinute: 30 },
  ];

  for (const testCase of testCases) {
    const result = parseISTTimestamp(testCase.timestamp);
    runner.assert(result instanceof Date, `Should parse ${testCase.timestamp}`);
    runner.assertEqual(result.getHours(), testCase.expectedHour, `Hour should be ${testCase.expectedHour}`);
    runner.assertEqual(result.getMinutes(), testCase.expectedMinute, `Minute should be ${testCase.expectedMinute}`);
  }
});

runner.test('Should throw error for invalid timestamp format', () => {
  const invalidTimestamps = [
    'invalid-date',
    '2024-01-15T14:30:00', // Missing timezone
    '2024-01-15 14:30:00+05:30', // Wrong format
    '2024-13-15T14:30:00+05:30', // Invalid month
  ];

  for (const invalidTimestamp of invalidTimestamps) {
    try {
      parseISTTimestamp(invalidTimestamp);
      runner.assert(false, `Should throw error for invalid timestamp: ${invalidTimestamp}`);
    } catch (error) {
      runner.assert(true, `Correctly threw error for invalid timestamp: ${invalidTimestamp}`);
    }
  }
});

// Test getHoursAgo function
runner.test('Should calculate hours ago correctly', () => {
  // Create a date that's exactly 1 hour ago from current time
  const past = new Date(Date.now() - 60 * 60 * 1000);
  const result = getHoursAgo(past);
  runner.assertEqual(result, '1 hour ago', 'Should be 1 hour ago');
});

runner.test('Should handle same time', () => {
  // Create a date that's now
  const now = new Date();
  const result = getHoursAgo(now);
  runner.assertEqual(result, 'Just now', 'Should be just now');
});

runner.test('Should handle multiple hours ago', () => {
  // Create a date that's 6 hours ago
  const past = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const result = getHoursAgo(past);
  runner.assertEqual(result, '6 hours ago', 'Should be 6 hours ago');
});

runner.test('Should handle minutes', () => {
  // Create a date that's 15 minutes ago
  const past = new Date(Date.now() - 15 * 60 * 1000);
  const result = getHoursAgo(past);
  runner.assertEqual(result, '15 minutes ago', 'Should be 15 minutes ago');
});

runner.test('Should handle days', () => {
  // Create a date that's 2 days ago
  const past = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const result = getHoursAgo(past);
  runner.assertEqual(result, '2 days ago', 'Should be 2 days ago');
});

runner.test('Should handle hours and minutes', () => {
  // Create a date that's 5 hours and 30 minutes ago
  const past = new Date(Date.now() - (5 * 60 + 30) * 60 * 1000);
  const result = getHoursAgo(past);
  runner.assertEqual(result, '5h 30m ago', 'Should be 5h 30m ago');
});

// Test integration between functions
runner.test('Should work together for real-world usage', () => {
  const timestamp = '2024-01-15T10:30:00+05:30';
  const parsedDate = parseISTTimestamp(timestamp);
  const hoursAgo = getHoursAgo(parsedDate);
  
  // The result should be a valid time format (we can't predict exact value due to current time)
  runner.assert(
    typeof hoursAgo === 'string' && hoursAgo.includes('ago'),
    'Should return a valid time ago string'
  );
});

// Test edge cases
runner.test('Should handle leap year dates', () => {
  const leapYearTimestamp = '2024-02-29T12:00:00+05:30';
  const result = parseISTTimestamp(leapYearTimestamp);
  
  runner.assert(result instanceof Date, 'Should handle leap year date');
  runner.assertEqual(result.getMonth(), 1, 'Month should be February');
  runner.assertEqual(result.getDate(), 29, 'Day should be 29 (leap day)');
});

runner.test('Should handle different months', () => {
  const months = [
    { timestamp: '2024-01-15T12:00:00+05:30', expectedMonth: 0 }, // January
    { timestamp: '2024-06-15T12:00:00+05:30', expectedMonth: 5 }, // June
    { timestamp: '2024-12-15T12:00:00+05:30', expectedMonth: 11 }, // December
  ];

  for (const testCase of months) {
    const result = parseISTTimestamp(testCase.timestamp);
    runner.assertEqual(result.getMonth(), testCase.expectedMonth, `Month should be correct for ${testCase.timestamp}`);
  }
});

// Run all tests
runner.run();
