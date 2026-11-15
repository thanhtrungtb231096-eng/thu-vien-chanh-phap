"""Compare problematic PDF characters with normal Vietnamese through authorized Microsoft TTS."""
import argparse,asyncio,hashlib,json,sys,time,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from narration_engine import edge_stream

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--voice',default='vi-VN-NamMinhNeural')
parser.add_argument('--rounds',type=int,default=2)
parser.add_argument('--demo',action='store_true')
args=parser.parse_args()
samples=[('heading-pdf','TIỂU SỬ HÒA THƢỢNG GIỚI NGHIÊM.'),
         ('heading-normal','TIỂU SỬ HÒA THƯỢNG GIỚI NGHIÊM.'),
         ('prose-pdf','Đàm thoại nhƣ một Trí giả hay nhƣ một Vƣơng giả?'),
         ('prose-normal','Đàm thoại như một Trí giả hay như một Vương giả?'),
         ('control','Chúng ta đọc kinh với tâm an tịnh và lắng nghe từng lời dạy.')]
if args.demo:
    samples=[('demo','Xin mời quý vị cùng lắng nghe. Hãy trở về với hơi thở, để tâm được lắng dịu. Khi biết nuôi dưỡng lòng từ bi và hiểu biết, chúng ta có thể sống an lành hơn, đối xử với nhau bằng sự chân thành và tìm thấy bình yên trong từng việc nhỏ mỗi ngày.')]
output=ROOT/'tests/artifacts/audio-root-20261112';output.mkdir(parents=True,exist_ok=True)
results=[]

async def main():
    for number in range(args.rounds):
        for label,text in samples:
            started=time.monotonic();audio=bytearray();error='';first=None
            try:
                async with asyncio.timeout(35):
                    async for data in edge_stream(text,args.voice,'-5%'):
                        if first is None:first=round(time.monotonic()-started,3)
                        audio.extend(data)
            except Exception as e:error=type(e).__name__
            row={'round':number+1,'case':label,'voice':args.voice,'sha256':hashlib.sha256(text.encode()).hexdigest(),
                 'characters':len(text),'seconds':round(time.monotonic()-started,3),'firstAudioSeconds':first,'bytes':len(audio),'error':error,'ok':not error and len(audio)>=256}
            results.append(row);print(json.dumps(row),flush=True)
            if row['ok']:(output/(label+'-'+args.voice+'.mp3')).write_bytes(audio)
            (output/('content-probe-'+args.voice+('-demo' if args.demo else '')+'.json')).write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            await asyncio.sleep(.25)

asyncio.run(main())
