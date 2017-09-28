import unittest
from scrapy.crawler import CrawlerProcess
from crawler import MyBaseSpider 


crawlerProcess = CrawlerProcess()
# crawlerProcess.install()
# crawlerProcess.configure()


class TestStringMethods(unittest.TestCase):

    def test_isupper(self):
        crawlerProcess.crawl(MyBaseSpider)
        crawlerProcess.start()

if __name__ == '__main__':
    unittest.main()