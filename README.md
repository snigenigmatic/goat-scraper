# GOATScraper 🐐

Automatically download course materials (slides, PDFs) from PESU Academy.

## Features

- Fuzzy search through 16,000+ courses using `fzf`
- Batch download all materials for a course
- Organized directory structure by units
- Login with credentials from `.env` file
- Interactive mode for selective downloads

## Installation

```bash
# Install fzf (required for fuzzy search)
brew install fzf

# Install dependencies
uv sync
```

## Usage

### Setup credentials

Create a `.env` file with your PESU Academy credentials:

```bash
PESU_USERNAME=your_srn_here
PESU_PASSWORD=your_password_here
```

### Run the fetcher

```bash
uv run main.py -c COURSE_CODE
```

### Workflow

1. **Select a course** - Search through all available courses using fzf
2. **Choose download mode**:
  - Option 1: Batch download ALL materials (recommended)
  - Option 2: Interactive - select specific unit/class
3. **Wait** - PDFs are automatically downloaded and organized

### Output Structure

```
course_20972/
  unit_1/
   01_Introduction.pdf
   02_Parser.pdf
   03_Lexical_Analysis.pdf
   ...
  unit_2/
   01_...pdf
   ...
  units.json
  unit_*_classes.json
```

## How it Works

The script uses the following PESU Academy API endpoints:

1. `/Academy/a/g/getSubjectsCode` - Get all course codes
2. `/Academy/a/i/getCourse/[course_id]` - Get units for a course
3. `/Academy/a/i/getCourseClasses/[unit_id]` - Get classes in a unit
4. `/Academy/s/studentProfilePESUAdmin` - Get PDF download links
5. `/Academy/a/referenceMeterials/downloadslidecoursedoc/[id]` - Download PDF

All data is saved to JSON files for reference.

## Usage Warning

- FOR ACADEMIC AND EDUCATIONAL USE ONLY
- The author is not responsible for misuse or violations resulting from improper use of this software.

## Credits

Akshaj my 🐐