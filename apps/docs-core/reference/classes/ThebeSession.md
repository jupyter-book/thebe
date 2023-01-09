[thebe-core](../README.md) / [Exports](../modules.md) / ThebeSession

# Class: ThebeSession

## Table of contents

### Constructors

- [constructor](ThebeSession.md#constructor)

### Properties

- [connection](ThebeSession.md#connection)
- [events](ThebeSession.md#events)
- [manager](ThebeSession.md#manager)
- [server](ThebeSession.md#server)

### Accessors

- [id](ThebeSession.md#id)
- [kernel](ThebeSession.md#kernel)
- [name](ThebeSession.md#name)
- [path](ThebeSession.md#path)

### Methods

- [dispose](ThebeSession.md#dispose)
- [restart](ThebeSession.md#restart)
- [shutdown](ThebeSession.md#shutdown)

## Constructors

### constructor

• **new ThebeSession**(`server`, `connection`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`ThebeServer`](ThebeServer.md) |
| `connection` | `ISessionConnection` |

#### Defined in

[packages/core/src/session.ts:14](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L14)

## Properties

### connection

• `Private` **connection**: `ISessionConnection`

#### Defined in

[packages/core/src/session.ts:11](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L11)

___

### events

• `Private` **events**: `EventEmitter`

#### Defined in

[packages/core/src/session.ts:12](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L12)

___

### manager

• `Readonly` **manager**: [`ThebeManager`](ThebeManager.md)

#### Defined in

[packages/core/src/session.ts:9](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L9)

___

### server

• `Readonly` **server**: [`ThebeServer`](ThebeServer.md)

#### Defined in

[packages/core/src/session.ts:8](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L8)

## Accessors

### id

• `get` **id**(): `string`

#### Returns

`string`

#### Defined in

[packages/core/src/session.ts:28](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L28)

___

### kernel

• `get` **kernel**(): ``null`` \| `IKernelConnection`

#### Returns

``null`` \| `IKernelConnection`

#### Defined in

[packages/core/src/session.ts:32](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L32)

___

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

[packages/core/src/session.ts:40](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L40)

___

### path

• `get` **path**(): `string`

#### Returns

`string`

#### Defined in

[packages/core/src/session.ts:36](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L36)

## Methods

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/session.ts:70](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L70)

___

### restart

▸ **restart**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/session.ts:44](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L44)

___

### shutdown

▸ **shutdown**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/session.ts:61](https://github.com/executablebooks/thebe/blob/280bb7d/packages/core/src/session.ts#L61)
