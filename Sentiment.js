// var Sentiment = require('sentiment');
// var sentiment = new Sentiment();
// var result = sentiment.analyze('This is greate product.', {language: 'en'});
// console.dir(result); // Score: -2, Comparative: -0.666

// // const analyse = require('simple-sentiment-lib');

// // const exampleData =
// //   'Because i communicates with each employee clearly and actively. And also manage team and client. And also control my emotions and behavior while high-conflict situations because i think situations are temporary but our behavior with surrounding people is set our impression at them mind.';

// // var result = analyse(exampleData);

// // // console.dir(result);

var compendium = require('compendium-js');

// // console.log(
// //   JSON.stringify(
// //     compendium.analyse(
// //       'Because i communicates with each employee clearly and actively. And also manage team and client. And also control my emotions and behavior while high-conflict situations because i think situations are temporary but our behavior with surrounding people is set our impression at them mind.',
// //     ),
// //   ),
// // );

// const tf = require('@tensorflow/tfjs-node');

// const toxicity = require('@tensorflow-models/toxicity');

// async function analyzeSentiment(text) {
//   const model = await toxicity.load();

//   const predictions = await model.classify(text);

//   const sentimentPrediction = predictions.find(p => p.label === 'toxicity');

//   const confidence = sentimentPrediction.results[0].match;

//   if (confidence > 0.5) {
//     console.log('Sentiment: Negative');
//   } else {
//     console.log('Sentiment: Positive');
//   }

//   console.log('Confidence:', confidence, JSON.stringify(sentimentPrediction));
// }

// const textToAnalyze = `Team morale seems low at the moment, and I've noticed you don't seem engaged in your work. This is impacting other team members. Please try to participate more and show some enthusiasm.`;

// analyzeSentiment(textToAnalyze);

const findSentiment = review => {
  const spellCorrector = new SpellCorrector();
  spellCorrector.loadDictionary();

  const lexedReview = aposToLexForm(review);
  const casedReview = lexedReview.toLowerCase();
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

  const {WordTokenizer} = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  tokenizedReview.forEach((word, index) => {
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
    // console.log(res, score);

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
  // console.log(confidenceScore);

  const analysis = analyzer.getSentiment(filteredReview);
  // if (temp.length + temp2.length + temp3.length === 0) {
  //   confidenceScore = 0;
  // } else {
  //   if (analysis > 0) {
  //     if (temp.length) {
  //       confidenceScore =
  //         temp.length / (temp.length + temp2.length + temp3.length);
  //     } else {
  //       confidenceScore = 0;
  //     }
  //   } else if (analysis < 0) {
  //     if (temp2.length) {
  //       confidenceScore =
  //         temp2.length / (temp.length + temp2.length + temp3.length);
  //     } else {
  //       confidenceScore = 0;
  //     }
  //   } else {
  //     if (temp3.length) {
  //       confidenceScore =
  //         temp3.length / (temp.length + temp2.length + temp3.length);
  //     } else {
  //       confidenceScore = 0;
  //     }
  //   }
  // }

  console.log({
    // overallScore: analysis,
    // positiveTokens: temp,
    // negativeTokens: temp2,
    // neutralTokens: temp3,
    confidenceScore: `${Number(confidenceScore * 100).toFixed(2)}%`,
  });

  return analysis > 0 ? 'positive' : analysis === 0 ? 'neutral' : 'negative';
};
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const aposToLexForm = require('apos-to-lex-form');
const SW = require('stopword');

const fs = require('fs');
const csvParser = require('csv-parser');

const result = [];
let TP = 0;
let TN = 0;
let FP = 0;
let FN = 0;

fs.createReadStream('./train.csv')
  .pipe(csvParser())
  .on('data', data => {
    // console.log(result.length);
    if (result.length < 50) {
      result.push({text: data.text, sentiment: data.sentiment});
    }
  })
  .on('end', () => {
    result.forEach(({text, sentiment}, index) => {
      let res = findSentiment(text);
      // console.log('Predicted', res, 'Actual', sentiment, index);
      // let res = compendium.analyse(text.replaceAll('.', ' '));
      // res = res[0].profile.label;
      // res = res[0] ? res[0]['profile']['label'] : 'neutral';

      // if (res === 'positive' && sentiment === 'positive') {
      //   TP = TP + 1;
      // } else if (res === 'negative' && sentiment === 'negative') {
      //   TN = TN + 1;
      // } else if (res === 'positive' && sentiment === 'negative') {
      //   FP = FP + 1;
      // } else if (res === 'negative' && sentiment === 'positive') {
      //   FN = FN + 1;
      // }
    });
    // console.log(TN, 'TN');
    // console.log(TP, 'TP');
    // console.log(FP, 'FP');
    // console.log(FN, 'FN');
    // console.log('accuracy', (TP + TN) / (TP + TN + FP + FN));
    // console.log(result);
  });

// let review =
//   "Team morale seems low at the moment, and I've noticed you don't seem engaged in your work. This is impacting other team members. Please try to participate more and show some enthusiasm.";

// console.log({
//   overallScore: analysis,
//   positiveTokens: temp,
//   negativeTokens: temp2,
//   neutralTokens: temp3,
//   confidenceScore: confidenceScore,
// });
