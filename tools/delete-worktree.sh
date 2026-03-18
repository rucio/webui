#!/bin/bash

# Script to delete a git worktree created by create-worktree.sh
# Usage: ./delete-worktree.sh <issue-number-or-branch-name>

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_info() {
    echo -e "${YELLOW}$1${NC}"
}

# Check if we have the required argument
if [ $# -lt 1 ]; then
    print_error "Missing required argument!"
    echo "Usage: $0 <issue-number-or-branch-name>"
    echo ""
    echo "Examples:"
    echo "  $0 42                                    # Find worktree by issue number"
    echo "  $0 feature-42-add_rule_examination_tab   # Find worktree by branch name"
    exit 1
fi

INPUT="$1"

# Define paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

# Determine if input is an issue number or branch name
if [[ "$INPUT" =~ ^[0-9]+$ ]]; then
    # Input is a number — find matching worktree by pattern
    ISSUE_NUMBER="$INPUT"
    print_info "Looking for worktree matching issue #${ISSUE_NUMBER}..."

    WORKTREE_INFO=$(git worktree list --porcelain | grep -A2 "branch refs/heads/feature-${ISSUE_NUMBER}-" || true)

    if [ -z "$WORKTREE_INFO" ]; then
        print_error "No worktree found for issue #${ISSUE_NUMBER}"
        echo ""
        echo "Active worktrees:"
        git worktree list
        exit 1
    fi

    # Extract the worktree path from porcelain output
    WORKTREE_PATH=$(git worktree list | grep "feature-${ISSUE_NUMBER}-" | awk '{print $1}')
    BRANCH_NAME=$(git worktree list | grep "feature-${ISSUE_NUMBER}-" | sed 's/.*\[//' | sed 's/\]//')
else
    # Input is a branch name
    BRANCH_NAME="$INPUT"
    print_info "Looking for worktree with branch: ${BRANCH_NAME}..."

    WORKTREE_PATH=$(git worktree list | grep "$BRANCH_NAME" | awk '{print $1}')

    if [ -z "$WORKTREE_PATH" ]; then
        print_error "No worktree found for branch '${BRANCH_NAME}'"
        echo ""
        echo "Active worktrees:"
        git worktree list
        exit 1
    fi
fi

print_info "Found worktree:"
echo "  Path:   ${WORKTREE_PATH}"
echo "  Branch: ${BRANCH_NAME}"
echo ""

# Check for uncommitted changes in the worktree
UNCOMMITTED=$(git -C "$WORKTREE_PATH" status --porcelain 2>/dev/null || true)
if [ -n "$UNCOMMITTED" ]; then
    print_error "Worktree has uncommitted changes:"
    echo "$UNCOMMITTED"
    echo ""
    read -p "Proceed with removal anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Aborted. Commit or stash your changes first."
        exit 0
    fi
fi

# Check for unpushed commits
UNPUSHED=$(git -C "$WORKTREE_PATH" log @{u}..HEAD --oneline 2>/dev/null || true)
if [ -n "$UNPUSHED" ]; then
    print_info "Warning: Worktree has unpushed commits:"
    echo "$UNPUSHED"
    echo ""
    read -p "Proceed with removal anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Aborted. Push your commits first."
        exit 0
    fi
fi

# Remove the worktree
print_info "Removing worktree..."
if git worktree remove "$WORKTREE_PATH" 2>/dev/null; then
    print_success "Worktree removed successfully"
else
    print_info "Standard removal failed, trying force removal..."
    if git worktree remove --force "$WORKTREE_PATH"; then
        print_success "Worktree force-removed successfully"
    else
        print_error "Failed to remove worktree"
        exit 1
    fi
fi

# Ask about deleting the local branch
echo ""
read -p "Delete local branch '${BRANCH_NAME}'? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if git branch -d "$BRANCH_NAME" 2>/dev/null; then
        print_success "Local branch '${BRANCH_NAME}' deleted"
    else
        print_info "Branch not fully merged. Force delete?"
        read -p "Force delete '${BRANCH_NAME}'? (y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git branch -D "$BRANCH_NAME"
            print_success "Local branch '${BRANCH_NAME}' force-deleted"
        else
            print_info "Local branch kept"
        fi
    fi
else
    print_info "Local branch '${BRANCH_NAME}' kept"
fi

# Final message
echo ""
print_success "Cleanup complete!"
if git branch -r | grep -q "origin/${BRANCH_NAME}"; then
    echo "Remote branch 'origin/${BRANCH_NAME}' still exists."
    echo "It will be deleted when the PR is merged, or manually with:"
    echo "  git push origin --delete ${BRANCH_NAME}"
fi
