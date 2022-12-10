[thebe-core](../README.md) / [Exports](../modules.md) / ThebeCell

# Class: ThebeCell

## Hierarchy

- [`PassiveCellRenderer`](PassiveCellRenderer.md)

  ↳ **`ThebeCell`**

## Implements

- [`IThebeCell`](../interfaces/IThebeCell.md)

## Table of contents

### Constructors

- [constructor](ThebeCell.md#constructor)

### Properties

- [area](ThebeCell.md#area)
- [busy](ThebeCell.md#busy)
- [events](ThebeCell.md#events)
- [id](ThebeCell.md#id)
- [metadata](ThebeCell.md#metadata)
- [model](ThebeCell.md#model)
- [notebookId](ThebeCell.md#notebookid)
- [rendermime](ThebeCell.md#rendermime)
- [session](ThebeCell.md#session)
- [source](ThebeCell.md#source)

### Accessors

- [isAttached](ThebeCell.md#isattached)
- [isAttachedToDOM](ThebeCell.md#isattachedtodom)
- [isBusy](ThebeCell.md#isbusy)
- [outputs](ThebeCell.md#outputs)
- [tags](ThebeCell.md#tags)

### Methods

- [attachSession](ThebeCell.md#attachsession)
- [attachToDOM](ThebeCell.md#attachtodom)
- [clear](ThebeCell.md#clear)
- [clearOnError](ThebeCell.md#clearonerror)
- [detachSession](ThebeCell.md#detachsession)
- [execute](ThebeCell.md#execute)
- [render](ThebeCell.md#render)
- [setAsBusy](ThebeCell.md#setasbusy)
- [setAsIdle](ThebeCell.md#setasidle)
- [setOutputText](ThebeCell.md#setoutputtext)
- [fromICodeCell](ThebeCell.md#fromicodecell)

## Constructors

### constructor

• **new ThebeCell**(`id`, `notebookId`, `source`, `config`, `metadata?`, `rendermime?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `notebookId` | `string` |
| `source` | `string` |
| `config` | [`Config`](Config.md) |
| `metadata` | [`JsonObject`](../modules.md#jsonobject) |
| `rendermime?` | `IRenderMimeRegistry` |

#### Overrides

[PassiveCellRenderer](PassiveCellRenderer.md).[constructor](PassiveCellRenderer.md#constructor)

#### Defined in

[packages/core/src/cell.ts:20](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L20)

## Properties

### area

• `Protected` **area**: `OutputArea`

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[area](PassiveCellRenderer.md#area)

#### Defined in

[packages/core/src/passive.ts:13](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L13)

___

### busy

• `Protected` **busy**: `boolean`

#### Defined in

[packages/core/src/cell.ts:17](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L17)

___

### events

• `Protected` **events**: `EventEmitter`

#### Defined in

[packages/core/src/cell.ts:18](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L18)

___

### id

• `Readonly` **id**: `string`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[id](../interfaces/IThebeCell.md#id)

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[id](PassiveCellRenderer.md#id)

#### Defined in

[packages/core/src/passive.ts:10](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L10)

___

### metadata

• **metadata**: [`JsonObject`](../modules.md#jsonobject)

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[metadata](../interfaces/IThebeCell.md#metadata)

#### Defined in

[packages/core/src/cell.ts:14](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L14)

___

### model

• `Protected` **model**: `OutputAreaModel`

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[model](PassiveCellRenderer.md#model)

#### Defined in

[packages/core/src/passive.ts:12](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L12)

___

### notebookId

• `Readonly` **notebookId**: `string`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[notebookId](../interfaces/IThebeCell.md#notebookid)

#### Defined in

[packages/core/src/cell.ts:16](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L16)

___

### rendermime

• `Readonly` **rendermime**: `IRenderMimeRegistry`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[rendermime](../interfaces/IThebeCell.md#rendermime)

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[rendermime](PassiveCellRenderer.md#rendermime)

#### Defined in

[packages/core/src/passive.ts:11](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L11)

___

### session

• `Optional` **session**: [`ThebeSession`](ThebeSession.md)

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[session](../interfaces/IThebeCell.md#session)

#### Defined in

[packages/core/src/cell.ts:15](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L15)

___

### source

• **source**: `string`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[source](../interfaces/IThebeCell.md#source)

#### Defined in

[packages/core/src/cell.ts:13](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L13)

## Accessors

### isAttached

• `get` **isAttached**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[isAttached](../interfaces/IThebeCell.md#isattached)

#### Defined in

[packages/core/src/cell.ts:59](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L59)

___

### isAttachedToDOM

• `get` **isAttachedToDOM**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[isAttachedToDOM](../interfaces/IThebeCell.md#isattachedtodom)

#### Inherited from

PassiveCellRenderer.isAttachedToDOM

#### Defined in

[packages/core/src/passive.ts:32](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L32)

___

### isBusy

• `get` **isBusy**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[isBusy](../interfaces/IThebeCell.md#isbusy)

#### Defined in

[packages/core/src/cell.ts:55](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L55)

___

### outputs

• `get` **outputs**(): `IOutput`[]

Serialize the model state to JSON

#### Returns

`IOutput`[]

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[outputs](../interfaces/IThebeCell.md#outputs)

#### Inherited from

PassiveCellRenderer.outputs

#### Defined in

[packages/core/src/passive.ts:28](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L28)

___

### tags

• `get` **tags**(): `string`[]

#### Returns

`string`[]

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[tags](../interfaces/IThebeCell.md#tags)

#### Defined in

[packages/core/src/cell.ts:63](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L63)

## Methods

### attachSession

▸ **attachSession**(`session`): `void`

Attaches to the session and adds the widgets factory to the rendermine registry
call this version if using ThebeCell in isolation, otherwise call ThebeNotebook::attachSession

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | [`ThebeSession`](ThebeSession.md) |

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[attachSession](../interfaces/IThebeCell.md#attachsession)

#### Defined in

[packages/core/src/cell.ts:73](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L73)

___

### attachToDOM

▸ **attachToDOM**(`el?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `el?` | `HTMLElement` |

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[attachToDOM](../interfaces/IThebeCell.md#attachtodom)

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[attachToDOM](PassiveCellRenderer.md#attachtodom)

#### Defined in

[packages/core/src/passive.ts:36](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L36)

___

### clear

▸ **clear**(): `void`

Clears the output area model

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[clear](../interfaces/IThebeCell.md#clear)

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[clear](PassiveCellRenderer.md#clear)

#### Defined in

[packages/core/src/passive.ts:83](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L83)

___

### clearOnError

▸ **clearOnError**(`error?`): `void`

Will trigger the output to render an error with text taken from the optional argument

#### Parameters

| Name | Type |
| :------ | :------ |
| `error?` | `any` |

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[clearOnError](../interfaces/IThebeCell.md#clearonerror)

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[clearOnError](PassiveCellRenderer.md#clearonerror)

#### Defined in

[packages/core/src/passive.ts:94](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L94)

___

### detachSession

▸ **detachSession**(): `void`

Detaches from the session and removes the widgets factory from the rendermine registry
call this version if using ThebeCell in isolation, otherwise call ThebeNotebook::detachSession

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[detachSession](../interfaces/IThebeCell.md#detachsession)

#### Defined in

[packages/core/src/cell.ts:87](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L87)

___

### execute

▸ **execute**(`source?`): `Promise`<``null`` \| [`IThebeCellExecuteReturn`](../interfaces/IThebeCellExecuteReturn.md)\>

TODO
 - pass execute_count or timestamp or something back to redux on success/failure?

#### Parameters

| Name | Type |
| :------ | :------ |
| `source?` | `string` |

#### Returns

`Promise`<``null`` \| [`IThebeCellExecuteReturn`](../interfaces/IThebeCellExecuteReturn.md)\>

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[execute](../interfaces/IThebeCell.md#execute)

#### Defined in

[packages/core/src/cell.ts:121](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L121)

___

### render

▸ **render**(`outputs`): `void`

Render output data directly from json

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `outputs` | `IOutput`[] | serialised jupyter outputs |

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[render](../interfaces/IThebeCell.md#render)

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[render](PassiveCellRenderer.md#render)

#### Defined in

[packages/core/src/passive.ts:110](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L110)

___

### setAsBusy

▸ **setAsBusy**(): `void`

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[setAsBusy](../interfaces/IThebeCell.md#setasbusy)

#### Defined in

[packages/core/src/cell.ts:96](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L96)

___

### setAsIdle

▸ **setAsIdle**(): `void`

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[setAsIdle](../interfaces/IThebeCell.md#setasidle)

#### Defined in

[packages/core/src/cell.ts:105](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L105)

___

### setOutputText

▸ **setOutputText**(`text`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`void`

#### Implementation of

[IThebeCell](../interfaces/IThebeCell.md).[setOutputText](../interfaces/IThebeCell.md#setoutputtext)

#### Inherited from

[PassiveCellRenderer](PassiveCellRenderer.md).[setOutputText](PassiveCellRenderer.md#setoutputtext)

#### Defined in

[packages/core/src/passive.ts:68](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/passive.ts#L68)

___

### fromICodeCell

▸ `Static` **fromICodeCell**(`icc`, `notebookId`, `config`, `rendermime?`): [`ThebeCell`](ThebeCell.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `icc` | `ICodeCell` |
| `notebookId` | `string` |
| `config` | [`Config`](Config.md) |
| `rendermime?` | `IRenderMimeRegistry` |

#### Returns

[`ThebeCell`](ThebeCell.md)

#### Defined in

[packages/core/src/cell.ts:36](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/cell.ts#L36)
