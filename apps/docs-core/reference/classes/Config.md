[thebe-core](../README.md) / [Exports](../modules.md) / Config

# Class: Config

## Table of contents

### Constructors

- [constructor](Config.md#constructor)

### Properties

- [\_binderOptions](Config.md#_binderoptions)
- [\_events](Config.md#_events)
- [\_kernelOptions](Config.md#_kerneloptions)
- [\_options](Config.md#_options)
- [\_savedSessions](Config.md#_savedsessions)
- [\_serverSettings](Config.md#_serversettings)

### Accessors

- [base](Config.md#base)
- [binder](Config.md#binder)
- [events](Config.md#events)
- [kernels](Config.md#kernels)
- [mathjax](Config.md#mathjax)
- [savedSessions](Config.md#savedsessions)
- [serverSettings](Config.md#serversettings)

## Constructors

### constructor

• **new Config**(`opts?`, `events?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CoreOptions`](../interfaces/CoreOptions.md) |
| `events?` | [`ThebeEvents`](ThebeEvents.md) |

#### Defined in

[packages/core/src/config.ts:27](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L27)

## Properties

### \_binderOptions

• `Private` **\_binderOptions**: `Required`<[`BinderOptions`](../interfaces/BinderOptions.md)\>

#### Defined in

[packages/core/src/config.ts:21](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L21)

___

### \_events

• `Private` **\_events**: [`ThebeEvents`](ThebeEvents.md)

#### Defined in

[packages/core/src/config.ts:25](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L25)

___

### \_kernelOptions

• `Private` **\_kernelOptions**: `Required`<[`KernelOptions`](../interfaces/KernelOptions.md)\>

#### Defined in

[packages/core/src/config.ts:23](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L23)

___

### \_options

• `Private` **\_options**: `Required`<`Omit`<[`CoreOptions`](../interfaces/CoreOptions.md), ``"binderOptions"`` \| ``"savedSessionOptions"`` \| ``"kernelOptions"`` \| ``"serverSettings"``\>\>

#### Defined in

[packages/core/src/config.ts:18](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L18)

___

### \_savedSessions

• `Private` **\_savedSessions**: `Required`<[`SavedSessionOptions`](../interfaces/SavedSessionOptions.md)\>

#### Defined in

[packages/core/src/config.ts:22](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L22)

___

### \_serverSettings

• `Private` **\_serverSettings**: `Required`<`Omit`<[`ServerSettings`](../interfaces/ServerSettings.md), ``"wsUrl"``\>\> & { `wsUrl?`: `string`  }

#### Defined in

[packages/core/src/config.ts:24](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L24)

## Accessors

### base

• `get` **base**(): `Required`<`Omit`<[`CoreOptions`](../interfaces/CoreOptions.md), ``"binderOptions"`` \| ``"savedSessionOptions"`` \| ``"kernelOptions"`` \| ``"serverSettings"``\>\>

#### Returns

`Required`<`Omit`<[`CoreOptions`](../interfaces/CoreOptions.md), ``"binderOptions"`` \| ``"savedSessionOptions"`` \| ``"kernelOptions"`` \| ``"serverSettings"``\>\>

#### Defined in

[packages/core/src/config.ts:49](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L49)

___

### binder

• `get` **binder**(): `Required`<[`BinderOptions`](../interfaces/BinderOptions.md)\>

#### Returns

`Required`<[`BinderOptions`](../interfaces/BinderOptions.md)\>

#### Defined in

[packages/core/src/config.ts:60](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L60)

___

### events

• `get` **events**(): [`ThebeEvents`](ThebeEvents.md)

#### Returns

[`ThebeEvents`](ThebeEvents.md)

#### Defined in

[packages/core/src/config.ts:45](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L45)

___

### kernels

• `get` **kernels**(): `Required`<[`KernelOptions`](../interfaces/KernelOptions.md)\>

#### Returns

`Required`<[`KernelOptions`](../interfaces/KernelOptions.md)\>

#### Defined in

[packages/core/src/config.ts:68](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L68)

___

### mathjax

• `get` **mathjax**(): [`MathjaxOptions`](../modules.md#mathjaxoptions)

#### Returns

[`MathjaxOptions`](../modules.md#mathjaxoptions)

#### Defined in

[packages/core/src/config.ts:53](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L53)

___

### savedSessions

• `get` **savedSessions**(): `Required`<[`SavedSessionOptions`](../interfaces/SavedSessionOptions.md)\>

#### Returns

`Required`<[`SavedSessionOptions`](../interfaces/SavedSessionOptions.md)\>

#### Defined in

[packages/core/src/config.ts:64](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L64)

___

### serverSettings

• `get` **serverSettings**(): `Required`<`Omit`<[`ServerSettings`](../interfaces/ServerSettings.md), ``"wsUrl"``\>\> & { `wsUrl?`: `string`  }

#### Returns

`Required`<`Omit`<[`ServerSettings`](../interfaces/ServerSettings.md), ``"wsUrl"``\>\> & { `wsUrl?`: `string`  }

#### Defined in

[packages/core/src/config.ts:72](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/config.ts#L72)
