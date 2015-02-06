#!/usr/bin/python

import json
import sys

try:

    fd = open(sys.argv[1], 'r')
    jo = json.load(fd)
    man = jo['datas']['man']
    woman = jo['datas']['woman']
    alls = man + woman

    self = '79'
    myvote = ''

    maxvote = 0

    for k in alls:
        if k['id'] == self:
            myvote = int(k['voteCount'])
            # print "my id is " + self + " my vote is %d" % myvote
            continue
        else:
            if int(k['voteCount']) > maxvote:
                # print "max id is" + k['id'] + " max vote is " +
                # k['voteCount']
                maxvote = int(k['voteCount'])

    diff = maxvote - myvote

    if diff < -3000:
        diff = 0

    if diff < 0:
        diff = diff * -1

    print diff

except:
    print 0
