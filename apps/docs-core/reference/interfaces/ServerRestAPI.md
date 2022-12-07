[thebe-core](../README.md) / [Exports](../modules.md) / ServerRestAPI

# Interface: ServerRestAPI

## Implemented by

- [`ThebeServer`](../classes/ThebeServer.md)

## Table of contents

### Properties

- [createDirectory](ServerRestAPI.md#createdirectory)
- [duplicateFile](ServerRestAPI.md#duplicatefile)
- [getContents](ServerRestAPI.md#getcontents)
- [getKernelSpecs](ServerRestAPI.md#getkernelspecs)
- [renameContents](ServerRestAPI.md#renamecontents)
- [uploadFile](ServerRestAPI.md#uploadfile)

## Properties

### createDirectory

• **createDirectory**: (`opts`: { `path`: `string`  }) => `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Type declaration

▸ (`opts`): `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.path` | `string` |

##### Returns

`Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Defined in

[packages/core/src/types.ts:155](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L155)

___

### duplicateFile

• **duplicateFile**: (`opts`: { `copy_from`: `string` ; `ext?`: `string` ; `path`: `string` ; `type?`: ``"notebook"`` \| ``"file"``  }) => `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Type declaration

▸ (`opts`): `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.copy_from` | `string` |
| `opts.ext?` | `string` |
| `opts.path` | `string` |
| `opts.type?` | ``"notebook"`` \| ``"file"`` |

##### Returns

`Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Defined in

[packages/core/src/types.ts:142](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L142)

___

### getContents

• **getContents**: (`opts`: { `format?`: ``"text"`` \| ``"base64"`` ; `path`: `string` ; `returnContent?`: `boolean` ; `type?`: ``"notebook"`` \| ``"file"`` \| ``"directory"``  }) => `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Type declaration

▸ (`opts`): `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.format?` | ``"text"`` \| ``"base64"`` |
| `opts.path` | `string` |
| `opts.returnContent?` | `boolean` |
| `opts.type?` | ``"notebook"`` \| ``"file"`` \| ``"directory"`` |

##### Returns

`Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Defined in

[packages/core/src/types.ts:136](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L136)

___

### getKernelSpecs

• **getKernelSpecs**: () => `Promise`<`ISpecModels`\>

#### Type declaration

▸ (): `Promise`<`ISpecModels`\>

##### Returns

`Promise`<`ISpecModels`\>

#### Defined in

[packages/core/src/types.ts:156](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L156)

___

### renameContents

• **renameContents**: (`opts`: { `newPath`: `string` ; `path`: `string`  }) => `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Type declaration

▸ (`opts`): `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.newPath` | `string` |
| `opts.path` | `string` |

##### Returns

`Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Defined in

[packages/core/src/types.ts:148](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L148)

___

### uploadFile

• **uploadFile**: (`opts`: { `content`: `string` ; `format?`: ``"text"`` \| ``"base64"`` \| ``"json"`` ; `path`: `string` ; `type?`: ``"notebook"`` \| ``"file"``  }) => `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Type declaration

▸ (`opts`): `Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.content` | `string` |
| `opts.format?` | ``"text"`` \| ``"base64"`` \| ``"json"`` |
| `opts.path` | `string` |
| `opts.type?` | ``"notebook"`` \| ``"file"`` |

##### Returns

`Promise`<[`RestAPIContentsResponse`](RestAPIContentsResponse.md)\>

#### Defined in

[packages/core/src/types.ts:149](https://github.com/executablebooks/thebe/blob/807ffe4/packages/core/src/types.ts#L149)
