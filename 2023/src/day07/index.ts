import run from "aocrunner";

type Set = Record<string, number>;
type Hand = {
  cards: string[],
  bid: number;
  score: HandScore;
};
type Hands = Hand[];

type HandScore = {
  type: HandType;
  score: number;
}

enum CardType {
  Joker = 'X',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = 'T',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A'
}

const CardRanks: string[] = [
  CardType.Joker,
  CardType.Two,
  CardType.Three,
  CardType.Four,
  CardType.Five,
  CardType.Six,
  CardType.Seven,
  CardType.Eight,
  CardType.Nine,
  CardType.Ten,
  CardType.Jack,
  CardType.Queen,
  CardType.King,
  CardType.Ace
];

const cardRankSort = (a: string, b: string): number => {
  if (a == b) {
    return 0;
  }
  return CardRanks.indexOf(a) < CardRanks.indexOf(b) ? 1 : -1;
}

enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind
}

const getHandType = (parsedCards: Set): HandType => {
  if (parsedCards[CardType.Joker] == 5) {
    parsedCards[CardType.Ace] = 5;
    delete parsedCards[CardType.Joker];
  }
  if (parsedCards[CardType.Joker]) {
    const keys = Object.keys(parsedCards).filter(c => c != CardType.Joker).sort((a,b) => {
      if (parsedCards[a] == parsedCards[b]) {
        return CardRanks.indexOf(b) - CardRanks.indexOf(a);
      }
      return parsedCards[b] - parsedCards[a]
    });

    const topKey = keys[0];

    parsedCards[topKey] += parsedCards[CardType.Joker];
    delete parsedCards[CardType.Joker];
  }

  const counts = Object.values(parsedCards).sort((a, b) => b - a);
  if (counts[0] == 5) {
    return HandType.FiveOfAKind;
  } else if (counts[0] == 4) {
    return HandType.FourOfAKind;
  } else if (counts[0] == 3) {
    if (counts[1] == 2) {
      return HandType.FullHouse;
    } else {
      return HandType.ThreeOfAKind;
    }
  } else if (counts[0] == 2) {
    if (counts[1] == 2) {
      return HandType.TwoPair;
    } else {
      return HandType.OnePair;
    }
  }

  return HandType.HighCard;
};

const scoreHand = (parsedCards: Set, cards: string[]): HandScore => {
  return {
    type: getHandType(parsedCards),
    score: cards.map((n, i) => CardRanks.indexOf(n) * Math.pow(100, 5-i)).reduce((pv, v) => pv + v, 0) };
}

const parseInput = (rawInput: string): Hands => rawInput
  .split("\n").map(line => {
    const [ cards, bid ] = line.split(" ");

    const cardCounts: Set = cards
      .split("")
      .sort(cardRankSort)
      .reduce((pv: Set, card: string) => {
        if (!pv[card]) {
          pv[card] = 0;
        }

        pv[card] += 1;

        return pv;
      }, {});
    ;

    return {
      cards: cards.split(""),
      bid: parseInt(bid),
      score: scoreHand(cardCounts, cards.split(""))
    };
  })
;

const convertJokers = (input: string): string => {
  return input.replace(/J/g, 'X');
}

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .sort((a, b) => {
      if (a.score.type == b.score.type) {
        if (a.score.score == b.score.score) {
          return 0;
        }

        return a.score.score < b.score.score ? -1 : 1 ;
      }

      return a.score.type < b.score.type ? -1 : 1 ;
    })
    .map((hand, i) => hand.bid * (i + 1))
    .reduce((pv, v) => pv + v, 0)
;

const part2 = (rawInput: string) =>
  parseInput(convertJokers(rawInput))
    .sort((a, b) => {
      if (a.score.type == b.score.type) {
        if (a.score.score == b.score.score) {
          return 0;
        }

        return a.score.score < b.score.score ? -1 : 1 ;
      }

      return a.score.type < b.score.type ? -1 : 1 ;
    })
    .map((hand, i) => hand.bid * (i + 1))
    .reduce((pv, v) => pv + v, 0)
;

run({
  part1: {
    tests: [
    {
      input: `2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41`,
      expected: 6592,
    },
    ],
    solution: part1,
  },
  part2: {
    tests: [
    {
      input: `2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41`,
      expected: 6839,
    },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
