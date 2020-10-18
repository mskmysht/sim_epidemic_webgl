import requests
import sys
import random, string
import os
import json

def random_name(n):
   return ''.join(random.choices(string.ascii_letters + string.digits, k=n))

def get_url(param, browser_id, option):
    return f'http://simepi.intlab.soka.ac.jp/{param}?me={browser_id}{option}'

def get_request(param, browser_id, option=''):
    return requests.get(get_url(param, browser_id, option))

def get_population(browser_id):
    return get_request('getPopulation', browser_id).content

if __name__ == "__main__":
    if len(sys.argv) <= 2: exit(1)
    try:
        bid = sys.argv[1]
        n = int(sys.argv[2])
        s = random_name(8)

        ps = []
        print('reset:', get_request('/reset', bid).content.decode('utf-8'))
        for i in range(n):
            print(f'step {i}:', get_request('/start', bid, '&stopAt=1').content.decode('utf-8'))
            ps.append(get_population(bid))

        print(f'create data/{s}')
        os.makedirs(f'data/{s}')
        for i, p in enumerate(ps):
            with open(f'data/{s}/{i}.json', mode='wb') as f:
                f.write(p)

        with open('data/list.json', 'r') as f:
            list_data = json.load(f)

        list_data['list'].append({
            'name': s,
            'count': n
        })

        with open('data/list.json', 'w') as f:
            json.dump(list_data, f)

    except Exception as e:
        print(e)
