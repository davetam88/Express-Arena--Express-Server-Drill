const express = require('express');
const morgan = require('morgan');

const app = express();
// use dev format
app.use(morgan('dev'));

// responds with some text to GET request to the root URL (/).
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// PATH, HANDLER
app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
})

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
  res.send(`We don't serve that here.Never call again!`);
});

// ehco send back what the get request, show request properties.
app.get('/echo', (req, res) => {
  const responseText = `Here are some 1 details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
  `;
  res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

// greetoing with check..query.. param..error.. check..
// handle query String get request
app.get('/greetings', (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  // if (!name)
  {
    //3. name was not provided
    return res.status(400).send('Please provide a name');
  }

  if (!race)
  {
    //3. race was not provided
    return res.status(400).send('Please provide a race');
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response 
  res.send(greeting);
});

// quiz # 1  sum 2 numbers
app.get('/sum', (req, res) => {
  //1. get values from the request
  const num1 = req.query.num1;
  const num2 = req.query.num2;
  //2. validate the values
  if (!num1 || !num2)
  {
    return res.status(400).send('Please provide 2 nubmers');
  }
  const total = parseInt(num1, 10) + parseInt(num2, 10);
  const result = `the sum of ${num1} and ${num2} is ${total}`;
  res.send(result);
});

// Drill 2
app.get('/cipher', (req, res) => {
  const { text, shift } = req.query;

  // validation: both values are required, shift must be a number
  if (!text)
  {
    return res
      .status(400)
      .send('text is required');
  }

  if (!shift)
  {
    return res
      .status(400)
      .send('shift is required');
  }

  const numShift = parseFloat(shift);

  // nan(Not - A - Number
  if (Number.isNaN(numShift))
  {
    return res
      .status(400)
      .send('shift must be a number');
  }
  const base = 'A'.charCodeAt(0);

  const cipher = text
    .toUpperCase()
    .split('') // create an array of characters
    .map(char => { // map each original char to a converted char
      const code = char.charCodeAt(0); //get the char code of cur char

      // if it is not one of the 26 letters ignore it
      if (code < base || code > (base + 26))
      {
        return char;
      }

      // otherwise convert it
      // get the distance from A
      let diff = code - base;
      diff = diff + numShift;

      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26;

      // convert back to a character
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join(''); // construct a String from the array

  // Return the response
  res
    .status(200)
    .send(cipher);
});

// Drill 3
app.get('/lotto', (req, res) => {
  const { arr } = req.query;
  if (arr.length !== 6)
  {
    return res
      .status(400)
      .send('6 nubmers are required');
  }

  let matchCnt = 0;
  const compare = arr.map((numx, idx) => {

    let randomNum = Math.floor(Math.random() * 20) + 1;
    let curnum = arr[idx];
    if (curnum === randomNum)
    {
      matchCnt++;
    }
  })


  let msg = "";
  if (matchCnt < 3)
  {
    msg = "Sorry, you lose";
  } else if (matchCnt === 4)
  {
    msg = "Congratulations, you win a free ticket";
  } else if (matchCnt === 5)
    msg = "Congratulations! You win $100!";
  else
  {
    msg = "Wow! Unbelievable! You could have won the mega millions!";
  }

  res
    .status(200).send(msg);
});

// Drill 3 
app.get('/lotto1', (req, res) => {
  const { numbers } = req.query;
  // const { arr } = req.query;



  // validation: 
  // 1. the numbers array must exist
  // 2. must be an array
  // 3. must be 6 numbers
  // 4. numbers must be between 1 and 20

  if (!numbers)
  {
    return res
      .status(400)
      .send("numbers is required");
  }

  if (!Array.isArray(numbers))
  {
    return res
      .status(400)
      .send("numbers must be an array");
  }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  // nubmer has to be 6 
  if (guesses.length != 6)
  {
    return res
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }

  // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

  const winningNumbers = [];
  for (let i = 0; i < 6; i++)
  {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  switch (diff.length)
  {
    case 0:
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1:
      responseText = 'Congratulations! You win $100!';
      break;
    case 2:
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';
  }


  // uncomment below to see how the results ran

  res.json({
    guesses,
    winningNumbers,
    diff,
    responseText
  });

  // res.send(responseText);
});

app.listen(8000, () => {
  console.log(`App listening on http://localhost:8000/ !`);
});


