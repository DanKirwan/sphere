import { describe, it, expect } from 'vitest';
import { adjustSize } from '../lib/aspectRatio';

describe('adjustSize', () => {
    it('should scale width to maxDimension when width > height', () => {
        const width = 200;
        const height = 100;
        const maxDimension = 300;

        const result = adjustSize(width, height, maxDimension);

        expect(result.width).toBe(maxDimension);
        expect(result.height).toBeCloseTo(150); // 300 / (200 / 100)
    });

    it('should scale height to maxDimension when height > width', () => {
        const width = 100;
        const height = 200;
        const maxDimension = 300;

        const result = adjustSize(width, height, maxDimension);

        expect(result.height).toBe(maxDimension);
        expect(result.width).toBeCloseTo(150); // 300 * (100 / 200)
    });

    it('should scale both dimensions proportionally when width == height', () => {
        const width = 100;
        const height = 100;
        const maxDimension = 300;

        const result = adjustSize(width, height, maxDimension);

        expect(result.width).toBe(maxDimension);
        expect(result.height).toBe(maxDimension);
    });

    it('should return 0 for width and height if both inputs are 0', () => {
        const width = 0;
        const height = 0;
        const maxDimension = 300;

        const result = adjustSize(width, height, maxDimension);

        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle edge cases where maxDimension is 0', () => {
        const width = 200;
        const height = 100;
        const maxDimension = 0;

        const result = adjustSize(width, height, maxDimension);

        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should return correct proportions for non-integer aspect ratios', () => {
        const width = 250;
        const height = 400;
        const maxDimension = 300;

        const result = adjustSize(width, height, maxDimension);

        expect(result.height).toBe(maxDimension);
        expect(result.width).toBeCloseTo(187.5); // 300 * (250 / 400)
    });
});
