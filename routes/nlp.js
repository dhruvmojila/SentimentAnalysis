const express = require('express');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const aposToLexForm = require('apos-to-lex-form');
const SW = require('stopword');

const router = express.Router();

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

let sentimentResult = {};

const data = {
  error_status: false,
  code: 'E360_MS_OK_200',
  message: 'The request was fullfiled successfully.',
  data: {
    COMMUNICATION_SKILLS: {
      LEAD: 'Tut',
      MANAGER: 'CTN',
      PEER: 'Communication Comm Comst',
      SELF: 'Hhddhwna',
    },
    INTERPERSONAL_SKILLS: {
      LEAD: 'For',
      MANAGER: 'Next',
      PEER: 'Iny3 Inrer Hauah',
      SELF: 'Interpersonal skills',
    },
    LEADERSHIP_SKILLS: {
      LEAD: 'Ch',
      MANAGER: 'Hubby',
      PEER: 'Ferish Leadership Lead',
      SELF: 'Leaderahip',
    },
    ORGANIZATION_SKILLS: {
      LEAD: 'Bb',
      MANAGER: 'Hey',
      PEER: 'Organisation  Orga Yseh',
      SELF: 'Organisation ',
    },
    TEAM_SKILLS: {
      LEAD: 'Must',
      PEER: 'Trams Nsjs',
      SELF: 'Teamsss',
    },
  },
};

const findSentiment = review => {
  const lexedReview = aposToLexForm(review);
  const casedReview = lexedReview.toLowerCase();
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

  const {WordTokenizer} = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
  const realWords = [];

  tokenizedReview.forEach((word, index) => {
    let obj = {
      raw: word,
      corrected: spellCorrector.correct(word),
    };
    realWords.push(obj);
    tokenizedReview[index] = spellCorrector.correct(word);
  });
  const filteredReview = SW.removeStopwords(tokenizedReview);

  const {SentimentAnalyzer, PorterStemmer} = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  let temp = [];
  let temp2 = [];
  let temp3 = [];
  let sum = 0;

  filteredReview.map(res => {
    let score = analyzer.getSentiment([res]);

    sum = sum + score;
    if (score > 0) {
      temp.push({
        word: res,
        score: score,
      });
    } else if (score < 0) {
      temp2.push({
        word: res,
        score: score,
      });
    } else {
      temp3.push({
        word: res,
        score: score,
      });
    }
  });

  let confidenceScore;

  const analysis = analyzer.getSentiment(filteredReview);

  if (temp.length + temp2.length + temp3.length === 0) {
    confidenceScore = 0;
  } else {
    if (analysis > 0) {
      if (temp.length) {
        confidenceScore =
          temp.length / (temp.length + temp2.length + temp3.length);
      } else {
        confidenceScore = 0;
      }
    } else if (analysis < 0) {
      if (temp2.length) {
        confidenceScore =
          temp2.length / (temp.length + temp2.length + temp3.length);
      } else {
        confidenceScore = 0;
      }
    } else {
      if (temp3.length) {
        confidenceScore =
          temp3.length / (temp.length + temp2.length + temp3.length);
      } else {
        confidenceScore = 0;
      }
    }
  }
  return {
    overallScore: analysis ? analysis : 0,
    positiveTokens: temp,
    negativeTokens: temp2,
    neutralTokens: temp3,
    confidenceScore: `${Number(confidenceScore * 100).toFixed(2)}%`,
    realWords: realWords,
  };
};

Object.keys(data.data).map(category => {
  Object.keys(data.data[category]).map(revieww => {
    // console.log(data.data[category][revieww]);
    sentimentResult = {
      ...sentimentResult,
      [category]: {
        ...sentimentResult[category],
        [revieww]: {
          ...findSentiment(data.data[category][revieww]),
          review: data.data[category][revieww],
        },
      },
    };
  });
});

console.log(JSON.stringify(sentimentResult));

// router.post('/s-analyzer', function (req, res, next) {
//   const {review} = req.body;
//   const lexedReview = aposToLexForm(review);
//   const casedReview = lexedReview.toLowerCase();
//   const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

//   const {WordTokenizer} = natural;
//   const tokenizer = new WordTokenizer();
//   const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
//   const realWords = [];

//   tokenizedReview.forEach((word, index) => {
//     let obj = {
//       raw: word,
//       corrected: spellCorrector.correct(word),
//     };
//     realWords.push(obj);
//     tokenizedReview[index] = spellCorrector.correct(word);
//   });
//   const filteredReview = SW.removeStopwords(tokenizedReview);

//   const {SentimentAnalyzer, PorterStemmer} = natural;
//   const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
//   let temp = [];
//   let temp2 = [];
//   let temp3 = [];
//   let sum = 0;

//   filteredReview.map(res => {
//     let score = analyzer.getSentiment([res]);
//     console.log(res, score);
//     sum = sum + score;
//     if (score > 0) {
//       temp.push({
//         word: res,
//         score: score,
//       });
//     } else if (score < 0) {
//       temp2.push({
//         word: res,
//         score: score,
//       });
//     } else {
//       temp3.push({
//         word: res,
//         score: score,
//       });
//     }
//   });

//   let confidenceScore;

//   const analysis = analyzer.getSentiment(filteredReview);

//   if (temp.length + temp2.length + temp3.length === 0) {
//     confidenceScore = 0;
//   } else {
//     if (analysis > 0) {
//       if (temp.length) {
//         confidenceScore =
//           temp.length / (temp.length + temp2.length + temp3.length);
//       } else {
//         confidenceScore = 0;
//       }
//     } else if (analysis < 0) {
//       if (temp2.length) {
//         confidenceScore =
//           temp2.length / (temp.length + temp2.length + temp3.length);
//       } else {
//         confidenceScore = 0;
//       }
//     } else {
//       if (temp3.length) {
//         confidenceScore =
//           temp3.length / (temp.length + temp2.length + temp3.length);
//       } else {
//         confidenceScore = 0;
//       }
//     }
//   }

//   res.status(200).json({
//     overallScore: analysis,
//     positiveTokens: temp,
//     negativeTokens: temp2,
//     neutralTokens: temp3,
//     confidenceScore: `${Number(confidenceScore * 100).toFixed(2)}%`,
//     realWords: realWords,
//   });
// });
// module.exports = router;
