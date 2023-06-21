let old = 2;

function random() {
    const val = Math.floor(Math.random() * 3) + 1;
    if (val != old) {
        old = val
        return val
    }
    else return random();
};

console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());
console.log(random());