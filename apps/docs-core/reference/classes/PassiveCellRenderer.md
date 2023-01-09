[thebe-core](../README.md) / [Exports](../modules.md) / PassiveCellRenderer

# Class: PassiveCellRenderer

## Hierarchy

- **`PassiveCellRenderer`**

  ↳ [`ThebeCell`](ThebeCell.md)

## Implements

- [`IPassiveCell`](../interfaces/IPassiveCell.md)

## Table of contents

### Constructors

- [constructor](PassiveCellRenderer.md#constructor)

### Properties

- [area](PassiveCellRenderer.md#area)
- [id](PassiveCellRenderer.md#id)
- [model](PassiveCellRenderer.md#model)
- [rendermime](PassiveCellRenderer.md#rendermime)

### Accessors

- [isAttachedToDOM](PassiveCellRenderer.md#isattachedtodom)
- [outputs](PassiveCellRenderer.md#outputs)

### Methods

- [attachToDOM](PassiveCellRenderer.md#attachtodom)
- [clear](PassiveCellRenderer.md#clear)
- [clearOnError](PassiveCellRenderer.md#clearonerror)
- [render](PassiveCellRenderer.md#render)
- [setOutputText](PassiveCellRenderer.md#setoutputtext)

## Constructors

### constructor

• **new PassiveCellRenderer**(`id`, `rendermime?`, `mathjax?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `rendermime?` | `IRenderMimeRegistry` |
| `mathjax?` | [`MathjaxOptions`](../modules.md#mathjaxoptions) |

#### Defined in

[packages/core/src/passive.ts:15](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L15)

## Properties

### area

• `Protected` **area**: `OutputArea`

#### Defined in

[packages/core/src/passive.ts:13](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L13)

___

### id

• `Readonly` **id**: `string`

#### Implementation of

[IPassiveCell](../interfaces/IPassiveCell.md).[id](../interfaces/IPassiveCell.md#id)

#### Defined in

[packages/core/src/passive.ts:10](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L10)

___

### model

• `Protected` **model**: `OutputAreaModel`

#### Defined in

[packages/core/src/passive.ts:12](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L12)

___

### rendermime

• `Readonly` **rendermime**: `IRenderMimeRegistry`

#### Implementation of

[IPassiveCell](../interfaces/IPassiveCell.md).[rendermime](../interfaces/IPassiveCell.md#rendermime)

#### Defined in

[packages/core/src/passive.ts:11](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L11)

## Accessors

### isAttachedToDOM

• `get` **isAttachedToDOM**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[IPassiveCell](../interfaces/IPassiveCell.md).[isAttachedToDOM](../interfaces/IPassiveCell.md#isattachedtodom)

#### Defined in

[packages/core/src/passive.ts:32](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L32)

___

### outputs

• `get` **outputs**(): `IOutput`[]

Serialize the model state to JSON

#### Returns

`IOutput`[]

#### Implementation of

[IPassiveCell](../interfaces/IPassiveCell.md).[outputs](../interfaces/IPassiveCell.md#outputs)

#### Defined in

[packages/core/src/passive.ts:28](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L28)

## Methods

### attachToDOM

▸ **attachToDOM**(`el?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `el?` | `HTMLElement` |

#### Returns

`void`

#### Implementation of

[IPassiveCell](../interfaces/IPassiveCell.md).[attachToDOM](../interfaces/IPassiveCell.md#attachtodom)

#### Defined in

[packages/core/src/passive.ts:36](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L36)

___

### clear

▸ **clear**(): `void`

Clears the output area model

#### Returns

`void`

#### Implementation of

[IPassiveCell](../interfaces/IPassiveCell.md).[clear](../interfaces/IPassiveCell.md#clear)

#### Defined in

[packages/core/src/passive.ts:83](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L83)

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

[IPassiveCell](../interfaces/IPassiveCell.md).[clearOnError](../interfaces/IPassiveCell.md#clearonerror)

#### Defined in

[packages/core/src/passive.ts:94](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L94)

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

[IPassiveCell](../interfaces/IPassiveCell.md).[render](../interfaces/IPassiveCell.md#render)

#### Defined in

[packages/core/src/passive.ts:110](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L110)

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

[IPassiveCell](../interfaces/IPassiveCell.md).[setOutputText](../interfaces/IPassiveCell.md#setoutputtext)

#### Defined in

[packages/core/src/passive.ts:68](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/passive.ts#L68)
