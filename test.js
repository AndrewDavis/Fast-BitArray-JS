window.onload = function() {
    window.bitArrayTypeIndex = 0;
    chainBitArrayTypeTests();
};

function chainBitArrayTypeTests() {
    let outputPre = document.body.appendChild(document.createElement('pre'));

    window.bitArrayType = BitArrayTypes[bitArrayTypeIndex];
    outputPre.innerHTML += `Current bit array type: ${bitArrayType.name}\n\n`;

    overallS = performance.now();

    //Create.
    window.bitArray = BitArray.create(1e8, bitArrayType);
    s = performance.now();
    for (let bit = 0; bit < 1e8; ++bit) {
        bitArray.assignBit(bit, (bit % 2) & 1);
    }
    e = performance.now();
    outputPre.innerHTML += `                Assignment of ${bitArray.size} bits took:` +
        `${(e - s).toString().padStart(5)}ms\n`;

    s = performance.now();
    {
        for (let x = 0; x < 1e3; ++x) {
            window.createDelete = BitArray.create(1e6, bitArrayType);
        }
    }
    e = performance.now();
    outputPre.innerHTML += `Creation and deletion of 1000 X 1000000 bits took:` +
        `${(e - s).toString().padStart(5)}ms\n\n`;

    outputPre.innerHTML += `      Size in bits: ${bitArray.size.toString().padStart(9)}`;
    outputPre.innerHTML += `\n  Raw size in bits: ${bitArray.rawBitSize.toString().padStart(9)}`;
    outputPre.innerHTML += `\n Raw size in bytes: ${bitArray.rawByteSize.toString().padStart(9)}`;
    outputPre.innerHTML += `\nRaw size in arrays: ${bitArray.rawArraySize.toString().padStart(9)}\n\n`;

    //Individual tests.
    outputPre.innerHTML += '                          Individual tests:\n';
    let individualBits = 50;
    function printBits(what) {
        //bitArray.toString(20, individualBits)
        outputPre.innerHTML += `${what}: ` + bitArray.toString(0, individualBits) + '\n';
    }
    printBits('           (bit % 2) & 1');
    for (let bit = 0; bit < individualBits; ++bit) {
        bitArray.clearBit(bit);
    }
    printBits('                 cleared');
    for (let bit = 0; bit < individualBits; ++bit) {
        bitArray.assignBit(bit, (bit % 3) & 1);
    }
    printBits('           (bit % 3) & 1');
    for (let bit = 0; bit < individualBits; ++bit) {
        bitArray.toggleBit(bit);
    }
    printBits('                 toggled');
    for (let bit = 0; bit < individualBits; ++bit) {
        bitArray.andBit(bit, 0);
    }
    printBits('            ANDed with 0');
    for (let bit = 0; bit < individualBits; ++bit) {
        bitArray.orBit(bit, (bit % 7) & 1);
    }
    printBits(' ORed with (bit % 7) & 1');
    for (let bit = 0; bit < individualBits; ++bit) {
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
    let aggregateBits = 25;
    window.testBitArray = BitArray.create(aggregateBits, bitArrayType);
    for (let bit = 0; bit < testBitArray.size; ++bit) {
        testBitArray.assignBit(bit, (bit % 5) & 1);
    }
    function printTestBits(printMe, what) {
        //printMe.toDelimitedString(',', 5, 10)
        outputPre.innerHTML += `${what}: ` + printMe.toDelimitedString(',') + '\n';
    }
    printTestBits(testBitArray, 'Original');
    outputPre.innerHTML += '-----------------------------------------------------------\n';
    outputPre.innerHTML += '-----------------------------------------------------------\n';
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
    outputPre.innerHTML += '-----------------------------------------------------------\n';
    window.anded = BitArray.combineAND(testBitArray, otherTestBitArray);
    printTestBits(anded, '   ANDed');
    outputPre.innerHTML += '-----------------------------------------------------------\n';
    window.ored = BitArray.combineOR(testBitArray, otherTestBitArray);
    printTestBits(ored, '    ORed');
    outputPre.innerHTML += '-----------------------------------------------------------\n';
    window.xored = BitArray.combineXOR(testBitArray, otherTestBitArray);
    printTestBits(xored, '   XORed');

    overallE = performance.now();
    outputPre.innerHTML += `\n\nTime it took to do all of the above: ${(overallE - overallS).toString().padStart(5)}ms`;

    outputPre.innerHTML += '\n\n-----------------------------------------------------------\n\n';

    ++bitArrayTypeIndex;
    if (bitArrayTypeIndex < BitArrayTypes.length) {
        //Space each bit array type test out a little bit, to allow the output to flush.
        setTimeout(chainBitArrayTypeTests, 50);
    }
    window.scrollTo(0, document.body.scrollHeight);
}