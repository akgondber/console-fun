const snippet = `
import joinPath from '../Components/Functions/path/joinPath';
import dirname from '../Components/Functions/path/dirname';
import FileMetaData from '../Typings/fileMetaData';
import isTauri from '../Util/is-tauri';
import { CALCULATE_DIRS_SIZE_ENDPOINT, CHECK_EXIST_ENDPOINT, CHECK_ISDIR_ENDPOINT, OPEN_FILE_ENDPOINT } from '../Util/constants';

/** Invoke Rust command to handle files */
class FileAPI {
	readonly fileName: string | string[];
	readonly parentDir: string;
	/**
	 * Construct FileAPI Class
	 * @param {string} fileName - Your file path
	 * @param {string} parentDir - Parent directory of the file
	 */
	constructor(fileName: string | string[], parentDir?: string) {
		if (parentDir && typeof fileName === 'string') {
			this.parentDir = parentDir;
			this.fileName = joinPath(parentDir, fileName);
		} else this.fileName = fileName;
	}
	/**
	 * Read text file
	 * @returns {Promise<any>}
	 */
	readFile(): Promise<string> {
		return new Promise((resolve, reject) => {
			if (typeof this.fileName === 'string') {
				if (isTauri) {
					const { fs } = require('@tauri-apps/api');
					fs.readTextFile(this.fileName).then((fileContent: string) => resolve(fileContent));
				} else {
					reject('Read file is currently not supported on web version');
				}
			} else {
				reject('File name is not a string');
			}
		});
	}

	async readBuffer(): Promise<Buffer> {
		const Buffer = require('buffer/').Buffer;
		return new Promise((resolve, reject) => {
			if (typeof this.fileName === 'string') {
				if (isTauri) {
					const { fs } = require('@tauri-apps/api');
					resolve(Buffer.from(fs.readBinaryFile(this.fileName).then((fileContent: string) => fileContent)));
				} else {
					reject('Read file is currently not supported on web version');
				}
			}
		});
	}
	/**
	 * Open file on default app
	 * @returns {Promise<void>}
	 */
	async openFile(): Promise<void> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			return await invoke('open_file', { filePath: this.fileName });
		} else {
			await fetch(OPEN_FILE_ENDPOINT + this.fileName, { method: 'GET' });
			return;
		}
	}
	/**
	 * Get tauri url of local assets
	 * @returns {string}
	 */
	readAsset(): string {
		if (isTauri) {
			const { tauri } = require('@tauri-apps/api');
			return typeof this.fileName === 'string' ? tauri.convertFileSrc(this.fileName) : '';
		}
	}
	/**
	 * Read file and return as JSON
	 * @returns {Promise<JSON>}
	 */
	async readJSONFile(): Promise<JSON> {
		const content = await this.readFile();
		return JSON.parse(content);
	}

	/**
	 * Return true if file exist
	 * @returns {boolean}
	 */
	async exists(): Promise<boolean> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			return await invoke('file_exist', { filePath: this.fileName });
		} else {
			const exists = await (await fetch(CHECK_EXIST_ENDPOINT + this.fileName, { method: 'GET' })).json();
			return exists;
		}
	}
	/**
	 * Create file if it doesn't exist
	 * @returns {Promise<void>}
	 */
	async createFile(): Promise<void> {
		if (typeof this.fileName === 'string') {
			if (isTauri) {
				const { invoke } = require('@tauri-apps/api');
				await invoke('create_dir_recursive', {
					dirPath: dirname(this.fileName),
				});
				return await invoke('create_file', { filePath: this.fileName });
			} else {
				return;
			}
		}
	}
	/**
	 * Read properties of a file
	 * @returns {Promise<FileMetaData>}
	 */
	async properties(): Promise<FileMetaData> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			return await invoke('get_file_properties', { filePath: this.fileName });
		}
	}

	/**
	 * Check if given path is directory
	 * @returns {Promise<boolean>}
	 */
	async isDir(): Promise<boolean> {
		return new Promise((resolve) => {
			if (isTauri) {
				const { invoke } = require('@tauri-apps/api');
				invoke('is_dir', { path: this.fileName }).then((result: boolean) => resolve(result));
			} else {
				fetch(CHECK_ISDIR_ENDPOINT + this.fileName, { method: 'GET' })
					.then((response) => response.json())
					.then((result: boolean) => resolve(result));
			}
		});
	}

	/**
	 * Extract icon of executable file
	 * @returns {Promise<string>}
	 */
	async extractIcon(): Promise<string> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			return await invoke('extract_icon', { filePath: this.fileName });
		}
	}

	/**
	 * Calculate total size of given file paths
	 * @returns {number} - Size in bytes
	 */
	async calculateFilesSize(): Promise<number> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			return await invoke('calculate_files_total_size', { files: this.fileName });
		} else {
			const paths = Array.isArray(this.fileName) ? this.fileName.join('%2c-%2c') : this.fileName;
			console.log(paths);
			const size = await (await fetch(CALCULATE_DIRS_SIZE_ENDPOINT + paths, { method: 'GET' })).json();
			return size;
		}
	}

	/**
	 * Compress file(s) to zip file
	 * @returns {Promise<void>}
	 */
	async zip(): Promise<void> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			return await invoke('compress_to_zip', { files: typeof this.fileName === 'string' ? [this.fileName] : this.fileName });
		}
		return;
	}

	/**
	 * Extract zip file
	 * @param {string} target_dir - Target directory to extract files
	 * @returns {any}
	 */
	async unzip(target_dir: string): Promise<void> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			return await invoke('decompress_from_zip', { zipPath: this.fileName, targetDir: target_dir });
		}
		return;
	}
}

export default FileAPI;`;

