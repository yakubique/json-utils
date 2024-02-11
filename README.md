# json-utils
A collection of handy utilities for working with JSON in GitHub Actions, making it easier to manipulate JSON data

For live examples, please see [actions](https://github.com/yakubique/json-utils/actions/workflows/test-myself.yaml)

**Methods**:
- [Diff](#diff)
- [Sort](#sort)
- [Pick](#pick)
- [Get](#get)

## Diff

### Flat
Order and values are taken from `input`. In this case it's `["1.3.0"]`

```yaml
uses: yakubique/json-utils@v1.1
with:
  input: '["1.0.0","1.1.0","1.2.0","1.2.1","1.3.0"]'
  secondary: '["1.0.0","1.1.0","1.2.0","1.2.1"]'
  action: "diff"

# result: "["1.3.0"]"
```


It'll return nothing if change direction

```yaml
uses: yakubique/json-utils@v1.1
with:
  input: '["1.0.0","1.1.0","1.2.0","1.2.1"]'
  secondary: '["1.0.0","1.1.0","1.2.0","1.2.1","1.3.0"]'
  action: "diff"

# result: "[]"
```


### With nested json
Find diff using `name` field in object

```yaml
uses: yakubique/json-utils@v1.1
with:
  input: '[{"name":"v0.3.26","tag_name":"v0.3.26","prerelease":false,"published_at":"2023-08-07T09:43:28Z"},{"name":"v0.3.22","tag_name":"v0.3.22","prerelease":false,"published_at":"2023-11-12T10:58:00Z"},{"name":"v0.3.23","tag_name":"v0.3.23","prerelease":false,"published_at":"2023-11-12T10:59:27Z"},{"name":"v0.3.25","tag_name":"v0.3.25","prerelease":false,"published_at":"2023-11-12T11:01:20Z"},{"name":"v0.3.31","tag_name":"v0.3.31","prerelease":false,"published_at":"2023-11-12T11:17:17Z"},{"name":"v0.3.34","tag_name":"v0.3.34","prerelease":false,"published_at":"2023-11-12T11:21:59Z"}]'
  secondary: '[{"name":"v0.3.26","tag_name":"v0.3.26","prerelease":false,"published_at":"2023-08-07T09:43:28Z"},{"name":"v0.3.22","tag_name":"v0.3.22","prerelease":false,"published_at":"2023-11-12T10:58:00Z"},{"name":"v0.3.23","tag_name":"v0.3.23","prerelease":false,"published_at":"2023-11-12T10:59:27Z"},{"name":"v0.3.25","tag_name":"v0.3.25","prerelease":false,"published_at":"2023-11-12T11:01:20Z"},{"name":"v0.3.31","tag_name":"v0.3.31","prerelease":false,"published_at":"2023-11-12T11:17:17Z"}]'
  action: "diff"
  type: "nested-json"
  key: "name"

# result: "[{"name":"v0.3.34","tag_name":"v0.3.34","prerelease":false,"published_at":"2023-11-12T11:21:59Z"}]"
```

### Use output

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4
  - name: Diff two arrays
    id: diff_two_arrays
    uses: yakubique/json-utils@v1.1
    with:
      input: '["1.0.0","1.1.0","1.2.0","1.2.1","1.3.0"]'
      secondary: '["1.0.0","1.1.0","1.2.0","1.2.1"]'
      action: "diff"
  - name: Test 1
    run: |
      echo "Expecting ['1.3.0']"
      echo "${{ steps.diff_two_arrays.outputs.result }}"
      test "${{ steps.diff_two_arrays.outputs.result }}" == "[1.3.0]"
```

## Sort

### Flat

By default it's `Ascending`

```yaml
uses: yakubique/json-utils@v1.1
with:
  input: '["1.0.0","1.1.0","1.2.0","1.2.1","1.3.0"]'
  action: "sort"
```

`Descending`

```yaml
uses: yakubique/json-utils@v1.1
with:
  input: '["1.0.0","1.1.0","1.2.0","1.2.1","1.3.0"]'
  action: "sort"
  modifier: "desc"
```


### With nested json
Find diff using `name` field in object

```yaml
uses: yakubique/json-utils@v1.1
with:
  input: '[{"name":"v0.3.26","tag_name":"v0.3.26","prerelease":false,"published_at":"2023-08-07T09:43:28Z"},{"name":"v0.3.22","tag_name":"v0.3.22","prerelease":false,"published_at":"2023-11-12T10:58:00Z"},{"name":"v0.3.23","tag_name":"v0.3.23","prerelease":false,"published_at":"2023-11-12T10:59:27Z"},{"name":"v0.3.25","tag_name":"v0.3.25","prerelease":false,"published_at":"2023-11-12T11:01:20Z"},{"name":"v0.3.31","tag_name":"v0.3.31","prerelease":false,"published_at":"2023-11-12T11:17:17Z"},{"name":"v0.3.34","tag_name":"v0.3.34","prerelease":false,"published_at":"2023-11-12T11:21:59Z"}]'
  action: "sort"
  type: "nested-json"
  key: "name"
  modifier: "desc"
```

### Use output

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4
  - name: Sort array of strings
    id: sort_array
    uses: yakubique/json-utils@v1.1
    with:
      input: '["1.0.0","1.1.0","1.2.0","1.2.1","1.3.0"]'
      action: "sort"
      modifier: "desc"
  - name: Test 1
    run: |
      echo "Expecting [1.3.0,1.2.1,1.2.0,1.1.0,1.0.0]"
      echo "${{ steps.sort_array.outputs.result }}"
```


## Pick

Creates an object composed of the picked object properties.

```yaml
- name: Pick "name"
  uses: yakubique/json-utils@v1.1
  with:
    input: '[{"name":"v0.3.26","tag_name":"v0.3.26","prerelease":false,"published_at":"2023-08-07T09:43:28Z"},{"name":"v0.3.22","tag_name":"v0.3.22","prerelease":false,"published_at":"2023-11-12T10:58:00Z"},{"name":"v0.3.23","tag_name":"v0.3.23","prerelease":false,"published_at":"2023-11-12T10:59:27Z"},{"name":"v0.3.25","tag_name":"v0.3.25","prerelease":false,"published_at":"2023-11-12T11:01:20Z"},{"name":"v0.3.31","tag_name":"v0.3.31","prerelease":false,"published_at":"2023-11-12T11:17:17Z"},{"name":"v0.3.34","tag_name":"v0.3.34","prerelease":false,"published_at":"2023-11-12T11:21:59Z"}]'
    action: "pick"
    key: "name"
```

Works with multiple comma-separated keys

```yaml
- name: Pick "name"
  uses: yakubique/json-utils@v1.1
  with:
    input: '[{"name":"v0.3.26","tag_name":"v0.3.26","prerelease":false,"published_at":"2023-08-07T09:43:28Z"},{"name":"v0.3.22","tag_name":"v0.3.22","prerelease":false,"published_at":"2023-11-12T10:58:00Z"},{"name":"v0.3.23","tag_name":"v0.3.23","prerelease":false,"published_at":"2023-11-12T10:59:27Z"},{"name":"v0.3.25","tag_name":"v0.3.25","prerelease":false,"published_at":"2023-11-12T11:01:20Z"},{"name":"v0.3.31","tag_name":"v0.3.31","prerelease":false,"published_at":"2023-11-12T11:17:17Z"},{"name":"v0.3.34","tag_name":"v0.3.34","prerelease":false,"published_at":"2023-11-12T11:21:59Z"}]'
    action: "pick"
    key: "name,prerelease"

  # returns: [{name:v0.3.26,prerelease:false},{name:v0.3.22,prerelease:false},{name:v0.3.23,prerelease:false},{name:v0.3.25,prerelease:false},{name:v0.3.31,prerelease:false},{name:v0.3.34,prerelease:false}]
```

## Get

Return only value of picket object property.

```yaml
  - name: Get "name"
    id: get_name
    uses: yakubique/json-utils@v1.1
    with:
      input: '[{"name":"v0.3.26","tag_name":"v0.3.26","prerelease":false,"published_at":"2023-08-07T09:43:28Z"},{"name":"v0.3.22","tag_name":"v0.3.22","prerelease":false,"published_at":"2023-11-12T10:58:00Z"},{"name":"v0.3.23","tag_name":"v0.3.23","prerelease":false,"published_at":"2023-11-12T10:59:27Z"},{"name":"v0.3.25","tag_name":"v0.3.25","prerelease":false,"published_at":"2023-11-12T11:01:20Z"},{"name":"v0.3.31","tag_name":"v0.3.31","prerelease":false,"published_at":"2023-11-12T11:17:17Z"},{"name":"v0.3.34","tag_name":"v0.3.34","prerelease":false,"published_at":"2023-11-12T11:21:59Z"}]'
      action: "get"
      key: "name"

  # returns: [v0.3.26,v0.3.22,v0.3.23,v0.3.25,v0.3.31,v0.3.34]
```
