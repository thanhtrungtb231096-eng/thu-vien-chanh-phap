"""Print flushed operational narration records; Ctrl+C stops following."""
import argparse
from collections import deque
from pathlib import Path
import time

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--path',type=Path,default=Path(__file__).resolve().parents[1]/'local/storage/cache/work/narration.log')
parser.add_argument('--lines',type=int,default=20)
parser.add_argument('--follow',action='store_true')
args=parser.parse_args()
args.path.parent.mkdir(parents=True,exist_ok=True)
with args.path.open('a+',encoding='utf-8') as source:
    source.seek(0)
    for line in deque(source,maxlen=max(0,args.lines)):print(line.rstrip(),flush=True)
    try:
        while args.follow:
            line=source.readline()
            if line:print(line.rstrip(),flush=True)
            else:time.sleep(.25)
    except KeyboardInterrupt:pass
