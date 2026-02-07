# Makefile — common convenience targets

.PHONY: all upgrade uv-sync frontend-update dev

all: upgrade

# Run both backend (uv) and frontend (bun) upgrades
upgrade: uv-sync frontend-update
	@echo "=== Running full upgrade ==="

# Upgrade backend via uv
uv-sync:
	@echo "Running: uv sync --upgrade"
	uv sync --upgrade

# Update frontend dependencies using bun
frontend-update:
	@echo "Running: cd frontend && bun update"
	cd frontend && bun update

dev:
	@echo "Running: cd frontend && bun dev"
	cd frontend && bun dev
