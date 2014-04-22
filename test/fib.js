var Fib = function(n) {
    if (n <= 1)
        return n;
    return Fib(n-1) + Fib(n-2);
}

console.log(Fib(40));
