import scrapy
from datetime import datetime
timenow=datetime.now()
from heapq import heappush, heappop
code_list = []

class Spider(scrapy.Spider):
	name = 'spider'
	start_urls = ['http://localhost:8080']
	custom_settings = {
        'LOG_ENABLED': 'false',
		'CONCURRENT_REQUESTS': 4,
		'CONCURRENT_REQUESTS_PER_DOMAIN': 4
    }
	def __init__(self, url=None):
		self.something = url

	def parse(self, response):
		local_codes = []
		for codes in response.css('div.codes > h1 ::text'):
			heappush(local_codes, codes.extract())
		yield heappush(code_list, heappop(local_codes))
		for next_page in response.css('a'):
			yield response.follow(next_page,callback=self.parse)

	def closed(self, reason):
		print heappop(code_list)
		print datetime.now() - timenow
