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

# 4. Start Nginx in the foreground
exec nginx -g 'daemon off;'
