#!/bin/bash

# Script to create a git worktree with proper setup for the monorepo
# Usage: ./create-worktree.sh <issue-number> "description with spaces"

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_error() {
    echo -e "${RED}L $1${NC}"
}

print_success() {
    echo -e "${GREEN} $1${NC}"
}

print_info() {
    echo -e "${YELLOW}9 $1${NC}"
}

# Check if we have the required arguments
if [ $# -lt 2 ]; then
    print_error "Missing required arguments!"
    echo "Usage: $0 <issue-number> \"description with spaces\""
    echo "Example: $0 1234 \"implement new feature\""
    exit 1
fi

# Get arguments
ISSUE_NUMBER="$1"
DESCRIPTION="$2"

# Convert description to lowercase and replace spaces with underscores
DESCRIPTION_FORMATTED=$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

# Create branch name
BRANCH_NAME="feature-${ISSUE_NUMBER}-${DESCRIPTION_FORMATTED}"

# Define paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKTREES_DIR="$(cd "$REPO_ROOT/.." && pwd)/worktrees"
WORKTREE_PATH="${WORKTREES_DIR}/${BRANCH_NAME}"

print_info "Creating worktree for branch: ${BRANCH_NAME}"
print_info "Worktree location: ${WORKTREE_PATH}"

# Create worktrees directory if it doesn't exist
if [ ! -d "$WORKTREES_DIR" ]; then
    print_info "Creating worktrees directory..."
    mkdir -p "$WORKTREES_DIR"
    print_success "Worktrees directory created"
fi

# Check if worktree already exists
if [ -d "$WORKTREE_PATH" ]; then
    print_error "Worktree already exists at: ${WORKTREE_PATH}"
    echo "Please remove it first or use a different issue number/description"
    exit 1
fi

# Check if branch already exists
cd "$REPO_ROOT"
if git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}"; then
    print_error "Branch '${BRANCH_NAME}' already exists!"
    echo "Please delete the branch first or use a different issue number/description"
    exit 1
fi

# Create the worktree with a new branch
print_info "Creating git worktree..."
git worktree add -b "${BRANCH_NAME}" "${WORKTREE_PATH}"
if [ $? -eq 0 ]; then
    print_success "Git worktree created successfully"
else
    print_error "Failed to create git worktree"
    exit 1
fi

# Function to copy .venv folders
copy_venv_folders() {
    print_info "Searching for .venv folders to copy..."

    # Find all .venv directories, excluding node_modules
    local venv_dirs=$(find "$REPO_ROOT" -path "*/node_modules" -prune -o -type d -name ".venv" -print 2>/dev/null)

    if [ -z "$venv_dirs" ]; then
        print_info "No .venv folders found"
        return
    fi

    while IFS= read -r venv_path; do
        [ -z "$venv_path" ] && continue

        # Get the relative path from repo root
        local rel_path="${venv_path#$REPO_ROOT/}"
        local target_path="$WORKTREE_PATH/$rel_path"
        local target_dir="$(dirname "$target_path")"

        print_info "Copying .venv from: $rel_path"

        # Create target directory if it doesn't exist
        mkdir -p "$target_dir"

        # Copy the .venv folder preserving symlinks and permissions
        cp -r "$venv_path" "$target_path"

        if [ $? -eq 0 ]; then
            print_success "Copied $rel_path"
        else
            print_error "Failed to copy $rel_path"
        fi
    done <<< "$venv_dirs"
}

# Function to copy environment files
copy_env_files() {
    print_info "Searching for environment files to copy..."

    # Find all .env, .env.local, and .env.development.local files
    # Exclude node_modules, templates, and test files
    local env_files=$(find "$REPO_ROOT" \
        -path "*/node_modules" -prune -o \
        \( -name ".env" -o -name ".env.local" -o -name ".env.development.local" \) \
        -type f \
        ! -name "*.template" \
        ! -name "*.test" \
        -print 2>/dev/null)

    if [ -z "$env_files" ]; then
        print_info "No environment files found"
        return
    fi

    while IFS= read -r env_path; do
        [ -z "$env_path" ] && continue

        # Skip template and test files (double-check)
        if [[ "$env_path" == *.template ]] || [[ "$env_path" == *.test ]]; then
            continue
        fi

        # Get the relative path from repo root
        local rel_path="${env_path#$REPO_ROOT/}"
        local target_path="$WORKTREE_PATH/$rel_path"
        local target_dir="$(dirname "$target_path")"

        print_info "Copying environment file: $rel_path"

        # Create target directory if it doesn't exist
        mkdir -p "$target_dir"

        # Copy the environment file
        cp "$env_path" "$target_path"

        if [ $? -eq 0 ]; then
            print_success "Copied $rel_path"
        else
            print_error "Failed to copy $rel_path"
        fi
    done <<< "$env_files"
}

# Copy necessary files
print_info "Setting up worktree configuration files..."

# Copy .npmrc from root
if [ -f "$REPO_ROOT/.npmrc" ]; then
    cp "$REPO_ROOT/.npmrc" "$WORKTREE_PATH/.npmrc"
    print_success "Copied .npmrc"
else
    print_info ".npmrc not found in root, skipping"
fi

# Copy .claude folder from root
if [ -d "$REPO_ROOT/.claude" ]; then
    cp -r "$REPO_ROOT/.claude" "$WORKTREE_PATH/.claude"
    print_success "Copied .claude folder"
else
    print_info ".claude folder not found in root, skipping"
fi

# Copy all .venv folders
copy_venv_folders

# Copy all environment files
copy_env_files

# Run npm install in the worktree
print_info "Running npm install in the worktree..."
cd "$WORKTREE_PATH"
if command -v npm &> /dev/null; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        echo "You may need to run 'npm install' manually in the worktree"
    fi
else
    print_error "npm is not installed!"
    echo "Please install npm and run 'npm install' in the worktree manually"
fi

# Final success message
echo ""
print_success "Worktree setup complete! <�"
echo ""
echo "To start working:"
echo "  cd ${WORKTREE_PATH}"
echo ""
echo "Branch name: ${BRANCH_NAME}"
echo "Worktree path: ${WORKTREE_PATH}"
echo ""
echo "When done, you can remove the worktree with:"
echo "  git worktree remove ${BRANCH_NAME}"