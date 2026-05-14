import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

const lines = [];
for await (const line of rl) {
  lines.push(line.trim());
}

const n = parseInt(lines[0], 10);
const nums = lines[1].split(/\s+/).map(Number);

let sum = 0;
for (let i = 0; i < n && i < nums.length; i++) {
  if (nums[i] % 2 === 0) {
    sum += nums[i];
  }
}

console.log(sum);
