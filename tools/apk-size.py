import zipfile, os, collections, sys

p = sys.argv[1] if len(sys.argv) > 1 else r'android\app\build\outputs\apk\release\app-release.apk'
z = zipfile.ZipFile(p)
print('APK %.2f MB' % (os.path.getsize(p) / 1048576.0))

files = [(i.filename, i.file_size, i.compress_size) for i in z.infolist() if not i.is_dir()]

def group(name):
    parts = name.split('/')
    if parts[0] == 'lib' and len(parts) > 2:
        return 'lib/%s' % parts[1]
    if len(parts) > 1:
        return parts[0]
    return '(root)'

for label, idx in (('RAW', 1), ('ZIP', 2)):
    agg = collections.Counter()
    for n, r, c in files:
        agg[group(n)] += (r if idx == 1 else c)
    print('--- %s ---' % label)
    for k, v in agg.most_common(20):
        print('  %-40s %8.2f MB' % (k, v / 1048576.0))

print('--- top 25 files (raw) ---')
for n, r, c in sorted(files, key=lambda t: -t[1])[:25]:
    print('  %-55s %8.2f MB' % (n, r / 1048576.0))
