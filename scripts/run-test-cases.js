const { resolve } = require('path');
const { readdirSync, unlinkSync } = require('fs');
const { expect } = require('chai');

const PROBLEMS_DIR = resolve(__dirname, '../problems');

const getTestProblems = testNum => readdirSync(PROBLEMS_DIR).filter(p => p.startsWith(testNum));

const getTestProblemNum = () => {
  let problemNum = process.argv[process.argv.length - 1];
  if (/[0-9]+/.test(problemNum)) {
    const len = problemNum.length;
    for (let i = 0; i < 3 - len; ++i) {
      problemNum = '0' + problemNum;
    }
    return problemNum;
  } else {
    return '';
  }
};

const executeCase = problem => {
  const program = require(resolve(PROBLEMS_DIR, problem, 'index'));
  const testCases = require(resolve(PROBLEMS_DIR, problem, 'test-cases'));
  describe(problem, () => {
    try{
      if (testCases.length) unlinkSync(resolve(__dirname, '../drafts', problem.split('_')[1] + '.js'));
    } catch(e) {}
    testCases.forEach(testCase => {
      const { input, output, func } = testCase;
      if (func) {
        it (`Func: ${func.name}\nInput: ${(JSON.stringify(...input) || '').slice(0, 66)}\t Output: ${JSON.stringify(output)}`, () => {
          expect(func(...input)).to.deep.equal(output);
        });
      } else {
        it (`Input: ${JSON.stringify(...input).slice(0, 66)}\t Output: ${JSON.stringify(output)}`, () => {
          expect(program(...input)).to.deep.equal(output);
        });
      }
    });
  });
};

const testProblems = problems => problems.forEach(executeCase);

testProblems(getTestProblems(getTestProblemNum()));