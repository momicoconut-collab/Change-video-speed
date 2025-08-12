# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome Extension called "Video Speed Controller" that allows users to control the playback speed of videos on any website. The extension detects video elements on web pages and provides an intuitive popup interface for adjusting playback speed.

## Development Setup

This is a Chrome Extension using Manifest V3. To develop and test:

1. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select this directory
   
2. Test the extension:
   - Navigate to any page with video content
   - Click the extension icon in the toolbar
   - Use the popup to control video speed

## Architecture

### Core Files

- `manifest.json`: Extension configuration with Manifest V3 format
- `content.js`: Content script that runs on all web pages to find and control video elements
- `popup.html/popup.js`: Extension popup UI for speed control
- `popup.css`: Integrated styling within popup.html

### Key Components

- **VideoSpeedController class** (content.js): Manages video detection and speed control
- **PopupController class** (popup.js): Handles user interface interactions
- **Message passing**: Communication between popup and content script using Chrome extension APIs

### Features

- Automatic video detection on all websites
- Real-time speed adjustment with slider (0.25x to 4x)
- Preset speed buttons for common speeds
- Multi-video support (controls all videos on a page simultaneously)
- Dynamic video detection for content loaded after page load