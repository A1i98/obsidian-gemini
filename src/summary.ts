import ObsidianGemini from '../main';
import { GeminiPrompts } from './prompts';
import { ModelRequest } from './api';

export class GeminiSummary {
	private plugin: ObsidianGemini;
	private prompts: GeminiPrompts;

	constructor(plugin: ObsidianGemini) {
		this.plugin = plugin;
		this.prompts = new GeminiPrompts();
	}

	async summarizeActiveFile() {
		const fileContent = await this.plugin.gfile.getCurrentFileContent(0, true);
		if (fileContent) {
			let request: ModelRequest = {
				model: this.plugin.settings.summaryModelName,
				prompt: this.prompts.summaryPrompt({ content: fileContent }),
			};
			const summary =
				await this.plugin.geminiApi.generateModelResponse(request);
			this.plugin.gfile.addToFrontMatter(
				this.plugin.settings.summaryFrontmatterKey,
				summary.markdown
			);
		} else {
			console.error('Failed to get file content for summary.');
		}
	}

	async setupSummarizaitonCommand() {
		this.plugin.addCommand({
			id: 'summarize-active-file',
			name: 'Summarize Active File',
			callback: () => this.summarizeActiveFile(),
		});
	}
}
