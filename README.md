# tabgroup-sync

Simple extension to sync tabs between open editors/tab groups

This is a super awful way to work around https://github.com/microsoft/vscode/issues/143024

https://user-images.githubusercontent.com/49327592/224231752-588c922b-d19c-4224-b89b-8f3e8b5a1fef.mp4

I've done a terrible thing

## Terrible things

- Resets back to whatever the current file is on any split, closing all other files.
- Will sometimes focus whatever file was opened in all editors

## Installation

```
npm run compile
npx vsce package
code --install-extension tabgroup-sync-0.1.0.vsix
```

## Notes

If you are at all familiar with typescript then you probably have me beat, please fork this or reimplement so that it no longer is terrible. Please.
