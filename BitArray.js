'use strict';

//Code published to: https://github.com/AndrewDavis/Fast-BitArray-JS

window.ByteBitSize = 8;

//Note: No 64-bit options allowed, because JS can't handle bit operations > 32 bits!
//Note: Array and Float32Array were both removed, because they function differently than Ints and Uints.
window.BitArrayTypes = [
    //8.
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,

    //16.
    Int16Array,
    Uint16Array,

    //32.
    Int32Array,
    Uint32Array
];
//Overall fastest; only slower than the others for creation of very large numbers of bits.
window.DefaultBitArrayType = Int8Array;

class BitArray {
    //Use BitArray.create() for regular usage.
    constructor(bitSize, array, arrayType) {
        this.size = bitSize;
        this.array = array;
        //It is assumed that what is provided is correct; otherwise, problems will arise when cloning or resizing.
        this.arrayType = arrayType;

        //Varies depending on which array type is utilized.
        this.arrayByteSize = this.array.BYTES_PER_ELEMENT;
        this.arrayBitSize = this.arrayByteSize * ByteBitSize;
    }

    //See BitArrayTypes for arrayType options.
    static create(bitSize = 0, arrayType = DefaultBitArrayType) {
        return new BitArray(bitSize, new arrayType(Math.ceil(bitSize / (arrayType.BYTES_PER_ELEMENT * ByteBitSize))),
            arrayType);
    }

    clone() {
        return new BitArray(this.size, this.array.slice(0, Math.ceil(this.size / this.arrayBitSize)), this.arrayType);
    }

    resizeClone(newBitSize) {
        if (newBitSize <= this.size) {
            return new BitArray(newBitSize, this.array.slice(0, Math.ceil(newBitSize / this.arrayBitSize)),
                this.arrayType);
        } else {
            let cloned = new BitArray(newBitSize, new this.arrayType(Math.ceil(newBitSize / this.arrayBitSize)),
                this.arrayType);
            cloned.array.set(this.array);
            return cloned;
        }
    }

    //Assumes the same underlying array type.
    static combineAND(me, withMe) {
        let size = Math.min(me.size, withMe.size);
        let combined = BitArray.create(size, me.arrayType);
        for (let bit = 0; bit < size; ++bit) {
            combined.assignBit(bit, me.getBit(bit) & withMe.getBit(bit));
        }
        return combined;
    }

    //Assumes the same underlying array type.
    static combineOR(me, withMe) {
        let size = Math.min(me.size, withMe.size);
        let combined = BitArray.create(size, me.arrayType);
        for (let bit = 0; bit < size; ++bit) {
            combined.assignBit(bit, me.getBit(bit) | withMe.getBit(bit));
        }
        return combined;
    }

    //Assumes the same underlying array type.
    static combineXOR(me, withMe) {
        let size = Math.min(me.size, withMe.size);
        let combined = BitArray.create(size, me.arrayType);
        for (let bit = 0; bit < size; ++bit) {
            combined.assignBit(bit, me.getBit(bit) ^ withMe.getBit(bit));
        }
        return combined;
    }

    getBit(bit) {
        return (this.array[~~(bit / this.arrayBitSize)] & (1 << (bit % this.arrayBitSize))) != 0 ? 1 : 0;
    }

    setBit(bit) {
        this.array[~~(bit / this.arrayBitSize)] |= (1 << (bit % this.arrayBitSize));
    }

    clearBit(bit) {
        this.array[~~(bit / this.arrayBitSize)] &= ~(1 << (bit % this.arrayBitSize));
    }

    assignBit(bit, value) {
        if (value) {
            this.array[~~(bit / this.arrayBitSize)] |= (1 << (bit % this.arrayBitSize));
        } else {
            this.array[~~(bit / this.arrayBitSize)] &= ~(1 << (bit % this.arrayBitSize));
        }
    }

    toggleBit(bit) {
        this.array[~~(bit / this.arrayBitSize)] ^= (1 << (bit % this.arrayBitSize));
    }

    andBit(bit, value) {
        this.array[~~(bit / this.arrayBitSize)] &= (value << (bit % this.arrayBitSize));
    }

    orBit(bit, value) {
        this.array[~~(bit / this.arrayBitSize)] |= (value << (bit % this.arrayBitSize));
    }

    xorBit(bit, value) {
        this.array[~~(bit / this.arrayBitSize)] ^= (value << (bit % this.arrayBitSize));
    }

    toggleAllBits() {
        for (let bit = 0; bit < this.size; ++bit) {
            this.toggleBit(bit);
        }
    }

    get rawBitSize() {
        return this.array.length * this.arrayBitSize;
    }

    get rawByteSize() {
        return this.array.length * this.arrayByteSize;
    }

    get rawArraySize() {
        return this.array.length;
    }

    toString(startAt = 0, upTo = this.size) {
        let str = '';
        for (let bit = startAt; bit < upTo; ++bit) {
            str += (this.array[~~(bit / this.arrayBitSize)] & (1 << (bit % this.arrayBitSize))) != 0 ? '1' : '0';
        }
        return str;
    }

    toDelimitedString(delimiter, startAt = 0, upTo = this.size) {
        let str = (this.array[~~(startAt / this.arrayBitSize)] & (1 << (startAt % this.arrayBitSize))) != 0 ? '1' : '0';
        for (let bit = startAt + 1; bit < upTo; ++bit) {
            str += delimiter +
                ((this.array[~~(bit / this.arrayBitSize)] & (1 << (bit % this.arrayBitSize))) != 0 ? '1' : '0');
        }
        return str;
    }
}

module.exports = BitArray;