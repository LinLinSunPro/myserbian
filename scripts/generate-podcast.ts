
import { parseArgs } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import { AuthManager } from '../../NotebookLM/src/auth/auth-manager';
import { SessionManager } from '../../NotebookLM/src/session/session-manager';
import { NotebookLibrary } from '../../NotebookLM/src/library/notebook-library';
import { ContentManager } from '../../NotebookLM/src/content/content-manager';
import { CONFIG } from '../../NotebookLM/src/config';
import { log } from '../../NotebookLM/src/utils/logger';

async function main() {
    const { values } = parseArgs({
        options: {
            dir: { type: 'string' },
            name: { type: 'string' },
        },
    });

    if (!values.dir || !values.name) {
        console.error('Usage: npx tsx scripts/generate-podcast.ts --dir <path> --name <podcast_name>');
        process.exit(1);
    }

    const sourceDir = path.resolve(values.dir);
    const podcastName = values.name;

    if (!fs.existsSync(sourceDir)) {
        console.error(`Error: Directory not found: ${sourceDir}`);
        process.exit(1);
    }

    log.info(`🎙️  Starting Podcast Generation for: ${podcastName}`);
    log.info(`📂 Source Directory: ${sourceDir}`);

    // Initialize Managers
    const authManager = new AuthManager();
    const sessionManager = new SessionManager(authManager);
    const library = new NotebookLibrary();

    try {
        // 1. Create or Get Notebook
        let notebookId = '';
        const existing = library.listNotebooks().find((n) => n.name === podcastName);

        // We need a session to interact with NotebookLM
        // For creation, we might need a generic session first? 
        // Actually, addNotebook logic usually requires a URL or we create a new one via browser
        // For simplicity, let's try to "Auto Discover" if it's a new URL, but we don't have a URL yet.
        // We need to CREATE a notebook. The current tools don't have a simple "create_notebook" method that returns a URL without a source.
        // But we can just start a session and go to the home page to create one?
        // Let's assume we use the "Active" notebook if we can't create one programmatically easily, 
        // OR we just use a specific "Podcast Generator" notebook and keep adding/removing sources?
        // Better: let's use the browser to create a new notebook.

        // Start a session (headless by default, unless debug)
        log.info('🚀 Launching browser session...');
        const session = await sessionManager.getOrCreateSession(); // Start generic session
        const page = session.getPage();
        if (!page) throw new Error('Could not get browser page');

        // Navigate to home to create new notebook
        log.info('Create new notebook...');
        await page.goto('https://notebooklm.google.com/');

        // Click "+ New Notebook"
        const newNotebookBtn = page.locator('.notebook-grid-item-create, button:has-text("New Notebook"), div[role="button"]:has-text("New Notebook")').first();
        await newNotebookBtn.click();
        await page.waitForTimeout(2000); // Wait for redirect

        const notebookUrl = page.url();
        log.info(`✅ Created Notebook: ${notebookUrl}`);

        // Rename the notebook
        const titleInput = page.locator('input.notebook-title'); // Hypothetical selector, might need adjustment
        // Actually, NotebookLM titles are often edited by clicking the header.
        // For now, let's skip renaming and focus on content. We can rename later or manually.

        const contentManager = new ContentManager(page);

        // 2. Upload Files
        const files = fs.readdirSync(sourceDir).filter(f => !f.startsWith('.'));
        log.info(`Found ${files.length} files to upload.`);

        for (const file of files) {
            const filePath = path.join(sourceDir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) continue;

            log.info(`Uploading: ${file}...`);
            try {
                await contentManager.addSource({
                    type: 'file',
                    filePath: filePath
                });
                log.success(`Uploaded: ${file}`);
            } catch (e) {
                log.error(`Failed to upload ${file}: ${e}`);
            }
        }

        // 3. Check for Custom Instructions
        let customInstructions = '';
        const instructionFile = path.join(sourceDir, 'podcast_instructions.txt');
        if (fs.existsSync(instructionFile)) {
            customInstructions = fs.readFileSync(instructionFile, 'utf-8');
            log.info(`Found custom instructions: ${customInstructions.substring(0, 50)}...`);
        }

        // 4. Generate Audio Overview
        log.info('🎧 Generating Audio Overview (Podcast)...');
        const genResult = await contentManager.generateContent({
            type: 'audio_overview',
            customInstructions: customInstructions // Pass this if supported by generateContent
        });

        if (!genResult.success) {
            throw new Error(`Failed to generate podcast: ${genResult.error}`);
        }

        log.success('✅ Podcast generated!');

        // 5. Download
        log.info('⬇️  Downloading Podcast...');
        const outputFile = path.join(sourceDir, `${podcastName}.wav`); // NotebookLM usually exports WAV for audio overview
        const dlResult = await contentManager.downloadContent('audio_overview', outputFile);

        if (dlResult.success && dlResult.filePath) {
            log.success(`🎉 Podcast saved to: ${dlResult.filePath}`);
        } else {
            log.error(`Failed to download: ${dlResult.error}`);
        }

    } catch (error) {
        log.error(`Fatal error: ${error}`);
    } finally {
        // Cleanup? Maybe keep open for debugging
        // await sessionManager.closeAllSessions();
    }
}

main();
