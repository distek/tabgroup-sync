import * as vscode from "vscode";

export async function activate(context: vscode.ExtensionContext) {
	let lastLength = vscode.window.tabGroups.activeTabGroup.tabs.length;
	let lastActiveGroup = {} as vscode.TabGroup;
	let splitCount = vscode.window.tabGroups.all.length;
	const sleepTime = 100;

	for (;;) {
		const activeGroup = vscode.window.tabGroups.activeTabGroup;

		// We opened a new split
		if (splitCount < vscode.window.tabGroups.all.length) {
			const uris = getURIsGroup(lastActiveGroup);

			for (let j = 0; j < uris.length; j++) {
				vscode.window.showTextDocument(uris[j], {
					preserveFocus: true,
					preview: false,
					viewColumn: activeGroup.viewColumn,
				});
			}

			splitCount = vscode.window.tabGroups.all.length;

			lastLength = activeGroup.tabs.length;

			lastActiveGroup = vscode.window.tabGroups.activeTabGroup;

			await sleep(sleepTime);

			continue;
		}

		if (activeGroup.tabs.length == lastLength) {
			lastActiveGroup = vscode.window.tabGroups.activeTabGroup;
			await sleep(sleepTime);

			continue;
		} else if (activeGroup.tabs.length > lastLength) {
			// New tab
			for (let i = 0; i < vscode.window.tabGroups.all.length; i++) {
				const uris = getURIsGroup(activeGroup);

				if (vscode.window.tabGroups.all[i].isActive) {
					continue;
				}

				const lastTab = vscode.window.tabGroups.all[i].activeTab
					?.input as vscode.TabInputText;

				for (let j = 0; j < uris.length; j++) {
					vscode.window.showTextDocument(uris[j], {
						preserveFocus: true,
						preview: false,
						viewColumn: vscode.window.tabGroups.all[i].viewColumn,
					});
				}

				vscode.window.showTextDocument(lastTab.uri, {
					preserveFocus: true,
					preview: false,
					viewColumn: vscode.window.tabGroups.all[i].viewColumn,
				});
			}
		} else if (activeGroup.tabs.length < lastLength) {
			// Closed tab
			const uris = getURIsGroup(activeGroup);

			const groups = vscode.window.tabGroups.all.filter(
				(group) => group !== activeGroup
			);

			for (let i = 0; i < groups.length; i++) {
				for (let k = 0; k < groups[i].tabs.length; k++) {
					const thisInput = groups[i].tabs[k]
						.input as vscode.TabInputText;
					if (!existsInArray(uris, thisInput.uri.path)) {
						const lastTab =
							vscode.window.tabGroups.all[i].activeTab;
						const inp = lastTab?.input as vscode.TabInputText;

						let doFocus = inp === groups[i].tabs[k].input;

						vscode.window.tabGroups.close(groups[i].tabs[k], true);

						if (doFocus) {
							vscode.window.showTextDocument(inp.uri);
						}
					}
				}
			}
		}

		lastLength = activeGroup.tabs.length;
		lastActiveGroup = vscode.window.tabGroups.activeTabGroup;

		await sleep(sleepTime);
	}
}

function getURIsGroup(group: vscode.TabGroup): vscode.Uri[] {
	const uris = [] as vscode.Uri[];
	for (let i = 0; i < group.tabs.length; i++) {
		const input = group.tabs[i].input as vscode.TabInputText;
		uris.push(input.uri);
	}

	return uris;
}

function existsInArray(arr: vscode.Uri[], item: string): boolean {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].path == item) {
			return true;
		}
	}

	return false;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
