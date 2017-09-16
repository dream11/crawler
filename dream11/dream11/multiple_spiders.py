import scrapy
from scrapy.crawler import CrawlerProcess

from spiders.link_crawler import LinkSpider

process = CrawlerProcess()
process.crawl(LinkSpider)
process.crawl(LinkSpider)
process.crawl(LinkSpider)
process.crawl(LinkSpider)
process.crawl(LinkSpider)
process.crawl(LinkSpider)
process.start()
