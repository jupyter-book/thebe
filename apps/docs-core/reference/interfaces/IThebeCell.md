[thebe-core](../README.md) / [Exports](../modules.md) / IThebeCell

# Interface: IThebeCell

## Hierarchy

- [`IPassiveCell`](IPassiveCell.md)

  ↳ **`IThebeCell`**

## Implemented by

- [`ThebeCell`](../classes/ThebeCell.md)

## Table of contents

### Properties

- [id](IThebeCell.md#id)
- [isAttached](IThebeCell.md#isattached)
- [isAttachedToDOM](IThebeCell.md#isattachedtodom)
- [isBusy](IThebeCell.md#isbusy)
- [metadata](IThebeCell.md#metadata)
- [notebookId](IThebeCell.md#notebookid)
- [outputs](IThebeCell.md#outputs)
- [rendermime](IThebeCell.md#rendermime)
- [session](IThebeCell.md#session)
- [source](IThebeCell.md#source)
- [tags](IThebeCell.md#tags)

### Methods

- [attachSession](IThebeCell.md#attachsession)
- [attachToDOM](IThebeCell.md#attachtodom)
- [clear](IThebeCell.md#clear)
- [clearOnError](IThebeCell.md#clearonerror)
- [detachSession](IThebeCell.md#detachsession)
- [execute](IThebeCell.md#execute)
- [render](IThebeCell.md#render)
- [setAsBusy](IThebeCell.md#setasbusy)
- [setAsIdle](IThebeCell.md#setasidle)
- [setOutputText](IThebeCell.md#setoutputtext)

## Properties

### id

• `Readonly` **id**: `string`

#### Inherited from

[IPassiveCell](IPassiveCell.md).[id](IPassiveCell.md#id)

#### Defined in

[packages/core/src/types.ts:75](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L75)

___

### isAttached

• `Readonly` **isAttached**: `boolean`

#### Defined in

[packages/core/src/types.ts:93](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L93)

___

### isAttachedToDOM

• `Readonly` **isAttachedToDOM**: `boolean`

#### Inherited from

[IPassiveCell](IPassiveCell.md).[isAttachedToDOM](IPassiveCell.md#isattachedtodom)

#### Defined in

[packages/core/src/types.ts:77](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L77)

___

### isBusy

• `Readonly` **isBusy**: `boolean`

#### Defined in

[packages/core/src/types.ts:92](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L92)

___

### metadata

• **metadata**: [`JsonObject`](../modules.md#jsonobject)

#### Defined in

[packages/core/src/types.ts:90](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L90)

___

### notebookId

• `Readonly` **notebookId**: `string`

#### Defined in

[packages/core/src/types.ts:91](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L91)

___

### outputs

• `Readonly` **outputs**: `IOutput`[]

#### Inherited from

[IPassiveCell](IPassiveCell.md).[outputs](IPassiveCell.md#outputs)

#### Defined in

[packages/core/src/types.ts:78](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L78)

___

### rendermime

• `Readonly` **rendermime**: `IRenderMimeRegistry`

#### Inherited from

[IPassiveCell](IPassiveCell.md).[rendermime](IPassiveCell.md#rendermime)

#### Defined in

[packages/core/src/types.ts:76](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L76)

___

### session

• `Optional` **session**: [`ThebeSession`](../classes/ThebeSession.md)

#### Defined in

[packages/core/src/types.ts:89](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L89)

___

### source

• **source**: `string`

#### Defined in

[packages/core/src/types.ts:88](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L88)

___

### tags

• `Readonly` **tags**: `string`[]

#### Defined in

[packages/core/src/types.ts:94](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L94)

## Methods

### attachSession

▸ **attachSession**(`session`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | [`ThebeSession`](../classes/ThebeSession.md) |

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:96](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L96)

___

### attachToDOM

▸ **attachToDOM**(`el?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `el?` | `HTMLElement` |

#### Returns

`void`

#### Inherited from

[IPassiveCell](IPassiveCell.md).[attachToDOM](IPassiveCell.md#attachtodom)

#### Defined in

[packages/core/src/types.ts:80](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L80)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

[IPassiveCell](IPassiveCell.md).[clear](IPassiveCell.md#clear)

#### Defined in

[packages/core/src/types.ts:82](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L82)

___

### clearOnError

▸ **clearOnError**(`error?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error?` | `any` |

#### Returns

`void`

#### Inherited from

[IPassiveCell](IPassiveCell.md).[clearOnError](IPassiveCell.md#clearonerror)

#### Defined in

[packages/core/src/types.ts:83](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L83)

___

### detachSession

▸ **detachSession**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:97](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L97)

___

### execute

▸ **execute**(`source?`): `Promise`<``null`` \| [`IThebeCellExecuteReturn`](IThebeCellExecuteReturn.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `source?` | `string` |

#### Returns

`Promise`<``null`` \| [`IThebeCellExecuteReturn`](IThebeCellExecuteReturn.md)\>

#### Defined in

[packages/core/src/types.ts:98](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L98)

___

### render

▸ **render**(`outputs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `outputs` | `IOutput`[] |

#### Returns

`void`

#### Inherited from

[IPassiveCell](IPassiveCell.md).[render](IPassiveCell.md#render)

#### Defined in

[packages/core/src/types.ts:84](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L84)

___

### setAsBusy

▸ **setAsBusy**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:99](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L99)

___

### setAsIdle

▸ **setAsIdle**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:100](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L100)

___

### setOutputText

▸ **setOutputText**(`text`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`void`

#### Inherited from

[IPassiveCell](IPassiveCell.md).[setOutputText](IPassiveCell.md#setoutputtext)

#### Defined in

[packages/core/src/types.ts:81](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L81)
