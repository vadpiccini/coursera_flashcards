#!/bin/bash

# Define the name of the output zip file
OUTPUT_ZIP="CourseraNotes.zip"

# List of patterns to exclude from the zip
EXCLUDE_PATTERNS=(
  "*.git*"
  "*.DS_Store*"
  "README.md"
  "LICENSE"
  ".gitignore"
)

# Start building the zip command with exclusions
ZIP_CMD="zip -r $OUTPUT_ZIP ."

# Add each exclusion pattern to the zip command
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
  ZIP_CMD+=" -x $pattern"
done

# Execute the zip command
eval $ZIP_CMD

echo "Extension zipped as $OUTPUT_ZIP, excluding specified patterns."
