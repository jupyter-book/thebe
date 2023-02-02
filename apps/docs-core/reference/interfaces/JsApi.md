[thebe-core](../README.md) / [Exports](../modules.md) / JsApi

# Interface: JsApi

This file is the main entrypoint for the cjs bundle
For the TS module, use setupThebeCore()

## Table of contents

### Properties

- [connectToBinder](JsApi.md#connecttobinder)
- [connectToJupyter](JsApi.md#connecttojupyter)
- [connectToJupyterLite](JsApi.md#connecttojupyterlite)
- [makeConfiguration](JsApi.md#makeconfiguration)
- [makeEvents](JsApi.md#makeevents)
- [makeServer](JsApi.md#makeserver)
- [setupNotebookFromBlocks](JsApi.md#setupnotebookfromblocks)
- [setupNotebookFromIpynb](JsApi.md#setupnotebookfromipynb)

## Properties

### connectToBinder

• **connectToBinder**: (`config`: [`Config`](../classes/Config.md)) => [`ThebeServer`](../classes/ThebeServer.md)

#### Type declaration

▸ (`config`): [`ThebeServer`](../classes/ThebeServer.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](../classes/Config.md) |

##### Returns

[`ThebeServer`](../classes/ThebeServer.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:27](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/thebe/entrypoint.ts#L27)

___

### connectToJupyter

• **connectToJupyter**: (`config`: [`Config`](../classes/Config.md)) => [`ThebeServer`](../classes/ThebeServer.md)

#### Type declaration

▸ (`config`): [`ThebeServer`](../classes/ThebeServer.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](../classes/Config.md) |

##### Returns

[`ThebeServer`](../classes/ThebeServer.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:28](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/thebe/entrypoint.ts#L28)

___

### connectToJupyterLite

• **connectToJupyterLite**: (`config`: [`Config`](../classes/Config.md)) => [`ThebeServer`](../classes/ThebeServer.md)

#### Type declaration

▸ (`config`): [`ThebeServer`](../classes/ThebeServer.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](../classes/Config.md) |

##### Returns

[`ThebeServer`](../classes/ThebeServer.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:29](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/thebe/entrypoint.ts#L29)

___

### makeConfiguration

• **makeConfiguration**: (`options`: `Partial`<[`CoreOptions`](CoreOptions.md)\>, `events?`: [`ThebeEvents`](../classes/ThebeEvents.md)) => [`Config`](../classes/Config.md)

#### Type declaration

▸ (`options`, `events?`): [`Config`](../classes/Config.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<[`CoreOptions`](CoreOptions.md)\> |
| `events?` | [`ThebeEvents`](../classes/ThebeEvents.md) |

##### Returns

[`Config`](../classes/Config.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:25](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/thebe/entrypoint.ts#L25)

___

### makeEvents

• **makeEvents**: () => [`ThebeEvents`](../classes/ThebeEvents.md)

#### Type declaration

▸ (): [`ThebeEvents`](../classes/ThebeEvents.md)

##### Returns

[`ThebeEvents`](../classes/ThebeEvents.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:24](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/thebe/entrypoint.ts#L24)

___

### makeServer

• **makeServer**: (`config`: [`Config`](../classes/Config.md)) => [`ThebeServer`](../classes/ThebeServer.md)

#### Type declaration

▸ (`config`): [`ThebeServer`](../classes/ThebeServer.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](../classes/Config.md) |

##### Returns

[`ThebeServer`](../classes/ThebeServer.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:26](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/thebe/entrypoint.ts#L26)

___

### setupNotebookFromBlocks

• **setupNotebookFromBlocks**: (`blocks`: [`CodeBlock`](CodeBlock.md)[], `config`: [`Config`](../classes/Config.md)) => [`ThebeNotebook`](../classes/ThebeNotebook.md)

#### Type declaration

▸ (`blocks`, `config`): [`ThebeNotebook`](../classes/ThebeNotebook.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `blocks` | [`CodeBlock`](CodeBlock.md)[] |
| `config` | [`Config`](../classes/Config.md) |

##### Returns

[`ThebeNotebook`](../classes/ThebeNotebook.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:30](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/thebe/entrypoint.ts#L30)

___

### setupNotebookFromIpynb

• **setupNotebookFromIpynb**: (`ipynb`: `INotebookContent`, `config`: [`Config`](../classes/Config.md)) => [`ThebeNotebook`](../classes/ThebeNotebook.md)

#### Type declaration

▸ (`ipynb`, `config`): [`ThebeNotebook`](../classes/ThebeNotebook.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `ipynb` | `INotebookContent` |
| `config` | [`Config`](../classes/Config.md) |

##### Returns

[`ThebeNotebook`](../classes/ThebeNotebook.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:31](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/thebe/entrypoint.ts#L31)
