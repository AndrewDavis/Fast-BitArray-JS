window.onload = function() {
    window.outputPre = document.getElementById('outputPre');

    overallS = performance.now();

    //Create.
    window.bitArray = BitArray.create(1e8);
    s = performance.now();
    for (let bit = 0; bit < 1e8; ++bit) {
        bitArray.assignBit(bit, (bit % 2) & 1);
    }
    e = performance.now();
    outputPre.innerHTML += `                     Assignment of ${bitArray.size} bits took: ${e - s}ms\n`;

    s = performance.now();
    {
        for (let x = 0; x < 1e6; ++x) {
            window.createDelete = new BitArray(1e8);
        }
    }
    e = performance.now();
    outputPre.innerHTML += `Creation and deletion of 1000000 X ${bitArray.size} bits took: ${e - s}ms\n\n`;

    outputPre.innerHTML += ` Size in bits: ${bitArray.size}`;
    outputPre.innerHTML += `\nSize in bytes:  ${bitArray.byteSize}`;
    outputPre.innerHTML += `\nSize in uints:   ${bitArray.uintSize}\n\n`;

    //Individual tests.
    outputPre.innerHTML += '                          Individual tests:\n';
    function printBits(what) {
        let str = '';
        for (let bit = 0; bit < 50; ++bit) {
            str += bitArray.getBit(bit);
        }
        outputPre.innerHTML += `${what}: ${str}\n`;
    }
    printBits('           (bit % 2) & 1');
    for (let bit = 0; bit < 50; ++bit) {
        bitArray.clearBit(bit);
    }
    printBits('                 cleared');
    for (let bit = 0; bit < 50; ++bit) {
        bitArray.assignBit(bit, (bit % 3) & 1);
    }
    printBits('           (bit % 3) & 1');
    for (let bit = 0; bit < 50; ++bit) {
        bitArray.toggleBit(bit);
    }
    printBits('                 toggled');
    for (let bit = 0; bit < 50; ++bit) {
        bitArray.andBit(bit, 0);
    }
    printBits('            ANDed with 0');
    for (let bit = 0; bit < 50; ++bit) {
        bitArray.orBit(bit, (bit % 7) & 1);
    }
    printBits(' ORed with (bit % 7) & 1');
    for (let bit = 0; bit < 50; ++bit) {
        bitArray.xorBit(bit, (bit % 2) & 1);
    }
    printBits('XORed with (bit % 2) & 1');

    //Resize tests.
    outputPre.innerHTML += `\nResize smaller then larger test (should see 0101): `;
    //Smaller. (Testing to make sure it's using ceiling division.)
    bitArray.clearBit(1e7 - 2);
    window.smallerBitArray = bitArray.resizeClone(1e7 - 1);
    outputPre.innerHTML += smallerBitArray.getBit(1e7 - 2);
    smallerBitArray.setBit(1e7 - 2);
    outputPre.innerHTML += smallerBitArray.getBit(1e7 - 2);
    //Larger.
    window.largerBitArray = bitArray.resizeClone(1e9);
    outputPre.innerHTML += largerBitArray.getBit(1e9 - 1);
    largerBitArray.setBit(1e9 - 1);
    outputPre.innerHTML += largerBitArray.getBit(1e9 - 1);

    //Aggregate tests.
    outputPre.innerHTML += '\n\n          Aggregate tests:\n';
    window.testBitArray = BitArray.create(50);
    for (let bit = 0; bit < testBitArray.size; ++bit) {
        testBitArray.assignBit(bit, (bit % 5) & 1);
    }
    function printTestBits(printMe, what) {
        let str = '';
        for (let bit = 0; bit < printMe.size; ++bit) {
            str += printMe.getBit(bit);
        }
        outputPre.innerHTML += `${what}: ${str}\n`;
    }
    printTestBits(testBitArray, 'Original');
    outputPre.innerHTML += '------------------------------------------\n';
    outputPre.innerHTML += '------------------------------------------\n';
    window.otherTestBitArray = testBitArray.clone();
    testBitArray.toggleAllBits();
    printTestBits(testBitArray, ' Toggled');
    for (let bit = 0; bit < otherTestBitArray.size; bit += 3) {
        otherTestBitArray.setBit(bit);
    }
    for (let bit = 0; bit < otherTestBitArray.size; bit += 4) {
        otherTestBitArray.clearBit(bit);
    }
    printTestBits(otherTestBitArray, '   Other');
    outputPre.innerHTML += '------------------------------------------\n';
    window.anded = BitArray.combineAND(testBitArray, otherTestBitArray);
    printTestBits(anded, '   ANDed');
    outputPre.innerHTML += '------------------------------------------\n';
    window.ored = BitArray.combineOR(testBitArray, otherTestBitArray);
    printTestBits(ored, '    ORed');
    outputPre.innerHTML += '------------------------------------------\n';
    window.xored = BitArray.combineXOR(testBitArray, otherTestBitArray);
    printTestBits(xored, '   XORed');

    overallE = performance.now();
    outputPre.innerHTML += `\n\nTime it took to do ALL of the above: ${overallE - overallS}ms`;
};