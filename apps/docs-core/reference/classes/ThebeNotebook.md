[thebe-core](../README.md) / [Exports](../modules.md) / ThebeNotebook

# Class: ThebeNotebook

## Table of contents

### Constructors

- [constructor](ThebeNotebook.md#constructor)

### Properties

- [cells](ThebeNotebook.md#cells)
- [events](ThebeNotebook.md#events)
- [id](ThebeNotebook.md#id)
- [metadata](ThebeNotebook.md#metadata)
- [rendermime](ThebeNotebook.md#rendermime)
- [session](ThebeNotebook.md#session)

### Accessors

- [last](ThebeNotebook.md#last)
- [parameters](ThebeNotebook.md#parameters)
- [widgets](ThebeNotebook.md#widgets)

### Methods

- [attachSession](ThebeNotebook.md#attachsession)
- [clear](ThebeNotebook.md#clear)
- [detachSession](ThebeNotebook.md#detachsession)
- [executeAll](ThebeNotebook.md#executeall)
- [executeCells](ThebeNotebook.md#executecells)
- [executeOnly](ThebeNotebook.md#executeonly)
- [executeUpTo](ThebeNotebook.md#executeupto)
- [findCells](ThebeNotebook.md#findcells)
- [getCell](ThebeNotebook.md#getcell)
- [getCellById](ThebeNotebook.md#getcellbyid)
- [lastCell](ThebeNotebook.md#lastcell)
- [numCells](ThebeNotebook.md#numcells)
- [updateParameters](ThebeNotebook.md#updateparameters)
- [waitForKernel](ThebeNotebook.md#waitforkernel)
- [fromCodeBlocks](ThebeNotebook.md#fromcodeblocks)
- [fromIpynb](ThebeNotebook.md#fromipynb)

## Constructors

### constructor

• **new ThebeNotebook**(`id`, `config`, `rendermime?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `config` | [`Config`](Config.md) |
| `rendermime?` | `IRenderMimeRegistry` |

#### Defined in

[packages/core/src/notebook.ts:33](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L33)

## Properties

### cells

• **cells**: [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Defined in

[packages/core/src/notebook.ts:28](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L28)

___

### events

• `Protected` **events**: `EventEmitter`

#### Defined in

[packages/core/src/notebook.ts:31](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L31)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/core/src/notebook.ts:26](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L26)

___

### metadata

• **metadata**: `INotebookMetadata`

#### Defined in

[packages/core/src/notebook.ts:29](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L29)

___

### rendermime

• `Readonly` **rendermime**: `IRenderMimeRegistry`

#### Defined in

[packages/core/src/notebook.ts:27](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L27)

___

### session

• `Optional` **session**: [`ThebeSession`](ThebeSession.md)

#### Defined in

[packages/core/src/notebook.ts:30](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L30)

## Accessors

### last

• `get` **last**(): [`IThebeCell`](../interfaces/IThebeCell.md)

#### Returns

[`IThebeCell`](../interfaces/IThebeCell.md)

#### Defined in

[packages/core/src/notebook.ts:79](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L79)

___

### parameters

• `get` **parameters**(): `undefined` \| [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Returns

`undefined` \| [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Defined in

[packages/core/src/notebook.ts:68](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L68)

___

### widgets

• `get` **widgets**(): [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Returns

[`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Defined in

[packages/core/src/notebook.ts:75](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L75)

## Methods

### attachSession

▸ **attachSession**(`session`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | [`ThebeSession`](ThebeSession.md) |

#### Returns

`void`

#### Defined in

[packages/core/src/notebook.ts:122](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L122)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/notebook.ts:145](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L145)

___

### detachSession

▸ **detachSession**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/notebook.ts:135](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L135)

___

### executeAll

▸ **executeAll**(`stopOnError?`, `preprocessor?`): `Promise`<(``null`` \| `ExecuteReturn`)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `stopOnError` | `boolean` | `false` |
| `preprocessor?` | (`s`: `string`) => `string` | `undefined` |

#### Returns

`Promise`<(``null`` \| `ExecuteReturn`)[]\>

#### Defined in

[packages/core/src/notebook.ts:238](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L238)

___

### executeCells

▸ **executeCells**(`cellIds`, `stopOnError?`, `preprocessor?`): `Promise`<(``null`` \| `ExecuteReturn`)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cellIds` | `string`[] | `undefined` |
| `stopOnError` | `boolean` | `false` |
| `preprocessor?` | (`s`: `string`) => `string` | `undefined` |

#### Returns

`Promise`<(``null`` \| `ExecuteReturn`)[]\>

#### Defined in

[packages/core/src/notebook.ts:195](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L195)

___

### executeOnly

▸ **executeOnly**(`cellId`, `preprocessor?`): `Promise`<``null`` \| `ExecuteReturn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cellId` | `string` |
| `preprocessor?` | (`s`: `string`) => `string` |

#### Returns

`Promise`<``null`` \| `ExecuteReturn`\>

#### Defined in

[packages/core/src/notebook.ts:177](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L177)

___

### executeUpTo

▸ **executeUpTo**(`cellId`, `stopOnError?`, `preprocessor?`): `Promise`<(``null`` \| `ExecuteReturn`)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cellId` | `string` | `undefined` |
| `stopOnError` | `boolean` | `false` |
| `preprocessor?` | (`s`: `string`) => `string` | `undefined` |

#### Returns

`Promise`<(``null`` \| `ExecuteReturn`)[]\>

#### Defined in

[packages/core/src/notebook.ts:149](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L149)

___

### findCells

▸ **findCells**(`tag`): `undefined` \| [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `string` |

#### Returns

`undefined` \| [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Defined in

[packages/core/src/notebook.ts:88](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L88)

___

### getCell

▸ **getCell**(`idx`): [`IThebeCell`](../interfaces/IThebeCell.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `idx` | `number` |

#### Returns

[`IThebeCell`](../interfaces/IThebeCell.md)

#### Defined in

[packages/core/src/notebook.ts:93](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L93)

___

### getCellById

▸ **getCellById**(`id`): `undefined` \| [`IThebeCell`](../interfaces/IThebeCell.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`undefined` \| [`IThebeCell`](../interfaces/IThebeCell.md)

#### Defined in

[packages/core/src/notebook.ts:100](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L100)

___

### lastCell

▸ **lastCell**(): [`IThebeCell`](../interfaces/IThebeCell.md)

#### Returns

[`IThebeCell`](../interfaces/IThebeCell.md)

#### Defined in

[packages/core/src/notebook.ts:105](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L105)

___

### numCells

▸ **numCells**(): `number`

#### Returns

`number`

#### Defined in

[packages/core/src/notebook.ts:84](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L84)

___

### updateParameters

▸ **updateParameters**(`newSource`, `interpolate?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `newSource` | `string` | `undefined` |
| `interpolate` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[packages/core/src/notebook.ts:110](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L110)

___

### waitForKernel

▸ **waitForKernel**(`kernel`): `Promise`<[`ThebeSession`](ThebeSession.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `kernel` | `Promise`<[`ThebeSession`](ThebeSession.md)\> |

#### Returns

`Promise`<[`ThebeSession`](ThebeSession.md)\>

#### Defined in

[packages/core/src/notebook.ts:115](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L115)

___

### fromCodeBlocks

▸ `Static` **fromCodeBlocks**(`blocks`, `config`): [`ThebeNotebook`](ThebeNotebook.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `blocks` | [`CodeBlock`](../interfaces/CodeBlock.md)[] |
| `config` | [`Config`](Config.md) |

#### Returns

[`ThebeNotebook`](ThebeNotebook.md)

#### Defined in

[packages/core/src/notebook.ts:41](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L41)

___

### fromIpynb

▸ `Static` **fromIpynb**(`ipynb`, `config`, `rendermime?`): [`ThebeNotebook`](ThebeNotebook.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ipynb` | `INotebookContent` |
| `config` | [`Config`](Config.md) |
| `rendermime?` | `IRenderMimeRegistry` |

#### Returns

[`ThebeNotebook`](ThebeNotebook.md)

#### Defined in

[packages/core/src/notebook.ts:54](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/notebook.ts#L54)
