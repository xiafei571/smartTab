# smartTab

smartTab is a Chrome extension designed to enhance tab management, providing users with efficient tools to save, restore, and organize their browsing sessions.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/xiafei571/smartTab.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" (top right corner).
4. Click "Load unpacked" and select the smartTab directory.

## Features

1. **Automatic Tab Saving**: Easily tidy up all your currently open tabs with a single click
2. **Tab Restoration**: Easily reopen previously closed tabs.
3. **Organized Tab List**: View closed tabs in a clean, organized list.
4. **Individual Tab Deletion**: Remove specific tabs from the saved list.
5. **Bulk Clear Option**: Clear all saved tabs at once.
6. **Expanded View**: Access a full-window view of all closed tabs.

## Project Structure

- `manifest.json`: Extension configuration and permissions.
- `background.js`: Background processes for tab management and storage.
- `popup.html` & `popup.js`: Main extension interface and its functionality.
- `closed_tabs.html` & `closed_tabs.js`: Full-page view of closed tabs and its logic.

## Usage Guide

1. Install smartTab in Chrome.
2. Click the smartTab icon to access recently closed tabs.
3. Click on a listed tab to reopen it.
4. Remove individual tabs using the "clear" button.

## Contributing

We welcome contributions to improve smartTab. Feel free to submit pull requests or open issues for enhancements or bug reports.

## License

This project is licensed under the [MIT License](LICENSE).
