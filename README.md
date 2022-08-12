# Google Meet Desktop (Unofficial)

**Unofficial desktop application for Google Meet built with electron.**

![Screenshot of Google Meet Desktop](https://static.arjun-g.com/google-meet/google-meet-screenshot.jpg)

## Features

- Presenter can draw/annotate on screen when sharing the screen

  ![Demo of annotation feature](https://static.arjun-g.com/google-meet/google-meet-annotation.gif)

- ~~Share audio while sharing application window (Windows Only)~~ (Temporary disabled due to a audio loop issue)
- Global shortcuts to mute/unmute microphone and switch on/off camera

| Shortcut               | Use                           |
| ---------------------- | ----------------------------- |
| `Ctrl/⌘` + `Alt` + `A` | Toggle microphone mute/unmute |
| `Ctrl/⌘` + `Alt` + `V` | Toggle camera on/off          |

## Todo

- [ ] Ability to stop screenshare without opening the main window
- [ ] Ability to draw/annotate on presenter's screen for all participants
- [ ] Show floating video preview when minimized similar to zoom, slack
- [ ] Customizable shortcuts
- [ ] Mute/umute all participants
- [ ] Add to windows startup
- [ ] Add ability to share audio while screensharing in mac
- [ ] Download chat history

## Installation

You can [download the latest release](https://github.com/arjun-g/google-meet-desktop/releases) for your operating system or build it yourself (see below).

On Windows, you can also use the [Chocolatey package](https://community.chocolatey.org/packages/unofficial-google-meet), in order to do the installation/update:
```powershell
choco install unofficial-google-meet
```

## Building

You'll need [Node.js](https://nodejs.org) installed on your computer in order to build this app.

```bash
$ git clone https://github.com/arjun-g/google-meet-desktop
$ cd google-meet-desktop
$ npm install
$ npm start
```
