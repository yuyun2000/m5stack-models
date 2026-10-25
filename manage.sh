#!/bin/zsh
set -eu
TASK_ROOT="${0:A:h}"
TASK_RUNTIME="$TASK_ROOT/.runtime"
TASK_PORT=5188
mkdir -p "$TASK_RUNTIME"
owned_pid() {
  [[ -f "$TASK_RUNTIME/server.pid" ]] || return 1
  TASK_PID=$(cat "$TASK_RUNTIME/server.pid")
  [[ "$TASK_PID" == <-> ]] || return 1
  kill -0 "$TASK_PID" 2>/dev/null || return 1
  TASK_CMD=$(ps -p "$TASK_PID" -o command=)
  [[ "$TASK_CMD" == *"$TASK_ROOT/scripts/serve.py"* ]]
}
case "${1:-help}" in
  start)
    if owned_pid; then echo "Already running: http://127.0.0.1:$TASK_PORT"; exit 0; fi
    [[ -f "$TASK_ROOT/dist/index.html" ]] || { echo 'Run npm ci && npm run build first.'; exit 1; }
    if curl -fsS --max-time 1 "http://127.0.0.1:$TASK_PORT/" >/dev/null 2>&1; then echo "Port $TASK_PORT is already occupied; no process was changed."; exit 1; fi
    nohup python3 "$TASK_ROOT/scripts/serve.py" --directory "$TASK_ROOT/dist" --port "$TASK_PORT" >"$TASK_RUNTIME/server.log" 2>&1 &
    echo $! > "$TASK_RUNTIME/server.pid"
    for TASK_ATTEMPT in {1..30}; do
      if owned_pid && curl -fsS --max-time 1 "http://127.0.0.1:$TASK_PORT/" 2>/dev/null | rg -q 'M5Stack Models'; then echo "Ready: http://127.0.0.1:$TASK_PORT"; exit 0; fi
      sleep 0.1
    done
    echo "Readiness failed; inspect ./manage.sh logs"; exit 1 ;;
  status)
    if owned_pid && curl -fsS --max-time 2 "http://127.0.0.1:$TASK_PORT/" 2>/dev/null | rg -q 'M5Stack Models'; then echo "Healthy: http://127.0.0.1:$TASK_PORT"; else echo 'Stopped or not ready'; exit 1; fi ;;
  stop)
    if owned_pid; then kill "$TASK_PID"; rm -f "$TASK_RUNTIME/server.pid"; echo 'Stopped owned preview server'; else echo 'No owned preview server to stop'; fi ;;
  logs) tail -n 60 "$TASK_RUNTIME/server.log" ;;
  help|--help|-h) echo './manage.sh start | status | logs | stop | help'; echo 'Preview: http://127.0.0.1:5188 (loopback only)'; echo 'Build: npm ci && npm run build' ;;
  *) echo 'Unknown command; use ./manage.sh help'; exit 2 ;;
esac
