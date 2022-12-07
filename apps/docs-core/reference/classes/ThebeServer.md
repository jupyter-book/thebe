[thebe-core](../README.md) / [Exports](../modules.md) / ThebeServer

# Class: ThebeServer

## Implements

- [`ServerRuntime`](../interfaces/ServerRuntime.md)
- [`ServerRestAPI`](../interfaces/ServerRestAPI.md)

## Table of contents

### Constructors

- [constructor](ThebeServer.md#constructor)

### Properties

- [\_isDisposed](ThebeServer.md#_isdisposed)
- [config](ThebeServer.md#config)
- [events](ThebeServer.md#events)
- [id](ThebeServer.md#id)
- [ready](ThebeServer.md#ready)
- [resolveReadyFn](ThebeServer.md#resolvereadyfn)
- [serviceManager](ThebeServer.md#servicemanager)
- [sessionManager](ThebeServer.md#sessionmanager)

### Accessors

- [isDisposed](ThebeServer.md#isdisposed)
- [isReady](ThebeServer.md#isready)
- [settings](ThebeServer.md#settings)

### Methods

- [\_makeBinderUrl](ThebeServer.md#_makebinderurl)
- [checkForSavedBinderSession](ThebeServer.md#checkforsavedbindersession)
- [clearSavedBinderSessions](ThebeServer.md#clearsavedbindersessions)
- [connectToExistingSession](ThebeServer.md#connecttoexistingsession)
- [connectToJupyterLiteServer](ThebeServer.md#connecttojupyterliteserver)
- [connectToJupyterServer](ThebeServer.md#connecttojupyterserver)
- [connectToServerViaBinder](ThebeServer.md#connecttoserverviabinder)
- [createDirectory](ThebeServer.md#createdirectory)
- [dispose](ThebeServer.md#dispose)
- [duplicateFile](ThebeServer.md#duplicatefile)
- [getContents](ThebeServer.md#getcontents)
- [getFetchUrl](ThebeServer.md#getfetchurl)
- [getKernelSpecs](ThebeServer.md#getkernelspecs)
- [listRunningSessions](ThebeServer.md#listrunningsessions)
- [refreshRunningSessions](ThebeServer.md#refreshrunningsessions)
- [renameContents](ThebeServer.md#renamecontents)
- [shutdownAllSessions](ThebeServer.md#shutdownallsessions)
- [shutdownSession](ThebeServer.md#shutdownsession)
- [startNewSession](ThebeServer.md#startnewsession)
- [uploadFile](ThebeServer.md#uploadfile)
- [status](ThebeServer.md#status)

## Constructors

### constructor

• **new ThebeServer**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](Config.md) |

#### Defined in

[packages/core/src/server.ts:42](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L42)

## Properties

### \_isDisposed

• `Private` **\_isDisposed**: `boolean`

#### Defined in

[packages/core/src/server.ts:39](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L39)

___

### config

• `Readonly` **config**: [`Config`](Config.md)

#### Defined in

[packages/core/src/server.ts:34](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L34)

___

### events

• `Private` **events**: `EventEmitter`

#### Defined in

[packages/core/src/server.ts:40](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L40)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[packages/core/src/server.ts:33](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L33)

___

### ready

• `Readonly` **ready**: `Promise`<[`ThebeServer`](ThebeServer.md)\>

#### Implementation of

[ServerRuntime](../interfaces/ServerRuntime.md).[ready](../interfaces/ServerRuntime.md#ready)

#### Defined in

[packages/core/src/server.ts:35](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L35)

___

### resolveReadyFn

• `Private` `Optional` **resolveReadyFn**: (`value`: [`ThebeServer`](ThebeServer.md) \| `PromiseLike`<[`ThebeServer`](ThebeServer.md)\>) => `void`

#### Type declaration

▸ (`value`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`ThebeServer`](ThebeServer.md) \| `PromiseLike`<[`ThebeServer`](ThebeServer.md)\> |

##### Returns

`void`

#### Defined in

[packages/core/src/server.ts:38](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L38)

___

### serviceManager

• `Optional` **serviceManager**: `ServiceManager`

#### Defined in

[packages/core/src/server.ts:37](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L37)

___

### sessionManager

• `Optional` **sessionManager**: `SessionManager`

#### Defined in

[packages/core/src/server.ts:36](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L36)

## Accessors

### isDisposed

• `get` **isDisposed**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/server.ts:56](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L56)

___

### isReady

• `get` **isReady**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ServerRuntime](../interfaces/ServerRuntime.md).[isReady](../interfaces/ServerRuntime.md#isready)

#### Defined in

[packages/core/src/server.ts:52](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L52)

___

### settings

• `get` **settings**(): `undefined` \| `ISettings`

#### Returns

`undefined` \| `ISettings`

#### Implementation of

[ServerRuntime](../interfaces/ServerRuntime.md).[settings](../interfaces/ServerRuntime.md#settings)

#### Defined in

[packages/core/src/server.ts:60](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L60)

## Methods

### \_makeBinderUrl

▸ **_makeBinderUrl**(): `string`

#### Returns

`string`

#### Defined in

[packages/core/src/server.ts:232](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L232)

___

### checkForSavedBinderSession

▸ **checkForSavedBinderSession**(): `Promise`<``null`` \| [`SavedSessionInfo`](../interfaces/SavedSessionInfo.md)\>

#### Returns

`Promise`<``null`` \| [`SavedSessionInfo`](../interfaces/SavedSessionInfo.md)\>

#### Defined in

[packages/core/src/server.ts:249](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L249)

___

### clearSavedBinderSessions

▸ **clearSavedBinderSessions**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/server.ts:129](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L129)

___

### connectToExistingSession

▸ **connectToExistingSession**(`model`): `Promise`<[`ThebeSession`](ThebeSession.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `IModel` |

#### Returns

`Promise`<[`ThebeSession`](ThebeSession.md)\>

#### Defined in

[packages/core/src/server.ts:118](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L118)

___

### connectToJupyterLiteServer

▸ **connectToJupyterLiteServer**(): `Promise`<`void`\>

Connect to Jupyterlite Server

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/server.ts:193](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L193)

___

### connectToJupyterServer

▸ **connectToJupyterServer**(): `Promise`<`void`\>

Connect to a Jupyter server directly

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/server.ts:139](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L139)

___

### connectToServerViaBinder

▸ **connectToServerViaBinder**(): `Promise`<`void`\>

Connect to a Binder instance in order to
access a Jupyter server that can provide kernels

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/server.ts:262](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L262)

___

### createDirectory

▸ **createDirectory**(`opts`): `Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.path` | `string` |

#### Returns

`Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Implementation of

ServerRestAPI.createDirectory

#### Defined in

[packages/core/src/server.ts:466](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L466)

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/server.ts:72](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L72)

___

### duplicateFile

▸ **duplicateFile**(`opts`): `Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.copy_from` | `string` |
| `opts.ext?` | `string` |
| `opts.path` | `string` |
| `opts.type?` | ``"notebook"`` \| ``"file"`` |

#### Returns

`Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Implementation of

ServerRestAPI.duplicateFile

#### Defined in

[packages/core/src/server.ts:449](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L449)

___

### getContents

▸ **getContents**(`opts`): `Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.format?` | ``"text"`` \| ``"base64"`` |
| `opts.path` | `string` |
| `opts.returnContent?` | `boolean` |
| `opts.type?` | ``"notebook"`` \| ``"file"`` \| ``"directory"`` |

#### Returns

`Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Implementation of

ServerRestAPI.getContents

#### Defined in

[packages/core/src/server.ts:436](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L436)

___

### getFetchUrl

▸ **getFetchUrl**(`relativeUrl`): `URL`

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeUrl` | `string` |

#### Returns

`URL`

#### Defined in

[packages/core/src/server.ts:408](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L408)

___

### getKernelSpecs

▸ **getKernelSpecs**(): `Promise`<`ISpecModels`\>

#### Returns

`Promise`<`ISpecModels`\>

#### Implementation of

ServerRestAPI.getKernelSpecs

#### Defined in

[packages/core/src/server.ts:428](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L428)

___

### listRunningSessions

▸ **listRunningSessions**(): `Promise`<`IModel`[]\>

#### Returns

`Promise`<`IModel`[]\>

#### Defined in

[packages/core/src/server.ts:101](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L101)

___

### refreshRunningSessions

▸ **refreshRunningSessions**(): `Promise`<`IModel`[]\>

#### Returns

`Promise`<`IModel`[]\>

#### Defined in

[packages/core/src/server.ts:112](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L112)

___

### renameContents

▸ **renameContents**(`opts`): `Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.newPath` | `string` |
| `opts.path` | `string` |

#### Returns

`Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Implementation of

ServerRestAPI.renameContents

#### Defined in

[packages/core/src/server.ts:477](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L477)

___

### shutdownAllSessions

▸ **shutdownAllSessions**(): `Promise`<`undefined` \| `void`\>

#### Returns

`Promise`<`undefined` \| `void`\>

#### Implementation of

ServerRuntime.shutdownAllSessions

#### Defined in

[packages/core/src/server.ts:68](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L68)

___

### shutdownSession

▸ **shutdownSession**(`id`): `Promise`<`undefined` \| `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`undefined` \| `void`\>

#### Implementation of

ServerRuntime.shutdownSession

#### Defined in

[packages/core/src/server.ts:64](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L64)

___

### startNewSession

▸ **startNewSession**(`kernelOptions?`): `Promise`<``null`` \| [`ThebeSession`](ThebeSession.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `kernelOptions?` | [`KernelOptions`](../interfaces/KernelOptions.md) |

#### Returns

`Promise`<``null`` \| [`ThebeSession`](ThebeSession.md)\>

#### Defined in

[packages/core/src/server.ts:81](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L81)

___

### uploadFile

▸ **uploadFile**(`opts`): `Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.content` | `string` |
| `opts.format?` | ``"text"`` \| ``"base64"`` \| ``"json"`` |
| `opts.path` | `string` |
| `opts.type?` | ``"notebook"`` \| ``"file"`` |

#### Returns

`Promise`<[`RestAPIContentsResponse`](../interfaces/RestAPIContentsResponse.md)\>

#### Implementation of

ServerRestAPI.uploadFile

#### Defined in

[packages/core/src/server.ts:489](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L489)

___

### status

▸ `Static` **status**(`serverSettings`): `Promise`<`void` \| `Response`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serverSettings` | `Required`<[`ServerSettings`](../interfaces/ServerSettings.md)\> |

#### Returns

`Promise`<`void` \| `Response`\>

#### Defined in

[packages/core/src/server.ts:420](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/server.ts#L420)
