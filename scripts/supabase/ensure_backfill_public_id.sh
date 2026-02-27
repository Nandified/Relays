#!/usr/bin/env bash
set -euo pipefail
cd /Users/Clawdbot/clawd/Relays

PID_FILE=/tmp/relays_backfill_public_id.pid
LOG_FILE=/tmp/relays_backfill_public_id.nohup.log

# Load secrets from .env.local (do NOT echo)
export NEXT_PUBLIC_SUPABASE_URL="$(python3 - <<'PY'
import pathlib
for line in pathlib.Path('.env.local').read_text().splitlines():
  if line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
    print(line.split('=',1)[1].strip())
    break
PY
)"
export SUPABASE_SERVICE_ROLE_KEY="$(python3 - <<'PY'
import pathlib
for line in pathlib.Path('.env.local').read_text().splitlines():
  if line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
    print(line.split('=',1)[1].strip())
    break
PY
)"

missing=$(node - <<'NODE'
import { createClient } from '@supabase/supabase-js';
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});
const {count, error}=await sb.from('licensed_professionals').select('id',{count:'exact', head:true}).is('public_id',null);
if (error) { console.error(error); process.exit(2); }
console.log(count ?? 0);
NODE
)

# If complete, stop any running worker and exit.
if [[ "${missing}" == "0" ]]; then
  if [[ -f "$PID_FILE" ]]; then
    pid=$(cat "$PID_FILE" || true)
    if [[ -n "${pid}" ]] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" || true
    fi
    rm -f "$PID_FILE" || true
  fi
  echo "OK: complete (missing=0)"
  exit 0
fi

# If already running, do nothing.
if [[ -f "$PID_FILE" ]]; then
  pid=$(cat "$PID_FILE" || true)
  if [[ -n "${pid}" ]] && kill -0 "$pid" 2>/dev/null; then
    echo "OK: running pid=${pid} missing=${missing}"
    exit 0
  fi
fi

# Start (stable) batch; script auto-reduces on timeouts.
BATCH_SIZE=${BATCH_SIZE:-50}

nohup node scripts/supabase/backfill_public_id.mjs --batch "$BATCH_SIZE" >> "$LOG_FILE" 2>&1 &
new_pid=$!
echo "$new_pid" > "$PID_FILE"

# brief status line
sleep 0.2
if kill -0 "$new_pid" 2>/dev/null; then
  echo "OK: started pid=${new_pid} batch=${BATCH_SIZE} missing=${missing}"
else
  echo "ERROR: failed to start (pid=${new_pid}) missing=${missing}" >&2
  exit 1
fi
