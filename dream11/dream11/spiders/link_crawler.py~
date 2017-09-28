import scrapy


class LinkSpider(scrapy.Spider):
    name = 'linkspider'
    allowed_domains = ['localhost']
    start_urls = [
        #'ftp://localhost:8080'
        'http://localhost:8080'
        #'http://127.0.0.1:8080'
    ]

    def parse(self, response):
        values = response.xpath('//h1/text()').extract()
        #yield {'values': values}
        yield {'values': set(values)}
        for link in response.xpath('//a'):
            yield response.follow(link, callback=self.parse)

    #def parse(self, response):
    #    old_min_value = response.meta.get('old_min_value')
    #    values = response.xpath('//h1/text()').extract()
    #    if old_min_value:
    #        values.append(old_min_value)
    #    values.sort()
    #    for link in response.xpath('//a/@href').extract():
    #        next_url = response.urljoin(link)
    #        request = scrapy.Request(next_url, callback=self.parse)
    #        request.meta['old_min_value'] = values[0]
    #        yield request
    #    #for link in response.xpath('//a'):
    #    #    yield response.follow(link, callback=self.parse)
    #    #print(values)
