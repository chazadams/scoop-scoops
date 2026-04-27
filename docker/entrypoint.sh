#!/bin/sh
set -e

# 1. Start the Tailscale daemon (userspace networking — no host tun device needed)
tailscaled --tun=userspace-networking --state=/var/lib/tailscale/tailscaled.state &
sleep 3

# 2. Bring the Tailscale interface up
tailscale up --authkey="${TAILSCALE_AUTHKEY}" --hostname=scoop-scoops

# 3. Fetch the TLS certificate for our Tailnet hostname
mkdir -p /etc/nginx/ssl
tailscale cert \
  --cert-file /etc/nginx/ssl/tailscale.crt \
  --key-file  /etc/nginx/ssl/tailscale.key \
  scoop-scoops.moose-likert.ts.net

# 4. Enable Tailscale Funnel on port 443 (makes the site publicly accessible)
# --tcp 443: raw TCP at external port 443 so nginx handles TLS termination
# --bg: run in background so entrypoint continues
# --yes: non-interactive
# Second 443: forward to localhost:443 (nginx)
tailscale funnel --bg --yes --tcp 443 443

# 5. Start Nginx in the foreground
exec nginx -g 'daemon off;'
