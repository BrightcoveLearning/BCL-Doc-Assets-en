#!/usr/bin/env python

import sys
import requests
import json
import argparse

pub_id = "1752604059001"
client_id = "3e23bbec-59b8-4861-b5ba-7c26e110a746"
client_secret = "quNdrH07IVoG8yZxSFsCySWmtvUuWfPYyzeg1Nil7Md7VpQ50A3KVV4eeMrZSR7FdeZA_3JS5jV9pBBI0skwWA"
access_token_url = "https://oauth.brightcove.com/v4/access_token"
profiles_base_url = "https://cms.api.brightcove.com/v1/accounts/{pub_id}"

def get_access_token():
    access_token = None
    r = requests.post(access_token_url, params="grant_type=client_credentials", auth=(client_id, client_secret), verify=False)
    if r.status_code == 200:
        access_token = r.json().get('access_token')
        print(access_token)
    return access_token

def get_video():
    access_token = get_access_token()
    headers = { 'Authorization': 'Bearer ' + access_token, "Content-Type": "application/json" }

    url = ("https://cms.api.brightcove.com/v1/accounts/{pubid}/videos/").format(pubid=pub_id)

    r = requests.get(url, headers=headers, data=data)
    return r.json()


v = get_video()
print v

