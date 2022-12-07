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

[packages/core/src/notebook.ts:33](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L33)

## Properties

### cells

• **cells**: [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Defined in

[packages/core/src/notebook.ts:28](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L28)

___

### events

• `Protected` **events**: `EventEmitter`

#### Defined in

[packages/core/src/notebook.ts:31](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L31)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/core/src/notebook.ts:26](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L26)

___

### metadata

• **metadata**: `INotebookMetadata`

#### Defined in

[packages/core/src/notebook.ts:29](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L29)

___

### rendermime

• `Readonly` **rendermime**: `IRenderMimeRegistry`

#### Defined in

[packages/core/src/notebook.ts:27](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L27)

___

### session

• `Optional` **session**: [`ThebeSession`](ThebeSession.md)

#### Defined in

[packages/core/src/notebook.ts:30](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L30)

## Accessors

### last

• `get` **last**(): [`IThebeCell`](../interfaces/IThebeCell.md)

#### Returns

[`IThebeCell`](../interfaces/IThebeCell.md)

#### Defined in

[packages/core/src/notebook.ts:78](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L78)

___

### parameters

• `get` **parameters**(): `undefined` \| [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Returns

`undefined` \| [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Defined in

[packages/core/src/notebook.ts:67](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L67)

___

### widgets

• `get` **widgets**(): [`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Returns

[`IThebeCell`](../interfaces/IThebeCell.md)[]

#### Defined in

[packages/core/src/notebook.ts:74](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L74)

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

[packages/core/src/notebook.ts:121](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L121)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/notebook.ts:144](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L144)

___

### detachSession

▸ **detachSession**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/notebook.ts:134](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L134)

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

[packages/core/src/notebook.ts:237](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L237)

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

[packages/core/src/notebook.ts:194](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L194)

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

[packages/core/src/notebook.ts:176](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L176)

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

[packages/core/src/notebook.ts:148](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L148)

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

[packages/core/src/notebook.ts:87](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L87)

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

[packages/core/src/notebook.ts:92](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L92)

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

[packages/core/src/notebook.ts:99](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L99)

___

### lastCell

▸ **lastCell**(): [`IThebeCell`](../interfaces/IThebeCell.md)

#### Returns

[`IThebeCell`](../interfaces/IThebeCell.md)

#### Defined in

[packages/core/src/notebook.ts:104](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L104)

___

### numCells

▸ **numCells**(): `number`

#### Returns

`number`

#### Defined in

[packages/core/src/notebook.ts:83](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L83)

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

[packages/core/src/notebook.ts:109](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L109)

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

[packages/core/src/notebook.ts:114](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L114)

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

[packages/core/src/notebook.ts:41](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L41)

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

[packages/core/src/notebook.ts:53](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/notebook.ts#L53)
