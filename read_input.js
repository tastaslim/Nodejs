import { log } from "console";
import { createInterface } from "readline";
const rl = createInterface(process.stdin, process.stdout);
// const playGame = () => {
//   const randomNumber = parseInt(Math.random() * 10);
//   rl.question("Please guess the number b/w 1-10: ", (guess) => {
//     if (guess > randomNumber) {
//       log("TOO HIGH");
//     } else if (guess < randomNumber) {
//       log("TOO LOW");
//     } else {
//       log("Winner");
//     }
//     rl.close();
//   });
// };

// playGame();

const game = (tries, randomNumber, guess) => {
  if (tries < 3) {
    if (guess > randomNumber) {
      log("TOO HIGH");
    } else if (guess < randomNumber) {
      log("TOO LOW");
    } else {
      log("WINNER");
      process.exit();
    }
  } else {
    log("LOSER");
    process.exit();
  }
};

/*
To read inputs multiple time and invoke event each time user press keyboard
*/
rl.setPrompt("Please guess the number b/w 1-10:");
rl.prompt();
let tries = 0;
rl.on("line", (answer) => {
  tries++;
  const randomNumber = parseInt(Math.random() * 10);
  game(tries, randomNumber, answer);
  rl.prompt();
});
