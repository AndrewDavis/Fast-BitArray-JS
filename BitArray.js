'use strict';

//Code published to: https://github.com/AndrewDavis/Fast-BitArray-JS

class BitArray {
    constructor(uints) {
        this.uints = uints;
    }

    static create(bitSize = 0) {
        return new BitArray(new Uint32Array(~~(bitSize / 32)));
    }

    clone() {
        return new BitArray(this.uints.slice(0, Math.ceil(this.size / 32)));
    }

    resizeClone(newBitSize) {
        if (newBitSize <= this.size) {
            return new BitArray(this.uints.slice(0, Math.ceil(newBitSize / 32)));
        } else {
            let cloned = new BitArray(new Uint32Array(~~(newBitSize / 32)));
            cloned.uints.set(this.uints);
            return cloned;
        }
    }

    static combineAND(me, withMe) {
        let size = Math.min(me.size, withMe.size);
        let combined = BitArray.create(size);
        for (let bit = 0; bit < size; ++bit) {
            combined.assignBit(bit, me.getBit(bit) & withMe.getBit(bit));
        }
        return combined;
    }

    static combineOR(me, withMe) {
        let size = Math.min(me.size, withMe.size);
        let combined = BitArray.create(size);
        for (let bit = 0; bit < size; ++bit) {
            combined.assignBit(bit, me.getBit(bit) | withMe.getBit(bit));
        }
        return combined;
    }

    static combineXOR(me, withMe) {
        let size = Math.min(me.size, withMe.size);
        let combined = BitArray.create(size);
        for (let bit = 0; bit < size; ++bit) {
            combined.assignBit(bit, me.getBit(bit) ^ withMe.getBit(bit));
        }
        return combined;
    }

    getBit(bit) {
        return (this.uints[~~(bit / 32)] & (1 << (bit % 32))) != 0 ? 1 : 0;
    }

    setBit(bit) {
        this.uints[~~(bit / 32)] |= (1 << (bit % 32));
    }

    clearBit(bit) {
        this.uints[~~(bit / 32)] &= ~(1 << (bit % 32));
    }

    assignBit(bit, value) {
        if (value) {
            this.uints[~~(bit / 32)] |= (1 << (bit % 32));
        } else {
            this.uints[~~(bit / 32)] &= ~(1 << (bit % 32));
        }
    }

    toggleBit(bit) {
        this.uints[~~(bit / 32)] ^= (1 << (bit % 32));
    }

    andBit(bit, value) {
        this.uints[~~(bit / 32)] &= (value << (bit % 32));
    }

    orBit(bit, value) {
        this.uints[~~(bit / 32)] |= (value << (bit % 32));
    }

    xorBit(bit, value) {
        this.uints[~~(bit / 32)] ^= (value << (bit % 32));
    }

    toggleAllBits() {
        let size = this.size;
        for (let bit = 0; bit < size; ++bit) {
            this.toggleBit(bit);
        }
    }

    get size() {
        return this.uints.length * 32;
    }

    get byteSize() {
        return this.uints.length * 4;
    }

    get uintSize() {
        return this.uints.length;
    }

    //Warning: You may want to Math.ceil() the returned value!
    static bitsToBytes(bits) {
        return bits / 8;
    }

    //Warning: You may want to Math.ceil() the returned value!
    static bitsToUints(bits) {
        return bits / 32;
    }
}

module.exports = BitArray;