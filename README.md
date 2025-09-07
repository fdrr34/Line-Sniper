# LineSniper

![LineSniper Logo](icon.png)

LineSniper is a powerful Chrome extension designed for frontend developers and designers. It allows you to add draggable lines and points directly onto any webpage, calculate precise pixel distances between elements, and manage them easily through a user-friendly popup interface. Perfect for layout measurements, debugging designs, and ensuring pixel-perfect alignments.

Whether you're sniping exact positions or measuring distances like a pro, LineSniper makes frontend work faster and more accurate.

## Features

- **Add Lines**: Insert horizontal or vertical lines with customizable color and width.
- **Add Points**: Place draggable points with customizable color.
- **Multiple Lines**: Quickly add batches of lines (e.g., 5 at once).
- **Draggable Elements**: Easily reposition lines and points by dragging and dropping.
- **Distance Calculation**: Select two elements and calculate the pixel distance between them (supports horizontal/vertical lines and Euclidean distance for points/mixed).
- **Elements List**: View, select, and manage added elements in the popup, with individual delete buttons and bulk deletion via checkboxes.
- **Clear All**: Remove all added elements with one click.
- **Persistence**: Elements stay on the page until cleared or the page is reloaded.
- **User-Friendly UI**: Clean popup with a light blue theme, rounded corners, and intuitive controls.

## Installation

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right.
4. Click "Load unpacked" and select the folder containing the extension files (including `manifest.json`, `popup.html`, `popup.js`, `content.js`, and `image.png` for the logo/icon).
5. The extension should now appear in your toolbar. Click the icon to open the popup on any webpage.

**Note**: This extension requires permissions for `activeTab` and `scripting` to inject and manage elements on the page.

## Usage

1. Click the LineSniper icon in your Chrome toolbar to open the popup.
2. **Add a Line**:
   - Choose type (horizontal/vertical), color, and width.
   - Click "Add Line" or "Add Multiple Lines (5)".
3. **Add a Point**:
   - Choose color and click "Add Point".
4. **Manage Elements**:
   - View the list in the popup.
   - Check boxes to select, then "Delete Selected" or use individual "Delete" buttons.
   - "Clear All" to remove everything.
5. **Calculate Distance**:
   - Select exactly two elements via checkboxes.
   - Click "Calculate Distance" to see the result in an alert.
6. Drag lines or points on the webpage to reposition them.

Elements are added to random positions initially—drag them where needed. Test on simple webpages like google.com for best results. If issues occur (e.g., on restricted pages), check the browser console for errors.

## Screenshots

*(Add screenshots here if available, e.g., popup interface or lines on a webpage.)*

## Development and Debugging

- **Files Overview**:
  - `manifest.json`: Extension configuration.
  - `popup.html`: UI for the popup.
  - `popup.js`: Logic for popup interactions and messaging.
  - `content.js`: Injected script for adding/managing elements on the page.
  - `image.png`: Logo/icon (used in manifest and README).

- **Testing**: Reload the extension in `chrome://extensions/` after changes. Use the browser console (Inspect > Console) to debug.

- **Known Limitations**:
  - Elements reset on page reload.
  - May not work on Chrome internal pages (e.g., chrome://) due to security restrictions.
  - Distance calculation assumes simple positioning; complex page layouts might affect accuracy.

## Contributing

Contributions are welcome! Fork the repo, make your changes, and submit a pull request. For major changes, open an issue first to discuss.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for frontend snipers everywhere!
