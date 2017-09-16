# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html


class Dream11Pipeline(object):
    def __init__(self):
        self.value = None

    def process_item(self, item, spider):
        if not self.value:
            values = list(item['values'])
        else:
            values = [self.value] + list(item['values'])
        values.sort()
        self.value = values[0]

    def close_spider(self, spider):
        print("Answer: %s" % self.value)
