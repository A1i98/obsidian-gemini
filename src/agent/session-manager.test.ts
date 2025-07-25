import { SessionManager } from './session-manager';
import { SessionType } from '../types/agent';

// Import the mocked TFile class
import { TFile } from 'obsidian';

// Mock plugin
const mockPlugin = {
	app: {
		vault: {
			getAbstractFileByPath: jest.fn(),
			createFolder: jest.fn(),
			read: jest.fn()
		},
		metadataCache: {
			getFileCache: jest.fn()
		}
	},
	settings: {
		historyFolder: 'gemini-scribe'
	}
} as any;

// Mock TFile using actual mock class constructor
const mockFile = new TFile();
(mockFile as any).basename = 'test';
(mockFile as any).stat = {
	ctime: Date.now(),
	mtime: Date.now()
};

describe('SessionManager', () => {
	let sessionManager: SessionManager;

	beforeEach(() => {
		sessionManager = new SessionManager(mockPlugin);
		jest.clearAllMocks();
	});

	describe('createAgentSession', () => {
		it('should sanitize file names with forbidden characters', async () => {
			const session = await sessionManager.createAgentSession('Agent: Test Mode');
			
			// Should replace colon with dash
			expect(session.title).toBe('Agent- Test Mode');
			expect(session.historyPath).toContain('Agent- Test Mode.md');
		});

		it('should handle various forbidden characters', async () => {
			const session = await sessionManager.createAgentSession('Test\\File/Name:With*Forbidden?Chars"<>|');
			
			// Should replace all forbidden characters with dashes
			expect(session.title).toBe('Test-File-Name-With-Forbidden-Chars----');
		});

		it('should limit file name length', async () => {
			const longTitle = 'A'.repeat(150);
			const session = await sessionManager.createAgentSession(longTitle);
			
			// Should be limited to 100 characters
			expect(session.title.length).toBeLessThanOrEqual(100);
		});

		it('should normalize whitespace', async () => {
			const session = await sessionManager.createAgentSession('  Test   Multiple   Spaces  ');
			
			// Should normalize multiple spaces to single spaces and trim
			expect(session.title).toBe('Test Multiple Spaces');
		});

		it('should create default title when none provided', async () => {
			const session = await sessionManager.createAgentSession();
			
			// Should create a default title with current date
			expect(session.title).toMatch(/Agent Session/);
			expect(session.type).toBe(SessionType.AGENT_SESSION);
		});
	});

	describe('createNoteChatSession', () => {
		it('should sanitize note chat session titles', async () => {
			const fileWithSpecialChars = {
				...mockFile,
				basename: 'Test:File*Name'
			};

			const session = await sessionManager.createNoteChatSession(fileWithSpecialChars);
			
			// Should sanitize the basename in the title
			expect(session.title).toBe('Test-File-Name Chat');
			expect(session.historyPath).toContain('Test-File-Name Chat.md');
		});

		it('should create note chat session with proper type', async () => {
			const session = await sessionManager.createNoteChatSession(mockFile);
			
			expect(session.type).toBe(SessionType.NOTE_CHAT);
			expect(session.sourceNotePath).toBe(mockFile.path);
			expect(session.context.contextFiles).toContain(mockFile);
		});

		it('should create agent session with context files', async () => {
			const contextFiles = [mockFile];
			const session = await sessionManager.createAgentSession('Test Session', {
				contextFiles: contextFiles
			});
			
			expect(session.context.contextFiles).toEqual(contextFiles);
			expect(session.context.contextFiles).toHaveLength(1);
		});
	});

	describe('getNoteChatSession', () => {
		it('should use sanitized file name when checking for existing history', async () => {
			const fileWithSpecialChars = {
				...mockFile,
				basename: 'Test:File'
			};

			// Mock that no file exists
			mockPlugin.app.vault.getAbstractFileByPath.mockReturnValue(null);

			const session = await sessionManager.getNoteChatSession(fileWithSpecialChars);
			
			// Should have called getAbstractFileByPath with sanitized name
			expect(mockPlugin.app.vault.getAbstractFileByPath).toHaveBeenCalledWith(
				expect.stringContaining('Test-File Chat.md')
			);
		});
	});

	describe('loadSessionFromFile', () => {
		beforeEach(() => {
			// Mock metadataCache for link resolution
			mockPlugin.app.metadataCache = {
				getFirstLinkpathDest: jest.fn(),
				getFileCache: jest.fn()
			};
		});

		it('should parse wikilink format context files when loading session', async () => {
			const mockHistoryFile = {
				path: 'gemini-scribe/Agent-Sessions/test.md',
				basename: 'test',
				stat: { ctime: Date.now(), mtime: Date.now() }
			} as any;

			const frontmatter = {
				session_id: 'test-session',
				type: 'agent-session',
				title: 'Test Session',
				context_files: ['[[Test File]]', '[[Another File]]'],
				context_depth: 3,
				enabled_tools: ['read_only'],
				created: new Date().toISOString(),
				last_active: new Date().toISOString()
			};

			// Mock file reading and metadata
			mockPlugin.app.vault.read.mockResolvedValue('test content');
			mockPlugin.app.metadataCache.getFileCache.mockReturnValue({ frontmatter });
			
			// Create mock TFile instances for link resolution
			const mockTFile1 = new TFile();
			(mockTFile1 as any).basename = 'Test File';
			const mockTFile2 = new TFile();
			(mockTFile2 as any).basename = 'Another File';
			
			// Mock link resolution - ensure it returns TFile instances
			mockPlugin.app.metadataCache.getFirstLinkpathDest
				.mockReturnValueOnce(mockTFile1)
				.mockReturnValueOnce(mockTFile2);

			// Call loadSessionFromFile (accessing private method via bracket notation for testing)
			const session = await (sessionManager as any).loadSessionFromFile(mockHistoryFile);
			
			// Verify that getFirstLinkpathDest was called with the link text
			expect(mockPlugin.app.metadataCache.getFirstLinkpathDest)
				.toHaveBeenCalledWith('Test File', '');
			expect(mockPlugin.app.metadataCache.getFirstLinkpathDest)
				.toHaveBeenCalledWith('Another File', '');
			
			// Verify context files were parsed correctly
			expect(session.context.contextFiles).toHaveLength(2);
		});

		it('should handle old path format for backwards compatibility', async () => {
			const mockHistoryFile = {
				path: 'gemini-scribe/Agent-Sessions/test.md',
				basename: 'test',
				stat: { ctime: Date.now(), mtime: Date.now() }
			} as any;

			const frontmatter = {
				session_id: 'test-session',
				type: 'agent-session',
				title: 'Test Session',
				context_files: ['path/to/file.md'],
				context_depth: 2,
				created: new Date().toISOString(),
				last_active: new Date().toISOString()
			};

			// Mock file reading and metadata
			mockPlugin.app.vault.read.mockResolvedValue('test content');
			mockPlugin.app.metadataCache.getFileCache.mockReturnValue({ frontmatter });
			
			// Create proper TFile instance for old path format
			const mockFileForPath = new TFile();
			(mockFileForPath as any).basename = 'file';
			mockPlugin.app.vault.getAbstractFileByPath.mockReturnValue(mockFileForPath);

			// Call loadSessionFromFile
			const session = await (sessionManager as any).loadSessionFromFile(mockHistoryFile);
			
			// Should fall back to getAbstractFileByPath for non-wikilink format
			expect(mockPlugin.app.vault.getAbstractFileByPath)
				.toHaveBeenCalledWith('path/to/file.md');
			
			// Verify context files were parsed correctly
			expect(session.context.contextFiles).toHaveLength(1);
		});
	});
});