[thebe-core](../README.md) / [Exports](../modules.md) / IPassiveCell

# Interface: IPassiveCell

## Hierarchy

- **`IPassiveCell`**

  ↳ [`IThebeCell`](IThebeCell.md)

## Implemented by

- [`PassiveCellRenderer`](../classes/PassiveCellRenderer.md)

## Table of contents

### Properties

- [id](IPassiveCell.md#id)
- [isAttachedToDOM](IPassiveCell.md#isattachedtodom)
- [outputs](IPassiveCell.md#outputs)
- [rendermime](IPassiveCell.md#rendermime)

### Methods

- [attachToDOM](IPassiveCell.md#attachtodom)
- [clear](IPassiveCell.md#clear)
- [clearOnError](IPassiveCell.md#clearonerror)
- [render](IPassiveCell.md#render)
- [setOutputText](IPassiveCell.md#setoutputtext)

## Properties

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/core/src/types.ts:78](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L78)

___

### isAttachedToDOM

• `Readonly` **isAttachedToDOM**: `boolean`

#### Defined in

[packages/core/src/types.ts:80](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L80)

___

### outputs

• `Readonly` **outputs**: `IOutput`[]

#### Defined in

[packages/core/src/types.ts:81](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L81)

___

### rendermime

• `Readonly` **rendermime**: `IRenderMimeRegistry`

#### Defined in

[packages/core/src/types.ts:79](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L79)

## Methods

### attachToDOM

▸ **attachToDOM**(`el?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `el?` | `HTMLElement` |

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:83](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L83)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:85](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L85)

___

### clearOnError

▸ **clearOnError**(`error?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error?` | `any` |

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:86](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L86)

___

### render

▸ **render**(`outputs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `outputs` | `IOutput`[] |

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:87](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L87)

___

### setOutputText

▸ **setOutputText**(`text`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:84](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L84)
