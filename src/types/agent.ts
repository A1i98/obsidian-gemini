import { TFile } from 'obsidian';

/**
 * Tool categories that can be enabled/disabled for an agent
 */
export enum ToolCategory {
	READ_ONLY = 'read_only',           // Search, read files, analyze
	VAULT_OPERATIONS = 'vault_ops',     // Create, modify, delete notes
	EXTERNAL_MCP = 'external_mcp',      // MCP server integrations
	SYSTEM = 'system'                   // System operations
}

/**
 * Actions that require user confirmation
 */
export enum DestructiveAction {
	MODIFY_FILES = 'modify_files',
	CREATE_FILES = 'create_files', 
	DELETE_FILES = 'delete_files',
	EXTERNAL_API_CALLS = 'external_calls'
}

/**
 * Configuration for agent context and capabilities
 */
export interface AgentContext {
	/** Files to include in the conversation context */
	contextFiles: TFile[];
	
	/** How deep to traverse linked files (0 = no links, 1 = direct links, etc.) */
	contextDepth: number;
	
	/** Tool categories enabled for this agent session */
	enabledTools: ToolCategory[];
	
	/** Actions that require user confirmation */
	requireConfirmation: DestructiveAction[];
	
	/** Maximum total characters to include from context files */
	maxContextChars?: number;
	
	/** Maximum characters per individual file */
	maxCharsPerFile?: number;
}

/**
 * Types of chat sessions
 */
export enum SessionType {
	NOTE_CHAT = 'note-chat',           // Traditional note-centric conversation
	AGENT_SESSION = 'agent-session'    // Multi-context agent conversation
}

/**
 * A chat session with full context and history
 */
export interface ChatSession {
	/** Unique identifier for this session */
	id: string;
	
	/** Type of session */
	type: SessionType;
	
	/** Display title for the session */
	title: string;
	
	/** Agent context configuration */
	context: AgentContext;
	
	/** When this session was created */
	created: Date;
	
	/** Last time this session was active */
	lastActive: Date;
	
	/** File path where this session's history is stored */
	historyPath: string;
	
	/** For note-chat sessions, the source note path */
	sourceNotePath?: string;
}

/**
 * Message within a chat session
 */
export interface ChatMessage {
	/** Unique message ID */
	id: string;
	
	/** Message role */
	role: 'user' | 'assistant' | 'system';
	
	/** Message content */
	content: string;
	
	/** Timestamp */
	timestamp: Date;
	
	/** Tools used in this message (for assistant messages) */
	toolsUsed?: ToolExecution[];
	
	/** Context that was active when this message was sent */
	contextSnapshot?: {
		files: string[];  // File paths
		depth: number;
	};
}

/**
 * Information about a tool execution
 */
export interface ToolExecution {
	/** Tool name/identifier */
	name: string;
	
	/** Tool category */
	category: ToolCategory;
	
	/** Parameters passed to the tool */
	parameters: Record<string, unknown>;
	
	/** Tool execution result */
	result?: unknown;
	
	/** Any error that occurred */
	error?: string;
	
	/** Whether user confirmation was required/given */
	confirmationRequired?: boolean;
	confirmationGiven?: boolean;
}

/**
 * Default agent contexts for different use cases
 */
export const DEFAULT_CONTEXTS = {
	NOTE_CHAT: {
		contextFiles: [], // Will be set to current file
		contextDepth: 2,
		enabledTools: [ToolCategory.READ_ONLY],
		requireConfirmation: [],
		maxContextChars: 50000,
		maxCharsPerFile: 10000
	} as Omit<AgentContext, 'contextFiles'>,
	
	AGENT_SESSION: {
		contextFiles: [],
		contextDepth: 3,
		enabledTools: [ToolCategory.READ_ONLY, ToolCategory.VAULT_OPERATIONS],
		requireConfirmation: [DestructiveAction.MODIFY_FILES, DestructiveAction.CREATE_FILES, DestructiveAction.DELETE_FILES],
		maxContextChars: 100000,
		maxCharsPerFile: 15000
	} as AgentContext
} as const;