const snippet2 = `
import isTauri from '../Util/is-tauri';
import DirectoryAPI from './directory';
/**
 * Invoke Rust command to operate files/dirs
 */
class OperationAPI {
	private src: string;
	private dest: string;
	constructor(src: string, dest?: string) {
		this.src = src;
		this.dest = dest;
	}
	/**
	 * Copy files/dirs
	 * @returns {Promise<void>}
	 */
	async copyFile(): Promise<void> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			return await invoke('copy', { src: this.src, dest: this.dest });
		}
	}
	/**
	 * Rename file/dir
	 * @returns {any}
	 */
	async rename(): Promise<void> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');

			return await invoke('rename', { path: this.src, newPath: this.dest });
		}
	}

	async cut(): Promise<void> {
		await this.copyFile();
		await this.unlink();
		return;
	}

	/**
	 * Unlink files/dirs
	 * @returns {Promise<void>}
	 */
	async unlink(): Promise<void> {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			if (await new DirectoryAPI(this.src).isDir()) {
				return await invoke('remove_dir', { path: this.src });
			} else {
				return await invoke('remove_file', { path: this.src });
			}
		}
	}

	async duplicate(): Promise<void> {
		this.dest =
			this.src.split('.').length > 1 ? this.src.split('.').slice(0, -1) + ' - COPY.' + this.src.split('.').slice(-1) : this.src + ' - COPY';
		return await this.copyFile();
	}
}
export default OperationAPI;    
`;

const snippet3 = `
import isTauri from '../Util/is-tauri';

/**
 * Write text into clipboard
 * @param {string} text - Text you want to write to clipboard
 * @returns {void}
 */
const writeTextToClipboard = async (text: string): Promise<void> => {
	if (isTauri) {
		const { clipboard } = require('@tauri-apps/api');
		return await clipboard.writeText(text);
	} else {
		return await navigator.clipboard.writeText(text);
	}
};

/**
 * Read clipboard text
 * @returns {Promise<string>}
 */
const readTextFromClipboard = async (): Promise<string> => {
	if (isTauri) {
		const { clipboard } = require('@tauri-apps/api');
		return await clipboard.readText();
	} else {
		return await navigator.clipboard.readText();
	}
};
export { writeTextToClipboard, readTextFromClipboard };
`;

const snippet4 = `
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import isTauri from '../Util/is-tauri';
import IStorageData from '../Typings/storageData';

// Store fetched data into variable
const data: IStorageData = {};
/**
 * Set information to local storage
 * @param {string} key - Information key
 * @param {any} data - Your data
 * @returns {Promise<void>}
 */
const set = async (key: string, value: any): Promise<void> => {
	if (isTauri) {
		data[key] = value;
		const { invoke } = require('@tauri-apps/api');
		return await invoke('write_data', { key, value });
	} else {
		data[key] = value;
		localStorage.setItem(key, JSON.stringify(value));
	}
};

/**
 * Get information from local storage
 * @param {string} key - Information key
 * @param {boolean} force - Force fetcing the latest data
 * @returns {Promise<any>} - Your data
 */
const get = async (key: string, force?: boolean): Promise<any> => {
	interface returnedType {
		status: boolean;
		data: JSON;
	}
	if (Object.keys(data).includes(key) && !force) {
		return data[key];
	} else {
		if (isTauri) {
			const { invoke } = require('@tauri-apps/api');
			const returnedData = (await invoke('read_data', { key })) as returnedType;
			data[key] = returnedData.data;
			return returnedData.status ? returnedData.data : {};
		} else {
			const storedData = localStorage.getItem(key);
			if (storedData) {
				data[key] = JSON.parse(storedData);
				return data[key];
			} else {
				return {};
			}
		}
	}
};

/**
 * Remove a data
 * @param {string} key
 * @returns {any}
 */
const remove = async (key: string): Promise<void> => {
	if (isTauri) {
		const { invoke } = require('@tauri-apps/api');
		await invoke('delete_storage_data', { key });
	} else {
		localStorage.removeItem(key);
	}
};

export default { get, set, remove };
`;

const snippets = [snippet, snippet2, snippet3, snippet4];

export { snippets };
