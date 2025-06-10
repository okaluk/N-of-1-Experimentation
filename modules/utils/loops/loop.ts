export  function  iterate_with_counter<T>(array:T[], f:((element:T, counter: number) => void)) {
    let counter = 0;
    for(let e of array) {
        f(e, counter++);
    }
}

export  function  iterate_both<T1, T2>(a1:T1[], a2:T2[], f:(first:T1, second:T2)=>void) {
    if(a1.length>a2.length)
        throw "Cannot loop both: first array has length: " + a1.length + ", but second has length " + a2.length;

    let counter = 0;
    for(let e of a1) {
        f(e, a2[counter++]);
    }
}

export  function  iterate<ElementType>(array:ElementType[]) {
    return new Iterator(array);
}

export class Iterator<T> {
    array: T[];

    constructor(array: T[]) {
        this.array = array;
    }

    do(f: ((element:T) => void)) {
        for(let element of this.array)
            f(element);
    }

    do_with_counter(f: ((element:T, counter:number) => void)) {
        for(let c = 0; c < this.array.length;c++) {
            f(this.array[c], c);
        }
    }

}



export function repeat(n:number, f:((c:number)=>void)) {
    for(let c=0; c < n; c++) {
        f(c);
    }

    // return new Repeat(0)
}

export function repeat_n_times(n:number):Repeat {
    return new Repeat(n);
}

export function repeat_(n:number) {
    return new Repeat(n);
}


export class Repeat {
    counter:number;


    constructor(counter: number) {
        this.counter = counter;
    }

    and_collect(f) {
        let arr = [];
        for(let c = 1; c <= this.counter;c++) {
            arr.push(f(c));
        }
        return arr;
    }

    _times(f) {
        for(let c = 1; c <= this.counter;c++) {
            f();
        }
    }

    times(f) {
        for(let c = 1; c <= this.counter;c++) {
            f(c);
        }
    }

    _do(f) {
        for(let c = 1; c <= this.counter;c++) {
            f(c);
        }

    }


}
