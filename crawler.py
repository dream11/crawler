import time
import requests
from BeautifulSoup import BeautifulSoup

word_list = []
link_list = set()
url = 'http://localhost:8080'

# def get_links(html):
start = time.time()
def recursiveLinks(route):
    nurl = url+route
    page = requests.get(nurl)
    html = BeautifulSoup(page.content)
    words = [ h1.text for h1 in html.findAll('h1') if h1.text]
    word_list.extend(words)
    links = html.findAll('a')
    if links > 0:
        for link in links:
            if not link['href'] in link_list:
                link_list.add(link['href'])
                links.extend(recursiveLinks(link['href']))
    return links

# print(start)
recursiveLinks('')
print(min(word_list))
print(time.time() - start)
