# batch-update-repo
Batch update source code to the personal repo.

## Inputs

```yaml
inputs:
  github_token:
    description: Base64 encoded Personal Access Token
    required: true
  source_repo:
    description: 'source_repo'
    required: true
  source_tag:
    description: 'source_tag'
    required: false
  source_branch:
    description: 'source_branch'
    required: false
  target_repo:
    description: 'target_repo'
    required: true
```

## Example usage
- Synchronize source code according to tag.
```yaml
      - name: use myaction
        uses: wangsongc/batch-update-repo@v1.0.0
        with:
          github_token: ${{ secrets.TEST_AUTH_TOKEN }}
          source_repo: 'https://github.com/vuejs/core.git, https://github.com/intlify/vue-i18n-next.git'
          source_branch: 'main, master'
          source_tag: 'v3.2.32, v9.1.8'
          target_repo: 'https://github.com/wangsongc/vue-next.git, https://github.com/wangsongc/vue-i18n-next.git'
```
- Synchronize source code mirror.
```yaml
      - name: use myaction
        uses: wangsongc/batch-update-repo@v1.0.0
        with:
          github_token: ${{ secrets.TEST_AUTH_TOKEN }}
          source_repo: 'https://github.com/vuejs/core.git, https://github.com/intlify/vue-i18n-next.git'
          target_repo: 'https://github.com/wangsongc/vue-next.git, https://github.com/wangsongc/vue-i18n-next.git'
```
