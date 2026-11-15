"""Run the release gates in order and bind evidence to verified asset hashes."""
from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,subprocess,sys,time

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tests/artifacts/ux-upgrade-20261010'

def verify_assets(manifest):
    for name,expected in manifest['assetHashes'].items():
        if hashlib.sha256((ROOT/'app/web'/name).read_bytes()).hexdigest()!=expected:
            raise ValueError('Rebuild release before testing: '+name)

def main():
    manifest=json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))
    verify_assets(manifest)
    commands=[['node','--test','tests/reader-model.test.cjs','tests/narration-model.test.cjs','tests/sutra-formatter.test.cjs']]
    commands += [[sys.executable,'-X','utf8','tests/ux_upgrade_acceptance.py','--stage',str(n)] for n in range(1,10)]
    commands += [[sys.executable,'-X','utf8','tests/'+name] for name in ['sync_lifecycle_check.py','ux_release_update_check.py','unified_player_check.py','home_search_actions_check.py','module_study_check.py','learning_depth_check.py','structure_check.py','local_launcher_check.py']]
    runs=[];result={'version':manifest['version'],'startedAt':datetime.now(timezone.utc).isoformat(),'runs':runs,'passed':False}
    try:
        scripts=list((ROOT/'app/web/js').glob('*.js'))+[ROOT/'app/web/sw.js']
        for script in scripts:subprocess.run(['node','--check',str(script)],cwd=ROOT,check=True,capture_output=True)
        result['javascriptSyntaxFiles']=len(scripts)
        for number,command in enumerate(commands,1):
            print(f'[{number}/{len(commands)}] '+ ' '.join(command[1:]),flush=True)
            start=time.perf_counter();process=subprocess.run(command,cwd=ROOT)
            runs.append({'command':command[1:],'exitCode':process.returncode,'seconds':round(time.perf_counter()-start,2)})
            if process.returncode:raise RuntimeError('Acceptance failed; fix before proceeding: '+str(command[1:]))
        evidence=[json.loads((OUT/f'stage{n}.json').read_text(encoding='utf-8')) for n in range(1,10)]
        assert all(x['passed'] and x['version']==manifest['version'] and not x['pageErrors'] for x in evidence)
        result['stagedChecks']=sum(len(x['checks']) for x in evidence)
        verify_assets(manifest);result['passed']=True
        print(json.dumps({k:v for k,v in result.items() if k!='runs'},ensure_ascii=False),flush=True)
    except Exception as error:result['failure']=str(error);raise
    finally:
        result['finishedAt']=datetime.now(timezone.utc).isoformat();(OUT/'regression.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':main()
