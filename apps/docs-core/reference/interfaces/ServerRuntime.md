[thebe-core](../README.md) / [Exports](../modules.md) / ServerRuntime

# Interface: ServerRuntime

## Implemented by

- [`ThebeServer`](../classes/ThebeServer.md)

## Table of contents

### Properties

- [isReady](ServerRuntime.md#isready)
- [ready](ServerRuntime.md#ready)
- [settings](ServerRuntime.md#settings)
- [shutdownAllSessions](ServerRuntime.md#shutdownallsessions)
- [shutdownSession](ServerRuntime.md#shutdownsession)

## Properties

### isReady

• **isReady**: `boolean`

#### Defined in

[packages/core/src/types.ts:112](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L112)

___

### ready

• **ready**: `Promise`<[`ThebeServer`](../classes/ThebeServer.md)\>

#### Defined in

[packages/core/src/types.ts:111](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L111)

___

### settings

• **settings**: `undefined` \| `ISettings`

#### Defined in

[packages/core/src/types.ts:113](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L113)

___

### shutdownAllSessions

• **shutdownAllSessions**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/types.ts:115](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L115)

___

### shutdownSession

• **shutdownSession**: (`id`: `string`) => `Promise`<`void`\>

#### Type declaration

▸ (`id`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

##### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/types.ts:114](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/types.ts#L114)
