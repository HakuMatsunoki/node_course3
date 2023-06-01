// console.log(__dirname);
// console.log(__filename);

// process.env.NODE_ENV = 'development'
// console.log(process.env);
// console.log(process.cwd());
// console.log(process.argv);

// process.exit();
// console.log(global);

// setTimeout(() => {
//   console.log('||=============>>>>>>>>>>>');
//   console.log(123123);
//   console.log('<<<<<<<<<<<=============||');
// }, 3000)

const readline = require('readline');
const fs = require('fs').promises;
const { program } = require('commander');
require('colors');

// HELPERS AND UTILS
// create readline instance and config it to interact with user via command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// readline usage example
// rl.on('line', (txt) => {
//   console.log('||=============>>>>>>>>>>>');
//   console.log(txt.bgRed);
//   console.log('<<<<<<<<<<<=============||');

//   process.exit();
// });

// Commander configs
program.option('-l, --log <type>', 'file for saving results', 'game_results.txt');

// Use command line arguments
program.parse(process.argv);

// path to the log file
const logFile = program.opts().log;

/**
 * Simple input data validator.
 * @param {number} val - value to validate
 * @returns {boolean}
 */
const isValid = (val) => {
  if (!Number.isNaN(val) && val > 0 && val <= 10) return true;

  if (Number.isNaN(val)) console.log('Please, enter a number!!'.red);
  if (val < 1 || val > 10) console.log('Number should be between 1 and 10'.red);

  return false;
};

/**
 * Log game results to the text file.
 * @param {string} msg - message to log
 * @returns {Promise<void>} - it means return promise with no data
 */
const logger = async (msg) => {
  try {
    await fs.appendFile(logFile, `${msg}\n`);

    console.log(`Successfully saved game results to the file ${logFile}`.yellow);
  } catch (err) {
    console.log(`Something went very wrong.. ${err.message}`);
  }
};

// GAME LOGIC
/** Counter of user attempts */
let counter = 0;

// Gussed number random number 1 - 10
const mind = Math.ceil(Math.random() * 10); // 1.1 => 2 1.9 => 2

/**
 * Main game process
 */
const game = () => {
  // ask the question
  rl.question('Please, enter any whole number between 1 and 10!\n'.green, (val) => {
    // convert type from string to number
    // const number = Number(val);
    const number = +val; // +'5' => 5 +'dsfds' => NaN

    // validate input value
    if (!isValid(number)) return game();

    // counter = counter + 1;
    // counter += 1;
    // ++counter;
    counter++;

    // if number is not right
    if (number !== mind) {
      console.log('Oh no!! Try again!'.red);

      return game();
    }

    console.log(`Congratulations!!! You have guessed the number in ${counter} step(s) =^^=`.magenta);

    logger(`${new Date().toLocaleString('uk-UK')}: Congrats!! You guessed the number in ${counter} step(s) =^^=`);

    rl.close();
  });
};

game();
