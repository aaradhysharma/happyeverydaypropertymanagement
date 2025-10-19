# Test Perplexity Simple

A simple test application to verify Perplexity API integration with a button that fetches top counties by population and displays them in a table and graph.

## Features

- Simple button interface
- Fetches top counties by population data
- Displays data in a table format
- Shows population data in a bar chart
- Version number display (v0.0.1)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click the "Get Top Counties" button
2. Wait for the data to load
3. View the results in both table and chart format

## Structure

- `app/page.tsx` - Main page with button and display components
- `app/api/counties/route.ts` - API endpoint that returns county data
- `app/layout.tsx` - Layout with version number display

## Version

Current version: 0.0.1

