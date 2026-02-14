#!/bin/bash
# Check if targeted search is still running and report progress
LOG="/Users/Clawdbot/clawd/Relays/data/outscraper/targeted_search_output.log"
PID_FILE="/Users/Clawdbot/clawd/Relays/data/outscraper/targeted_search.pid"
PROGRESS="/Users/Clawdbot/clawd/Relays/data/outscraper/targeted_search_progress.json"
SCRIPT="/Users/Clawdbot/clawd/Relays/data/outscraper/targeted_search_all.py"

PID=$(cat "$PID_FILE" 2>/dev/null)
IS_RUNNING=$(ps aux | grep "targeted_search_all.py" | grep -v grep | wc -l | tr -d ' ')

echo "=== Targeted Search Status ==="
echo "PID from file: $PID"
echo "Running: $IS_RUNNING"

if [ -f "$PROGRESS" ]; then
    echo "Progress: $(python3 -c "
import json
with open('$PROGRESS') as f:
    p = json.load(f)
ts = p.get('total_searched', 0)
mf = p.get('matches_found', 0)
rate = mf/max(ts,1)*100
print(f'{ts} searched, {mf} matches ({rate:.1f}%), last updated {p.get(\"last_updated\",\"?\")}')" 2>/dev/null)"
fi

if [ "$IS_RUNNING" = "0" ]; then
    echo "PROCESS IS DEAD!"
    # Check last few lines of log for errors
    echo "Last 5 log lines:"
    tail -5 "$LOG" 2>/dev/null
    
    # Check if it completed successfully
    if tail -3 "$LOG" 2>/dev/null | grep -q "FINISHED"; then
        echo "STATUS: COMPLETED SUCCESSFULLY"
    else
        echo "STATUS: CRASHED — RESTARTING..."
        cd "$(dirname "$SCRIPT")"
        nohup python3 "$SCRIPT" > "$LOG.restart" 2>&1 &
        NEW_PID=$!
        echo $NEW_PID > "$PID_FILE"
        echo "Restarted with PID: $NEW_PID"
        # Append restart log to main log
        sleep 2
        cat "$LOG.restart" >> "$LOG"
    fi
fi
