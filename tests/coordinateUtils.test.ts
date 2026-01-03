/**
 * Tests for coordinateUtils functions
 * These tests verify coordinate calculation functionality for the Jaipur traffic grid
 */

import { getCellCenterCoordinates, JAIPUR_BOUNDARIES, GRID_METERS } from '../src/lib/coordinateUtils';
import { GRID_DIMENSIONS } from '../src/lib/constants';

// Test framework
class TestRunner {
  private tests: Array<{ name: string; testFn: () => void }> = [];
  private passed = 0;
  private failed = 0;

  test(name: string, testFn: () => void): void {
    this.tests.push({ name, testFn });
  }

  run(): void {
    console.log('🧪 Running Coordinate Utils Tests\n');

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

// Test boundary constants
runner.test('JAIPUR_BOUNDARIES constants should be correct', () => {
  runner.assertEqual(JAIPUR_BOUNDARIES.NORTH_WEST_LAT, 26.99, 'Northwest latitude');
  runner.assertEqual(JAIPUR_BOUNDARIES.SOUTH_EAST_LAT, 26.78, 'Southeast latitude');
  runner.assertEqual(JAIPUR_BOUNDARIES.NORTH_WEST_LNG, 75.65, 'Northwest longitude');
  runner.assertEqual(JAIPUR_BOUNDARIES.SOUTH_EAST_LNG, 75.92, 'Southeast longitude');
});

// Test grid meter constants
runner.test('GRID_METERS constants should be correct', () => {
  runner.assertEqual(GRID_METERS.HEIGHT, 23100, 'Grid height in meters');
  runner.assertClose(GRID_METERS.WIDTH, 26998.580215450143, 0.001, 'Grid width in meters');
});

// Test grid dimensions
runner.test('GRID_DIMENSIONS should be correct', () => {
  runner.assertEqual(GRID_DIMENSIONS.ROWS, 21, 'Number of rows');
  runner.assertEqual(GRID_DIMENSIONS.COLS, 15, 'Number of columns');
});

// Test corner coordinates
runner.test('Should calculate northwest corner correctly', () => {
  const result = getCellCenterCoordinates(0, 0);
  runner.assertClose(result.lat, 26.985059, 0.0001, 'Northwest corner latitude');
  runner.assertClose(result.lng, 75.659073, 0.0001, 'Northwest corner longitude');
});

runner.test('Should calculate northeast corner correctly', () => {
  const result = getCellCenterCoordinates(14, 0);
  runner.assertClose(result.lat, 26.985059, 0.0001, 'Northeast corner latitude');
  runner.assertClose(result.lng, 75.913105, 0.0001, 'Northeast corner longitude');
});

runner.test('Should calculate southwest corner correctly', () => {
  const result = getCellCenterCoordinates(0, 20);
  runner.assertClose(result.lat, 26.787431, 0.0001, 'Southwest corner latitude');
  runner.assertClose(result.lng, 75.659057, 0.0001, 'Southwest corner longitude');
});

runner.test('Should calculate southeast corner correctly', () => {
  const result = getCellCenterCoordinates(14, 20);
  runner.assertClose(result.lat, 26.787431, 0.0001, 'Southeast corner latitude');
  runner.assertClose(result.lng, 75.912645, 0.0001, 'Southeast corner longitude');
});

// Test coordinate patterns
runner.test('Should maintain constant latitude across same row', () => {
  const row0 = getCellCenterCoordinates(0, 0);
  const row0End = getCellCenterCoordinates(14, 0);
  runner.assertClose(row0.lat, row0End.lat, 0.000001, 'Latitude should be same across row 0');

  const row10 = getCellCenterCoordinates(0, 10);
  const row10End = getCellCenterCoordinates(14, 10);
  runner.assertClose(row10.lat, row10End.lat, 0.000001, 'Latitude should be same across row 10');
});

runner.test('Should maintain nearly constant longitude across same column', () => {
  const col0 = getCellCenterCoordinates(0, 0);
  const col0End = getCellCenterCoordinates(0, 20);
  runner.assertClose(col0.lng, col0End.lng, 0.001, 'Longitude should be nearly same across column 0');

  const col7 = getCellCenterCoordinates(7, 0);
  const col7End = getCellCenterCoordinates(7, 20);
  runner.assertClose(col7.lng, col7End.lng, 0.001, 'Longitude should be nearly same across column 7');
});

// Test step sizes
runner.test('Should have correct latitude step size', () => {
  const row0 = getCellCenterCoordinates(0, 0);
  const row1 = getCellCenterCoordinates(0, 1);
  const latStep = Math.abs(row0.lat - row1.lat);
  runner.assertClose(latStep, 0.009881, 0.000001, 'Latitude step size should be ~0.009881°');
});

runner.test('Should have correct longitude step size', () => {
  const col0 = getCellCenterCoordinates(0, 0);
  const col1 = getCellCenterCoordinates(1, 0);
  const lngStep = Math.abs(col0.lng - col1.lng);
  runner.assertClose(lngStep, 0.018145, 0.000001, 'Longitude step size should be ~0.018145°');
});

// Test specific coordinates from expected output
runner.test('Should match expected coordinates for sample cells', () => {
  const testCases = [
    { x: 7, y: 10, expectedLat: 26.886245, expectedLng: 75.785969 },
    { x: 3, y: 5, expectedLat: 26.935652, expectedLng: 75.713480 },
    { x: 10, y: 15, expectedLat: 26.836838, expectedLng: 75.840274 },
    { x: 12, y: 8, expectedLat: 26.906008, expectedLng: 75.876556 },
  ];

  for (const testCase of testCases) {
    const result = getCellCenterCoordinates(testCase.x, testCase.y);
    runner.assertClose(
      result.lat, 
      testCase.expectedLat, 
      0.0001, 
      `Latitude for cell (${testCase.x}, ${testCase.y})`
    );
    runner.assertClose(
      result.lng, 
      testCase.expectedLng, 
      0.0001, 
      `Longitude for cell (${testCase.x}, ${testCase.y})`
    );
  }
});

// Test bounds
runner.test('Should keep coordinates within Jaipur boundaries', () => {
  for (let y = 0; y < GRID_DIMENSIONS.ROWS; y++) {
    for (let x = 0; x < GRID_DIMENSIONS.COLS; x++) {
      const coord = getCellCenterCoordinates(x, y);
      runner.assert(
        coord.lat >= JAIPUR_BOUNDARIES.SOUTH_EAST_LAT && coord.lat <= JAIPUR_BOUNDARIES.NORTH_WEST_LAT,
        `Latitude ${coord.lat} at (${x}, ${y}) should be within boundaries`
      );
      runner.assert(
        coord.lng >= JAIPUR_BOUNDARIES.NORTH_WEST_LNG && coord.lng <= JAIPUR_BOUNDARIES.SOUTH_EAST_LNG,
        `Longitude ${coord.lng} at (${x}, ${y}) should be within boundaries`
      );
    }
  }
});

// Test monotonic progression
runner.test('Should have monotonic latitude progression (decreasing southward)', () => {
  for (let x = 0; x < GRID_DIMENSIONS.COLS; x++) {
    for (let y = 1; y < GRID_DIMENSIONS.ROWS; y++) {
      const north = getCellCenterCoordinates(x, y - 1);
      const south = getCellCenterCoordinates(x, y);
      runner.assert(
        north.lat > south.lat,
        `Latitude should decrease going south at column ${x}, row ${y}`
      );
    }
  }
});

runner.test('Should have monotonic longitude progression (increasing eastward)', () => {
  for (let y = 0; y < GRID_DIMENSIONS.ROWS; y++) {
    for (let x = 1; x < GRID_DIMENSIONS.COLS; x++) {
      const west = getCellCenterCoordinates(x - 1, y);
      const east = getCellCenterCoordinates(x, y);
      runner.assert(
        west.lng < east.lng,
        `Longitude should increase going east at row ${y}, column ${x}`
      );
    }
  }
});

// Run all tests
runner.run();
