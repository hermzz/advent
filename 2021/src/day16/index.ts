import run from "aocrunner";

type LiteralPacket = {
  version: number,
  type: number,
  payload: number
}

type OperatorPacket = {
  version: number,
  type: number,
  packets: Packet[]
}

type Packet = LiteralPacket | OperatorPacket;

const parseInput = (rawInput: string): Packet[] => parsePackets(rawInput.split("").map(n=>(parseInt(n, 16) >> 0).toString(2).padStart(4, '0')).join("").split(""));

const toNumber = (input: string[]): number =>
  parseInt(input.join(""),2);
               
const parsePackets = (input: string[], packetLimit: number = Infinity): Packet[] => {
  const packets: Packet[] = [];
  while (packets.length < packetLimit && input.length > 6) {
    const version = toNumber(input.splice(0 ,3));
    const type = toNumber(input.splice(0 ,3));

    // literal
    if (type == 4) {
      let agg: string[] = []
      let done = false;
      while (!done) {
        const extract = input.splice(0, 5);
        agg = agg.concat(extract.slice(1));

        if (extract[0] == '0') {
          const payload = parseInt(agg.join(""), 2);
          packets.push({version, type, payload});
          done = true;
        }
      }
    } else {
      const typeLength = input.splice(0, 1).pop();
      if (typeLength == '0') {
        const subpacketLength = toNumber(input.splice(0, 15));
        packets.push({version, type, packets: parsePackets(input.splice(0, subpacketLength))});
      } else if (typeLength == '1') {
        const packetNumber = toNumber(input.splice(0, 11));
        packets.push({version, type, packets: parsePackets(input, packetNumber)});
      }
    }
  }

  return packets;
};

const versionSum = (packets: Packet[]): number =>
  packets.reduce((pv, packet) => pv + packet.version + ('packets' in packet ? versionSum(packet.packets) : 0), 0);

const extractLiteral = (packet: LiteralPacket): number =>
  packet.payload;

const doCalculation = (packet: OperatorPacket): number => {
  switch (packet.type) {
    case 0:
      return packet.packets.reduce((pv, p) => pv + calculate(p), 0);
    case 1:
      return packet.packets.reduce((pv, p) => pv * calculate(p), 1);
    case 2:
      return Math.min(...packet.packets.map(p => calculate(p)));
    case 3:
      return Math.max(...packet.packets.map(p => calculate(p)));
    case 5:
      return calculate(packet.packets[0]) > calculate(packet.packets[1]) ? 1: 0;
    case 6:
      return calculate(packet.packets[0]) < calculate(packet.packets[1]) ? 1: 0;
    case 7:
      return calculate(packet.packets[0]) === calculate(packet.packets[1]) ? 1: 0;
  }

  throw Error(`Not implemented type ${packet.type}`);
}

const calculate = (packet: Packet): number => {
  if (packet.type == 4) {
    return extractLiteral(packet as LiteralPacket);
  }

  return doCalculation(packet as OperatorPacket);
}

const part1 = (rawInput: string) => versionSum(parseInput(rawInput));

const part2 = (rawInput: string) => {
  const packets = parseInput(rawInput);

  if (packets.length > 1) {
    throw Error(`Too many initial packets`);
  }

  return calculate(packets.shift()!);
};

run({
  part1: {
    tests: [
      { input: `D2FE28`, expected: 6 },
      { input: `8A004A801A8002F478`, expected: 16 },
      { input: `620080001611562C8802118E34`, expected: 12 },
      { input: `C0015000016115A2E0802F182340`, expected: 23 },
      { input: `A0016C880162017C3686B18A3D4780`, expected: 31 },
      { input: `f800bc4fddc27bb0688f`, expected: 7 }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `C200B40A82`, expected: 3 },
      { input: `04005AC33890`, expected: 54 },
      { input: `880086C3E88112`, expected: 7 },
      { input: `CE00C43D881120`, expected: 9 },
      { input: `D8005AC2A8F0`, expected: 1 },
      { input: `F600BC2D8F`, expected: 0 },
      { input: `9C005AC2F8F0`, expected: 0 },
      { input: `9C0141080250320F1802104A08`, expected: 1 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});