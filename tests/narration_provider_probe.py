"""Bounded direct upstream diagnostic using authored synthetic text only."""
import argparse
import asyncio
import json
from pathlib import Path
import sys
import time

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from narration_engine import edge_stream

async def sample(voice,timeout):
    started=time.monotonic();first=None;size=0
    async def collect():
        nonlocal first,size
        async for packet in edge_stream('Đây là câu tự tạo để kiểm tra âm thanh.',voice,'-5%'):
            if first is None:first=time.monotonic()-started
            size+=len(packet)
    try:
        await asyncio.wait_for(collect(),timeout)
        return {'voice':voice,'ok':size>=256,'firstByteSeconds':first,'bytes':size,'totalSeconds':time.monotonic()-started}
    except Exception as error:
        return {'voice':voice,'ok':False,'error':type(error).__name__,'bytes':size,'totalSeconds':time.monotonic()-started}

async def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--timeout',type=float,default=15)
    args=parser.parse_args()
    for voice in ['vi-VN-HoaiMyNeural','vi-VN-NamMinhNeural']:
        print(json.dumps(await sample(voice,args.timeout)),flush=True)

if __name__=='__main__':asyncio.run(main())
