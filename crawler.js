'use strict';

let request = require('request'),
	cheerio = require('cheerio');

module.exports = url =>
	new Promise((resolve, reject) => {
		let codes = [],
			links = [],
			visited = {},
			inProgress = [],
			retry = {},
			dispatcher = () => {
				if(links.length === 0) {
					resolve(codes.sort()[0])
				} else {
					let pop = links.pop();

					if (!(pop in visited)) {
						crawl(pop);
					}
				}
			},
			crawl = async function (geturl){

				request(geturl, function(error, response, body) {
					if(error || !response) {
						console.log("Error: " + error, geturl);
						crawl(geturl);
					}else if (!('statusCode' in response)){
						console.log("no response: ", geturl);
						//dispatcher();
						crawl(geturl);
					}else if(response.statusCode === 200) {
						visited[geturl] = true;

						let $ = cheerio.load(body);

						$('.codes h1').each(function(i, code){
							codes.push($(code).text());
						});

						$('.link').each(function(i, link){
							var href = url + $(link).attr('href');
							if(!visited[href] && links.indexOf(href) === -1){
								links.push(href);
							}
						});

						dispatcher();
					} else {
						//console.log("something else happened here", body);
						crawl(geturl);
					}
				});
			};

		crawl(url);
	});