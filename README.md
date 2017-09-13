# Table of content
  - [Problem Statement](#problem-statement)
  - [Project Setup](#project-setup)
  - [Judging Criteria](#judging-criteria)
  - [Solution](#solution)
  - [FAQ](#faq)

# Problem Statement
We have a website called **string-factory.com**. The website has a page that looks like this —

<img src='https://raw.githubusercontent.com/dream11/crawler/master/public/string-factory.png' height="300">

A typical page contains two types of content —
1. Links to other similar pages, it is marked with `red` colored anchor tags.
2. A set of strings in `white`.

**Our goal is to find the lexicographically smallest string on the website.**

To achieve this we should first implement a **crawler** inside `crawler.js`. The crawler opens the website's home page ie — [http://localhost:8080](http://localhost:8080), extracts the strings that are displayed in `white` color and moves on to the next set of pages using the links that are displayed in `red`. This is done till the time all pages have not been parsed. Once all the the pages have been parsed and the strings in `white` have been extracted from all of them, we need to find the lexicographically smallest string amongst them. That's all!

For Example: Lets say there are just three pages on the website viz. `a0`, `a1` and `a2`.

- From `a0` you can go to both `a1` and `a2`.

  <img src="https://raw.githubusercontent.com/dream11/crawler/master/public/example-a0.png" height="300" />

- From `a1` you can only goto `a2`

  <img src="https://raw.githubusercontent.com/dream11/crawler/master/public/example-a1.png" height="300" />

- From `a2` you can go back to `a0` & `a1`

  <img src="https://raw.githubusercontent.com/dream11/crawler/master/public/example-a2.png" height="300" />

In the above case I first load page `a0` I extract all the strings in white from that page,

```patch
{
  strings: [
  'rga',
  'abd',
  'ebd',
  'bde'
  ]
}
```

Next I should go to `a1` and then extract all the strings from there —

```patch
{
  strings: [
  'rga',
  'abd',
  'ebd',
  'bde',
+ 'wwd',
+ 'asw',
+ 'mjl'
  ]
}
```

Finally I should go to `a2`, extract all the strings and add it to my list and stop.

```patch
{
  strings: [
  'rga',
  'abd',
  'ebd',
  'bde',
  'wwd',
  'asw',
  'mjl',
+ 'bcc',
+ 'foo',
+ 'aax'
  ]
}
```

Here we can do a simple comparison between all the strings and find that `aax` is the lexicographically smallest string. So the answer here would be `aax`.


# Getting Started
The project is built using `express` and `pug`. To run it locally follow these steps.
  1. Install `node >= 8`
  1. Clone the project
    ```
    git clone git@github.com:dream11/crawler.git
    ```
  1. Install npm dependencies
    ```
    npm i
    ```
  1. Start the server
    ```
    npm start
    ```
  1. Visit [http://localhost:8080](http://localhost:8080) in the browser.

  1. Feel free to run `npm test` and fix the broken tests :)


The project consists of a mock webserver that serves **string-factory.com**. Each request to the server is delayed by `1000ms`, this is to mimic a real world latency. The project contains a file `crawler.js` where you should start writing the logic.

The team would be glad to assist you in setting up the project on your computer. Feel free to stop by and ask questions.

# Judging Criteria
Once your tests pass we will benchmark your code against ours on five different versions of the website. If your crawler beat us in at least three of five, you win!

# Solution
We would be posting our solution over at our twitter handle — [@d11engg](https://twitter.com/D11Engg) after the conference is over.

# FAQ

- **What does lexicographically smallest string mean?**
  The lexicographically smallest string would be the first string in an english dictionary where all the words are sorted in alphabetical order. Eg: `a < b` or `aa < ab`.

- **How do I know when to stop?**
  *HINT: It is essentially a Graph Traversal problem, the only difference is that — going from one node to another requires an I/O operation.*

Please don't hesitate to get in touch with the team or shoot us a query directly on [d11engg](https://twitter.com/D11Engg).
