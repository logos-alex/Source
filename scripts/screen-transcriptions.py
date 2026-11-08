# -*- coding: utf-8 -*-
"""Screen text files: is this a real transcription or OCR garbage?

For each candidate file, compute the share of characters that belong to a
manuscript script (Arabic incl. presentation forms, Greek, Hebrew/Aramaic,
Cyrillic) vs. noise (Latin letters, stray digits, symbols).
"""
import io, os, re, json, sys

ROOTS = [r'C:\the project']
EXTS = ('.txt', '.md')
MIN_KB = 15

ARABIC = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')
GREEK = re.compile(r'[\u0370-\u03FF\u1F00-\u1FFF]')
HEBREW = re.compile(r'[\u0590-\u05FF\uFB1D-\uFB4F]')
CYRILLIC = re.compile(r'[\u0400-\u04FF]')
LATIN = re.compile(r'[A-Za-z]')
DIGIT = re.compile(r'[0-9]')


def scan(path):
    try:
        s = io.open(path, encoding='utf-8', errors='replace').read()
    except Exception as e:
        return None
    n = len(s)
    if n < 1000:
        return None
    # sample to keep it fast
    if n > 300000:
        s = s[:300000]
        n = len(s)
    counts = {
        'ar': len(ARABIC.findall(s)),
        'gr': len(GREEK.findall(s)),
        'he': len(HEBREW.findall(s)),
        'cy': len(CYRILLIC.findall(s)),
        'lat': len(LATIN.findall(s)),
        'dig': len(DIGIT.findall(s)),
    }
    script = counts['ar'] + counts['gr'] + counts['he'] + counts['cy']
    total_letters = script + counts['lat'] + counts['dig']
    if total_letters == 0:
        return None
    share = script / total_letters
    dominant = max(['ar', 'gr', 'he', 'cy', 'lat'], key=lambda k: counts[k])
    return {
        'path': path,
        'kb': round(os.path.getsize(path) / 1024),
        'chars': n,
        'script_share': round(share, 3),
        'dominant': dominant,
        **{k: counts[k] for k in counts},
    }


def main():
    out = []
    for root in ROOTS:
        for dp, dn, fn in os.walk(root):
            # skip heavy/irrelevant trees
            low = dp.lower()
            if any(x in low for x in ('\\_site', '\\node_modules', '\\.git\\', '\\_work\\old-versions')):
                continue
            for f in fn:
                if not f.lower().endswith(EXTS):
                    continue
                p = os.path.join(dp, f)
                try:
                    if os.path.getsize(p) < MIN_KB * 1024:
                        continue
                except OSError:
                    continue
                r = scan(p)
                if r:
                    out.append(r)
    out.sort(key=lambda r: (-r['chars']))
    io.open(r'C:\the project\LOGIA\_work\transcript-quality.json', 'w', encoding='utf-8').write(
        json.dumps(out, ensure_ascii=False, indent=1))
    # console summary
    print('scanned: %d' % len(out))
    print('%-6s %-5s %-6s %-8s %s' % ('KB', 'dom', 'share', 'chars', 'path'))
    for r in out:
        if r['dominant'] != 'lat':
            print('%-6d %-5s %-6s %-8d %s' % (r['kb'], r['dominant'], r['script_share'], r['chars'],
                                              r['path'].replace(r'C:\the project\\', '')))


if __name__ == '__main__':
    main()
