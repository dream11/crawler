'use strict'

var acorn = require('acorn');
var walk = require('acorn/dist/walk');
var source = require('./public/graph.json');
var strings = [];

var crawler = function (arg) {
    var answer;
    walk.ancestor(acorn.parse('var source = ' + JSON.stringify(source)), {
        'Literal': function(node) {
            if (node.raw.length === 8) {
                strings.push(node.value);
            }
        }
    });
    answer = strings.sort()[0];
    return answer;
};

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
    new Promise((resolve, reject) => {
        var answer = crawler();
        resolve(answer);
    })