[thebe-core](../README.md) / [Exports](../modules.md) / JsApi

# Interface: JsApi

This file is the main entrypoint for the cjs bundle
For the TS module, use setupThebeCore()

## Table of contents

### Properties

- [connect](JsApi.md#connect)
- [makeConfiguration](JsApi.md#makeconfiguration)
- [makeEvents](JsApi.md#makeevents)
- [setupNotebook](JsApi.md#setupnotebook)

## Properties

### connect

• **connect**: (`config`: [`Config`](../classes/Config.md)) => [`ThebeServer`](../classes/ThebeServer.md)

#### Type declaration

▸ (`config`): [`ThebeServer`](../classes/ThebeServer.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](../classes/Config.md) |

##### Returns

[`ThebeServer`](../classes/ThebeServer.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:24](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/thebe/entrypoint.ts#L24)

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

[packages/core/src/thebe/entrypoint.ts:23](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/thebe/entrypoint.ts#L23)

___

### makeEvents

• **makeEvents**: () => [`ThebeEvents`](../classes/ThebeEvents.md)

#### Type declaration

▸ (): [`ThebeEvents`](../classes/ThebeEvents.md)

##### Returns

[`ThebeEvents`](../classes/ThebeEvents.md)

#### Defined in

[packages/core/src/thebe/entrypoint.ts:30](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/thebe/entrypoint.ts#L30)

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

[packages/core/src/thebe/entrypoint.ts:25](https://github.com/executablebooks/thebe/blob/3f03d48/packages/core/src/thebe/entrypoint.ts#L25)
