# PG Fixtures Editor

Utilities to edit SQL fixtures for Postgres databases.

Have you ever had to edit a SQL fixture after a DB schema migration? It's a real pain.
This extension aims to make this process easier.

![Remove column command demo](https://raw.githubusercontent.com/labarilem/pg-fixtures-editor-vscode/main/images/demo-hires.gif)

## Features

Included commands:

- `Remove Column`: removes a column and its values from the selected INSERT statement(s).
- `Add Column`: adds a column and its value to the selected INSERT statement(s). Note that the value will be emitted "as is", so you need to include proper quoting and escaping if needed. Example: to insert a SQL string, you need to pass `'your string'` as columnValue (i.e. enclosed with single quotes).

## Known Issues

Please refer to the [pg-fixtures-editor docs](https://www.npmjs.com/package/pg-fixtures-editor) for known issues and quirks related to SQL parsing. It's the underlying library powering this extension.
