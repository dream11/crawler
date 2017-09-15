import scrapy
links = []
codes_list = []
class Spider(scrapy.Spider):
    name = 'spider'
    start_urls = ['http://localhost:8080']
    def parse(self, response):
	for codes in response.css('div.codes > h1 ::text'):    
	 codes_list.append(codes.extract())
        for next_page in response.css('div > a.link'):
         if(next_page.extract() in links):
    	  yield	  
	 else: 
	  links.append(next_page.extract())
	  yield response.follow(next_page, self.parse)

    def closed(reason, r2):
	codes_list.sort()
	print codes_list.pop(0)
