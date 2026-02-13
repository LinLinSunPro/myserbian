---
description: Generate a podcast from a local folder using NotebookLM
---

# NotebookLM Podcast Generation Workflow

This workflow describes the process of turning a folder of documents into an audio podcast.

## 1. Prepare Content

Ensure your source directory (e.g., `e:\Antigravity\Serbian`) contains the text files, PDFs, or markdown files you want to be discussed.

## 2. Generate Podcast

Run the generator script targeting your folder.

```bash
cd e:\Antigravity\NotebookLM
npx tsx scripts/generate-podcast.ts --dir "e:\Antigravity\Serbian" --name "Serbian Deep Dive"
```

## 3. (Optional) Customize

If you want to control the conversation style, add a `podcast_instructions.txt` file to your source folder. The script will look for this file and pass its contents as custom instructions to NotebookLM.

## 4. Retrieve Audio

The generated MP3 file will be saved back into your source directory (e.g., `e:\Antigravity\Serbian\Serbian Deep Dive.mp3`).
