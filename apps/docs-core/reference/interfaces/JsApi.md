[thebe-core](../README.md) / [Exports](../modules.md) / JsApi

# Interface: JsApi

This file is the main entrypoint for the cjs bundle
For the TS module, use setupThebeCore()

## Table of contents

### Properties

- [connect](JsApi.md#connect)
- [makeEvents](JsApi.md#makeevents)
- [setupNotebook](JsApi.md#setupnotebook)

## Properties

### connect

• **connect**: (`options`: `Partial`<[`CoreOptions`](CoreOptions.md)\>, `events`: [`ThebeEvents`](../classes/ThebeEvents.md)) => [`ThebeServer`](../classes/ThebeServer.md)

#### Type declaration

▸ (`options`, `events`): [`ThebeServer`](../classes/ThebeServer.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<[`CoreOptions`](CoreOptions.md)\> |
| `events` | [`ThebeEvents`](../classes/ThebeEvents.md) |

##### Returns

[`ThebeServer`](../classes/ThebeServer.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:22](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/thebe/entrypoint.ts#L22)

___

### makeEvents

• **makeEvents**: () => [`ThebeEvents`](../classes/ThebeEvents.md)

#### Type declaration

▸ (): [`ThebeEvents`](../classes/ThebeEvents.md)

##### Returns

[`ThebeEvents`](../classes/ThebeEvents.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:28](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/thebe/entrypoint.ts#L28)

___

### setupNotebook

• **setupNotebook**: (`blocks`: [`CodeBlock`](CodeBlock.md)[], `options`: `Partial`<[`CoreOptions`](CoreOptions.md)\>, `events`: [`ThebeEvents`](../classes/ThebeEvents.md)) => [`ThebeNotebook`](../classes/ThebeNotebook.md)

#### Type declaration

▸ (`blocks`, `options`, `events`): [`ThebeNotebook`](../classes/ThebeNotebook.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `blocks` | [`CodeBlock`](CodeBlock.md)[] |
| `options` | `Partial`<[`CoreOptions`](CoreOptions.md)\> |
| `events` | [`ThebeEvents`](../classes/ThebeEvents.md) |

##### Returns

[`ThebeNotebook`](../classes/ThebeNotebook.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:23](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/thebe/entrypoint.ts#L23)
