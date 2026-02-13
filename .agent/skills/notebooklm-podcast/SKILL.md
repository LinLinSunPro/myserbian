# NotebookLM Podcast Generation Skill

This skill automates the creation of "Audio Overviews" (Podcasts) from local directories by interfacing with the NotebookLM MCP server.

## Purpose

To turn any folder of documents (PDFs, TXT, MD) into a high-quality AI-generated podcast episode discussing the contents.

## Implementation Details

This skill relies on a script located in `e:\Antigravity\Serbian\scripts\generate-podcast.ts` (which we will create).

## Prerequisites

- The `notebooklm-mcp` server must be running.
- Authentication must be set up via `setup_auth`.

## Usage

Run the following command in your terminal from the `Serbian` directory:

```bash
npx tsx scripts/generate-podcast.ts --dir "e:\Antigravity\Serbian" --name "Serbian Lesson 1"
```

## Configuration (per-folder)

You can place a `podcast.yaml` file in any folder to define specific instructions for that folder's podcast:

```yaml
name: "Project Alpha Weekly Update"
instructions: "Focus deeply on the budget section. Be skeptical."
```
