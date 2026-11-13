import glob, os

for f in glob.glob('tools/*.cmd'):
    d = open(f, 'rb').read()
    n = d.replace(b'\r\n', b'\n').replace(b'\n', b'\r\n')
    if n != d:
        open(f, 'wb').write(n)
    print('%-28s CRLF=%d LF=%d' % (os.path.basename(f), n.count(b'\r\n'), n.count(b'\n')))
