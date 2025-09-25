// test/miniMaple.test.js
import { MiniMaple } from "../src/miniMaple";

describe('MiniMaple', () => {
    test('differentiates 4*x^3 with respect to x', () => {
        expect(MiniMaple.diff('4*x^3', 'x')).toBe('12*x^2');
    });
    
    test('differentiates 4*x^3 with respect to y', () => {
        expect(MiniMaple.diff('4*x^3', 'y')).toBe('0');
    });
    
    test('differentiates 4*x^3-x^2 with respect to x', () => {
        expect(MiniMaple.diff('4*x^3-x^2', 'x')).toBe('12*x^2-2*x');
    });
    
    test('differentiates x with respect to x', () => {
        expect(MiniMaple.diff('x', 'x')).toBe('1');
    });
    
    test('differentiates constant with respect to x', () => {
        expect(MiniMaple.diff('5', 'x')).toBe('0');
    });
    
    test('differentiates x^2 with respect to x', () => {
        expect(MiniMaple.diff('x^2', 'x')).toBe('2*x');
    });
    
    test('differentiates 3*x with respect to x', () => {
        expect(MiniMaple.diff('3*x', 'x')).toBe('3');
    });
    
    test('handles implicit multiplication', () => {
        expect(MiniMaple.diff('4x^3', 'x')).toBe('12*x^2');
    });
    
    test('handles negative coefficients', () => {
        expect(MiniMaple.diff('-x^2', 'x')).toBe('-2*x');
    });
    
    test('throws error for invalid variable', () => {
        expect(() => MiniMaple.diff('x', 'xy')).toThrow();
    });
    
    test('throws error for non-string inputs', () => {
        expect(() => MiniMaple.diff(5, 'x')).toThrow();
        expect(() => MiniMaple.diff('x', 5)).toThrow();
    });
    
    test('handles complex polynomial', () => {
        expect(MiniMaple.diff('2*x^4 + 3*x^2 - 5*x + 7', 'x')).toBe('8*x^3+6*x-5');
    });
});