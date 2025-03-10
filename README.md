# Noter - A Simple Note Taking App

A minimalist note-taking application built with Next.js that uses localStorage for data persistence.

## Features

- Create notes with timestamps
- Delete notes
- Persistent storage using browser's localStorage
- Clean and responsive UI using Tailwind CSS
- Client-side rendering with React hooks

## Technical Implementation

The app uses:
- Next.js 13+ with App Router
- React Hooks (useState, useEffect)
- localStorage for data persistence
- Tailwind CSS for styling
- TypeScript for type safety

## How It Works

1. Notes are stored as key-value pairs where:
   - Key: The note text
   - Value: Timestamp when the note was created

2. Data Persistence:
   - Notes are saved to localStorage whenever the data changes
   - Notes are loaded from localStorage when the app mounts

3. User Interface:
   - Input field at the bottom for creating new notes
   - Press Enter to add a new note
   - Click the X button to delete a note
   - Responsive design that works on all screen sizes

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- Type your note in the input field and press Enter to save
- Click the X button next to any note to delete it
- Notes persist even after browser refresh
