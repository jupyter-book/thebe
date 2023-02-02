[thebe-core](../README.md) / [Exports](../modules.md) / ThebeEvents

# Class: ThebeEvents

## Table of contents

### Constructors

- [constructor](ThebeEvents.md#constructor)

### Properties

- [listeners](ThebeEvents.md#listeners)

### Methods

- [\_ensureMap](ThebeEvents.md#_ensuremap)
- [off](ThebeEvents.md#off)
- [on](ThebeEvents.md#on)
- [one](ThebeEvents.md#one)
- [trigger](ThebeEvents.md#trigger)

## Constructors

### constructor

• **new ThebeEvents**()

#### Defined in

[packages/core/src/events.ts:96](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/events.ts#L96)

## Properties

### listeners

• **listeners**: `Record`<`string`, `Map`<[`ThebeEventCb`](../modules.md#thebeeventcb), { `unbind`: `boolean`  }\>\>

#### Defined in

[packages/core/src/events.ts:94](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/events.ts#L94)

## Methods

### \_ensureMap

▸ **_ensureMap**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/src/events.ts:100](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/events.ts#L100)

___

### off

▸ **off**(`event`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ThebeEventType`](../enums/ThebeEventType.md) |
| `cb` | [`ThebeEventCb`](../modules.md#thebeeventcb) |

#### Returns

`void`

#### Defined in

[packages/core/src/events.ts:124](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/events.ts#L124)

___

### on

▸ **on**(`event`, `cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ThebeEventType`](../enums/ThebeEventType.md) |
| `cb` | [`ThebeEventCb`](../modules.md#thebeeventcb) |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/core/src/events.ts:112](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/events.ts#L112)

___

### one

▸ **one**(`event`, `cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ThebeEventType`](../enums/ThebeEventType.md) |
| `cb` | [`ThebeEventCb`](../modules.md#thebeeventcb) |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/core/src/events.ts:118](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/events.ts#L118)

___

### trigger

▸ **trigger**(`event`, `evt`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ThebeEventType`](../enums/ThebeEventType.md) |
| `evt` | [`ThebeEventData`](../interfaces/ThebeEventData.md) |

#### Returns

`void`

#### Defined in

[packages/core/src/events.ts:104](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/events.ts#L104)
