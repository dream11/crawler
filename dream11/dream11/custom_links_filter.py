from scrapy.utils.job import job_dir
from scrapy.dupefilters import RFPDupeFilter, BaseDupeFilter
from scrapy.utils.request import request_fingerprint


class CustomLinksFilter(BaseDupeFilter):
    """Request Fingerprint duplicates filter"""

    def __init__(self, path=None, debug=False):
        self.file = None
        self.fingerprints = set()

    def request_fingerprint(self, request):
        return request.url[22:27]

    def request_seen(self, request):
        fp = self.request_fingerprint(request)
        if fp in self.fingerprints:
            return True
        self.fingerprints.add(fp)


#class CustomLinksFilter(RFPDupeFilter):
#    """Request Fingerprint duplicates filter"""
#
#    def request_fingerprint(self, request):
#        return request.url[22:27]
#
#    #def __init__(self, path=None):
#    #    self.file = None
#    #    self.visited = set()
#    #    #self.fingerprints = BloomFilter(2000000, 0.00001)
#
#    #@classmethod
#    #def from_settings(cls, settings):
#    #    return cls(job_dir(settings))
#
#    #def request_seen(self, request):
#    #    fp = request.url
#    #    #import pdb; pdb.set_trace()  # XXX BREAKPOINT
#    #    sorten_fp = fp[22:27]
#    #    if sorten_fp in self.visited:
#    #        return True
#    #    self.visited.update(sorten_fp)
#    #    #if fp in self.fingerprints:
#    #    #    return True
#    #    #self.fingerprints.add(fp)
#
#    #def close(self, reason):
#    #    self.visited = None
#    #    #self.fingerprints = None
