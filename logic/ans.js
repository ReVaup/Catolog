const fs = require('fs');

const MAX_256_BIT = Math.pow(2, 256) - 1;

function isValidCoefficient(value) {
    return value >= 0 && value <= MAX_256_BIT;
}

function decodeValue(base, value) {
    const decodedValue = parseInt(value, base);
    if (!isValidCoefficient(decodedValue)) {
        throw new Error(Decoded value ${decodedValue} is not within the 256-bit range.);
    }
    return decodedValue;
}

function lagrangeInterpolation(points, k) {
    let constant = 0;
    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;
        let li = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                li *= (0 - points[j].x) / (xi - points[j].x);
            }
        }
        constant += li * yi;
    }
    if (constant < 0 || constant > MAX_256_BIT) {
        throw new Error(${constant} is not in 256-bit range.);
    }
    return Math.round(constant);
}

function parseInput(jsonData) {
    const points = [];
    const n = jsonData.keys.n;
    const k = jsonData.keys.k;
    
    if (n < k) {
        throw new Error(The number of roots (n) must be greater than or equal to the minimum number of roots (k).);
    }

    for (const key in jsonData) {
        if (!isNaN(parseInt(key))) {
            const x = parseInt(key);
            const base = parseInt(jsonData[key].base);
            const value = jsonData[key].value;
            const y = decodeValue(base, value);
            points.push({ x, y });
        }
    }
    points.sort((a, b) => a.x - b.x);
    return { points, k };
}

function findSecret(jsonFile) {
    const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    const { points, k } = parseInput(jsonData);
    return lagrangeInterpolation(points, k);
}

const testCase1 = findSecret('../data/TestCase1.json');
const testCase2 = findSecret('../data/TestCase2.json');

console.log('Secret for Test Case 1:', testCase1);
console.log('Secret for Test Case 2:', testCase2);