---

# LRC Generator

**LRC Generator** is a user-friendly web application that allows users to paste lyrics, synchronize them with audio playback, and download the synchronized lyrics as an `.lrc` file. This project is built with **React**, featuring a modern UI styled using **Tailwind CSS**, state management powered by **Zustand**, and audio handling implemented with **Howler.js**.

## Features

- **Paste Lyrics**: Easily paste song lyrics into the application.
- **Sync Lyrics**: Synchronize lyrics with audio playback in real time.
- **Download LRC**: Export synchronized lyrics as an `.lrc` file for use with media players.

## Technologies Used

- **React**: For building the user interface.
- **Tailwind CSS**: For styling the application with a modern, responsive design.
- **Zustand**: Lightweight state management.
- **Howler.js**: Audio playback and controls.

## Preview

![Screenshot of LRC Generator](/screenshot/image.png)

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alien501/lrc-generator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd lrc-generator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the application in your browser at `http://localhost:5173`.

## Current Limitations

- Editing synchronized lyrics after initial sync is not yet supported.
- UI may require further improvements for better accessibility and aesthetics.
- Existing `.lrc` file synchronization is not backward-compatible in this release.

## To-Do (Upcoming Features)

1. **Edit Functionality**: Add the ability to edit synchronized lyrics.
2. **Backward Compatibility**: Support syncing existing `.lrc` files.
3. **UI Enhancements**: Improve the user interface for a better user experience.

## Contributing

Contributions are welcome! If you’d like to improve the application or address existing issues, feel free to fork the repository and submit a pull request.

## Feedback

If you encounter any issues or have suggestions for improvement, please open an issue in the repository or reach out to the developer.

## License

This project is licensed under the [MIT License](LICENSE).

---

This README reflects your project's current state and outlines plans for future improvements. Let me know if you'd like to tweak any section!