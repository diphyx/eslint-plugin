.PHONY: lint
lint:
	pnpm run lint

.PHONY: format
format:
	pnpm run format

.PHONY: test
test:
	sh test.sh

.PHONY: publish
publish:
	sh publish.sh
