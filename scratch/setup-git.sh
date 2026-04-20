#!/bin/bash

# --- CO-WRITTER GIT AUTH HELPER ---
# This script helps resolve the 403 Forbidden error during git push.

echo "=========================================="
echo "   CO-WRITTER GIT AUTHENTICATION HELPER   "
echo "=========================================="
echo ""

REPO_URL="https://github.com/co-writter/co-writter.github.io.git"
UPSTREAM_NAME="upstream"

echo "Current Git Config (Upstream):"
git remote get-url $UPSTREAM_NAME 2>/dev/null || echo "Upstream remote not found!"
echo ""

echo "Select an option to fix the 403 error:"
echo "1) Use a Personal Access Token (PAT) via HTTPS"
echo "2) Use SSH (Requires your SSH key to be added to GitHub)"
echo "3) Reset to default HTTPS URL (Will prompt for credentials on push)"
echo "q) Quit"
read -p "Choice [1-3, q]: " choice

case $choice in
    1)
        read -p "Enter your GitHub Personal Access Token: " token
        if [ -z "$token" ]; then
            echo "Token cannot be empty."
            exit 1
        fi
        NEW_URL="https://$token@github.com/co-writter/co-writter.github.io.git"
        git remote set-url $UPSTREAM_NAME "$NEW_URL"
        echo "Remote updated with PAT."
        ;;
    2)
        NEW_URL="git@github.com:co-writter/co-writter.github.io.git"
        git remote set-url $UPSTREAM_NAME "$NEW_URL"
        echo "Remote updated to SSH."
        echo "NOTE: Ensure your public key (~/.ssh/id_rsa.pub) is added to your GitHub account."
        ;;
    3)
        git remote set-url $UPSTREAM_NAME "$REPO_URL"
        echo "Remote reset to standard HTTPS."
        ;;
    q)
        echo "Exiting."
        exit 0
        ;;
    *)
        echo "Invalid choice."
        exit 1
        ;;
esac

echo ""
echo "Testing connectivity to GitHub..."
ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"
if [ $? -eq 0 ]; then
    echo "SSH Authentication SUCCESSFUL."
else
    echo "SSH Authentication FAILED (or not tested). You may still be able to push via HTTPS if you chose option 1."
fi

echo ""
echo "Try pushing again with: git push $UPSTREAM_NAME main"
echo "=========================================="
