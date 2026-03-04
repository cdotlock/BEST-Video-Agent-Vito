
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Skill
 * Skill — 遵循 Agent Skills 开放标准 (agentskills.io)
 * 实体表只保留身份字段 + production 指针，内容存在 SkillVersion
 */
export type Skill = $Result.DefaultSelection<Prisma.$SkillPayload>
/**
 * Model SkillVersion
 * SkillVersion — 不可变的版本快照
 */
export type SkillVersion = $Result.DefaultSelection<Prisma.$SkillVersionPayload>
/**
 * Model User
 * User — 轻量用户标识，无密码，按 name 区分
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ChatSession
 * ChatSession — 对话会话，持久化多轮对话，按 user 隔离
 */
export type ChatSession = $Result.DefaultSelection<Prisma.$ChatSessionPayload>
/**
 * Model ChatMessage
 * ChatMessage — 单条对话消息
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model KeyResource
 * KeyResource — 关键资源，版本化，LLM 通过 present 工具展示的图片/视频/JSON，会话隔离
 */
export type KeyResource = $Result.DefaultSelection<Prisma.$KeyResourcePayload>
/**
 * Model KeyResourceVersion
 * KeyResourceVersion — 不可变的版本快照
 */
export type KeyResourceVersion = $Result.DefaultSelection<Prisma.$KeyResourceVersionPayload>
/**
 * Model ImageGeneration
 * ImageGeneration — 图片生成实体，session 级别
 * 主记录只保留身份 + 指针，所有可变数据存 ImageGenerationVersion
 */
export type ImageGeneration = $Result.DefaultSelection<Prisma.$ImageGenerationPayload>
/**
 * Model ImageGenerationVersion
 * ImageGenerationVersion — 不可变的版本快照
 */
export type ImageGenerationVersion = $Result.DefaultSelection<Prisma.$ImageGenerationVersionPayload>
/**
 * Model McpServer
 * McpServer — 动态 MCP，JS 代码存储于 DB，运行于 QuickJS WebAssembly 沙盒
 * 实体表保留身份 + 运行时字段，代码存在 McpServerVersion
 */
export type McpServer = $Result.DefaultSelection<Prisma.$McpServerPayload>
/**
 * Model McpServerVersion
 * McpServerVersion — 不可变的版本快照
 */
export type McpServerVersion = $Result.DefaultSelection<Prisma.$McpServerVersionPayload>
/**
 * Model BizTableMapping
 * BizTableMapping — 逻辑表名到物理表名(UUID)的映射，实现 biz-db 用户隔离
 * userName="_global_" 表示全局表，其他值为用户私有表
 */
export type BizTableMapping = $Result.DefaultSelection<Prisma.$BizTableMappingPayload>
/**
 * Model Task
 * Task — 一次 agent 调用的生命周期，后端驱动，不依赖前端连接
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model TaskEvent
 * TaskEvent — 可重放的事件流，autoincrement id 用于 Last-Event-ID 排序
 */
export type TaskEvent = $Result.DefaultSelection<Prisma.$TaskEventPayload>
/**
 * Model Api
 * Api — 对外 CRUD 接口，声明式 SQL 操作绑定 biz-db 数据
 * 实体表保留身份 + 启用状态 + production 指针，内容存在 ApiVersion
 */
export type Api = $Result.DefaultSelection<Prisma.$ApiPayload>
/**
 * Model ApiVersion
 * ApiVersion — 不可变的版本快照
 */
export type ApiVersion = $Result.DefaultSelection<Prisma.$ApiVersionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Skills
 * const skills = await prisma.skill.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Skills
   * const skills = await prisma.skill.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.skill`: Exposes CRUD operations for the **Skill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Skills
    * const skills = await prisma.skill.findMany()
    * ```
    */
  get skill(): Prisma.SkillDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.skillVersion`: Exposes CRUD operations for the **SkillVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SkillVersions
    * const skillVersions = await prisma.skillVersion.findMany()
    * ```
    */
  get skillVersion(): Prisma.SkillVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatSession`: Exposes CRUD operations for the **ChatSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatSessions
    * const chatSessions = await prisma.chatSession.findMany()
    * ```
    */
  get chatSession(): Prisma.ChatSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.keyResource`: Exposes CRUD operations for the **KeyResource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KeyResources
    * const keyResources = await prisma.keyResource.findMany()
    * ```
    */
  get keyResource(): Prisma.KeyResourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.keyResourceVersion`: Exposes CRUD operations for the **KeyResourceVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KeyResourceVersions
    * const keyResourceVersions = await prisma.keyResourceVersion.findMany()
    * ```
    */
  get keyResourceVersion(): Prisma.KeyResourceVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imageGeneration`: Exposes CRUD operations for the **ImageGeneration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImageGenerations
    * const imageGenerations = await prisma.imageGeneration.findMany()
    * ```
    */
  get imageGeneration(): Prisma.ImageGenerationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imageGenerationVersion`: Exposes CRUD operations for the **ImageGenerationVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImageGenerationVersions
    * const imageGenerationVersions = await prisma.imageGenerationVersion.findMany()
    * ```
    */
  get imageGenerationVersion(): Prisma.ImageGenerationVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mcpServer`: Exposes CRUD operations for the **McpServer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more McpServers
    * const mcpServers = await prisma.mcpServer.findMany()
    * ```
    */
  get mcpServer(): Prisma.McpServerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mcpServerVersion`: Exposes CRUD operations for the **McpServerVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more McpServerVersions
    * const mcpServerVersions = await prisma.mcpServerVersion.findMany()
    * ```
    */
  get mcpServerVersion(): Prisma.McpServerVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bizTableMapping`: Exposes CRUD operations for the **BizTableMapping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BizTableMappings
    * const bizTableMappings = await prisma.bizTableMapping.findMany()
    * ```
    */
  get bizTableMapping(): Prisma.BizTableMappingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.taskEvent`: Exposes CRUD operations for the **TaskEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskEvents
    * const taskEvents = await prisma.taskEvent.findMany()
    * ```
    */
  get taskEvent(): Prisma.TaskEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.api`: Exposes CRUD operations for the **Api** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Apis
    * const apis = await prisma.api.findMany()
    * ```
    */
  get api(): Prisma.ApiDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiVersion`: Exposes CRUD operations for the **ApiVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiVersions
    * const apiVersions = await prisma.apiVersion.findMany()
    * ```
    */
  get apiVersion(): Prisma.ApiVersionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Skill: 'Skill',
    SkillVersion: 'SkillVersion',
    User: 'User',
    ChatSession: 'ChatSession',
    ChatMessage: 'ChatMessage',
    KeyResource: 'KeyResource',
    KeyResourceVersion: 'KeyResourceVersion',
    ImageGeneration: 'ImageGeneration',
    ImageGenerationVersion: 'ImageGenerationVersion',
    McpServer: 'McpServer',
    McpServerVersion: 'McpServerVersion',
    BizTableMapping: 'BizTableMapping',
    Task: 'Task',
    TaskEvent: 'TaskEvent',
    Api: 'Api',
    ApiVersion: 'ApiVersion'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "skill" | "skillVersion" | "user" | "chatSession" | "chatMessage" | "keyResource" | "keyResourceVersion" | "imageGeneration" | "imageGenerationVersion" | "mcpServer" | "mcpServerVersion" | "bizTableMapping" | "task" | "taskEvent" | "api" | "apiVersion"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Skill: {
        payload: Prisma.$SkillPayload<ExtArgs>
        fields: Prisma.SkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findFirst: {
            args: Prisma.SkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findMany: {
            args: Prisma.SkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          create: {
            args: Prisma.SkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          createMany: {
            args: Prisma.SkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          delete: {
            args: Prisma.SkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          update: {
            args: Prisma.SkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          deleteMany: {
            args: Prisma.SkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SkillUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          upsert: {
            args: Prisma.SkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          aggregate: {
            args: Prisma.SkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkill>
          }
          groupBy: {
            args: Prisma.SkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.SkillCountArgs<ExtArgs>
            result: $Utils.Optional<SkillCountAggregateOutputType> | number
          }
        }
      }
      SkillVersion: {
        payload: Prisma.$SkillVersionPayload<ExtArgs>
        fields: Prisma.SkillVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SkillVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SkillVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>
          }
          findFirst: {
            args: Prisma.SkillVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SkillVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>
          }
          findMany: {
            args: Prisma.SkillVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>[]
          }
          create: {
            args: Prisma.SkillVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>
          }
          createMany: {
            args: Prisma.SkillVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SkillVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>[]
          }
          delete: {
            args: Prisma.SkillVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>
          }
          update: {
            args: Prisma.SkillVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>
          }
          deleteMany: {
            args: Prisma.SkillVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SkillVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SkillVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>[]
          }
          upsert: {
            args: Prisma.SkillVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillVersionPayload>
          }
          aggregate: {
            args: Prisma.SkillVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkillVersion>
          }
          groupBy: {
            args: Prisma.SkillVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SkillVersionCountArgs<ExtArgs>
            result: $Utils.Optional<SkillVersionCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ChatSession: {
        payload: Prisma.$ChatSessionPayload<ExtArgs>
        fields: Prisma.ChatSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findFirst: {
            args: Prisma.ChatSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findMany: {
            args: Prisma.ChatSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          create: {
            args: Prisma.ChatSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          createMany: {
            args: Prisma.ChatSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          delete: {
            args: Prisma.ChatSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          update: {
            args: Prisma.ChatSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          deleteMany: {
            args: Prisma.ChatSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          upsert: {
            args: Prisma.ChatSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          aggregate: {
            args: Prisma.ChatSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatSession>
          }
          groupBy: {
            args: Prisma.ChatSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      KeyResource: {
        payload: Prisma.$KeyResourcePayload<ExtArgs>
        fields: Prisma.KeyResourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KeyResourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KeyResourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>
          }
          findFirst: {
            args: Prisma.KeyResourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KeyResourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>
          }
          findMany: {
            args: Prisma.KeyResourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>[]
          }
          create: {
            args: Prisma.KeyResourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>
          }
          createMany: {
            args: Prisma.KeyResourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KeyResourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>[]
          }
          delete: {
            args: Prisma.KeyResourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>
          }
          update: {
            args: Prisma.KeyResourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>
          }
          deleteMany: {
            args: Prisma.KeyResourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KeyResourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KeyResourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>[]
          }
          upsert: {
            args: Prisma.KeyResourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourcePayload>
          }
          aggregate: {
            args: Prisma.KeyResourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKeyResource>
          }
          groupBy: {
            args: Prisma.KeyResourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<KeyResourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.KeyResourceCountArgs<ExtArgs>
            result: $Utils.Optional<KeyResourceCountAggregateOutputType> | number
          }
        }
      }
      KeyResourceVersion: {
        payload: Prisma.$KeyResourceVersionPayload<ExtArgs>
        fields: Prisma.KeyResourceVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KeyResourceVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KeyResourceVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>
          }
          findFirst: {
            args: Prisma.KeyResourceVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KeyResourceVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>
          }
          findMany: {
            args: Prisma.KeyResourceVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>[]
          }
          create: {
            args: Prisma.KeyResourceVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>
          }
          createMany: {
            args: Prisma.KeyResourceVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KeyResourceVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>[]
          }
          delete: {
            args: Prisma.KeyResourceVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>
          }
          update: {
            args: Prisma.KeyResourceVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>
          }
          deleteMany: {
            args: Prisma.KeyResourceVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KeyResourceVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KeyResourceVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>[]
          }
          upsert: {
            args: Prisma.KeyResourceVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeyResourceVersionPayload>
          }
          aggregate: {
            args: Prisma.KeyResourceVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKeyResourceVersion>
          }
          groupBy: {
            args: Prisma.KeyResourceVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<KeyResourceVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.KeyResourceVersionCountArgs<ExtArgs>
            result: $Utils.Optional<KeyResourceVersionCountAggregateOutputType> | number
          }
        }
      }
      ImageGeneration: {
        payload: Prisma.$ImageGenerationPayload<ExtArgs>
        fields: Prisma.ImageGenerationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageGenerationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageGenerationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>
          }
          findFirst: {
            args: Prisma.ImageGenerationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageGenerationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>
          }
          findMany: {
            args: Prisma.ImageGenerationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>[]
          }
          create: {
            args: Prisma.ImageGenerationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>
          }
          createMany: {
            args: Prisma.ImageGenerationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImageGenerationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>[]
          }
          delete: {
            args: Prisma.ImageGenerationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>
          }
          update: {
            args: Prisma.ImageGenerationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>
          }
          deleteMany: {
            args: Prisma.ImageGenerationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageGenerationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImageGenerationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>[]
          }
          upsert: {
            args: Prisma.ImageGenerationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationPayload>
          }
          aggregate: {
            args: Prisma.ImageGenerationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImageGeneration>
          }
          groupBy: {
            args: Prisma.ImageGenerationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageGenerationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageGenerationCountArgs<ExtArgs>
            result: $Utils.Optional<ImageGenerationCountAggregateOutputType> | number
          }
        }
      }
      ImageGenerationVersion: {
        payload: Prisma.$ImageGenerationVersionPayload<ExtArgs>
        fields: Prisma.ImageGenerationVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageGenerationVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageGenerationVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>
          }
          findFirst: {
            args: Prisma.ImageGenerationVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageGenerationVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>
          }
          findMany: {
            args: Prisma.ImageGenerationVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>[]
          }
          create: {
            args: Prisma.ImageGenerationVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>
          }
          createMany: {
            args: Prisma.ImageGenerationVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImageGenerationVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>[]
          }
          delete: {
            args: Prisma.ImageGenerationVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>
          }
          update: {
            args: Prisma.ImageGenerationVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>
          }
          deleteMany: {
            args: Prisma.ImageGenerationVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageGenerationVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImageGenerationVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>[]
          }
          upsert: {
            args: Prisma.ImageGenerationVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImageGenerationVersionPayload>
          }
          aggregate: {
            args: Prisma.ImageGenerationVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImageGenerationVersion>
          }
          groupBy: {
            args: Prisma.ImageGenerationVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageGenerationVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageGenerationVersionCountArgs<ExtArgs>
            result: $Utils.Optional<ImageGenerationVersionCountAggregateOutputType> | number
          }
        }
      }
      McpServer: {
        payload: Prisma.$McpServerPayload<ExtArgs>
        fields: Prisma.McpServerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.McpServerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.McpServerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>
          }
          findFirst: {
            args: Prisma.McpServerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.McpServerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>
          }
          findMany: {
            args: Prisma.McpServerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>[]
          }
          create: {
            args: Prisma.McpServerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>
          }
          createMany: {
            args: Prisma.McpServerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.McpServerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>[]
          }
          delete: {
            args: Prisma.McpServerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>
          }
          update: {
            args: Prisma.McpServerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>
          }
          deleteMany: {
            args: Prisma.McpServerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.McpServerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.McpServerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>[]
          }
          upsert: {
            args: Prisma.McpServerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerPayload>
          }
          aggregate: {
            args: Prisma.McpServerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMcpServer>
          }
          groupBy: {
            args: Prisma.McpServerGroupByArgs<ExtArgs>
            result: $Utils.Optional<McpServerGroupByOutputType>[]
          }
          count: {
            args: Prisma.McpServerCountArgs<ExtArgs>
            result: $Utils.Optional<McpServerCountAggregateOutputType> | number
          }
        }
      }
      McpServerVersion: {
        payload: Prisma.$McpServerVersionPayload<ExtArgs>
        fields: Prisma.McpServerVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.McpServerVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.McpServerVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>
          }
          findFirst: {
            args: Prisma.McpServerVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.McpServerVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>
          }
          findMany: {
            args: Prisma.McpServerVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>[]
          }
          create: {
            args: Prisma.McpServerVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>
          }
          createMany: {
            args: Prisma.McpServerVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.McpServerVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>[]
          }
          delete: {
            args: Prisma.McpServerVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>
          }
          update: {
            args: Prisma.McpServerVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>
          }
          deleteMany: {
            args: Prisma.McpServerVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.McpServerVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.McpServerVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>[]
          }
          upsert: {
            args: Prisma.McpServerVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpServerVersionPayload>
          }
          aggregate: {
            args: Prisma.McpServerVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMcpServerVersion>
          }
          groupBy: {
            args: Prisma.McpServerVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<McpServerVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.McpServerVersionCountArgs<ExtArgs>
            result: $Utils.Optional<McpServerVersionCountAggregateOutputType> | number
          }
        }
      }
      BizTableMapping: {
        payload: Prisma.$BizTableMappingPayload<ExtArgs>
        fields: Prisma.BizTableMappingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BizTableMappingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BizTableMappingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>
          }
          findFirst: {
            args: Prisma.BizTableMappingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BizTableMappingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>
          }
          findMany: {
            args: Prisma.BizTableMappingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>[]
          }
          create: {
            args: Prisma.BizTableMappingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>
          }
          createMany: {
            args: Prisma.BizTableMappingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BizTableMappingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>[]
          }
          delete: {
            args: Prisma.BizTableMappingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>
          }
          update: {
            args: Prisma.BizTableMappingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>
          }
          deleteMany: {
            args: Prisma.BizTableMappingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BizTableMappingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BizTableMappingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>[]
          }
          upsert: {
            args: Prisma.BizTableMappingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BizTableMappingPayload>
          }
          aggregate: {
            args: Prisma.BizTableMappingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBizTableMapping>
          }
          groupBy: {
            args: Prisma.BizTableMappingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BizTableMappingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BizTableMappingCountArgs<ExtArgs>
            result: $Utils.Optional<BizTableMappingCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      TaskEvent: {
        payload: Prisma.$TaskEventPayload<ExtArgs>
        fields: Prisma.TaskEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          findFirst: {
            args: Prisma.TaskEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          findMany: {
            args: Prisma.TaskEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>[]
          }
          create: {
            args: Prisma.TaskEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          createMany: {
            args: Prisma.TaskEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>[]
          }
          delete: {
            args: Prisma.TaskEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          update: {
            args: Prisma.TaskEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          deleteMany: {
            args: Prisma.TaskEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>[]
          }
          upsert: {
            args: Prisma.TaskEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          aggregate: {
            args: Prisma.TaskEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskEvent>
          }
          groupBy: {
            args: Prisma.TaskEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskEventCountArgs<ExtArgs>
            result: $Utils.Optional<TaskEventCountAggregateOutputType> | number
          }
        }
      }
      Api: {
        payload: Prisma.$ApiPayload<ExtArgs>
        fields: Prisma.ApiFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>
          }
          findFirst: {
            args: Prisma.ApiFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>
          }
          findMany: {
            args: Prisma.ApiFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>[]
          }
          create: {
            args: Prisma.ApiCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>
          }
          createMany: {
            args: Prisma.ApiCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>[]
          }
          delete: {
            args: Prisma.ApiDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>
          }
          update: {
            args: Prisma.ApiUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>
          }
          deleteMany: {
            args: Prisma.ApiDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>[]
          }
          upsert: {
            args: Prisma.ApiUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiPayload>
          }
          aggregate: {
            args: Prisma.ApiAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApi>
          }
          groupBy: {
            args: Prisma.ApiGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiCountArgs<ExtArgs>
            result: $Utils.Optional<ApiCountAggregateOutputType> | number
          }
        }
      }
      ApiVersion: {
        payload: Prisma.$ApiVersionPayload<ExtArgs>
        fields: Prisma.ApiVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>
          }
          findFirst: {
            args: Prisma.ApiVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>
          }
          findMany: {
            args: Prisma.ApiVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>[]
          }
          create: {
            args: Prisma.ApiVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>
          }
          createMany: {
            args: Prisma.ApiVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>[]
          }
          delete: {
            args: Prisma.ApiVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>
          }
          update: {
            args: Prisma.ApiVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>
          }
          deleteMany: {
            args: Prisma.ApiVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>[]
          }
          upsert: {
            args: Prisma.ApiVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiVersionPayload>
          }
          aggregate: {
            args: Prisma.ApiVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiVersion>
          }
          groupBy: {
            args: Prisma.ApiVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiVersionCountArgs<ExtArgs>
            result: $Utils.Optional<ApiVersionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    skill?: SkillOmit
    skillVersion?: SkillVersionOmit
    user?: UserOmit
    chatSession?: ChatSessionOmit
    chatMessage?: ChatMessageOmit
    keyResource?: KeyResourceOmit
    keyResourceVersion?: KeyResourceVersionOmit
    imageGeneration?: ImageGenerationOmit
    imageGenerationVersion?: ImageGenerationVersionOmit
    mcpServer?: McpServerOmit
    mcpServerVersion?: McpServerVersionOmit
    bizTableMapping?: BizTableMappingOmit
    task?: TaskOmit
    taskEvent?: TaskEventOmit
    api?: ApiOmit
    apiVersion?: ApiVersionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SkillCountOutputType
   */

  export type SkillCountOutputType = {
    versions: number
  }

  export type SkillCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | SkillCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCountOutputType
     */
    select?: SkillCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SkillCountOutputType without action
   */
  export type SkillCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillVersionWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
  }


  /**
   * Count Type ChatSessionCountOutputType
   */

  export type ChatSessionCountOutputType = {
    messages: number
    keyResources: number
    tasks: number
    imageGenerations: number
  }

  export type ChatSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatSessionCountOutputTypeCountMessagesArgs
    keyResources?: boolean | ChatSessionCountOutputTypeCountKeyResourcesArgs
    tasks?: boolean | ChatSessionCountOutputTypeCountTasksArgs
    imageGenerations?: boolean | ChatSessionCountOutputTypeCountImageGenerationsArgs
  }

  // Custom InputTypes
  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSessionCountOutputType
     */
    select?: ChatSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountKeyResourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KeyResourceWhereInput
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountImageGenerationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageGenerationWhereInput
  }


  /**
   * Count Type KeyResourceCountOutputType
   */

  export type KeyResourceCountOutputType = {
    versions: number
  }

  export type KeyResourceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | KeyResourceCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * KeyResourceCountOutputType without action
   */
  export type KeyResourceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceCountOutputType
     */
    select?: KeyResourceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * KeyResourceCountOutputType without action
   */
  export type KeyResourceCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KeyResourceVersionWhereInput
  }


  /**
   * Count Type ImageGenerationCountOutputType
   */

  export type ImageGenerationCountOutputType = {
    versions: number
  }

  export type ImageGenerationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | ImageGenerationCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * ImageGenerationCountOutputType without action
   */
  export type ImageGenerationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationCountOutputType
     */
    select?: ImageGenerationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ImageGenerationCountOutputType without action
   */
  export type ImageGenerationCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageGenerationVersionWhereInput
  }


  /**
   * Count Type McpServerCountOutputType
   */

  export type McpServerCountOutputType = {
    versions: number
  }

  export type McpServerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | McpServerCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * McpServerCountOutputType without action
   */
  export type McpServerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerCountOutputType
     */
    select?: McpServerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * McpServerCountOutputType without action
   */
  export type McpServerCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: McpServerVersionWhereInput
  }


  /**
   * Count Type TaskCountOutputType
   */

  export type TaskCountOutputType = {
    events: number
  }

  export type TaskCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | TaskCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCountOutputType
     */
    select?: TaskCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskEventWhereInput
  }


  /**
   * Count Type ApiCountOutputType
   */

  export type ApiCountOutputType = {
    versions: number
  }

  export type ApiCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | ApiCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * ApiCountOutputType without action
   */
  export type ApiCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiCountOutputType
     */
    select?: ApiCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ApiCountOutputType without action
   */
  export type ApiCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiVersionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Skill
   */

  export type AggregateSkill = {
    _count: SkillCountAggregateOutputType | null
    _avg: SkillAvgAggregateOutputType | null
    _sum: SkillSumAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  export type SkillAvgAggregateOutputType = {
    productionVersion: number | null
  }

  export type SkillSumAggregateOutputType = {
    productionVersion: number | null
  }

  export type SkillMinAggregateOutputType = {
    id: string | null
    name: string | null
    productionVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SkillMaxAggregateOutputType = {
    id: string | null
    name: string | null
    productionVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SkillCountAggregateOutputType = {
    id: number
    name: number
    tags: number
    productionVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SkillAvgAggregateInputType = {
    productionVersion?: true
  }

  export type SkillSumAggregateInputType = {
    productionVersion?: true
  }

  export type SkillMinAggregateInputType = {
    id?: true
    name?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SkillMaxAggregateInputType = {
    id?: true
    name?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SkillCountAggregateInputType = {
    id?: true
    name?: true
    tags?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skill to aggregate.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Skills
    **/
    _count?: true | SkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SkillAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SkillSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SkillMaxAggregateInputType
  }

  export type GetSkillAggregateType<T extends SkillAggregateArgs> = {
        [P in keyof T & keyof AggregateSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSkill[P]>
      : GetScalarType<T[P], AggregateSkill[P]>
  }




  export type SkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillWhereInput
    orderBy?: SkillOrderByWithAggregationInput | SkillOrderByWithAggregationInput[]
    by: SkillScalarFieldEnum[] | SkillScalarFieldEnum
    having?: SkillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SkillCountAggregateInputType | true
    _avg?: SkillAvgAggregateInputType
    _sum?: SkillSumAggregateInputType
    _min?: SkillMinAggregateInputType
    _max?: SkillMaxAggregateInputType
  }

  export type SkillGroupByOutputType = {
    id: string
    name: string
    tags: string[]
    productionVersion: number
    createdAt: Date
    updatedAt: Date
    _count: SkillCountAggregateOutputType | null
    _avg: SkillAvgAggregateOutputType | null
    _sum: SkillSumAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  type GetSkillGroupByPayload<T extends SkillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SkillGroupByOutputType[P]>
            : GetScalarType<T[P], SkillGroupByOutputType[P]>
        }
      >
    >


  export type SkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    tags?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    versions?: boolean | Skill$versionsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    tags?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    tags?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectScalar = {
    id?: boolean
    name?: boolean
    tags?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SkillOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "tags" | "productionVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["skill"]>
  export type SkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | Skill$versionsArgs<ExtArgs>
    _count?: boolean | SkillCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SkillIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Skill"
    objects: {
      versions: Prisma.$SkillVersionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      tags: string[]
      productionVersion: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["skill"]>
    composites: {}
  }

  type SkillGetPayload<S extends boolean | null | undefined | SkillDefaultArgs> = $Result.GetResult<Prisma.$SkillPayload, S>

  type SkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SkillFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SkillCountAggregateInputType | true
    }

  export interface SkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Skill'], meta: { name: 'Skill' } }
    /**
     * Find zero or one Skill that matches the filter.
     * @param {SkillFindUniqueArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SkillFindUniqueArgs>(args: SelectSubset<T, SkillFindUniqueArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Skill that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SkillFindUniqueOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SkillFindUniqueOrThrowArgs>(args: SelectSubset<T, SkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Skill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SkillFindFirstArgs>(args?: SelectSubset<T, SkillFindFirstArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Skill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SkillFindFirstOrThrowArgs>(args?: SelectSubset<T, SkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Skills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Skills
     * const skills = await prisma.skill.findMany()
     * 
     * // Get first 10 Skills
     * const skills = await prisma.skill.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const skillWithIdOnly = await prisma.skill.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SkillFindManyArgs>(args?: SelectSubset<T, SkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Skill.
     * @param {SkillCreateArgs} args - Arguments to create a Skill.
     * @example
     * // Create one Skill
     * const Skill = await prisma.skill.create({
     *   data: {
     *     // ... data to create a Skill
     *   }
     * })
     * 
     */
    create<T extends SkillCreateArgs>(args: SelectSubset<T, SkillCreateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Skills.
     * @param {SkillCreateManyArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SkillCreateManyArgs>(args?: SelectSubset<T, SkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Skills and returns the data saved in the database.
     * @param {SkillCreateManyAndReturnArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Skills and only return the `id`
     * const skillWithIdOnly = await prisma.skill.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SkillCreateManyAndReturnArgs>(args?: SelectSubset<T, SkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Skill.
     * @param {SkillDeleteArgs} args - Arguments to delete one Skill.
     * @example
     * // Delete one Skill
     * const Skill = await prisma.skill.delete({
     *   where: {
     *     // ... filter to delete one Skill
     *   }
     * })
     * 
     */
    delete<T extends SkillDeleteArgs>(args: SelectSubset<T, SkillDeleteArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Skill.
     * @param {SkillUpdateArgs} args - Arguments to update one Skill.
     * @example
     * // Update one Skill
     * const skill = await prisma.skill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SkillUpdateArgs>(args: SelectSubset<T, SkillUpdateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Skills.
     * @param {SkillDeleteManyArgs} args - Arguments to filter Skills to delete.
     * @example
     * // Delete a few Skills
     * const { count } = await prisma.skill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SkillDeleteManyArgs>(args?: SelectSubset<T, SkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Skills
     * const skill = await prisma.skill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SkillUpdateManyArgs>(args: SelectSubset<T, SkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills and returns the data updated in the database.
     * @param {SkillUpdateManyAndReturnArgs} args - Arguments to update many Skills.
     * @example
     * // Update many Skills
     * const skill = await prisma.skill.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Skills and only return the `id`
     * const skillWithIdOnly = await prisma.skill.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SkillUpdateManyAndReturnArgs>(args: SelectSubset<T, SkillUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Skill.
     * @param {SkillUpsertArgs} args - Arguments to update or create a Skill.
     * @example
     * // Update or create a Skill
     * const skill = await prisma.skill.upsert({
     *   create: {
     *     // ... data to create a Skill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Skill we want to update
     *   }
     * })
     */
    upsert<T extends SkillUpsertArgs>(args: SelectSubset<T, SkillUpsertArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCountArgs} args - Arguments to filter Skills to count.
     * @example
     * // Count the number of Skills
     * const count = await prisma.skill.count({
     *   where: {
     *     // ... the filter for the Skills we want to count
     *   }
     * })
    **/
    count<T extends SkillCountArgs>(
      args?: Subset<T, SkillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SkillAggregateArgs>(args: Subset<T, SkillAggregateArgs>): Prisma.PrismaPromise<GetSkillAggregateType<T>>

    /**
     * Group by Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SkillGroupByArgs['orderBy'] }
        : { orderBy?: SkillGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Skill model
   */
  readonly fields: SkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Skill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    versions<T extends Skill$versionsArgs<ExtArgs> = {}>(args?: Subset<T, Skill$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Skill model
   */
  interface SkillFieldRefs {
    readonly id: FieldRef<"Skill", 'String'>
    readonly name: FieldRef<"Skill", 'String'>
    readonly tags: FieldRef<"Skill", 'String[]'>
    readonly productionVersion: FieldRef<"Skill", 'Int'>
    readonly createdAt: FieldRef<"Skill", 'DateTime'>
    readonly updatedAt: FieldRef<"Skill", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Skill findUnique
   */
  export type SkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findUniqueOrThrow
   */
  export type SkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findFirst
   */
  export type SkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findFirstOrThrow
   */
  export type SkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findMany
   */
  export type SkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skills to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill create
   */
  export type SkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to create a Skill.
     */
    data: XOR<SkillCreateInput, SkillUncheckedCreateInput>
  }

  /**
   * Skill createMany
   */
  export type SkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Skill createManyAndReturn
   */
  export type SkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Skill update
   */
  export type SkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to update a Skill.
     */
    data: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
    /**
     * Choose, which Skill to update.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill updateMany
   */
  export type SkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Skills.
     */
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyInput>
    /**
     * Filter which Skills to update
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to update.
     */
    limit?: number
  }

  /**
   * Skill updateManyAndReturn
   */
  export type SkillUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * The data used to update Skills.
     */
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyInput>
    /**
     * Filter which Skills to update
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to update.
     */
    limit?: number
  }

  /**
   * Skill upsert
   */
  export type SkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The filter to search for the Skill to update in case it exists.
     */
    where: SkillWhereUniqueInput
    /**
     * In case the Skill found by the `where` argument doesn't exist, create a new Skill with this data.
     */
    create: XOR<SkillCreateInput, SkillUncheckedCreateInput>
    /**
     * In case the Skill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
  }

  /**
   * Skill delete
   */
  export type SkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter which Skill to delete.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill deleteMany
   */
  export type SkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skills to delete
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to delete.
     */
    limit?: number
  }

  /**
   * Skill.versions
   */
  export type Skill$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    where?: SkillVersionWhereInput
    orderBy?: SkillVersionOrderByWithRelationInput | SkillVersionOrderByWithRelationInput[]
    cursor?: SkillVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SkillVersionScalarFieldEnum | SkillVersionScalarFieldEnum[]
  }

  /**
   * Skill without action
   */
  export type SkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
  }


  /**
   * Model SkillVersion
   */

  export type AggregateSkillVersion = {
    _count: SkillVersionCountAggregateOutputType | null
    _avg: SkillVersionAvgAggregateOutputType | null
    _sum: SkillVersionSumAggregateOutputType | null
    _min: SkillVersionMinAggregateOutputType | null
    _max: SkillVersionMaxAggregateOutputType | null
  }

  export type SkillVersionAvgAggregateOutputType = {
    version: number | null
  }

  export type SkillVersionSumAggregateOutputType = {
    version: number | null
  }

  export type SkillVersionMinAggregateOutputType = {
    id: string | null
    skillId: string | null
    version: number | null
    description: string | null
    content: string | null
    createdAt: Date | null
  }

  export type SkillVersionMaxAggregateOutputType = {
    id: string | null
    skillId: string | null
    version: number | null
    description: string | null
    content: string | null
    createdAt: Date | null
  }

  export type SkillVersionCountAggregateOutputType = {
    id: number
    skillId: number
    version: number
    description: number
    content: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type SkillVersionAvgAggregateInputType = {
    version?: true
  }

  export type SkillVersionSumAggregateInputType = {
    version?: true
  }

  export type SkillVersionMinAggregateInputType = {
    id?: true
    skillId?: true
    version?: true
    description?: true
    content?: true
    createdAt?: true
  }

  export type SkillVersionMaxAggregateInputType = {
    id?: true
    skillId?: true
    version?: true
    description?: true
    content?: true
    createdAt?: true
  }

  export type SkillVersionCountAggregateInputType = {
    id?: true
    skillId?: true
    version?: true
    description?: true
    content?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type SkillVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SkillVersion to aggregate.
     */
    where?: SkillVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillVersions to fetch.
     */
    orderBy?: SkillVersionOrderByWithRelationInput | SkillVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SkillVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SkillVersions
    **/
    _count?: true | SkillVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SkillVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SkillVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SkillVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SkillVersionMaxAggregateInputType
  }

  export type GetSkillVersionAggregateType<T extends SkillVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateSkillVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSkillVersion[P]>
      : GetScalarType<T[P], AggregateSkillVersion[P]>
  }




  export type SkillVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillVersionWhereInput
    orderBy?: SkillVersionOrderByWithAggregationInput | SkillVersionOrderByWithAggregationInput[]
    by: SkillVersionScalarFieldEnum[] | SkillVersionScalarFieldEnum
    having?: SkillVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SkillVersionCountAggregateInputType | true
    _avg?: SkillVersionAvgAggregateInputType
    _sum?: SkillVersionSumAggregateInputType
    _min?: SkillVersionMinAggregateInputType
    _max?: SkillVersionMaxAggregateInputType
  }

  export type SkillVersionGroupByOutputType = {
    id: string
    skillId: string
    version: number
    description: string
    content: string
    metadata: JsonValue | null
    createdAt: Date
    _count: SkillVersionCountAggregateOutputType | null
    _avg: SkillVersionAvgAggregateOutputType | null
    _sum: SkillVersionSumAggregateOutputType | null
    _min: SkillVersionMinAggregateOutputType | null
    _max: SkillVersionMaxAggregateOutputType | null
  }

  type GetSkillVersionGroupByPayload<T extends SkillVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SkillVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SkillVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SkillVersionGroupByOutputType[P]>
            : GetScalarType<T[P], SkillVersionGroupByOutputType[P]>
        }
      >
    >


  export type SkillVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    skillId?: boolean
    version?: boolean
    description?: boolean
    content?: boolean
    metadata?: boolean
    createdAt?: boolean
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillVersion"]>

  export type SkillVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    skillId?: boolean
    version?: boolean
    description?: boolean
    content?: boolean
    metadata?: boolean
    createdAt?: boolean
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillVersion"]>

  export type SkillVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    skillId?: boolean
    version?: boolean
    description?: boolean
    content?: boolean
    metadata?: boolean
    createdAt?: boolean
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillVersion"]>

  export type SkillVersionSelectScalar = {
    id?: boolean
    skillId?: boolean
    version?: boolean
    description?: boolean
    content?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type SkillVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "skillId" | "version" | "description" | "content" | "metadata" | "createdAt", ExtArgs["result"]["skillVersion"]>
  export type SkillVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type SkillVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }
  export type SkillVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skill?: boolean | SkillDefaultArgs<ExtArgs>
  }

  export type $SkillVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SkillVersion"
    objects: {
      skill: Prisma.$SkillPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      skillId: string
      version: number
      description: string
      content: string
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["skillVersion"]>
    composites: {}
  }

  type SkillVersionGetPayload<S extends boolean | null | undefined | SkillVersionDefaultArgs> = $Result.GetResult<Prisma.$SkillVersionPayload, S>

  type SkillVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SkillVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SkillVersionCountAggregateInputType | true
    }

  export interface SkillVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SkillVersion'], meta: { name: 'SkillVersion' } }
    /**
     * Find zero or one SkillVersion that matches the filter.
     * @param {SkillVersionFindUniqueArgs} args - Arguments to find a SkillVersion
     * @example
     * // Get one SkillVersion
     * const skillVersion = await prisma.skillVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SkillVersionFindUniqueArgs>(args: SelectSubset<T, SkillVersionFindUniqueArgs<ExtArgs>>): Prisma__SkillVersionClient<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SkillVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SkillVersionFindUniqueOrThrowArgs} args - Arguments to find a SkillVersion
     * @example
     * // Get one SkillVersion
     * const skillVersion = await prisma.skillVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SkillVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, SkillVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SkillVersionClient<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SkillVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillVersionFindFirstArgs} args - Arguments to find a SkillVersion
     * @example
     * // Get one SkillVersion
     * const skillVersion = await prisma.skillVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SkillVersionFindFirstArgs>(args?: SelectSubset<T, SkillVersionFindFirstArgs<ExtArgs>>): Prisma__SkillVersionClient<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SkillVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillVersionFindFirstOrThrowArgs} args - Arguments to find a SkillVersion
     * @example
     * // Get one SkillVersion
     * const skillVersion = await prisma.skillVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SkillVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, SkillVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SkillVersionClient<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SkillVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SkillVersions
     * const skillVersions = await prisma.skillVersion.findMany()
     * 
     * // Get first 10 SkillVersions
     * const skillVersions = await prisma.skillVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const skillVersionWithIdOnly = await prisma.skillVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SkillVersionFindManyArgs>(args?: SelectSubset<T, SkillVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SkillVersion.
     * @param {SkillVersionCreateArgs} args - Arguments to create a SkillVersion.
     * @example
     * // Create one SkillVersion
     * const SkillVersion = await prisma.skillVersion.create({
     *   data: {
     *     // ... data to create a SkillVersion
     *   }
     * })
     * 
     */
    create<T extends SkillVersionCreateArgs>(args: SelectSubset<T, SkillVersionCreateArgs<ExtArgs>>): Prisma__SkillVersionClient<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SkillVersions.
     * @param {SkillVersionCreateManyArgs} args - Arguments to create many SkillVersions.
     * @example
     * // Create many SkillVersions
     * const skillVersion = await prisma.skillVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SkillVersionCreateManyArgs>(args?: SelectSubset<T, SkillVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SkillVersions and returns the data saved in the database.
     * @param {SkillVersionCreateManyAndReturnArgs} args - Arguments to create many SkillVersions.
     * @example
     * // Create many SkillVersions
     * const skillVersion = await prisma.skillVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SkillVersions and only return the `id`
     * const skillVersionWithIdOnly = await prisma.skillVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SkillVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, SkillVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SkillVersion.
     * @param {SkillVersionDeleteArgs} args - Arguments to delete one SkillVersion.
     * @example
     * // Delete one SkillVersion
     * const SkillVersion = await prisma.skillVersion.delete({
     *   where: {
     *     // ... filter to delete one SkillVersion
     *   }
     * })
     * 
     */
    delete<T extends SkillVersionDeleteArgs>(args: SelectSubset<T, SkillVersionDeleteArgs<ExtArgs>>): Prisma__SkillVersionClient<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SkillVersion.
     * @param {SkillVersionUpdateArgs} args - Arguments to update one SkillVersion.
     * @example
     * // Update one SkillVersion
     * const skillVersion = await prisma.skillVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SkillVersionUpdateArgs>(args: SelectSubset<T, SkillVersionUpdateArgs<ExtArgs>>): Prisma__SkillVersionClient<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SkillVersions.
     * @param {SkillVersionDeleteManyArgs} args - Arguments to filter SkillVersions to delete.
     * @example
     * // Delete a few SkillVersions
     * const { count } = await prisma.skillVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SkillVersionDeleteManyArgs>(args?: SelectSubset<T, SkillVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SkillVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SkillVersions
     * const skillVersion = await prisma.skillVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SkillVersionUpdateManyArgs>(args: SelectSubset<T, SkillVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SkillVersions and returns the data updated in the database.
     * @param {SkillVersionUpdateManyAndReturnArgs} args - Arguments to update many SkillVersions.
     * @example
     * // Update many SkillVersions
     * const skillVersion = await prisma.skillVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SkillVersions and only return the `id`
     * const skillVersionWithIdOnly = await prisma.skillVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SkillVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, SkillVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SkillVersion.
     * @param {SkillVersionUpsertArgs} args - Arguments to update or create a SkillVersion.
     * @example
     * // Update or create a SkillVersion
     * const skillVersion = await prisma.skillVersion.upsert({
     *   create: {
     *     // ... data to create a SkillVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SkillVersion we want to update
     *   }
     * })
     */
    upsert<T extends SkillVersionUpsertArgs>(args: SelectSubset<T, SkillVersionUpsertArgs<ExtArgs>>): Prisma__SkillVersionClient<$Result.GetResult<Prisma.$SkillVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SkillVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillVersionCountArgs} args - Arguments to filter SkillVersions to count.
     * @example
     * // Count the number of SkillVersions
     * const count = await prisma.skillVersion.count({
     *   where: {
     *     // ... the filter for the SkillVersions we want to count
     *   }
     * })
    **/
    count<T extends SkillVersionCountArgs>(
      args?: Subset<T, SkillVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SkillVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SkillVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SkillVersionAggregateArgs>(args: Subset<T, SkillVersionAggregateArgs>): Prisma.PrismaPromise<GetSkillVersionAggregateType<T>>

    /**
     * Group by SkillVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SkillVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SkillVersionGroupByArgs['orderBy'] }
        : { orderBy?: SkillVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SkillVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SkillVersion model
   */
  readonly fields: SkillVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SkillVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SkillVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    skill<T extends SkillDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SkillDefaultArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SkillVersion model
   */
  interface SkillVersionFieldRefs {
    readonly id: FieldRef<"SkillVersion", 'String'>
    readonly skillId: FieldRef<"SkillVersion", 'String'>
    readonly version: FieldRef<"SkillVersion", 'Int'>
    readonly description: FieldRef<"SkillVersion", 'String'>
    readonly content: FieldRef<"SkillVersion", 'String'>
    readonly metadata: FieldRef<"SkillVersion", 'Json'>
    readonly createdAt: FieldRef<"SkillVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SkillVersion findUnique
   */
  export type SkillVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * Filter, which SkillVersion to fetch.
     */
    where: SkillVersionWhereUniqueInput
  }

  /**
   * SkillVersion findUniqueOrThrow
   */
  export type SkillVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * Filter, which SkillVersion to fetch.
     */
    where: SkillVersionWhereUniqueInput
  }

  /**
   * SkillVersion findFirst
   */
  export type SkillVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * Filter, which SkillVersion to fetch.
     */
    where?: SkillVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillVersions to fetch.
     */
    orderBy?: SkillVersionOrderByWithRelationInput | SkillVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SkillVersions.
     */
    cursor?: SkillVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SkillVersions.
     */
    distinct?: SkillVersionScalarFieldEnum | SkillVersionScalarFieldEnum[]
  }

  /**
   * SkillVersion findFirstOrThrow
   */
  export type SkillVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * Filter, which SkillVersion to fetch.
     */
    where?: SkillVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillVersions to fetch.
     */
    orderBy?: SkillVersionOrderByWithRelationInput | SkillVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SkillVersions.
     */
    cursor?: SkillVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SkillVersions.
     */
    distinct?: SkillVersionScalarFieldEnum | SkillVersionScalarFieldEnum[]
  }

  /**
   * SkillVersion findMany
   */
  export type SkillVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * Filter, which SkillVersions to fetch.
     */
    where?: SkillVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillVersions to fetch.
     */
    orderBy?: SkillVersionOrderByWithRelationInput | SkillVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SkillVersions.
     */
    cursor?: SkillVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillVersions.
     */
    skip?: number
    distinct?: SkillVersionScalarFieldEnum | SkillVersionScalarFieldEnum[]
  }

  /**
   * SkillVersion create
   */
  export type SkillVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a SkillVersion.
     */
    data: XOR<SkillVersionCreateInput, SkillVersionUncheckedCreateInput>
  }

  /**
   * SkillVersion createMany
   */
  export type SkillVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SkillVersions.
     */
    data: SkillVersionCreateManyInput | SkillVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SkillVersion createManyAndReturn
   */
  export type SkillVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * The data used to create many SkillVersions.
     */
    data: SkillVersionCreateManyInput | SkillVersionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SkillVersion update
   */
  export type SkillVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a SkillVersion.
     */
    data: XOR<SkillVersionUpdateInput, SkillVersionUncheckedUpdateInput>
    /**
     * Choose, which SkillVersion to update.
     */
    where: SkillVersionWhereUniqueInput
  }

  /**
   * SkillVersion updateMany
   */
  export type SkillVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SkillVersions.
     */
    data: XOR<SkillVersionUpdateManyMutationInput, SkillVersionUncheckedUpdateManyInput>
    /**
     * Filter which SkillVersions to update
     */
    where?: SkillVersionWhereInput
    /**
     * Limit how many SkillVersions to update.
     */
    limit?: number
  }

  /**
   * SkillVersion updateManyAndReturn
   */
  export type SkillVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * The data used to update SkillVersions.
     */
    data: XOR<SkillVersionUpdateManyMutationInput, SkillVersionUncheckedUpdateManyInput>
    /**
     * Filter which SkillVersions to update
     */
    where?: SkillVersionWhereInput
    /**
     * Limit how many SkillVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SkillVersion upsert
   */
  export type SkillVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the SkillVersion to update in case it exists.
     */
    where: SkillVersionWhereUniqueInput
    /**
     * In case the SkillVersion found by the `where` argument doesn't exist, create a new SkillVersion with this data.
     */
    create: XOR<SkillVersionCreateInput, SkillVersionUncheckedCreateInput>
    /**
     * In case the SkillVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SkillVersionUpdateInput, SkillVersionUncheckedUpdateInput>
  }

  /**
   * SkillVersion delete
   */
  export type SkillVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
    /**
     * Filter which SkillVersion to delete.
     */
    where: SkillVersionWhereUniqueInput
  }

  /**
   * SkillVersion deleteMany
   */
  export type SkillVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SkillVersions to delete
     */
    where?: SkillVersionWhereInput
    /**
     * Limit how many SkillVersions to delete.
     */
    limit?: number
  }

  /**
   * SkillVersion without action
   */
  export type SkillVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillVersion
     */
    select?: SkillVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillVersion
     */
    omit?: SkillVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillVersionInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$ChatSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    cursor?: ChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ChatSession
   */

  export type AggregateChatSession = {
    _count: ChatSessionCountAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  export type ChatSessionMinAggregateOutputType = {
    id: string | null
    title: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatSessionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatSessionCountAggregateOutputType = {
    id: number
    title: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChatSessionMinAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatSessionMaxAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatSessionCountAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChatSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSession to aggregate.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatSessions
    **/
    _count?: true | ChatSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatSessionMaxAggregateInputType
  }

  export type GetChatSessionAggregateType<T extends ChatSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateChatSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatSession[P]>
      : GetScalarType<T[P], AggregateChatSession[P]>
  }




  export type ChatSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithAggregationInput | ChatSessionOrderByWithAggregationInput[]
    by: ChatSessionScalarFieldEnum[] | ChatSessionScalarFieldEnum
    having?: ChatSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatSessionCountAggregateInputType | true
    _min?: ChatSessionMinAggregateInputType
    _max?: ChatSessionMaxAggregateInputType
  }

  export type ChatSessionGroupByOutputType = {
    id: string
    title: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: ChatSessionCountAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  type GetChatSessionGroupByPayload<T extends ChatSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
        }
      >
    >


  export type ChatSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    keyResources?: boolean | ChatSession$keyResourcesArgs<ExtArgs>
    tasks?: boolean | ChatSession$tasksArgs<ExtArgs>
    imageGenerations?: boolean | ChatSession$imageGenerationsArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectScalar = {
    id?: boolean
    title?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChatSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["chatSession"]>
  export type ChatSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    keyResources?: boolean | ChatSession$keyResourcesArgs<ExtArgs>
    tasks?: boolean | ChatSession$tasksArgs<ExtArgs>
    imageGenerations?: boolean | ChatSession$imageGenerationsArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChatSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      messages: Prisma.$ChatMessagePayload<ExtArgs>[]
      keyResources: Prisma.$KeyResourcePayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      imageGenerations: Prisma.$ImageGenerationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chatSession"]>
    composites: {}
  }

  type ChatSessionGetPayload<S extends boolean | null | undefined | ChatSessionDefaultArgs> = $Result.GetResult<Prisma.$ChatSessionPayload, S>

  type ChatSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatSessionCountAggregateInputType | true
    }

  export interface ChatSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatSession'], meta: { name: 'ChatSession' } }
    /**
     * Find zero or one ChatSession that matches the filter.
     * @param {ChatSessionFindUniqueArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatSessionFindUniqueArgs>(args: SelectSubset<T, ChatSessionFindUniqueArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatSessionFindUniqueOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatSessionFindFirstArgs>(args?: SelectSubset<T, ChatSessionFindFirstArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatSessions
     * const chatSessions = await prisma.chatSession.findMany()
     * 
     * // Get first 10 ChatSessions
     * const chatSessions = await prisma.chatSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatSessionFindManyArgs>(args?: SelectSubset<T, ChatSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatSession.
     * @param {ChatSessionCreateArgs} args - Arguments to create a ChatSession.
     * @example
     * // Create one ChatSession
     * const ChatSession = await prisma.chatSession.create({
     *   data: {
     *     // ... data to create a ChatSession
     *   }
     * })
     * 
     */
    create<T extends ChatSessionCreateArgs>(args: SelectSubset<T, ChatSessionCreateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatSessions.
     * @param {ChatSessionCreateManyArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatSessionCreateManyArgs>(args?: SelectSubset<T, ChatSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatSessions and returns the data saved in the database.
     * @param {ChatSessionCreateManyAndReturnArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatSession.
     * @param {ChatSessionDeleteArgs} args - Arguments to delete one ChatSession.
     * @example
     * // Delete one ChatSession
     * const ChatSession = await prisma.chatSession.delete({
     *   where: {
     *     // ... filter to delete one ChatSession
     *   }
     * })
     * 
     */
    delete<T extends ChatSessionDeleteArgs>(args: SelectSubset<T, ChatSessionDeleteArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatSession.
     * @param {ChatSessionUpdateArgs} args - Arguments to update one ChatSession.
     * @example
     * // Update one ChatSession
     * const chatSession = await prisma.chatSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatSessionUpdateArgs>(args: SelectSubset<T, ChatSessionUpdateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatSessions.
     * @param {ChatSessionDeleteManyArgs} args - Arguments to filter ChatSessions to delete.
     * @example
     * // Delete a few ChatSessions
     * const { count } = await prisma.chatSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatSessionDeleteManyArgs>(args?: SelectSubset<T, ChatSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatSessionUpdateManyArgs>(args: SelectSubset<T, ChatSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions and returns the data updated in the database.
     * @param {ChatSessionUpdateManyAndReturnArgs} args - Arguments to update many ChatSessions.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatSession.
     * @param {ChatSessionUpsertArgs} args - Arguments to update or create a ChatSession.
     * @example
     * // Update or create a ChatSession
     * const chatSession = await prisma.chatSession.upsert({
     *   create: {
     *     // ... data to create a ChatSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatSession we want to update
     *   }
     * })
     */
    upsert<T extends ChatSessionUpsertArgs>(args: SelectSubset<T, ChatSessionUpsertArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionCountArgs} args - Arguments to filter ChatSessions to count.
     * @example
     * // Count the number of ChatSessions
     * const count = await prisma.chatSession.count({
     *   where: {
     *     // ... the filter for the ChatSessions we want to count
     *   }
     * })
    **/
    count<T extends ChatSessionCountArgs>(
      args?: Subset<T, ChatSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatSessionAggregateArgs>(args: Subset<T, ChatSessionAggregateArgs>): Prisma.PrismaPromise<GetChatSessionAggregateType<T>>

    /**
     * Group by ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatSessionGroupByArgs['orderBy'] }
        : { orderBy?: ChatSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatSession model
   */
  readonly fields: ChatSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends ChatSession$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    keyResources<T extends ChatSession$keyResourcesArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$keyResourcesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tasks<T extends ChatSession$tasksArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    imageGenerations<T extends ChatSession$imageGenerationsArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$imageGenerationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatSession model
   */
  interface ChatSessionFieldRefs {
    readonly id: FieldRef<"ChatSession", 'String'>
    readonly title: FieldRef<"ChatSession", 'String'>
    readonly userId: FieldRef<"ChatSession", 'String'>
    readonly createdAt: FieldRef<"ChatSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatSession findUnique
   */
  export type ChatSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findUniqueOrThrow
   */
  export type ChatSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findFirst
   */
  export type ChatSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findFirstOrThrow
   */
  export type ChatSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findMany
   */
  export type ChatSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSessions to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession create
   */
  export type ChatSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatSession.
     */
    data: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
  }

  /**
   * ChatSession createMany
   */
  export type ChatSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatSession createManyAndReturn
   */
  export type ChatSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession update
   */
  export type ChatSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatSession.
     */
    data: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
    /**
     * Choose, which ChatSession to update.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession updateMany
   */
  export type ChatSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to update.
     */
    limit?: number
  }

  /**
   * ChatSession updateManyAndReturn
   */
  export type ChatSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession upsert
   */
  export type ChatSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatSession to update in case it exists.
     */
    where: ChatSessionWhereUniqueInput
    /**
     * In case the ChatSession found by the `where` argument doesn't exist, create a new ChatSession with this data.
     */
    create: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
    /**
     * In case the ChatSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
  }

  /**
   * ChatSession delete
   */
  export type ChatSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter which ChatSession to delete.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession deleteMany
   */
  export type ChatSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSessions to delete
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to delete.
     */
    limit?: number
  }

  /**
   * ChatSession.messages
   */
  export type ChatSession$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatSession.keyResources
   */
  export type ChatSession$keyResourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    where?: KeyResourceWhereInput
    orderBy?: KeyResourceOrderByWithRelationInput | KeyResourceOrderByWithRelationInput[]
    cursor?: KeyResourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KeyResourceScalarFieldEnum | KeyResourceScalarFieldEnum[]
  }

  /**
   * ChatSession.tasks
   */
  export type ChatSession$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * ChatSession.imageGenerations
   */
  export type ChatSession$imageGenerationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    where?: ImageGenerationWhereInput
    orderBy?: ImageGenerationOrderByWithRelationInput | ImageGenerationOrderByWithRelationInput[]
    cursor?: ImageGenerationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageGenerationScalarFieldEnum | ImageGenerationScalarFieldEnum[]
  }

  /**
   * ChatSession without action
   */
  export type ChatSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    toolCallId: string | null
    hidden: boolean | null
    createdAt: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    toolCallId: string | null
    hidden: boolean | null
    createdAt: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    sessionId: number
    role: number
    content: number
    images: number
    toolCalls: number
    toolCallId: number
    hidden: number
    createdAt: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    toolCallId?: true
    hidden?: true
    createdAt?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    toolCallId?: true
    hidden?: true
    createdAt?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    images?: true
    toolCalls?: true
    toolCallId?: true
    hidden?: true
    createdAt?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    sessionId: string
    role: string
    content: string | null
    images: string[]
    toolCalls: JsonValue | null
    toolCallId: string | null
    hidden: boolean
    createdAt: Date
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    images?: boolean
    toolCalls?: boolean
    toolCallId?: boolean
    hidden?: boolean
    createdAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    images?: boolean
    toolCalls?: boolean
    toolCallId?: boolean
    hidden?: boolean
    createdAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    images?: boolean
    toolCalls?: boolean
    toolCallId?: boolean
    hidden?: boolean
    createdAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    images?: boolean
    toolCalls?: boolean
    toolCallId?: boolean
    hidden?: boolean
    createdAt?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "role" | "content" | "images" | "toolCalls" | "toolCallId" | "hidden" | "createdAt", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      session: Prisma.$ChatSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      role: string
      content: string | null
      images: string[]
      toolCalls: Prisma.JsonValue | null
      toolCallId: string | null
      hidden: boolean
      createdAt: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages and returns the data updated in the database.
     * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends ChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatSessionDefaultArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly sessionId: FieldRef<"ChatMessage", 'String'>
    readonly role: FieldRef<"ChatMessage", 'String'>
    readonly content: FieldRef<"ChatMessage", 'String'>
    readonly images: FieldRef<"ChatMessage", 'String[]'>
    readonly toolCalls: FieldRef<"ChatMessage", 'Json'>
    readonly toolCallId: FieldRef<"ChatMessage", 'String'>
    readonly hidden: FieldRef<"ChatMessage", 'Boolean'>
    readonly createdAt: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage updateManyAndReturn
   */
  export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model KeyResource
   */

  export type AggregateKeyResource = {
    _count: KeyResourceCountAggregateOutputType | null
    _avg: KeyResourceAvgAggregateOutputType | null
    _sum: KeyResourceSumAggregateOutputType | null
    _min: KeyResourceMinAggregateOutputType | null
    _max: KeyResourceMaxAggregateOutputType | null
  }

  export type KeyResourceAvgAggregateOutputType = {
    currentVersion: number | null
  }

  export type KeyResourceSumAggregateOutputType = {
    currentVersion: number | null
  }

  export type KeyResourceMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    key: string | null
    mediaType: string | null
    currentVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KeyResourceMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    key: string | null
    mediaType: string | null
    currentVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KeyResourceCountAggregateOutputType = {
    id: number
    sessionId: number
    key: number
    mediaType: number
    currentVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KeyResourceAvgAggregateInputType = {
    currentVersion?: true
  }

  export type KeyResourceSumAggregateInputType = {
    currentVersion?: true
  }

  export type KeyResourceMinAggregateInputType = {
    id?: true
    sessionId?: true
    key?: true
    mediaType?: true
    currentVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KeyResourceMaxAggregateInputType = {
    id?: true
    sessionId?: true
    key?: true
    mediaType?: true
    currentVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KeyResourceCountAggregateInputType = {
    id?: true
    sessionId?: true
    key?: true
    mediaType?: true
    currentVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KeyResourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KeyResource to aggregate.
     */
    where?: KeyResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeyResources to fetch.
     */
    orderBy?: KeyResourceOrderByWithRelationInput | KeyResourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KeyResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeyResources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeyResources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KeyResources
    **/
    _count?: true | KeyResourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KeyResourceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KeyResourceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KeyResourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KeyResourceMaxAggregateInputType
  }

  export type GetKeyResourceAggregateType<T extends KeyResourceAggregateArgs> = {
        [P in keyof T & keyof AggregateKeyResource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKeyResource[P]>
      : GetScalarType<T[P], AggregateKeyResource[P]>
  }




  export type KeyResourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KeyResourceWhereInput
    orderBy?: KeyResourceOrderByWithAggregationInput | KeyResourceOrderByWithAggregationInput[]
    by: KeyResourceScalarFieldEnum[] | KeyResourceScalarFieldEnum
    having?: KeyResourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KeyResourceCountAggregateInputType | true
    _avg?: KeyResourceAvgAggregateInputType
    _sum?: KeyResourceSumAggregateInputType
    _min?: KeyResourceMinAggregateInputType
    _max?: KeyResourceMaxAggregateInputType
  }

  export type KeyResourceGroupByOutputType = {
    id: string
    sessionId: string
    key: string
    mediaType: string
    currentVersion: number
    createdAt: Date
    updatedAt: Date
    _count: KeyResourceCountAggregateOutputType | null
    _avg: KeyResourceAvgAggregateOutputType | null
    _sum: KeyResourceSumAggregateOutputType | null
    _min: KeyResourceMinAggregateOutputType | null
    _max: KeyResourceMaxAggregateOutputType | null
  }

  type GetKeyResourceGroupByPayload<T extends KeyResourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KeyResourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KeyResourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KeyResourceGroupByOutputType[P]>
            : GetScalarType<T[P], KeyResourceGroupByOutputType[P]>
        }
      >
    >


  export type KeyResourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    key?: boolean
    mediaType?: boolean
    currentVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    versions?: boolean | KeyResource$versionsArgs<ExtArgs>
    _count?: boolean | KeyResourceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyResource"]>

  export type KeyResourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    key?: boolean
    mediaType?: boolean
    currentVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyResource"]>

  export type KeyResourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    key?: boolean
    mediaType?: boolean
    currentVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyResource"]>

  export type KeyResourceSelectScalar = {
    id?: boolean
    sessionId?: boolean
    key?: boolean
    mediaType?: boolean
    currentVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KeyResourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "key" | "mediaType" | "currentVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["keyResource"]>
  export type KeyResourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    versions?: boolean | KeyResource$versionsArgs<ExtArgs>
    _count?: boolean | KeyResourceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type KeyResourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type KeyResourceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }

  export type $KeyResourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KeyResource"
    objects: {
      session: Prisma.$ChatSessionPayload<ExtArgs>
      versions: Prisma.$KeyResourceVersionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      key: string
      mediaType: string
      currentVersion: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["keyResource"]>
    composites: {}
  }

  type KeyResourceGetPayload<S extends boolean | null | undefined | KeyResourceDefaultArgs> = $Result.GetResult<Prisma.$KeyResourcePayload, S>

  type KeyResourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KeyResourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KeyResourceCountAggregateInputType | true
    }

  export interface KeyResourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KeyResource'], meta: { name: 'KeyResource' } }
    /**
     * Find zero or one KeyResource that matches the filter.
     * @param {KeyResourceFindUniqueArgs} args - Arguments to find a KeyResource
     * @example
     * // Get one KeyResource
     * const keyResource = await prisma.keyResource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KeyResourceFindUniqueArgs>(args: SelectSubset<T, KeyResourceFindUniqueArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KeyResource that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KeyResourceFindUniqueOrThrowArgs} args - Arguments to find a KeyResource
     * @example
     * // Get one KeyResource
     * const keyResource = await prisma.keyResource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KeyResourceFindUniqueOrThrowArgs>(args: SelectSubset<T, KeyResourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KeyResource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceFindFirstArgs} args - Arguments to find a KeyResource
     * @example
     * // Get one KeyResource
     * const keyResource = await prisma.keyResource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KeyResourceFindFirstArgs>(args?: SelectSubset<T, KeyResourceFindFirstArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KeyResource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceFindFirstOrThrowArgs} args - Arguments to find a KeyResource
     * @example
     * // Get one KeyResource
     * const keyResource = await prisma.keyResource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KeyResourceFindFirstOrThrowArgs>(args?: SelectSubset<T, KeyResourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KeyResources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KeyResources
     * const keyResources = await prisma.keyResource.findMany()
     * 
     * // Get first 10 KeyResources
     * const keyResources = await prisma.keyResource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const keyResourceWithIdOnly = await prisma.keyResource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KeyResourceFindManyArgs>(args?: SelectSubset<T, KeyResourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KeyResource.
     * @param {KeyResourceCreateArgs} args - Arguments to create a KeyResource.
     * @example
     * // Create one KeyResource
     * const KeyResource = await prisma.keyResource.create({
     *   data: {
     *     // ... data to create a KeyResource
     *   }
     * })
     * 
     */
    create<T extends KeyResourceCreateArgs>(args: SelectSubset<T, KeyResourceCreateArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KeyResources.
     * @param {KeyResourceCreateManyArgs} args - Arguments to create many KeyResources.
     * @example
     * // Create many KeyResources
     * const keyResource = await prisma.keyResource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KeyResourceCreateManyArgs>(args?: SelectSubset<T, KeyResourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KeyResources and returns the data saved in the database.
     * @param {KeyResourceCreateManyAndReturnArgs} args - Arguments to create many KeyResources.
     * @example
     * // Create many KeyResources
     * const keyResource = await prisma.keyResource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KeyResources and only return the `id`
     * const keyResourceWithIdOnly = await prisma.keyResource.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KeyResourceCreateManyAndReturnArgs>(args?: SelectSubset<T, KeyResourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KeyResource.
     * @param {KeyResourceDeleteArgs} args - Arguments to delete one KeyResource.
     * @example
     * // Delete one KeyResource
     * const KeyResource = await prisma.keyResource.delete({
     *   where: {
     *     // ... filter to delete one KeyResource
     *   }
     * })
     * 
     */
    delete<T extends KeyResourceDeleteArgs>(args: SelectSubset<T, KeyResourceDeleteArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KeyResource.
     * @param {KeyResourceUpdateArgs} args - Arguments to update one KeyResource.
     * @example
     * // Update one KeyResource
     * const keyResource = await prisma.keyResource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KeyResourceUpdateArgs>(args: SelectSubset<T, KeyResourceUpdateArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KeyResources.
     * @param {KeyResourceDeleteManyArgs} args - Arguments to filter KeyResources to delete.
     * @example
     * // Delete a few KeyResources
     * const { count } = await prisma.keyResource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KeyResourceDeleteManyArgs>(args?: SelectSubset<T, KeyResourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KeyResources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KeyResources
     * const keyResource = await prisma.keyResource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KeyResourceUpdateManyArgs>(args: SelectSubset<T, KeyResourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KeyResources and returns the data updated in the database.
     * @param {KeyResourceUpdateManyAndReturnArgs} args - Arguments to update many KeyResources.
     * @example
     * // Update many KeyResources
     * const keyResource = await prisma.keyResource.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KeyResources and only return the `id`
     * const keyResourceWithIdOnly = await prisma.keyResource.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KeyResourceUpdateManyAndReturnArgs>(args: SelectSubset<T, KeyResourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KeyResource.
     * @param {KeyResourceUpsertArgs} args - Arguments to update or create a KeyResource.
     * @example
     * // Update or create a KeyResource
     * const keyResource = await prisma.keyResource.upsert({
     *   create: {
     *     // ... data to create a KeyResource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KeyResource we want to update
     *   }
     * })
     */
    upsert<T extends KeyResourceUpsertArgs>(args: SelectSubset<T, KeyResourceUpsertArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KeyResources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceCountArgs} args - Arguments to filter KeyResources to count.
     * @example
     * // Count the number of KeyResources
     * const count = await prisma.keyResource.count({
     *   where: {
     *     // ... the filter for the KeyResources we want to count
     *   }
     * })
    **/
    count<T extends KeyResourceCountArgs>(
      args?: Subset<T, KeyResourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KeyResourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KeyResource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KeyResourceAggregateArgs>(args: Subset<T, KeyResourceAggregateArgs>): Prisma.PrismaPromise<GetKeyResourceAggregateType<T>>

    /**
     * Group by KeyResource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KeyResourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KeyResourceGroupByArgs['orderBy'] }
        : { orderBy?: KeyResourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KeyResourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKeyResourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KeyResource model
   */
  readonly fields: KeyResourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KeyResource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KeyResourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends ChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatSessionDefaultArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    versions<T extends KeyResource$versionsArgs<ExtArgs> = {}>(args?: Subset<T, KeyResource$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KeyResource model
   */
  interface KeyResourceFieldRefs {
    readonly id: FieldRef<"KeyResource", 'String'>
    readonly sessionId: FieldRef<"KeyResource", 'String'>
    readonly key: FieldRef<"KeyResource", 'String'>
    readonly mediaType: FieldRef<"KeyResource", 'String'>
    readonly currentVersion: FieldRef<"KeyResource", 'Int'>
    readonly createdAt: FieldRef<"KeyResource", 'DateTime'>
    readonly updatedAt: FieldRef<"KeyResource", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KeyResource findUnique
   */
  export type KeyResourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * Filter, which KeyResource to fetch.
     */
    where: KeyResourceWhereUniqueInput
  }

  /**
   * KeyResource findUniqueOrThrow
   */
  export type KeyResourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * Filter, which KeyResource to fetch.
     */
    where: KeyResourceWhereUniqueInput
  }

  /**
   * KeyResource findFirst
   */
  export type KeyResourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * Filter, which KeyResource to fetch.
     */
    where?: KeyResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeyResources to fetch.
     */
    orderBy?: KeyResourceOrderByWithRelationInput | KeyResourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KeyResources.
     */
    cursor?: KeyResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeyResources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeyResources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KeyResources.
     */
    distinct?: KeyResourceScalarFieldEnum | KeyResourceScalarFieldEnum[]
  }

  /**
   * KeyResource findFirstOrThrow
   */
  export type KeyResourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * Filter, which KeyResource to fetch.
     */
    where?: KeyResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeyResources to fetch.
     */
    orderBy?: KeyResourceOrderByWithRelationInput | KeyResourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KeyResources.
     */
    cursor?: KeyResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeyResources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeyResources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KeyResources.
     */
    distinct?: KeyResourceScalarFieldEnum | KeyResourceScalarFieldEnum[]
  }

  /**
   * KeyResource findMany
   */
  export type KeyResourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * Filter, which KeyResources to fetch.
     */
    where?: KeyResourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeyResources to fetch.
     */
    orderBy?: KeyResourceOrderByWithRelationInput | KeyResourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KeyResources.
     */
    cursor?: KeyResourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeyResources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeyResources.
     */
    skip?: number
    distinct?: KeyResourceScalarFieldEnum | KeyResourceScalarFieldEnum[]
  }

  /**
   * KeyResource create
   */
  export type KeyResourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * The data needed to create a KeyResource.
     */
    data: XOR<KeyResourceCreateInput, KeyResourceUncheckedCreateInput>
  }

  /**
   * KeyResource createMany
   */
  export type KeyResourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KeyResources.
     */
    data: KeyResourceCreateManyInput | KeyResourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KeyResource createManyAndReturn
   */
  export type KeyResourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * The data used to create many KeyResources.
     */
    data: KeyResourceCreateManyInput | KeyResourceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KeyResource update
   */
  export type KeyResourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * The data needed to update a KeyResource.
     */
    data: XOR<KeyResourceUpdateInput, KeyResourceUncheckedUpdateInput>
    /**
     * Choose, which KeyResource to update.
     */
    where: KeyResourceWhereUniqueInput
  }

  /**
   * KeyResource updateMany
   */
  export type KeyResourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KeyResources.
     */
    data: XOR<KeyResourceUpdateManyMutationInput, KeyResourceUncheckedUpdateManyInput>
    /**
     * Filter which KeyResources to update
     */
    where?: KeyResourceWhereInput
    /**
     * Limit how many KeyResources to update.
     */
    limit?: number
  }

  /**
   * KeyResource updateManyAndReturn
   */
  export type KeyResourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * The data used to update KeyResources.
     */
    data: XOR<KeyResourceUpdateManyMutationInput, KeyResourceUncheckedUpdateManyInput>
    /**
     * Filter which KeyResources to update
     */
    where?: KeyResourceWhereInput
    /**
     * Limit how many KeyResources to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KeyResource upsert
   */
  export type KeyResourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * The filter to search for the KeyResource to update in case it exists.
     */
    where: KeyResourceWhereUniqueInput
    /**
     * In case the KeyResource found by the `where` argument doesn't exist, create a new KeyResource with this data.
     */
    create: XOR<KeyResourceCreateInput, KeyResourceUncheckedCreateInput>
    /**
     * In case the KeyResource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KeyResourceUpdateInput, KeyResourceUncheckedUpdateInput>
  }

  /**
   * KeyResource delete
   */
  export type KeyResourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
    /**
     * Filter which KeyResource to delete.
     */
    where: KeyResourceWhereUniqueInput
  }

  /**
   * KeyResource deleteMany
   */
  export type KeyResourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KeyResources to delete
     */
    where?: KeyResourceWhereInput
    /**
     * Limit how many KeyResources to delete.
     */
    limit?: number
  }

  /**
   * KeyResource.versions
   */
  export type KeyResource$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    where?: KeyResourceVersionWhereInput
    orderBy?: KeyResourceVersionOrderByWithRelationInput | KeyResourceVersionOrderByWithRelationInput[]
    cursor?: KeyResourceVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KeyResourceVersionScalarFieldEnum | KeyResourceVersionScalarFieldEnum[]
  }

  /**
   * KeyResource without action
   */
  export type KeyResourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResource
     */
    select?: KeyResourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResource
     */
    omit?: KeyResourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceInclude<ExtArgs> | null
  }


  /**
   * Model KeyResourceVersion
   */

  export type AggregateKeyResourceVersion = {
    _count: KeyResourceVersionCountAggregateOutputType | null
    _avg: KeyResourceVersionAvgAggregateOutputType | null
    _sum: KeyResourceVersionSumAggregateOutputType | null
    _min: KeyResourceVersionMinAggregateOutputType | null
    _max: KeyResourceVersionMaxAggregateOutputType | null
  }

  export type KeyResourceVersionAvgAggregateOutputType = {
    version: number | null
  }

  export type KeyResourceVersionSumAggregateOutputType = {
    version: number | null
  }

  export type KeyResourceVersionMinAggregateOutputType = {
    id: string | null
    keyResourceId: string | null
    version: number | null
    title: string | null
    url: string | null
    prompt: string | null
    createdAt: Date | null
  }

  export type KeyResourceVersionMaxAggregateOutputType = {
    id: string | null
    keyResourceId: string | null
    version: number | null
    title: string | null
    url: string | null
    prompt: string | null
    createdAt: Date | null
  }

  export type KeyResourceVersionCountAggregateOutputType = {
    id: number
    keyResourceId: number
    version: number
    title: number
    url: number
    data: number
    prompt: number
    refUrls: number
    createdAt: number
    _all: number
  }


  export type KeyResourceVersionAvgAggregateInputType = {
    version?: true
  }

  export type KeyResourceVersionSumAggregateInputType = {
    version?: true
  }

  export type KeyResourceVersionMinAggregateInputType = {
    id?: true
    keyResourceId?: true
    version?: true
    title?: true
    url?: true
    prompt?: true
    createdAt?: true
  }

  export type KeyResourceVersionMaxAggregateInputType = {
    id?: true
    keyResourceId?: true
    version?: true
    title?: true
    url?: true
    prompt?: true
    createdAt?: true
  }

  export type KeyResourceVersionCountAggregateInputType = {
    id?: true
    keyResourceId?: true
    version?: true
    title?: true
    url?: true
    data?: true
    prompt?: true
    refUrls?: true
    createdAt?: true
    _all?: true
  }

  export type KeyResourceVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KeyResourceVersion to aggregate.
     */
    where?: KeyResourceVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeyResourceVersions to fetch.
     */
    orderBy?: KeyResourceVersionOrderByWithRelationInput | KeyResourceVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KeyResourceVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeyResourceVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeyResourceVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KeyResourceVersions
    **/
    _count?: true | KeyResourceVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KeyResourceVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KeyResourceVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KeyResourceVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KeyResourceVersionMaxAggregateInputType
  }

  export type GetKeyResourceVersionAggregateType<T extends KeyResourceVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateKeyResourceVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKeyResourceVersion[P]>
      : GetScalarType<T[P], AggregateKeyResourceVersion[P]>
  }




  export type KeyResourceVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KeyResourceVersionWhereInput
    orderBy?: KeyResourceVersionOrderByWithAggregationInput | KeyResourceVersionOrderByWithAggregationInput[]
    by: KeyResourceVersionScalarFieldEnum[] | KeyResourceVersionScalarFieldEnum
    having?: KeyResourceVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KeyResourceVersionCountAggregateInputType | true
    _avg?: KeyResourceVersionAvgAggregateInputType
    _sum?: KeyResourceVersionSumAggregateInputType
    _min?: KeyResourceVersionMinAggregateInputType
    _max?: KeyResourceVersionMaxAggregateInputType
  }

  export type KeyResourceVersionGroupByOutputType = {
    id: string
    keyResourceId: string
    version: number
    title: string | null
    url: string | null
    data: JsonValue | null
    prompt: string | null
    refUrls: string[]
    createdAt: Date
    _count: KeyResourceVersionCountAggregateOutputType | null
    _avg: KeyResourceVersionAvgAggregateOutputType | null
    _sum: KeyResourceVersionSumAggregateOutputType | null
    _min: KeyResourceVersionMinAggregateOutputType | null
    _max: KeyResourceVersionMaxAggregateOutputType | null
  }

  type GetKeyResourceVersionGroupByPayload<T extends KeyResourceVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KeyResourceVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KeyResourceVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KeyResourceVersionGroupByOutputType[P]>
            : GetScalarType<T[P], KeyResourceVersionGroupByOutputType[P]>
        }
      >
    >


  export type KeyResourceVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keyResourceId?: boolean
    version?: boolean
    title?: boolean
    url?: boolean
    data?: boolean
    prompt?: boolean
    refUrls?: boolean
    createdAt?: boolean
    keyResource?: boolean | KeyResourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyResourceVersion"]>

  export type KeyResourceVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keyResourceId?: boolean
    version?: boolean
    title?: boolean
    url?: boolean
    data?: boolean
    prompt?: boolean
    refUrls?: boolean
    createdAt?: boolean
    keyResource?: boolean | KeyResourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyResourceVersion"]>

  export type KeyResourceVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keyResourceId?: boolean
    version?: boolean
    title?: boolean
    url?: boolean
    data?: boolean
    prompt?: boolean
    refUrls?: boolean
    createdAt?: boolean
    keyResource?: boolean | KeyResourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["keyResourceVersion"]>

  export type KeyResourceVersionSelectScalar = {
    id?: boolean
    keyResourceId?: boolean
    version?: boolean
    title?: boolean
    url?: boolean
    data?: boolean
    prompt?: boolean
    refUrls?: boolean
    createdAt?: boolean
  }

  export type KeyResourceVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "keyResourceId" | "version" | "title" | "url" | "data" | "prompt" | "refUrls" | "createdAt", ExtArgs["result"]["keyResourceVersion"]>
  export type KeyResourceVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    keyResource?: boolean | KeyResourceDefaultArgs<ExtArgs>
  }
  export type KeyResourceVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    keyResource?: boolean | KeyResourceDefaultArgs<ExtArgs>
  }
  export type KeyResourceVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    keyResource?: boolean | KeyResourceDefaultArgs<ExtArgs>
  }

  export type $KeyResourceVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KeyResourceVersion"
    objects: {
      keyResource: Prisma.$KeyResourcePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      keyResourceId: string
      version: number
      title: string | null
      url: string | null
      data: Prisma.JsonValue | null
      prompt: string | null
      refUrls: string[]
      createdAt: Date
    }, ExtArgs["result"]["keyResourceVersion"]>
    composites: {}
  }

  type KeyResourceVersionGetPayload<S extends boolean | null | undefined | KeyResourceVersionDefaultArgs> = $Result.GetResult<Prisma.$KeyResourceVersionPayload, S>

  type KeyResourceVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KeyResourceVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KeyResourceVersionCountAggregateInputType | true
    }

  export interface KeyResourceVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KeyResourceVersion'], meta: { name: 'KeyResourceVersion' } }
    /**
     * Find zero or one KeyResourceVersion that matches the filter.
     * @param {KeyResourceVersionFindUniqueArgs} args - Arguments to find a KeyResourceVersion
     * @example
     * // Get one KeyResourceVersion
     * const keyResourceVersion = await prisma.keyResourceVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KeyResourceVersionFindUniqueArgs>(args: SelectSubset<T, KeyResourceVersionFindUniqueArgs<ExtArgs>>): Prisma__KeyResourceVersionClient<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KeyResourceVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KeyResourceVersionFindUniqueOrThrowArgs} args - Arguments to find a KeyResourceVersion
     * @example
     * // Get one KeyResourceVersion
     * const keyResourceVersion = await prisma.keyResourceVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KeyResourceVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, KeyResourceVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KeyResourceVersionClient<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KeyResourceVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceVersionFindFirstArgs} args - Arguments to find a KeyResourceVersion
     * @example
     * // Get one KeyResourceVersion
     * const keyResourceVersion = await prisma.keyResourceVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KeyResourceVersionFindFirstArgs>(args?: SelectSubset<T, KeyResourceVersionFindFirstArgs<ExtArgs>>): Prisma__KeyResourceVersionClient<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KeyResourceVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceVersionFindFirstOrThrowArgs} args - Arguments to find a KeyResourceVersion
     * @example
     * // Get one KeyResourceVersion
     * const keyResourceVersion = await prisma.keyResourceVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KeyResourceVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, KeyResourceVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__KeyResourceVersionClient<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KeyResourceVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KeyResourceVersions
     * const keyResourceVersions = await prisma.keyResourceVersion.findMany()
     * 
     * // Get first 10 KeyResourceVersions
     * const keyResourceVersions = await prisma.keyResourceVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const keyResourceVersionWithIdOnly = await prisma.keyResourceVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KeyResourceVersionFindManyArgs>(args?: SelectSubset<T, KeyResourceVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KeyResourceVersion.
     * @param {KeyResourceVersionCreateArgs} args - Arguments to create a KeyResourceVersion.
     * @example
     * // Create one KeyResourceVersion
     * const KeyResourceVersion = await prisma.keyResourceVersion.create({
     *   data: {
     *     // ... data to create a KeyResourceVersion
     *   }
     * })
     * 
     */
    create<T extends KeyResourceVersionCreateArgs>(args: SelectSubset<T, KeyResourceVersionCreateArgs<ExtArgs>>): Prisma__KeyResourceVersionClient<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KeyResourceVersions.
     * @param {KeyResourceVersionCreateManyArgs} args - Arguments to create many KeyResourceVersions.
     * @example
     * // Create many KeyResourceVersions
     * const keyResourceVersion = await prisma.keyResourceVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KeyResourceVersionCreateManyArgs>(args?: SelectSubset<T, KeyResourceVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KeyResourceVersions and returns the data saved in the database.
     * @param {KeyResourceVersionCreateManyAndReturnArgs} args - Arguments to create many KeyResourceVersions.
     * @example
     * // Create many KeyResourceVersions
     * const keyResourceVersion = await prisma.keyResourceVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KeyResourceVersions and only return the `id`
     * const keyResourceVersionWithIdOnly = await prisma.keyResourceVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KeyResourceVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, KeyResourceVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KeyResourceVersion.
     * @param {KeyResourceVersionDeleteArgs} args - Arguments to delete one KeyResourceVersion.
     * @example
     * // Delete one KeyResourceVersion
     * const KeyResourceVersion = await prisma.keyResourceVersion.delete({
     *   where: {
     *     // ... filter to delete one KeyResourceVersion
     *   }
     * })
     * 
     */
    delete<T extends KeyResourceVersionDeleteArgs>(args: SelectSubset<T, KeyResourceVersionDeleteArgs<ExtArgs>>): Prisma__KeyResourceVersionClient<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KeyResourceVersion.
     * @param {KeyResourceVersionUpdateArgs} args - Arguments to update one KeyResourceVersion.
     * @example
     * // Update one KeyResourceVersion
     * const keyResourceVersion = await prisma.keyResourceVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KeyResourceVersionUpdateArgs>(args: SelectSubset<T, KeyResourceVersionUpdateArgs<ExtArgs>>): Prisma__KeyResourceVersionClient<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KeyResourceVersions.
     * @param {KeyResourceVersionDeleteManyArgs} args - Arguments to filter KeyResourceVersions to delete.
     * @example
     * // Delete a few KeyResourceVersions
     * const { count } = await prisma.keyResourceVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KeyResourceVersionDeleteManyArgs>(args?: SelectSubset<T, KeyResourceVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KeyResourceVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KeyResourceVersions
     * const keyResourceVersion = await prisma.keyResourceVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KeyResourceVersionUpdateManyArgs>(args: SelectSubset<T, KeyResourceVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KeyResourceVersions and returns the data updated in the database.
     * @param {KeyResourceVersionUpdateManyAndReturnArgs} args - Arguments to update many KeyResourceVersions.
     * @example
     * // Update many KeyResourceVersions
     * const keyResourceVersion = await prisma.keyResourceVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KeyResourceVersions and only return the `id`
     * const keyResourceVersionWithIdOnly = await prisma.keyResourceVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KeyResourceVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, KeyResourceVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KeyResourceVersion.
     * @param {KeyResourceVersionUpsertArgs} args - Arguments to update or create a KeyResourceVersion.
     * @example
     * // Update or create a KeyResourceVersion
     * const keyResourceVersion = await prisma.keyResourceVersion.upsert({
     *   create: {
     *     // ... data to create a KeyResourceVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KeyResourceVersion we want to update
     *   }
     * })
     */
    upsert<T extends KeyResourceVersionUpsertArgs>(args: SelectSubset<T, KeyResourceVersionUpsertArgs<ExtArgs>>): Prisma__KeyResourceVersionClient<$Result.GetResult<Prisma.$KeyResourceVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KeyResourceVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceVersionCountArgs} args - Arguments to filter KeyResourceVersions to count.
     * @example
     * // Count the number of KeyResourceVersions
     * const count = await prisma.keyResourceVersion.count({
     *   where: {
     *     // ... the filter for the KeyResourceVersions we want to count
     *   }
     * })
    **/
    count<T extends KeyResourceVersionCountArgs>(
      args?: Subset<T, KeyResourceVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KeyResourceVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KeyResourceVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KeyResourceVersionAggregateArgs>(args: Subset<T, KeyResourceVersionAggregateArgs>): Prisma.PrismaPromise<GetKeyResourceVersionAggregateType<T>>

    /**
     * Group by KeyResourceVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeyResourceVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KeyResourceVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KeyResourceVersionGroupByArgs['orderBy'] }
        : { orderBy?: KeyResourceVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KeyResourceVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKeyResourceVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KeyResourceVersion model
   */
  readonly fields: KeyResourceVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KeyResourceVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KeyResourceVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    keyResource<T extends KeyResourceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KeyResourceDefaultArgs<ExtArgs>>): Prisma__KeyResourceClient<$Result.GetResult<Prisma.$KeyResourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KeyResourceVersion model
   */
  interface KeyResourceVersionFieldRefs {
    readonly id: FieldRef<"KeyResourceVersion", 'String'>
    readonly keyResourceId: FieldRef<"KeyResourceVersion", 'String'>
    readonly version: FieldRef<"KeyResourceVersion", 'Int'>
    readonly title: FieldRef<"KeyResourceVersion", 'String'>
    readonly url: FieldRef<"KeyResourceVersion", 'String'>
    readonly data: FieldRef<"KeyResourceVersion", 'Json'>
    readonly prompt: FieldRef<"KeyResourceVersion", 'String'>
    readonly refUrls: FieldRef<"KeyResourceVersion", 'String[]'>
    readonly createdAt: FieldRef<"KeyResourceVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KeyResourceVersion findUnique
   */
  export type KeyResourceVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * Filter, which KeyResourceVersion to fetch.
     */
    where: KeyResourceVersionWhereUniqueInput
  }

  /**
   * KeyResourceVersion findUniqueOrThrow
   */
  export type KeyResourceVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * Filter, which KeyResourceVersion to fetch.
     */
    where: KeyResourceVersionWhereUniqueInput
  }

  /**
   * KeyResourceVersion findFirst
   */
  export type KeyResourceVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * Filter, which KeyResourceVersion to fetch.
     */
    where?: KeyResourceVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeyResourceVersions to fetch.
     */
    orderBy?: KeyResourceVersionOrderByWithRelationInput | KeyResourceVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KeyResourceVersions.
     */
    cursor?: KeyResourceVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeyResourceVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeyResourceVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KeyResourceVersions.
     */
    distinct?: KeyResourceVersionScalarFieldEnum | KeyResourceVersionScalarFieldEnum[]
  }

  /**
   * KeyResourceVersion findFirstOrThrow
   */
  export type KeyResourceVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * Filter, which KeyResourceVersion to fetch.
     */
    where?: KeyResourceVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeyResourceVersions to fetch.
     */
    orderBy?: KeyResourceVersionOrderByWithRelationInput | KeyResourceVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KeyResourceVersions.
     */
    cursor?: KeyResourceVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeyResourceVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeyResourceVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KeyResourceVersions.
     */
    distinct?: KeyResourceVersionScalarFieldEnum | KeyResourceVersionScalarFieldEnum[]
  }

  /**
   * KeyResourceVersion findMany
   */
  export type KeyResourceVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * Filter, which KeyResourceVersions to fetch.
     */
    where?: KeyResourceVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeyResourceVersions to fetch.
     */
    orderBy?: KeyResourceVersionOrderByWithRelationInput | KeyResourceVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KeyResourceVersions.
     */
    cursor?: KeyResourceVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeyResourceVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeyResourceVersions.
     */
    skip?: number
    distinct?: KeyResourceVersionScalarFieldEnum | KeyResourceVersionScalarFieldEnum[]
  }

  /**
   * KeyResourceVersion create
   */
  export type KeyResourceVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a KeyResourceVersion.
     */
    data: XOR<KeyResourceVersionCreateInput, KeyResourceVersionUncheckedCreateInput>
  }

  /**
   * KeyResourceVersion createMany
   */
  export type KeyResourceVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KeyResourceVersions.
     */
    data: KeyResourceVersionCreateManyInput | KeyResourceVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KeyResourceVersion createManyAndReturn
   */
  export type KeyResourceVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * The data used to create many KeyResourceVersions.
     */
    data: KeyResourceVersionCreateManyInput | KeyResourceVersionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KeyResourceVersion update
   */
  export type KeyResourceVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a KeyResourceVersion.
     */
    data: XOR<KeyResourceVersionUpdateInput, KeyResourceVersionUncheckedUpdateInput>
    /**
     * Choose, which KeyResourceVersion to update.
     */
    where: KeyResourceVersionWhereUniqueInput
  }

  /**
   * KeyResourceVersion updateMany
   */
  export type KeyResourceVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KeyResourceVersions.
     */
    data: XOR<KeyResourceVersionUpdateManyMutationInput, KeyResourceVersionUncheckedUpdateManyInput>
    /**
     * Filter which KeyResourceVersions to update
     */
    where?: KeyResourceVersionWhereInput
    /**
     * Limit how many KeyResourceVersions to update.
     */
    limit?: number
  }

  /**
   * KeyResourceVersion updateManyAndReturn
   */
  export type KeyResourceVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * The data used to update KeyResourceVersions.
     */
    data: XOR<KeyResourceVersionUpdateManyMutationInput, KeyResourceVersionUncheckedUpdateManyInput>
    /**
     * Filter which KeyResourceVersions to update
     */
    where?: KeyResourceVersionWhereInput
    /**
     * Limit how many KeyResourceVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KeyResourceVersion upsert
   */
  export type KeyResourceVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the KeyResourceVersion to update in case it exists.
     */
    where: KeyResourceVersionWhereUniqueInput
    /**
     * In case the KeyResourceVersion found by the `where` argument doesn't exist, create a new KeyResourceVersion with this data.
     */
    create: XOR<KeyResourceVersionCreateInput, KeyResourceVersionUncheckedCreateInput>
    /**
     * In case the KeyResourceVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KeyResourceVersionUpdateInput, KeyResourceVersionUncheckedUpdateInput>
  }

  /**
   * KeyResourceVersion delete
   */
  export type KeyResourceVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
    /**
     * Filter which KeyResourceVersion to delete.
     */
    where: KeyResourceVersionWhereUniqueInput
  }

  /**
   * KeyResourceVersion deleteMany
   */
  export type KeyResourceVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KeyResourceVersions to delete
     */
    where?: KeyResourceVersionWhereInput
    /**
     * Limit how many KeyResourceVersions to delete.
     */
    limit?: number
  }

  /**
   * KeyResourceVersion without action
   */
  export type KeyResourceVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeyResourceVersion
     */
    select?: KeyResourceVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KeyResourceVersion
     */
    omit?: KeyResourceVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KeyResourceVersionInclude<ExtArgs> | null
  }


  /**
   * Model ImageGeneration
   */

  export type AggregateImageGeneration = {
    _count: ImageGenerationCountAggregateOutputType | null
    _avg: ImageGenerationAvgAggregateOutputType | null
    _sum: ImageGenerationSumAggregateOutputType | null
    _min: ImageGenerationMinAggregateOutputType | null
    _max: ImageGenerationMaxAggregateOutputType | null
  }

  export type ImageGenerationAvgAggregateOutputType = {
    currentVersion: number | null
  }

  export type ImageGenerationSumAggregateOutputType = {
    currentVersion: number | null
  }

  export type ImageGenerationMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    key: string | null
    currentVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImageGenerationMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    key: string | null
    currentVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ImageGenerationCountAggregateOutputType = {
    id: number
    sessionId: number
    key: number
    currentVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ImageGenerationAvgAggregateInputType = {
    currentVersion?: true
  }

  export type ImageGenerationSumAggregateInputType = {
    currentVersion?: true
  }

  export type ImageGenerationMinAggregateInputType = {
    id?: true
    sessionId?: true
    key?: true
    currentVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImageGenerationMaxAggregateInputType = {
    id?: true
    sessionId?: true
    key?: true
    currentVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ImageGenerationCountAggregateInputType = {
    id?: true
    sessionId?: true
    key?: true
    currentVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ImageGenerationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageGeneration to aggregate.
     */
    where?: ImageGenerationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageGenerations to fetch.
     */
    orderBy?: ImageGenerationOrderByWithRelationInput | ImageGenerationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageGenerationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageGenerations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageGenerations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImageGenerations
    **/
    _count?: true | ImageGenerationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImageGenerationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImageGenerationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageGenerationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageGenerationMaxAggregateInputType
  }

  export type GetImageGenerationAggregateType<T extends ImageGenerationAggregateArgs> = {
        [P in keyof T & keyof AggregateImageGeneration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImageGeneration[P]>
      : GetScalarType<T[P], AggregateImageGeneration[P]>
  }




  export type ImageGenerationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageGenerationWhereInput
    orderBy?: ImageGenerationOrderByWithAggregationInput | ImageGenerationOrderByWithAggregationInput[]
    by: ImageGenerationScalarFieldEnum[] | ImageGenerationScalarFieldEnum
    having?: ImageGenerationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageGenerationCountAggregateInputType | true
    _avg?: ImageGenerationAvgAggregateInputType
    _sum?: ImageGenerationSumAggregateInputType
    _min?: ImageGenerationMinAggregateInputType
    _max?: ImageGenerationMaxAggregateInputType
  }

  export type ImageGenerationGroupByOutputType = {
    id: string
    sessionId: string
    key: string
    currentVersion: number
    createdAt: Date
    updatedAt: Date
    _count: ImageGenerationCountAggregateOutputType | null
    _avg: ImageGenerationAvgAggregateOutputType | null
    _sum: ImageGenerationSumAggregateOutputType | null
    _min: ImageGenerationMinAggregateOutputType | null
    _max: ImageGenerationMaxAggregateOutputType | null
  }

  type GetImageGenerationGroupByPayload<T extends ImageGenerationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageGenerationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageGenerationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageGenerationGroupByOutputType[P]>
            : GetScalarType<T[P], ImageGenerationGroupByOutputType[P]>
        }
      >
    >


  export type ImageGenerationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    key?: boolean
    currentVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    versions?: boolean | ImageGeneration$versionsArgs<ExtArgs>
    _count?: boolean | ImageGenerationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageGeneration"]>

  export type ImageGenerationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    key?: boolean
    currentVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageGeneration"]>

  export type ImageGenerationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    key?: boolean
    currentVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageGeneration"]>

  export type ImageGenerationSelectScalar = {
    id?: boolean
    sessionId?: boolean
    key?: boolean
    currentVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ImageGenerationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "key" | "currentVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["imageGeneration"]>
  export type ImageGenerationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    versions?: boolean | ImageGeneration$versionsArgs<ExtArgs>
    _count?: boolean | ImageGenerationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ImageGenerationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type ImageGenerationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }

  export type $ImageGenerationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImageGeneration"
    objects: {
      session: Prisma.$ChatSessionPayload<ExtArgs>
      versions: Prisma.$ImageGenerationVersionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      key: string
      currentVersion: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["imageGeneration"]>
    composites: {}
  }

  type ImageGenerationGetPayload<S extends boolean | null | undefined | ImageGenerationDefaultArgs> = $Result.GetResult<Prisma.$ImageGenerationPayload, S>

  type ImageGenerationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImageGenerationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImageGenerationCountAggregateInputType | true
    }

  export interface ImageGenerationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImageGeneration'], meta: { name: 'ImageGeneration' } }
    /**
     * Find zero or one ImageGeneration that matches the filter.
     * @param {ImageGenerationFindUniqueArgs} args - Arguments to find a ImageGeneration
     * @example
     * // Get one ImageGeneration
     * const imageGeneration = await prisma.imageGeneration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageGenerationFindUniqueArgs>(args: SelectSubset<T, ImageGenerationFindUniqueArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImageGeneration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImageGenerationFindUniqueOrThrowArgs} args - Arguments to find a ImageGeneration
     * @example
     * // Get one ImageGeneration
     * const imageGeneration = await prisma.imageGeneration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageGenerationFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageGenerationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageGeneration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationFindFirstArgs} args - Arguments to find a ImageGeneration
     * @example
     * // Get one ImageGeneration
     * const imageGeneration = await prisma.imageGeneration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageGenerationFindFirstArgs>(args?: SelectSubset<T, ImageGenerationFindFirstArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageGeneration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationFindFirstOrThrowArgs} args - Arguments to find a ImageGeneration
     * @example
     * // Get one ImageGeneration
     * const imageGeneration = await prisma.imageGeneration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageGenerationFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageGenerationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImageGenerations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImageGenerations
     * const imageGenerations = await prisma.imageGeneration.findMany()
     * 
     * // Get first 10 ImageGenerations
     * const imageGenerations = await prisma.imageGeneration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageGenerationWithIdOnly = await prisma.imageGeneration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageGenerationFindManyArgs>(args?: SelectSubset<T, ImageGenerationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImageGeneration.
     * @param {ImageGenerationCreateArgs} args - Arguments to create a ImageGeneration.
     * @example
     * // Create one ImageGeneration
     * const ImageGeneration = await prisma.imageGeneration.create({
     *   data: {
     *     // ... data to create a ImageGeneration
     *   }
     * })
     * 
     */
    create<T extends ImageGenerationCreateArgs>(args: SelectSubset<T, ImageGenerationCreateArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImageGenerations.
     * @param {ImageGenerationCreateManyArgs} args - Arguments to create many ImageGenerations.
     * @example
     * // Create many ImageGenerations
     * const imageGeneration = await prisma.imageGeneration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageGenerationCreateManyArgs>(args?: SelectSubset<T, ImageGenerationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImageGenerations and returns the data saved in the database.
     * @param {ImageGenerationCreateManyAndReturnArgs} args - Arguments to create many ImageGenerations.
     * @example
     * // Create many ImageGenerations
     * const imageGeneration = await prisma.imageGeneration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImageGenerations and only return the `id`
     * const imageGenerationWithIdOnly = await prisma.imageGeneration.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImageGenerationCreateManyAndReturnArgs>(args?: SelectSubset<T, ImageGenerationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImageGeneration.
     * @param {ImageGenerationDeleteArgs} args - Arguments to delete one ImageGeneration.
     * @example
     * // Delete one ImageGeneration
     * const ImageGeneration = await prisma.imageGeneration.delete({
     *   where: {
     *     // ... filter to delete one ImageGeneration
     *   }
     * })
     * 
     */
    delete<T extends ImageGenerationDeleteArgs>(args: SelectSubset<T, ImageGenerationDeleteArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImageGeneration.
     * @param {ImageGenerationUpdateArgs} args - Arguments to update one ImageGeneration.
     * @example
     * // Update one ImageGeneration
     * const imageGeneration = await prisma.imageGeneration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageGenerationUpdateArgs>(args: SelectSubset<T, ImageGenerationUpdateArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImageGenerations.
     * @param {ImageGenerationDeleteManyArgs} args - Arguments to filter ImageGenerations to delete.
     * @example
     * // Delete a few ImageGenerations
     * const { count } = await prisma.imageGeneration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageGenerationDeleteManyArgs>(args?: SelectSubset<T, ImageGenerationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageGenerations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImageGenerations
     * const imageGeneration = await prisma.imageGeneration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageGenerationUpdateManyArgs>(args: SelectSubset<T, ImageGenerationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageGenerations and returns the data updated in the database.
     * @param {ImageGenerationUpdateManyAndReturnArgs} args - Arguments to update many ImageGenerations.
     * @example
     * // Update many ImageGenerations
     * const imageGeneration = await prisma.imageGeneration.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImageGenerations and only return the `id`
     * const imageGenerationWithIdOnly = await prisma.imageGeneration.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImageGenerationUpdateManyAndReturnArgs>(args: SelectSubset<T, ImageGenerationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImageGeneration.
     * @param {ImageGenerationUpsertArgs} args - Arguments to update or create a ImageGeneration.
     * @example
     * // Update or create a ImageGeneration
     * const imageGeneration = await prisma.imageGeneration.upsert({
     *   create: {
     *     // ... data to create a ImageGeneration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImageGeneration we want to update
     *   }
     * })
     */
    upsert<T extends ImageGenerationUpsertArgs>(args: SelectSubset<T, ImageGenerationUpsertArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImageGenerations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationCountArgs} args - Arguments to filter ImageGenerations to count.
     * @example
     * // Count the number of ImageGenerations
     * const count = await prisma.imageGeneration.count({
     *   where: {
     *     // ... the filter for the ImageGenerations we want to count
     *   }
     * })
    **/
    count<T extends ImageGenerationCountArgs>(
      args?: Subset<T, ImageGenerationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageGenerationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImageGeneration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImageGenerationAggregateArgs>(args: Subset<T, ImageGenerationAggregateArgs>): Prisma.PrismaPromise<GetImageGenerationAggregateType<T>>

    /**
     * Group by ImageGeneration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImageGenerationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageGenerationGroupByArgs['orderBy'] }
        : { orderBy?: ImageGenerationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImageGenerationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageGenerationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImageGeneration model
   */
  readonly fields: ImageGenerationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImageGeneration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageGenerationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends ChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatSessionDefaultArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    versions<T extends ImageGeneration$versionsArgs<ExtArgs> = {}>(args?: Subset<T, ImageGeneration$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ImageGeneration model
   */
  interface ImageGenerationFieldRefs {
    readonly id: FieldRef<"ImageGeneration", 'String'>
    readonly sessionId: FieldRef<"ImageGeneration", 'String'>
    readonly key: FieldRef<"ImageGeneration", 'String'>
    readonly currentVersion: FieldRef<"ImageGeneration", 'Int'>
    readonly createdAt: FieldRef<"ImageGeneration", 'DateTime'>
    readonly updatedAt: FieldRef<"ImageGeneration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImageGeneration findUnique
   */
  export type ImageGenerationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * Filter, which ImageGeneration to fetch.
     */
    where: ImageGenerationWhereUniqueInput
  }

  /**
   * ImageGeneration findUniqueOrThrow
   */
  export type ImageGenerationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * Filter, which ImageGeneration to fetch.
     */
    where: ImageGenerationWhereUniqueInput
  }

  /**
   * ImageGeneration findFirst
   */
  export type ImageGenerationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * Filter, which ImageGeneration to fetch.
     */
    where?: ImageGenerationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageGenerations to fetch.
     */
    orderBy?: ImageGenerationOrderByWithRelationInput | ImageGenerationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageGenerations.
     */
    cursor?: ImageGenerationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageGenerations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageGenerations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageGenerations.
     */
    distinct?: ImageGenerationScalarFieldEnum | ImageGenerationScalarFieldEnum[]
  }

  /**
   * ImageGeneration findFirstOrThrow
   */
  export type ImageGenerationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * Filter, which ImageGeneration to fetch.
     */
    where?: ImageGenerationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageGenerations to fetch.
     */
    orderBy?: ImageGenerationOrderByWithRelationInput | ImageGenerationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageGenerations.
     */
    cursor?: ImageGenerationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageGenerations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageGenerations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageGenerations.
     */
    distinct?: ImageGenerationScalarFieldEnum | ImageGenerationScalarFieldEnum[]
  }

  /**
   * ImageGeneration findMany
   */
  export type ImageGenerationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * Filter, which ImageGenerations to fetch.
     */
    where?: ImageGenerationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageGenerations to fetch.
     */
    orderBy?: ImageGenerationOrderByWithRelationInput | ImageGenerationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImageGenerations.
     */
    cursor?: ImageGenerationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageGenerations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageGenerations.
     */
    skip?: number
    distinct?: ImageGenerationScalarFieldEnum | ImageGenerationScalarFieldEnum[]
  }

  /**
   * ImageGeneration create
   */
  export type ImageGenerationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * The data needed to create a ImageGeneration.
     */
    data: XOR<ImageGenerationCreateInput, ImageGenerationUncheckedCreateInput>
  }

  /**
   * ImageGeneration createMany
   */
  export type ImageGenerationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImageGenerations.
     */
    data: ImageGenerationCreateManyInput | ImageGenerationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImageGeneration createManyAndReturn
   */
  export type ImageGenerationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * The data used to create many ImageGenerations.
     */
    data: ImageGenerationCreateManyInput | ImageGenerationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImageGeneration update
   */
  export type ImageGenerationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * The data needed to update a ImageGeneration.
     */
    data: XOR<ImageGenerationUpdateInput, ImageGenerationUncheckedUpdateInput>
    /**
     * Choose, which ImageGeneration to update.
     */
    where: ImageGenerationWhereUniqueInput
  }

  /**
   * ImageGeneration updateMany
   */
  export type ImageGenerationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImageGenerations.
     */
    data: XOR<ImageGenerationUpdateManyMutationInput, ImageGenerationUncheckedUpdateManyInput>
    /**
     * Filter which ImageGenerations to update
     */
    where?: ImageGenerationWhereInput
    /**
     * Limit how many ImageGenerations to update.
     */
    limit?: number
  }

  /**
   * ImageGeneration updateManyAndReturn
   */
  export type ImageGenerationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * The data used to update ImageGenerations.
     */
    data: XOR<ImageGenerationUpdateManyMutationInput, ImageGenerationUncheckedUpdateManyInput>
    /**
     * Filter which ImageGenerations to update
     */
    where?: ImageGenerationWhereInput
    /**
     * Limit how many ImageGenerations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImageGeneration upsert
   */
  export type ImageGenerationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * The filter to search for the ImageGeneration to update in case it exists.
     */
    where: ImageGenerationWhereUniqueInput
    /**
     * In case the ImageGeneration found by the `where` argument doesn't exist, create a new ImageGeneration with this data.
     */
    create: XOR<ImageGenerationCreateInput, ImageGenerationUncheckedCreateInput>
    /**
     * In case the ImageGeneration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageGenerationUpdateInput, ImageGenerationUncheckedUpdateInput>
  }

  /**
   * ImageGeneration delete
   */
  export type ImageGenerationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
    /**
     * Filter which ImageGeneration to delete.
     */
    where: ImageGenerationWhereUniqueInput
  }

  /**
   * ImageGeneration deleteMany
   */
  export type ImageGenerationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageGenerations to delete
     */
    where?: ImageGenerationWhereInput
    /**
     * Limit how many ImageGenerations to delete.
     */
    limit?: number
  }

  /**
   * ImageGeneration.versions
   */
  export type ImageGeneration$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    where?: ImageGenerationVersionWhereInput
    orderBy?: ImageGenerationVersionOrderByWithRelationInput | ImageGenerationVersionOrderByWithRelationInput[]
    cursor?: ImageGenerationVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImageGenerationVersionScalarFieldEnum | ImageGenerationVersionScalarFieldEnum[]
  }

  /**
   * ImageGeneration without action
   */
  export type ImageGenerationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGeneration
     */
    select?: ImageGenerationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGeneration
     */
    omit?: ImageGenerationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationInclude<ExtArgs> | null
  }


  /**
   * Model ImageGenerationVersion
   */

  export type AggregateImageGenerationVersion = {
    _count: ImageGenerationVersionCountAggregateOutputType | null
    _avg: ImageGenerationVersionAvgAggregateOutputType | null
    _sum: ImageGenerationVersionSumAggregateOutputType | null
    _min: ImageGenerationVersionMinAggregateOutputType | null
    _max: ImageGenerationVersionMaxAggregateOutputType | null
  }

  export type ImageGenerationVersionAvgAggregateOutputType = {
    version: number | null
  }

  export type ImageGenerationVersionSumAggregateOutputType = {
    version: number | null
  }

  export type ImageGenerationVersionMinAggregateOutputType = {
    id: string | null
    imageGenId: string | null
    version: number | null
    prompt: string | null
    imageUrl: string | null
    createdAt: Date | null
  }

  export type ImageGenerationVersionMaxAggregateOutputType = {
    id: string | null
    imageGenId: string | null
    version: number | null
    prompt: string | null
    imageUrl: string | null
    createdAt: Date | null
  }

  export type ImageGenerationVersionCountAggregateOutputType = {
    id: number
    imageGenId: number
    version: number
    prompt: number
    imageUrl: number
    refUrls: number
    createdAt: number
    _all: number
  }


  export type ImageGenerationVersionAvgAggregateInputType = {
    version?: true
  }

  export type ImageGenerationVersionSumAggregateInputType = {
    version?: true
  }

  export type ImageGenerationVersionMinAggregateInputType = {
    id?: true
    imageGenId?: true
    version?: true
    prompt?: true
    imageUrl?: true
    createdAt?: true
  }

  export type ImageGenerationVersionMaxAggregateInputType = {
    id?: true
    imageGenId?: true
    version?: true
    prompt?: true
    imageUrl?: true
    createdAt?: true
  }

  export type ImageGenerationVersionCountAggregateInputType = {
    id?: true
    imageGenId?: true
    version?: true
    prompt?: true
    imageUrl?: true
    refUrls?: true
    createdAt?: true
    _all?: true
  }

  export type ImageGenerationVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageGenerationVersion to aggregate.
     */
    where?: ImageGenerationVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageGenerationVersions to fetch.
     */
    orderBy?: ImageGenerationVersionOrderByWithRelationInput | ImageGenerationVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageGenerationVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageGenerationVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageGenerationVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImageGenerationVersions
    **/
    _count?: true | ImageGenerationVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImageGenerationVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImageGenerationVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageGenerationVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageGenerationVersionMaxAggregateInputType
  }

  export type GetImageGenerationVersionAggregateType<T extends ImageGenerationVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateImageGenerationVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImageGenerationVersion[P]>
      : GetScalarType<T[P], AggregateImageGenerationVersion[P]>
  }




  export type ImageGenerationVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageGenerationVersionWhereInput
    orderBy?: ImageGenerationVersionOrderByWithAggregationInput | ImageGenerationVersionOrderByWithAggregationInput[]
    by: ImageGenerationVersionScalarFieldEnum[] | ImageGenerationVersionScalarFieldEnum
    having?: ImageGenerationVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageGenerationVersionCountAggregateInputType | true
    _avg?: ImageGenerationVersionAvgAggregateInputType
    _sum?: ImageGenerationVersionSumAggregateInputType
    _min?: ImageGenerationVersionMinAggregateInputType
    _max?: ImageGenerationVersionMaxAggregateInputType
  }

  export type ImageGenerationVersionGroupByOutputType = {
    id: string
    imageGenId: string
    version: number
    prompt: string
    imageUrl: string | null
    refUrls: string[]
    createdAt: Date
    _count: ImageGenerationVersionCountAggregateOutputType | null
    _avg: ImageGenerationVersionAvgAggregateOutputType | null
    _sum: ImageGenerationVersionSumAggregateOutputType | null
    _min: ImageGenerationVersionMinAggregateOutputType | null
    _max: ImageGenerationVersionMaxAggregateOutputType | null
  }

  type GetImageGenerationVersionGroupByPayload<T extends ImageGenerationVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageGenerationVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageGenerationVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageGenerationVersionGroupByOutputType[P]>
            : GetScalarType<T[P], ImageGenerationVersionGroupByOutputType[P]>
        }
      >
    >


  export type ImageGenerationVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageGenId?: boolean
    version?: boolean
    prompt?: boolean
    imageUrl?: boolean
    refUrls?: boolean
    createdAt?: boolean
    imageGen?: boolean | ImageGenerationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageGenerationVersion"]>

  export type ImageGenerationVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageGenId?: boolean
    version?: boolean
    prompt?: boolean
    imageUrl?: boolean
    refUrls?: boolean
    createdAt?: boolean
    imageGen?: boolean | ImageGenerationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageGenerationVersion"]>

  export type ImageGenerationVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imageGenId?: boolean
    version?: boolean
    prompt?: boolean
    imageUrl?: boolean
    refUrls?: boolean
    createdAt?: boolean
    imageGen?: boolean | ImageGenerationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imageGenerationVersion"]>

  export type ImageGenerationVersionSelectScalar = {
    id?: boolean
    imageGenId?: boolean
    version?: boolean
    prompt?: boolean
    imageUrl?: boolean
    refUrls?: boolean
    createdAt?: boolean
  }

  export type ImageGenerationVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imageGenId" | "version" | "prompt" | "imageUrl" | "refUrls" | "createdAt", ExtArgs["result"]["imageGenerationVersion"]>
  export type ImageGenerationVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imageGen?: boolean | ImageGenerationDefaultArgs<ExtArgs>
  }
  export type ImageGenerationVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imageGen?: boolean | ImageGenerationDefaultArgs<ExtArgs>
  }
  export type ImageGenerationVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imageGen?: boolean | ImageGenerationDefaultArgs<ExtArgs>
  }

  export type $ImageGenerationVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImageGenerationVersion"
    objects: {
      imageGen: Prisma.$ImageGenerationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imageGenId: string
      version: number
      prompt: string
      imageUrl: string | null
      refUrls: string[]
      createdAt: Date
    }, ExtArgs["result"]["imageGenerationVersion"]>
    composites: {}
  }

  type ImageGenerationVersionGetPayload<S extends boolean | null | undefined | ImageGenerationVersionDefaultArgs> = $Result.GetResult<Prisma.$ImageGenerationVersionPayload, S>

  type ImageGenerationVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImageGenerationVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImageGenerationVersionCountAggregateInputType | true
    }

  export interface ImageGenerationVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImageGenerationVersion'], meta: { name: 'ImageGenerationVersion' } }
    /**
     * Find zero or one ImageGenerationVersion that matches the filter.
     * @param {ImageGenerationVersionFindUniqueArgs} args - Arguments to find a ImageGenerationVersion
     * @example
     * // Get one ImageGenerationVersion
     * const imageGenerationVersion = await prisma.imageGenerationVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageGenerationVersionFindUniqueArgs>(args: SelectSubset<T, ImageGenerationVersionFindUniqueArgs<ExtArgs>>): Prisma__ImageGenerationVersionClient<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImageGenerationVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImageGenerationVersionFindUniqueOrThrowArgs} args - Arguments to find a ImageGenerationVersion
     * @example
     * // Get one ImageGenerationVersion
     * const imageGenerationVersion = await prisma.imageGenerationVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageGenerationVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageGenerationVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageGenerationVersionClient<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageGenerationVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationVersionFindFirstArgs} args - Arguments to find a ImageGenerationVersion
     * @example
     * // Get one ImageGenerationVersion
     * const imageGenerationVersion = await prisma.imageGenerationVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageGenerationVersionFindFirstArgs>(args?: SelectSubset<T, ImageGenerationVersionFindFirstArgs<ExtArgs>>): Prisma__ImageGenerationVersionClient<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImageGenerationVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationVersionFindFirstOrThrowArgs} args - Arguments to find a ImageGenerationVersion
     * @example
     * // Get one ImageGenerationVersion
     * const imageGenerationVersion = await prisma.imageGenerationVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageGenerationVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageGenerationVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageGenerationVersionClient<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImageGenerationVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImageGenerationVersions
     * const imageGenerationVersions = await prisma.imageGenerationVersion.findMany()
     * 
     * // Get first 10 ImageGenerationVersions
     * const imageGenerationVersions = await prisma.imageGenerationVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageGenerationVersionWithIdOnly = await prisma.imageGenerationVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageGenerationVersionFindManyArgs>(args?: SelectSubset<T, ImageGenerationVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImageGenerationVersion.
     * @param {ImageGenerationVersionCreateArgs} args - Arguments to create a ImageGenerationVersion.
     * @example
     * // Create one ImageGenerationVersion
     * const ImageGenerationVersion = await prisma.imageGenerationVersion.create({
     *   data: {
     *     // ... data to create a ImageGenerationVersion
     *   }
     * })
     * 
     */
    create<T extends ImageGenerationVersionCreateArgs>(args: SelectSubset<T, ImageGenerationVersionCreateArgs<ExtArgs>>): Prisma__ImageGenerationVersionClient<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImageGenerationVersions.
     * @param {ImageGenerationVersionCreateManyArgs} args - Arguments to create many ImageGenerationVersions.
     * @example
     * // Create many ImageGenerationVersions
     * const imageGenerationVersion = await prisma.imageGenerationVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageGenerationVersionCreateManyArgs>(args?: SelectSubset<T, ImageGenerationVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImageGenerationVersions and returns the data saved in the database.
     * @param {ImageGenerationVersionCreateManyAndReturnArgs} args - Arguments to create many ImageGenerationVersions.
     * @example
     * // Create many ImageGenerationVersions
     * const imageGenerationVersion = await prisma.imageGenerationVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImageGenerationVersions and only return the `id`
     * const imageGenerationVersionWithIdOnly = await prisma.imageGenerationVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImageGenerationVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, ImageGenerationVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImageGenerationVersion.
     * @param {ImageGenerationVersionDeleteArgs} args - Arguments to delete one ImageGenerationVersion.
     * @example
     * // Delete one ImageGenerationVersion
     * const ImageGenerationVersion = await prisma.imageGenerationVersion.delete({
     *   where: {
     *     // ... filter to delete one ImageGenerationVersion
     *   }
     * })
     * 
     */
    delete<T extends ImageGenerationVersionDeleteArgs>(args: SelectSubset<T, ImageGenerationVersionDeleteArgs<ExtArgs>>): Prisma__ImageGenerationVersionClient<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImageGenerationVersion.
     * @param {ImageGenerationVersionUpdateArgs} args - Arguments to update one ImageGenerationVersion.
     * @example
     * // Update one ImageGenerationVersion
     * const imageGenerationVersion = await prisma.imageGenerationVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageGenerationVersionUpdateArgs>(args: SelectSubset<T, ImageGenerationVersionUpdateArgs<ExtArgs>>): Prisma__ImageGenerationVersionClient<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImageGenerationVersions.
     * @param {ImageGenerationVersionDeleteManyArgs} args - Arguments to filter ImageGenerationVersions to delete.
     * @example
     * // Delete a few ImageGenerationVersions
     * const { count } = await prisma.imageGenerationVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageGenerationVersionDeleteManyArgs>(args?: SelectSubset<T, ImageGenerationVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageGenerationVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImageGenerationVersions
     * const imageGenerationVersion = await prisma.imageGenerationVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageGenerationVersionUpdateManyArgs>(args: SelectSubset<T, ImageGenerationVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImageGenerationVersions and returns the data updated in the database.
     * @param {ImageGenerationVersionUpdateManyAndReturnArgs} args - Arguments to update many ImageGenerationVersions.
     * @example
     * // Update many ImageGenerationVersions
     * const imageGenerationVersion = await prisma.imageGenerationVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImageGenerationVersions and only return the `id`
     * const imageGenerationVersionWithIdOnly = await prisma.imageGenerationVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImageGenerationVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, ImageGenerationVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImageGenerationVersion.
     * @param {ImageGenerationVersionUpsertArgs} args - Arguments to update or create a ImageGenerationVersion.
     * @example
     * // Update or create a ImageGenerationVersion
     * const imageGenerationVersion = await prisma.imageGenerationVersion.upsert({
     *   create: {
     *     // ... data to create a ImageGenerationVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImageGenerationVersion we want to update
     *   }
     * })
     */
    upsert<T extends ImageGenerationVersionUpsertArgs>(args: SelectSubset<T, ImageGenerationVersionUpsertArgs<ExtArgs>>): Prisma__ImageGenerationVersionClient<$Result.GetResult<Prisma.$ImageGenerationVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImageGenerationVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationVersionCountArgs} args - Arguments to filter ImageGenerationVersions to count.
     * @example
     * // Count the number of ImageGenerationVersions
     * const count = await prisma.imageGenerationVersion.count({
     *   where: {
     *     // ... the filter for the ImageGenerationVersions we want to count
     *   }
     * })
    **/
    count<T extends ImageGenerationVersionCountArgs>(
      args?: Subset<T, ImageGenerationVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageGenerationVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImageGenerationVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImageGenerationVersionAggregateArgs>(args: Subset<T, ImageGenerationVersionAggregateArgs>): Prisma.PrismaPromise<GetImageGenerationVersionAggregateType<T>>

    /**
     * Group by ImageGenerationVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGenerationVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImageGenerationVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageGenerationVersionGroupByArgs['orderBy'] }
        : { orderBy?: ImageGenerationVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImageGenerationVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageGenerationVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImageGenerationVersion model
   */
  readonly fields: ImageGenerationVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImageGenerationVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageGenerationVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    imageGen<T extends ImageGenerationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ImageGenerationDefaultArgs<ExtArgs>>): Prisma__ImageGenerationClient<$Result.GetResult<Prisma.$ImageGenerationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ImageGenerationVersion model
   */
  interface ImageGenerationVersionFieldRefs {
    readonly id: FieldRef<"ImageGenerationVersion", 'String'>
    readonly imageGenId: FieldRef<"ImageGenerationVersion", 'String'>
    readonly version: FieldRef<"ImageGenerationVersion", 'Int'>
    readonly prompt: FieldRef<"ImageGenerationVersion", 'String'>
    readonly imageUrl: FieldRef<"ImageGenerationVersion", 'String'>
    readonly refUrls: FieldRef<"ImageGenerationVersion", 'String[]'>
    readonly createdAt: FieldRef<"ImageGenerationVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImageGenerationVersion findUnique
   */
  export type ImageGenerationVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * Filter, which ImageGenerationVersion to fetch.
     */
    where: ImageGenerationVersionWhereUniqueInput
  }

  /**
   * ImageGenerationVersion findUniqueOrThrow
   */
  export type ImageGenerationVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * Filter, which ImageGenerationVersion to fetch.
     */
    where: ImageGenerationVersionWhereUniqueInput
  }

  /**
   * ImageGenerationVersion findFirst
   */
  export type ImageGenerationVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * Filter, which ImageGenerationVersion to fetch.
     */
    where?: ImageGenerationVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageGenerationVersions to fetch.
     */
    orderBy?: ImageGenerationVersionOrderByWithRelationInput | ImageGenerationVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageGenerationVersions.
     */
    cursor?: ImageGenerationVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageGenerationVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageGenerationVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageGenerationVersions.
     */
    distinct?: ImageGenerationVersionScalarFieldEnum | ImageGenerationVersionScalarFieldEnum[]
  }

  /**
   * ImageGenerationVersion findFirstOrThrow
   */
  export type ImageGenerationVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * Filter, which ImageGenerationVersion to fetch.
     */
    where?: ImageGenerationVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageGenerationVersions to fetch.
     */
    orderBy?: ImageGenerationVersionOrderByWithRelationInput | ImageGenerationVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImageGenerationVersions.
     */
    cursor?: ImageGenerationVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageGenerationVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageGenerationVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImageGenerationVersions.
     */
    distinct?: ImageGenerationVersionScalarFieldEnum | ImageGenerationVersionScalarFieldEnum[]
  }

  /**
   * ImageGenerationVersion findMany
   */
  export type ImageGenerationVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * Filter, which ImageGenerationVersions to fetch.
     */
    where?: ImageGenerationVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImageGenerationVersions to fetch.
     */
    orderBy?: ImageGenerationVersionOrderByWithRelationInput | ImageGenerationVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImageGenerationVersions.
     */
    cursor?: ImageGenerationVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImageGenerationVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImageGenerationVersions.
     */
    skip?: number
    distinct?: ImageGenerationVersionScalarFieldEnum | ImageGenerationVersionScalarFieldEnum[]
  }

  /**
   * ImageGenerationVersion create
   */
  export type ImageGenerationVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a ImageGenerationVersion.
     */
    data: XOR<ImageGenerationVersionCreateInput, ImageGenerationVersionUncheckedCreateInput>
  }

  /**
   * ImageGenerationVersion createMany
   */
  export type ImageGenerationVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImageGenerationVersions.
     */
    data: ImageGenerationVersionCreateManyInput | ImageGenerationVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImageGenerationVersion createManyAndReturn
   */
  export type ImageGenerationVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * The data used to create many ImageGenerationVersions.
     */
    data: ImageGenerationVersionCreateManyInput | ImageGenerationVersionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImageGenerationVersion update
   */
  export type ImageGenerationVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a ImageGenerationVersion.
     */
    data: XOR<ImageGenerationVersionUpdateInput, ImageGenerationVersionUncheckedUpdateInput>
    /**
     * Choose, which ImageGenerationVersion to update.
     */
    where: ImageGenerationVersionWhereUniqueInput
  }

  /**
   * ImageGenerationVersion updateMany
   */
  export type ImageGenerationVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImageGenerationVersions.
     */
    data: XOR<ImageGenerationVersionUpdateManyMutationInput, ImageGenerationVersionUncheckedUpdateManyInput>
    /**
     * Filter which ImageGenerationVersions to update
     */
    where?: ImageGenerationVersionWhereInput
    /**
     * Limit how many ImageGenerationVersions to update.
     */
    limit?: number
  }

  /**
   * ImageGenerationVersion updateManyAndReturn
   */
  export type ImageGenerationVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * The data used to update ImageGenerationVersions.
     */
    data: XOR<ImageGenerationVersionUpdateManyMutationInput, ImageGenerationVersionUncheckedUpdateManyInput>
    /**
     * Filter which ImageGenerationVersions to update
     */
    where?: ImageGenerationVersionWhereInput
    /**
     * Limit how many ImageGenerationVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImageGenerationVersion upsert
   */
  export type ImageGenerationVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the ImageGenerationVersion to update in case it exists.
     */
    where: ImageGenerationVersionWhereUniqueInput
    /**
     * In case the ImageGenerationVersion found by the `where` argument doesn't exist, create a new ImageGenerationVersion with this data.
     */
    create: XOR<ImageGenerationVersionCreateInput, ImageGenerationVersionUncheckedCreateInput>
    /**
     * In case the ImageGenerationVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageGenerationVersionUpdateInput, ImageGenerationVersionUncheckedUpdateInput>
  }

  /**
   * ImageGenerationVersion delete
   */
  export type ImageGenerationVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
    /**
     * Filter which ImageGenerationVersion to delete.
     */
    where: ImageGenerationVersionWhereUniqueInput
  }

  /**
   * ImageGenerationVersion deleteMany
   */
  export type ImageGenerationVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImageGenerationVersions to delete
     */
    where?: ImageGenerationVersionWhereInput
    /**
     * Limit how many ImageGenerationVersions to delete.
     */
    limit?: number
  }

  /**
   * ImageGenerationVersion without action
   */
  export type ImageGenerationVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImageGenerationVersion
     */
    select?: ImageGenerationVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImageGenerationVersion
     */
    omit?: ImageGenerationVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageGenerationVersionInclude<ExtArgs> | null
  }


  /**
   * Model McpServer
   */

  export type AggregateMcpServer = {
    _count: McpServerCountAggregateOutputType | null
    _avg: McpServerAvgAggregateOutputType | null
    _sum: McpServerSumAggregateOutputType | null
    _min: McpServerMinAggregateOutputType | null
    _max: McpServerMaxAggregateOutputType | null
  }

  export type McpServerAvgAggregateOutputType = {
    productionVersion: number | null
  }

  export type McpServerSumAggregateOutputType = {
    productionVersion: number | null
  }

  export type McpServerMinAggregateOutputType = {
    id: string | null
    name: string | null
    enabled: boolean | null
    productionVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type McpServerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    enabled: boolean | null
    productionVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type McpServerCountAggregateOutputType = {
    id: number
    name: number
    enabled: number
    config: number
    productionVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type McpServerAvgAggregateInputType = {
    productionVersion?: true
  }

  export type McpServerSumAggregateInputType = {
    productionVersion?: true
  }

  export type McpServerMinAggregateInputType = {
    id?: true
    name?: true
    enabled?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type McpServerMaxAggregateInputType = {
    id?: true
    name?: true
    enabled?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type McpServerCountAggregateInputType = {
    id?: true
    name?: true
    enabled?: true
    config?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type McpServerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which McpServer to aggregate.
     */
    where?: McpServerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpServers to fetch.
     */
    orderBy?: McpServerOrderByWithRelationInput | McpServerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: McpServerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpServers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpServers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned McpServers
    **/
    _count?: true | McpServerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: McpServerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: McpServerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: McpServerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: McpServerMaxAggregateInputType
  }

  export type GetMcpServerAggregateType<T extends McpServerAggregateArgs> = {
        [P in keyof T & keyof AggregateMcpServer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMcpServer[P]>
      : GetScalarType<T[P], AggregateMcpServer[P]>
  }




  export type McpServerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: McpServerWhereInput
    orderBy?: McpServerOrderByWithAggregationInput | McpServerOrderByWithAggregationInput[]
    by: McpServerScalarFieldEnum[] | McpServerScalarFieldEnum
    having?: McpServerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: McpServerCountAggregateInputType | true
    _avg?: McpServerAvgAggregateInputType
    _sum?: McpServerSumAggregateInputType
    _min?: McpServerMinAggregateInputType
    _max?: McpServerMaxAggregateInputType
  }

  export type McpServerGroupByOutputType = {
    id: string
    name: string
    enabled: boolean
    config: JsonValue | null
    productionVersion: number
    createdAt: Date
    updatedAt: Date
    _count: McpServerCountAggregateOutputType | null
    _avg: McpServerAvgAggregateOutputType | null
    _sum: McpServerSumAggregateOutputType | null
    _min: McpServerMinAggregateOutputType | null
    _max: McpServerMaxAggregateOutputType | null
  }

  type GetMcpServerGroupByPayload<T extends McpServerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<McpServerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof McpServerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], McpServerGroupByOutputType[P]>
            : GetScalarType<T[P], McpServerGroupByOutputType[P]>
        }
      >
    >


  export type McpServerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    enabled?: boolean
    config?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    versions?: boolean | McpServer$versionsArgs<ExtArgs>
    _count?: boolean | McpServerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpServer"]>

  export type McpServerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    enabled?: boolean
    config?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mcpServer"]>

  export type McpServerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    enabled?: boolean
    config?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mcpServer"]>

  export type McpServerSelectScalar = {
    id?: boolean
    name?: boolean
    enabled?: boolean
    config?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type McpServerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "enabled" | "config" | "productionVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["mcpServer"]>
  export type McpServerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | McpServer$versionsArgs<ExtArgs>
    _count?: boolean | McpServerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type McpServerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type McpServerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $McpServerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "McpServer"
    objects: {
      versions: Prisma.$McpServerVersionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      enabled: boolean
      config: Prisma.JsonValue | null
      productionVersion: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mcpServer"]>
    composites: {}
  }

  type McpServerGetPayload<S extends boolean | null | undefined | McpServerDefaultArgs> = $Result.GetResult<Prisma.$McpServerPayload, S>

  type McpServerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<McpServerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: McpServerCountAggregateInputType | true
    }

  export interface McpServerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['McpServer'], meta: { name: 'McpServer' } }
    /**
     * Find zero or one McpServer that matches the filter.
     * @param {McpServerFindUniqueArgs} args - Arguments to find a McpServer
     * @example
     * // Get one McpServer
     * const mcpServer = await prisma.mcpServer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends McpServerFindUniqueArgs>(args: SelectSubset<T, McpServerFindUniqueArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one McpServer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {McpServerFindUniqueOrThrowArgs} args - Arguments to find a McpServer
     * @example
     * // Get one McpServer
     * const mcpServer = await prisma.mcpServer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends McpServerFindUniqueOrThrowArgs>(args: SelectSubset<T, McpServerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first McpServer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerFindFirstArgs} args - Arguments to find a McpServer
     * @example
     * // Get one McpServer
     * const mcpServer = await prisma.mcpServer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends McpServerFindFirstArgs>(args?: SelectSubset<T, McpServerFindFirstArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first McpServer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerFindFirstOrThrowArgs} args - Arguments to find a McpServer
     * @example
     * // Get one McpServer
     * const mcpServer = await prisma.mcpServer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends McpServerFindFirstOrThrowArgs>(args?: SelectSubset<T, McpServerFindFirstOrThrowArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more McpServers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all McpServers
     * const mcpServers = await prisma.mcpServer.findMany()
     * 
     * // Get first 10 McpServers
     * const mcpServers = await prisma.mcpServer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mcpServerWithIdOnly = await prisma.mcpServer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends McpServerFindManyArgs>(args?: SelectSubset<T, McpServerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a McpServer.
     * @param {McpServerCreateArgs} args - Arguments to create a McpServer.
     * @example
     * // Create one McpServer
     * const McpServer = await prisma.mcpServer.create({
     *   data: {
     *     // ... data to create a McpServer
     *   }
     * })
     * 
     */
    create<T extends McpServerCreateArgs>(args: SelectSubset<T, McpServerCreateArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many McpServers.
     * @param {McpServerCreateManyArgs} args - Arguments to create many McpServers.
     * @example
     * // Create many McpServers
     * const mcpServer = await prisma.mcpServer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends McpServerCreateManyArgs>(args?: SelectSubset<T, McpServerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many McpServers and returns the data saved in the database.
     * @param {McpServerCreateManyAndReturnArgs} args - Arguments to create many McpServers.
     * @example
     * // Create many McpServers
     * const mcpServer = await prisma.mcpServer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many McpServers and only return the `id`
     * const mcpServerWithIdOnly = await prisma.mcpServer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends McpServerCreateManyAndReturnArgs>(args?: SelectSubset<T, McpServerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a McpServer.
     * @param {McpServerDeleteArgs} args - Arguments to delete one McpServer.
     * @example
     * // Delete one McpServer
     * const McpServer = await prisma.mcpServer.delete({
     *   where: {
     *     // ... filter to delete one McpServer
     *   }
     * })
     * 
     */
    delete<T extends McpServerDeleteArgs>(args: SelectSubset<T, McpServerDeleteArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one McpServer.
     * @param {McpServerUpdateArgs} args - Arguments to update one McpServer.
     * @example
     * // Update one McpServer
     * const mcpServer = await prisma.mcpServer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends McpServerUpdateArgs>(args: SelectSubset<T, McpServerUpdateArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more McpServers.
     * @param {McpServerDeleteManyArgs} args - Arguments to filter McpServers to delete.
     * @example
     * // Delete a few McpServers
     * const { count } = await prisma.mcpServer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends McpServerDeleteManyArgs>(args?: SelectSubset<T, McpServerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more McpServers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many McpServers
     * const mcpServer = await prisma.mcpServer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends McpServerUpdateManyArgs>(args: SelectSubset<T, McpServerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more McpServers and returns the data updated in the database.
     * @param {McpServerUpdateManyAndReturnArgs} args - Arguments to update many McpServers.
     * @example
     * // Update many McpServers
     * const mcpServer = await prisma.mcpServer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more McpServers and only return the `id`
     * const mcpServerWithIdOnly = await prisma.mcpServer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends McpServerUpdateManyAndReturnArgs>(args: SelectSubset<T, McpServerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one McpServer.
     * @param {McpServerUpsertArgs} args - Arguments to update or create a McpServer.
     * @example
     * // Update or create a McpServer
     * const mcpServer = await prisma.mcpServer.upsert({
     *   create: {
     *     // ... data to create a McpServer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the McpServer we want to update
     *   }
     * })
     */
    upsert<T extends McpServerUpsertArgs>(args: SelectSubset<T, McpServerUpsertArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of McpServers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerCountArgs} args - Arguments to filter McpServers to count.
     * @example
     * // Count the number of McpServers
     * const count = await prisma.mcpServer.count({
     *   where: {
     *     // ... the filter for the McpServers we want to count
     *   }
     * })
    **/
    count<T extends McpServerCountArgs>(
      args?: Subset<T, McpServerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], McpServerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a McpServer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends McpServerAggregateArgs>(args: Subset<T, McpServerAggregateArgs>): Prisma.PrismaPromise<GetMcpServerAggregateType<T>>

    /**
     * Group by McpServer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends McpServerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: McpServerGroupByArgs['orderBy'] }
        : { orderBy?: McpServerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, McpServerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMcpServerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the McpServer model
   */
  readonly fields: McpServerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for McpServer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__McpServerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    versions<T extends McpServer$versionsArgs<ExtArgs> = {}>(args?: Subset<T, McpServer$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the McpServer model
   */
  interface McpServerFieldRefs {
    readonly id: FieldRef<"McpServer", 'String'>
    readonly name: FieldRef<"McpServer", 'String'>
    readonly enabled: FieldRef<"McpServer", 'Boolean'>
    readonly config: FieldRef<"McpServer", 'Json'>
    readonly productionVersion: FieldRef<"McpServer", 'Int'>
    readonly createdAt: FieldRef<"McpServer", 'DateTime'>
    readonly updatedAt: FieldRef<"McpServer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * McpServer findUnique
   */
  export type McpServerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * Filter, which McpServer to fetch.
     */
    where: McpServerWhereUniqueInput
  }

  /**
   * McpServer findUniqueOrThrow
   */
  export type McpServerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * Filter, which McpServer to fetch.
     */
    where: McpServerWhereUniqueInput
  }

  /**
   * McpServer findFirst
   */
  export type McpServerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * Filter, which McpServer to fetch.
     */
    where?: McpServerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpServers to fetch.
     */
    orderBy?: McpServerOrderByWithRelationInput | McpServerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for McpServers.
     */
    cursor?: McpServerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpServers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpServers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of McpServers.
     */
    distinct?: McpServerScalarFieldEnum | McpServerScalarFieldEnum[]
  }

  /**
   * McpServer findFirstOrThrow
   */
  export type McpServerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * Filter, which McpServer to fetch.
     */
    where?: McpServerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpServers to fetch.
     */
    orderBy?: McpServerOrderByWithRelationInput | McpServerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for McpServers.
     */
    cursor?: McpServerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpServers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpServers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of McpServers.
     */
    distinct?: McpServerScalarFieldEnum | McpServerScalarFieldEnum[]
  }

  /**
   * McpServer findMany
   */
  export type McpServerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * Filter, which McpServers to fetch.
     */
    where?: McpServerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpServers to fetch.
     */
    orderBy?: McpServerOrderByWithRelationInput | McpServerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing McpServers.
     */
    cursor?: McpServerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpServers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpServers.
     */
    skip?: number
    distinct?: McpServerScalarFieldEnum | McpServerScalarFieldEnum[]
  }

  /**
   * McpServer create
   */
  export type McpServerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * The data needed to create a McpServer.
     */
    data: XOR<McpServerCreateInput, McpServerUncheckedCreateInput>
  }

  /**
   * McpServer createMany
   */
  export type McpServerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many McpServers.
     */
    data: McpServerCreateManyInput | McpServerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * McpServer createManyAndReturn
   */
  export type McpServerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * The data used to create many McpServers.
     */
    data: McpServerCreateManyInput | McpServerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * McpServer update
   */
  export type McpServerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * The data needed to update a McpServer.
     */
    data: XOR<McpServerUpdateInput, McpServerUncheckedUpdateInput>
    /**
     * Choose, which McpServer to update.
     */
    where: McpServerWhereUniqueInput
  }

  /**
   * McpServer updateMany
   */
  export type McpServerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update McpServers.
     */
    data: XOR<McpServerUpdateManyMutationInput, McpServerUncheckedUpdateManyInput>
    /**
     * Filter which McpServers to update
     */
    where?: McpServerWhereInput
    /**
     * Limit how many McpServers to update.
     */
    limit?: number
  }

  /**
   * McpServer updateManyAndReturn
   */
  export type McpServerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * The data used to update McpServers.
     */
    data: XOR<McpServerUpdateManyMutationInput, McpServerUncheckedUpdateManyInput>
    /**
     * Filter which McpServers to update
     */
    where?: McpServerWhereInput
    /**
     * Limit how many McpServers to update.
     */
    limit?: number
  }

  /**
   * McpServer upsert
   */
  export type McpServerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * The filter to search for the McpServer to update in case it exists.
     */
    where: McpServerWhereUniqueInput
    /**
     * In case the McpServer found by the `where` argument doesn't exist, create a new McpServer with this data.
     */
    create: XOR<McpServerCreateInput, McpServerUncheckedCreateInput>
    /**
     * In case the McpServer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<McpServerUpdateInput, McpServerUncheckedUpdateInput>
  }

  /**
   * McpServer delete
   */
  export type McpServerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
    /**
     * Filter which McpServer to delete.
     */
    where: McpServerWhereUniqueInput
  }

  /**
   * McpServer deleteMany
   */
  export type McpServerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which McpServers to delete
     */
    where?: McpServerWhereInput
    /**
     * Limit how many McpServers to delete.
     */
    limit?: number
  }

  /**
   * McpServer.versions
   */
  export type McpServer$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    where?: McpServerVersionWhereInput
    orderBy?: McpServerVersionOrderByWithRelationInput | McpServerVersionOrderByWithRelationInput[]
    cursor?: McpServerVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: McpServerVersionScalarFieldEnum | McpServerVersionScalarFieldEnum[]
  }

  /**
   * McpServer without action
   */
  export type McpServerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServer
     */
    select?: McpServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServer
     */
    omit?: McpServerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerInclude<ExtArgs> | null
  }


  /**
   * Model McpServerVersion
   */

  export type AggregateMcpServerVersion = {
    _count: McpServerVersionCountAggregateOutputType | null
    _avg: McpServerVersionAvgAggregateOutputType | null
    _sum: McpServerVersionSumAggregateOutputType | null
    _min: McpServerVersionMinAggregateOutputType | null
    _max: McpServerVersionMaxAggregateOutputType | null
  }

  export type McpServerVersionAvgAggregateOutputType = {
    version: number | null
  }

  export type McpServerVersionSumAggregateOutputType = {
    version: number | null
  }

  export type McpServerVersionMinAggregateOutputType = {
    id: string | null
    mcpServerId: string | null
    version: number | null
    description: string | null
    code: string | null
    createdAt: Date | null
  }

  export type McpServerVersionMaxAggregateOutputType = {
    id: string | null
    mcpServerId: string | null
    version: number | null
    description: string | null
    code: string | null
    createdAt: Date | null
  }

  export type McpServerVersionCountAggregateOutputType = {
    id: number
    mcpServerId: number
    version: number
    description: number
    code: number
    createdAt: number
    _all: number
  }


  export type McpServerVersionAvgAggregateInputType = {
    version?: true
  }

  export type McpServerVersionSumAggregateInputType = {
    version?: true
  }

  export type McpServerVersionMinAggregateInputType = {
    id?: true
    mcpServerId?: true
    version?: true
    description?: true
    code?: true
    createdAt?: true
  }

  export type McpServerVersionMaxAggregateInputType = {
    id?: true
    mcpServerId?: true
    version?: true
    description?: true
    code?: true
    createdAt?: true
  }

  export type McpServerVersionCountAggregateInputType = {
    id?: true
    mcpServerId?: true
    version?: true
    description?: true
    code?: true
    createdAt?: true
    _all?: true
  }

  export type McpServerVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which McpServerVersion to aggregate.
     */
    where?: McpServerVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpServerVersions to fetch.
     */
    orderBy?: McpServerVersionOrderByWithRelationInput | McpServerVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: McpServerVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpServerVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpServerVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned McpServerVersions
    **/
    _count?: true | McpServerVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: McpServerVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: McpServerVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: McpServerVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: McpServerVersionMaxAggregateInputType
  }

  export type GetMcpServerVersionAggregateType<T extends McpServerVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateMcpServerVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMcpServerVersion[P]>
      : GetScalarType<T[P], AggregateMcpServerVersion[P]>
  }




  export type McpServerVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: McpServerVersionWhereInput
    orderBy?: McpServerVersionOrderByWithAggregationInput | McpServerVersionOrderByWithAggregationInput[]
    by: McpServerVersionScalarFieldEnum[] | McpServerVersionScalarFieldEnum
    having?: McpServerVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: McpServerVersionCountAggregateInputType | true
    _avg?: McpServerVersionAvgAggregateInputType
    _sum?: McpServerVersionSumAggregateInputType
    _min?: McpServerVersionMinAggregateInputType
    _max?: McpServerVersionMaxAggregateInputType
  }

  export type McpServerVersionGroupByOutputType = {
    id: string
    mcpServerId: string
    version: number
    description: string | null
    code: string
    createdAt: Date
    _count: McpServerVersionCountAggregateOutputType | null
    _avg: McpServerVersionAvgAggregateOutputType | null
    _sum: McpServerVersionSumAggregateOutputType | null
    _min: McpServerVersionMinAggregateOutputType | null
    _max: McpServerVersionMaxAggregateOutputType | null
  }

  type GetMcpServerVersionGroupByPayload<T extends McpServerVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<McpServerVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof McpServerVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], McpServerVersionGroupByOutputType[P]>
            : GetScalarType<T[P], McpServerVersionGroupByOutputType[P]>
        }
      >
    >


  export type McpServerVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mcpServerId?: boolean
    version?: boolean
    description?: boolean
    code?: boolean
    createdAt?: boolean
    mcpServer?: boolean | McpServerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpServerVersion"]>

  export type McpServerVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mcpServerId?: boolean
    version?: boolean
    description?: boolean
    code?: boolean
    createdAt?: boolean
    mcpServer?: boolean | McpServerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpServerVersion"]>

  export type McpServerVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mcpServerId?: boolean
    version?: boolean
    description?: boolean
    code?: boolean
    createdAt?: boolean
    mcpServer?: boolean | McpServerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpServerVersion"]>

  export type McpServerVersionSelectScalar = {
    id?: boolean
    mcpServerId?: boolean
    version?: boolean
    description?: boolean
    code?: boolean
    createdAt?: boolean
  }

  export type McpServerVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "mcpServerId" | "version" | "description" | "code" | "createdAt", ExtArgs["result"]["mcpServerVersion"]>
  export type McpServerVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mcpServer?: boolean | McpServerDefaultArgs<ExtArgs>
  }
  export type McpServerVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mcpServer?: boolean | McpServerDefaultArgs<ExtArgs>
  }
  export type McpServerVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mcpServer?: boolean | McpServerDefaultArgs<ExtArgs>
  }

  export type $McpServerVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "McpServerVersion"
    objects: {
      mcpServer: Prisma.$McpServerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      mcpServerId: string
      version: number
      description: string | null
      code: string
      createdAt: Date
    }, ExtArgs["result"]["mcpServerVersion"]>
    composites: {}
  }

  type McpServerVersionGetPayload<S extends boolean | null | undefined | McpServerVersionDefaultArgs> = $Result.GetResult<Prisma.$McpServerVersionPayload, S>

  type McpServerVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<McpServerVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: McpServerVersionCountAggregateInputType | true
    }

  export interface McpServerVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['McpServerVersion'], meta: { name: 'McpServerVersion' } }
    /**
     * Find zero or one McpServerVersion that matches the filter.
     * @param {McpServerVersionFindUniqueArgs} args - Arguments to find a McpServerVersion
     * @example
     * // Get one McpServerVersion
     * const mcpServerVersion = await prisma.mcpServerVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends McpServerVersionFindUniqueArgs>(args: SelectSubset<T, McpServerVersionFindUniqueArgs<ExtArgs>>): Prisma__McpServerVersionClient<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one McpServerVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {McpServerVersionFindUniqueOrThrowArgs} args - Arguments to find a McpServerVersion
     * @example
     * // Get one McpServerVersion
     * const mcpServerVersion = await prisma.mcpServerVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends McpServerVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, McpServerVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__McpServerVersionClient<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first McpServerVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerVersionFindFirstArgs} args - Arguments to find a McpServerVersion
     * @example
     * // Get one McpServerVersion
     * const mcpServerVersion = await prisma.mcpServerVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends McpServerVersionFindFirstArgs>(args?: SelectSubset<T, McpServerVersionFindFirstArgs<ExtArgs>>): Prisma__McpServerVersionClient<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first McpServerVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerVersionFindFirstOrThrowArgs} args - Arguments to find a McpServerVersion
     * @example
     * // Get one McpServerVersion
     * const mcpServerVersion = await prisma.mcpServerVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends McpServerVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, McpServerVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__McpServerVersionClient<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more McpServerVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all McpServerVersions
     * const mcpServerVersions = await prisma.mcpServerVersion.findMany()
     * 
     * // Get first 10 McpServerVersions
     * const mcpServerVersions = await prisma.mcpServerVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mcpServerVersionWithIdOnly = await prisma.mcpServerVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends McpServerVersionFindManyArgs>(args?: SelectSubset<T, McpServerVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a McpServerVersion.
     * @param {McpServerVersionCreateArgs} args - Arguments to create a McpServerVersion.
     * @example
     * // Create one McpServerVersion
     * const McpServerVersion = await prisma.mcpServerVersion.create({
     *   data: {
     *     // ... data to create a McpServerVersion
     *   }
     * })
     * 
     */
    create<T extends McpServerVersionCreateArgs>(args: SelectSubset<T, McpServerVersionCreateArgs<ExtArgs>>): Prisma__McpServerVersionClient<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many McpServerVersions.
     * @param {McpServerVersionCreateManyArgs} args - Arguments to create many McpServerVersions.
     * @example
     * // Create many McpServerVersions
     * const mcpServerVersion = await prisma.mcpServerVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends McpServerVersionCreateManyArgs>(args?: SelectSubset<T, McpServerVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many McpServerVersions and returns the data saved in the database.
     * @param {McpServerVersionCreateManyAndReturnArgs} args - Arguments to create many McpServerVersions.
     * @example
     * // Create many McpServerVersions
     * const mcpServerVersion = await prisma.mcpServerVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many McpServerVersions and only return the `id`
     * const mcpServerVersionWithIdOnly = await prisma.mcpServerVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends McpServerVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, McpServerVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a McpServerVersion.
     * @param {McpServerVersionDeleteArgs} args - Arguments to delete one McpServerVersion.
     * @example
     * // Delete one McpServerVersion
     * const McpServerVersion = await prisma.mcpServerVersion.delete({
     *   where: {
     *     // ... filter to delete one McpServerVersion
     *   }
     * })
     * 
     */
    delete<T extends McpServerVersionDeleteArgs>(args: SelectSubset<T, McpServerVersionDeleteArgs<ExtArgs>>): Prisma__McpServerVersionClient<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one McpServerVersion.
     * @param {McpServerVersionUpdateArgs} args - Arguments to update one McpServerVersion.
     * @example
     * // Update one McpServerVersion
     * const mcpServerVersion = await prisma.mcpServerVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends McpServerVersionUpdateArgs>(args: SelectSubset<T, McpServerVersionUpdateArgs<ExtArgs>>): Prisma__McpServerVersionClient<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more McpServerVersions.
     * @param {McpServerVersionDeleteManyArgs} args - Arguments to filter McpServerVersions to delete.
     * @example
     * // Delete a few McpServerVersions
     * const { count } = await prisma.mcpServerVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends McpServerVersionDeleteManyArgs>(args?: SelectSubset<T, McpServerVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more McpServerVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many McpServerVersions
     * const mcpServerVersion = await prisma.mcpServerVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends McpServerVersionUpdateManyArgs>(args: SelectSubset<T, McpServerVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more McpServerVersions and returns the data updated in the database.
     * @param {McpServerVersionUpdateManyAndReturnArgs} args - Arguments to update many McpServerVersions.
     * @example
     * // Update many McpServerVersions
     * const mcpServerVersion = await prisma.mcpServerVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more McpServerVersions and only return the `id`
     * const mcpServerVersionWithIdOnly = await prisma.mcpServerVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends McpServerVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, McpServerVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one McpServerVersion.
     * @param {McpServerVersionUpsertArgs} args - Arguments to update or create a McpServerVersion.
     * @example
     * // Update or create a McpServerVersion
     * const mcpServerVersion = await prisma.mcpServerVersion.upsert({
     *   create: {
     *     // ... data to create a McpServerVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the McpServerVersion we want to update
     *   }
     * })
     */
    upsert<T extends McpServerVersionUpsertArgs>(args: SelectSubset<T, McpServerVersionUpsertArgs<ExtArgs>>): Prisma__McpServerVersionClient<$Result.GetResult<Prisma.$McpServerVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of McpServerVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerVersionCountArgs} args - Arguments to filter McpServerVersions to count.
     * @example
     * // Count the number of McpServerVersions
     * const count = await prisma.mcpServerVersion.count({
     *   where: {
     *     // ... the filter for the McpServerVersions we want to count
     *   }
     * })
    **/
    count<T extends McpServerVersionCountArgs>(
      args?: Subset<T, McpServerVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], McpServerVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a McpServerVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends McpServerVersionAggregateArgs>(args: Subset<T, McpServerVersionAggregateArgs>): Prisma.PrismaPromise<GetMcpServerVersionAggregateType<T>>

    /**
     * Group by McpServerVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpServerVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends McpServerVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: McpServerVersionGroupByArgs['orderBy'] }
        : { orderBy?: McpServerVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, McpServerVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMcpServerVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the McpServerVersion model
   */
  readonly fields: McpServerVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for McpServerVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__McpServerVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mcpServer<T extends McpServerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, McpServerDefaultArgs<ExtArgs>>): Prisma__McpServerClient<$Result.GetResult<Prisma.$McpServerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the McpServerVersion model
   */
  interface McpServerVersionFieldRefs {
    readonly id: FieldRef<"McpServerVersion", 'String'>
    readonly mcpServerId: FieldRef<"McpServerVersion", 'String'>
    readonly version: FieldRef<"McpServerVersion", 'Int'>
    readonly description: FieldRef<"McpServerVersion", 'String'>
    readonly code: FieldRef<"McpServerVersion", 'String'>
    readonly createdAt: FieldRef<"McpServerVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * McpServerVersion findUnique
   */
  export type McpServerVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * Filter, which McpServerVersion to fetch.
     */
    where: McpServerVersionWhereUniqueInput
  }

  /**
   * McpServerVersion findUniqueOrThrow
   */
  export type McpServerVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * Filter, which McpServerVersion to fetch.
     */
    where: McpServerVersionWhereUniqueInput
  }

  /**
   * McpServerVersion findFirst
   */
  export type McpServerVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * Filter, which McpServerVersion to fetch.
     */
    where?: McpServerVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpServerVersions to fetch.
     */
    orderBy?: McpServerVersionOrderByWithRelationInput | McpServerVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for McpServerVersions.
     */
    cursor?: McpServerVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpServerVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpServerVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of McpServerVersions.
     */
    distinct?: McpServerVersionScalarFieldEnum | McpServerVersionScalarFieldEnum[]
  }

  /**
   * McpServerVersion findFirstOrThrow
   */
  export type McpServerVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * Filter, which McpServerVersion to fetch.
     */
    where?: McpServerVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpServerVersions to fetch.
     */
    orderBy?: McpServerVersionOrderByWithRelationInput | McpServerVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for McpServerVersions.
     */
    cursor?: McpServerVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpServerVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpServerVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of McpServerVersions.
     */
    distinct?: McpServerVersionScalarFieldEnum | McpServerVersionScalarFieldEnum[]
  }

  /**
   * McpServerVersion findMany
   */
  export type McpServerVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * Filter, which McpServerVersions to fetch.
     */
    where?: McpServerVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpServerVersions to fetch.
     */
    orderBy?: McpServerVersionOrderByWithRelationInput | McpServerVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing McpServerVersions.
     */
    cursor?: McpServerVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpServerVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpServerVersions.
     */
    skip?: number
    distinct?: McpServerVersionScalarFieldEnum | McpServerVersionScalarFieldEnum[]
  }

  /**
   * McpServerVersion create
   */
  export type McpServerVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a McpServerVersion.
     */
    data: XOR<McpServerVersionCreateInput, McpServerVersionUncheckedCreateInput>
  }

  /**
   * McpServerVersion createMany
   */
  export type McpServerVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many McpServerVersions.
     */
    data: McpServerVersionCreateManyInput | McpServerVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * McpServerVersion createManyAndReturn
   */
  export type McpServerVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * The data used to create many McpServerVersions.
     */
    data: McpServerVersionCreateManyInput | McpServerVersionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * McpServerVersion update
   */
  export type McpServerVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a McpServerVersion.
     */
    data: XOR<McpServerVersionUpdateInput, McpServerVersionUncheckedUpdateInput>
    /**
     * Choose, which McpServerVersion to update.
     */
    where: McpServerVersionWhereUniqueInput
  }

  /**
   * McpServerVersion updateMany
   */
  export type McpServerVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update McpServerVersions.
     */
    data: XOR<McpServerVersionUpdateManyMutationInput, McpServerVersionUncheckedUpdateManyInput>
    /**
     * Filter which McpServerVersions to update
     */
    where?: McpServerVersionWhereInput
    /**
     * Limit how many McpServerVersions to update.
     */
    limit?: number
  }

  /**
   * McpServerVersion updateManyAndReturn
   */
  export type McpServerVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * The data used to update McpServerVersions.
     */
    data: XOR<McpServerVersionUpdateManyMutationInput, McpServerVersionUncheckedUpdateManyInput>
    /**
     * Filter which McpServerVersions to update
     */
    where?: McpServerVersionWhereInput
    /**
     * Limit how many McpServerVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * McpServerVersion upsert
   */
  export type McpServerVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the McpServerVersion to update in case it exists.
     */
    where: McpServerVersionWhereUniqueInput
    /**
     * In case the McpServerVersion found by the `where` argument doesn't exist, create a new McpServerVersion with this data.
     */
    create: XOR<McpServerVersionCreateInput, McpServerVersionUncheckedCreateInput>
    /**
     * In case the McpServerVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<McpServerVersionUpdateInput, McpServerVersionUncheckedUpdateInput>
  }

  /**
   * McpServerVersion delete
   */
  export type McpServerVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
    /**
     * Filter which McpServerVersion to delete.
     */
    where: McpServerVersionWhereUniqueInput
  }

  /**
   * McpServerVersion deleteMany
   */
  export type McpServerVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which McpServerVersions to delete
     */
    where?: McpServerVersionWhereInput
    /**
     * Limit how many McpServerVersions to delete.
     */
    limit?: number
  }

  /**
   * McpServerVersion without action
   */
  export type McpServerVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpServerVersion
     */
    select?: McpServerVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the McpServerVersion
     */
    omit?: McpServerVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpServerVersionInclude<ExtArgs> | null
  }


  /**
   * Model BizTableMapping
   */

  export type AggregateBizTableMapping = {
    _count: BizTableMappingCountAggregateOutputType | null
    _min: BizTableMappingMinAggregateOutputType | null
    _max: BizTableMappingMaxAggregateOutputType | null
  }

  export type BizTableMappingMinAggregateOutputType = {
    id: string | null
    userName: string | null
    logicalName: string | null
    physicalName: string | null
    createdAt: Date | null
  }

  export type BizTableMappingMaxAggregateOutputType = {
    id: string | null
    userName: string | null
    logicalName: string | null
    physicalName: string | null
    createdAt: Date | null
  }

  export type BizTableMappingCountAggregateOutputType = {
    id: number
    userName: number
    logicalName: number
    physicalName: number
    createdAt: number
    _all: number
  }


  export type BizTableMappingMinAggregateInputType = {
    id?: true
    userName?: true
    logicalName?: true
    physicalName?: true
    createdAt?: true
  }

  export type BizTableMappingMaxAggregateInputType = {
    id?: true
    userName?: true
    logicalName?: true
    physicalName?: true
    createdAt?: true
  }

  export type BizTableMappingCountAggregateInputType = {
    id?: true
    userName?: true
    logicalName?: true
    physicalName?: true
    createdAt?: true
    _all?: true
  }

  export type BizTableMappingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BizTableMapping to aggregate.
     */
    where?: BizTableMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BizTableMappings to fetch.
     */
    orderBy?: BizTableMappingOrderByWithRelationInput | BizTableMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BizTableMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BizTableMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BizTableMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BizTableMappings
    **/
    _count?: true | BizTableMappingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BizTableMappingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BizTableMappingMaxAggregateInputType
  }

  export type GetBizTableMappingAggregateType<T extends BizTableMappingAggregateArgs> = {
        [P in keyof T & keyof AggregateBizTableMapping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBizTableMapping[P]>
      : GetScalarType<T[P], AggregateBizTableMapping[P]>
  }




  export type BizTableMappingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BizTableMappingWhereInput
    orderBy?: BizTableMappingOrderByWithAggregationInput | BizTableMappingOrderByWithAggregationInput[]
    by: BizTableMappingScalarFieldEnum[] | BizTableMappingScalarFieldEnum
    having?: BizTableMappingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BizTableMappingCountAggregateInputType | true
    _min?: BizTableMappingMinAggregateInputType
    _max?: BizTableMappingMaxAggregateInputType
  }

  export type BizTableMappingGroupByOutputType = {
    id: string
    userName: string
    logicalName: string
    physicalName: string
    createdAt: Date
    _count: BizTableMappingCountAggregateOutputType | null
    _min: BizTableMappingMinAggregateOutputType | null
    _max: BizTableMappingMaxAggregateOutputType | null
  }

  type GetBizTableMappingGroupByPayload<T extends BizTableMappingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BizTableMappingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BizTableMappingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BizTableMappingGroupByOutputType[P]>
            : GetScalarType<T[P], BizTableMappingGroupByOutputType[P]>
        }
      >
    >


  export type BizTableMappingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userName?: boolean
    logicalName?: boolean
    physicalName?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["bizTableMapping"]>

  export type BizTableMappingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userName?: boolean
    logicalName?: boolean
    physicalName?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["bizTableMapping"]>

  export type BizTableMappingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userName?: boolean
    logicalName?: boolean
    physicalName?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["bizTableMapping"]>

  export type BizTableMappingSelectScalar = {
    id?: boolean
    userName?: boolean
    logicalName?: boolean
    physicalName?: boolean
    createdAt?: boolean
  }

  export type BizTableMappingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userName" | "logicalName" | "physicalName" | "createdAt", ExtArgs["result"]["bizTableMapping"]>

  export type $BizTableMappingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BizTableMapping"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userName: string
      logicalName: string
      physicalName: string
      createdAt: Date
    }, ExtArgs["result"]["bizTableMapping"]>
    composites: {}
  }

  type BizTableMappingGetPayload<S extends boolean | null | undefined | BizTableMappingDefaultArgs> = $Result.GetResult<Prisma.$BizTableMappingPayload, S>

  type BizTableMappingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BizTableMappingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BizTableMappingCountAggregateInputType | true
    }

  export interface BizTableMappingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BizTableMapping'], meta: { name: 'BizTableMapping' } }
    /**
     * Find zero or one BizTableMapping that matches the filter.
     * @param {BizTableMappingFindUniqueArgs} args - Arguments to find a BizTableMapping
     * @example
     * // Get one BizTableMapping
     * const bizTableMapping = await prisma.bizTableMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BizTableMappingFindUniqueArgs>(args: SelectSubset<T, BizTableMappingFindUniqueArgs<ExtArgs>>): Prisma__BizTableMappingClient<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BizTableMapping that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BizTableMappingFindUniqueOrThrowArgs} args - Arguments to find a BizTableMapping
     * @example
     * // Get one BizTableMapping
     * const bizTableMapping = await prisma.bizTableMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BizTableMappingFindUniqueOrThrowArgs>(args: SelectSubset<T, BizTableMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BizTableMappingClient<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BizTableMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BizTableMappingFindFirstArgs} args - Arguments to find a BizTableMapping
     * @example
     * // Get one BizTableMapping
     * const bizTableMapping = await prisma.bizTableMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BizTableMappingFindFirstArgs>(args?: SelectSubset<T, BizTableMappingFindFirstArgs<ExtArgs>>): Prisma__BizTableMappingClient<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BizTableMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BizTableMappingFindFirstOrThrowArgs} args - Arguments to find a BizTableMapping
     * @example
     * // Get one BizTableMapping
     * const bizTableMapping = await prisma.bizTableMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BizTableMappingFindFirstOrThrowArgs>(args?: SelectSubset<T, BizTableMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BizTableMappingClient<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BizTableMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BizTableMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BizTableMappings
     * const bizTableMappings = await prisma.bizTableMapping.findMany()
     * 
     * // Get first 10 BizTableMappings
     * const bizTableMappings = await prisma.bizTableMapping.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bizTableMappingWithIdOnly = await prisma.bizTableMapping.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BizTableMappingFindManyArgs>(args?: SelectSubset<T, BizTableMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BizTableMapping.
     * @param {BizTableMappingCreateArgs} args - Arguments to create a BizTableMapping.
     * @example
     * // Create one BizTableMapping
     * const BizTableMapping = await prisma.bizTableMapping.create({
     *   data: {
     *     // ... data to create a BizTableMapping
     *   }
     * })
     * 
     */
    create<T extends BizTableMappingCreateArgs>(args: SelectSubset<T, BizTableMappingCreateArgs<ExtArgs>>): Prisma__BizTableMappingClient<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BizTableMappings.
     * @param {BizTableMappingCreateManyArgs} args - Arguments to create many BizTableMappings.
     * @example
     * // Create many BizTableMappings
     * const bizTableMapping = await prisma.bizTableMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BizTableMappingCreateManyArgs>(args?: SelectSubset<T, BizTableMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BizTableMappings and returns the data saved in the database.
     * @param {BizTableMappingCreateManyAndReturnArgs} args - Arguments to create many BizTableMappings.
     * @example
     * // Create many BizTableMappings
     * const bizTableMapping = await prisma.bizTableMapping.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BizTableMappings and only return the `id`
     * const bizTableMappingWithIdOnly = await prisma.bizTableMapping.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BizTableMappingCreateManyAndReturnArgs>(args?: SelectSubset<T, BizTableMappingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BizTableMapping.
     * @param {BizTableMappingDeleteArgs} args - Arguments to delete one BizTableMapping.
     * @example
     * // Delete one BizTableMapping
     * const BizTableMapping = await prisma.bizTableMapping.delete({
     *   where: {
     *     // ... filter to delete one BizTableMapping
     *   }
     * })
     * 
     */
    delete<T extends BizTableMappingDeleteArgs>(args: SelectSubset<T, BizTableMappingDeleteArgs<ExtArgs>>): Prisma__BizTableMappingClient<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BizTableMapping.
     * @param {BizTableMappingUpdateArgs} args - Arguments to update one BizTableMapping.
     * @example
     * // Update one BizTableMapping
     * const bizTableMapping = await prisma.bizTableMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BizTableMappingUpdateArgs>(args: SelectSubset<T, BizTableMappingUpdateArgs<ExtArgs>>): Prisma__BizTableMappingClient<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BizTableMappings.
     * @param {BizTableMappingDeleteManyArgs} args - Arguments to filter BizTableMappings to delete.
     * @example
     * // Delete a few BizTableMappings
     * const { count } = await prisma.bizTableMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BizTableMappingDeleteManyArgs>(args?: SelectSubset<T, BizTableMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BizTableMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BizTableMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BizTableMappings
     * const bizTableMapping = await prisma.bizTableMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BizTableMappingUpdateManyArgs>(args: SelectSubset<T, BizTableMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BizTableMappings and returns the data updated in the database.
     * @param {BizTableMappingUpdateManyAndReturnArgs} args - Arguments to update many BizTableMappings.
     * @example
     * // Update many BizTableMappings
     * const bizTableMapping = await prisma.bizTableMapping.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BizTableMappings and only return the `id`
     * const bizTableMappingWithIdOnly = await prisma.bizTableMapping.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BizTableMappingUpdateManyAndReturnArgs>(args: SelectSubset<T, BizTableMappingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BizTableMapping.
     * @param {BizTableMappingUpsertArgs} args - Arguments to update or create a BizTableMapping.
     * @example
     * // Update or create a BizTableMapping
     * const bizTableMapping = await prisma.bizTableMapping.upsert({
     *   create: {
     *     // ... data to create a BizTableMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BizTableMapping we want to update
     *   }
     * })
     */
    upsert<T extends BizTableMappingUpsertArgs>(args: SelectSubset<T, BizTableMappingUpsertArgs<ExtArgs>>): Prisma__BizTableMappingClient<$Result.GetResult<Prisma.$BizTableMappingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BizTableMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BizTableMappingCountArgs} args - Arguments to filter BizTableMappings to count.
     * @example
     * // Count the number of BizTableMappings
     * const count = await prisma.bizTableMapping.count({
     *   where: {
     *     // ... the filter for the BizTableMappings we want to count
     *   }
     * })
    **/
    count<T extends BizTableMappingCountArgs>(
      args?: Subset<T, BizTableMappingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BizTableMappingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BizTableMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BizTableMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BizTableMappingAggregateArgs>(args: Subset<T, BizTableMappingAggregateArgs>): Prisma.PrismaPromise<GetBizTableMappingAggregateType<T>>

    /**
     * Group by BizTableMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BizTableMappingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BizTableMappingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BizTableMappingGroupByArgs['orderBy'] }
        : { orderBy?: BizTableMappingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BizTableMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBizTableMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BizTableMapping model
   */
  readonly fields: BizTableMappingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BizTableMapping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BizTableMappingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BizTableMapping model
   */
  interface BizTableMappingFieldRefs {
    readonly id: FieldRef<"BizTableMapping", 'String'>
    readonly userName: FieldRef<"BizTableMapping", 'String'>
    readonly logicalName: FieldRef<"BizTableMapping", 'String'>
    readonly physicalName: FieldRef<"BizTableMapping", 'String'>
    readonly createdAt: FieldRef<"BizTableMapping", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BizTableMapping findUnique
   */
  export type BizTableMappingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * Filter, which BizTableMapping to fetch.
     */
    where: BizTableMappingWhereUniqueInput
  }

  /**
   * BizTableMapping findUniqueOrThrow
   */
  export type BizTableMappingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * Filter, which BizTableMapping to fetch.
     */
    where: BizTableMappingWhereUniqueInput
  }

  /**
   * BizTableMapping findFirst
   */
  export type BizTableMappingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * Filter, which BizTableMapping to fetch.
     */
    where?: BizTableMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BizTableMappings to fetch.
     */
    orderBy?: BizTableMappingOrderByWithRelationInput | BizTableMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BizTableMappings.
     */
    cursor?: BizTableMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BizTableMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BizTableMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BizTableMappings.
     */
    distinct?: BizTableMappingScalarFieldEnum | BizTableMappingScalarFieldEnum[]
  }

  /**
   * BizTableMapping findFirstOrThrow
   */
  export type BizTableMappingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * Filter, which BizTableMapping to fetch.
     */
    where?: BizTableMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BizTableMappings to fetch.
     */
    orderBy?: BizTableMappingOrderByWithRelationInput | BizTableMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BizTableMappings.
     */
    cursor?: BizTableMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BizTableMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BizTableMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BizTableMappings.
     */
    distinct?: BizTableMappingScalarFieldEnum | BizTableMappingScalarFieldEnum[]
  }

  /**
   * BizTableMapping findMany
   */
  export type BizTableMappingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * Filter, which BizTableMappings to fetch.
     */
    where?: BizTableMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BizTableMappings to fetch.
     */
    orderBy?: BizTableMappingOrderByWithRelationInput | BizTableMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BizTableMappings.
     */
    cursor?: BizTableMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BizTableMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BizTableMappings.
     */
    skip?: number
    distinct?: BizTableMappingScalarFieldEnum | BizTableMappingScalarFieldEnum[]
  }

  /**
   * BizTableMapping create
   */
  export type BizTableMappingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * The data needed to create a BizTableMapping.
     */
    data: XOR<BizTableMappingCreateInput, BizTableMappingUncheckedCreateInput>
  }

  /**
   * BizTableMapping createMany
   */
  export type BizTableMappingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BizTableMappings.
     */
    data: BizTableMappingCreateManyInput | BizTableMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BizTableMapping createManyAndReturn
   */
  export type BizTableMappingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * The data used to create many BizTableMappings.
     */
    data: BizTableMappingCreateManyInput | BizTableMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BizTableMapping update
   */
  export type BizTableMappingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * The data needed to update a BizTableMapping.
     */
    data: XOR<BizTableMappingUpdateInput, BizTableMappingUncheckedUpdateInput>
    /**
     * Choose, which BizTableMapping to update.
     */
    where: BizTableMappingWhereUniqueInput
  }

  /**
   * BizTableMapping updateMany
   */
  export type BizTableMappingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BizTableMappings.
     */
    data: XOR<BizTableMappingUpdateManyMutationInput, BizTableMappingUncheckedUpdateManyInput>
    /**
     * Filter which BizTableMappings to update
     */
    where?: BizTableMappingWhereInput
    /**
     * Limit how many BizTableMappings to update.
     */
    limit?: number
  }

  /**
   * BizTableMapping updateManyAndReturn
   */
  export type BizTableMappingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * The data used to update BizTableMappings.
     */
    data: XOR<BizTableMappingUpdateManyMutationInput, BizTableMappingUncheckedUpdateManyInput>
    /**
     * Filter which BizTableMappings to update
     */
    where?: BizTableMappingWhereInput
    /**
     * Limit how many BizTableMappings to update.
     */
    limit?: number
  }

  /**
   * BizTableMapping upsert
   */
  export type BizTableMappingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * The filter to search for the BizTableMapping to update in case it exists.
     */
    where: BizTableMappingWhereUniqueInput
    /**
     * In case the BizTableMapping found by the `where` argument doesn't exist, create a new BizTableMapping with this data.
     */
    create: XOR<BizTableMappingCreateInput, BizTableMappingUncheckedCreateInput>
    /**
     * In case the BizTableMapping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BizTableMappingUpdateInput, BizTableMappingUncheckedUpdateInput>
  }

  /**
   * BizTableMapping delete
   */
  export type BizTableMappingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
    /**
     * Filter which BizTableMapping to delete.
     */
    where: BizTableMappingWhereUniqueInput
  }

  /**
   * BizTableMapping deleteMany
   */
  export type BizTableMappingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BizTableMappings to delete
     */
    where?: BizTableMappingWhereInput
    /**
     * Limit how many BizTableMappings to delete.
     */
    limit?: number
  }

  /**
   * BizTableMapping without action
   */
  export type BizTableMappingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BizTableMapping
     */
    select?: BizTableMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BizTableMapping
     */
    omit?: BizTableMappingOmit<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    status: string | null
    reply: string | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    status: string | null
    reply: string | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    sessionId: number
    status: number
    input: number
    reply: number
    error: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaskMinAggregateInputType = {
    id?: true
    sessionId?: true
    status?: true
    reply?: true
    error?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    sessionId?: true
    status?: true
    reply?: true
    error?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    sessionId?: true
    status?: true
    input?: true
    reply?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    sessionId: string
    status: string
    input: JsonValue
    reply: string | null
    error: string | null
    createdAt: Date
    updatedAt: Date
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    status?: boolean
    input?: boolean
    reply?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    events?: boolean | Task$eventsArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    status?: boolean
    input?: boolean
    reply?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    status?: boolean
    input?: boolean
    reply?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    sessionId?: boolean
    status?: boolean
    input?: boolean
    reply?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "status" | "input" | "reply" | "error" | "createdAt" | "updatedAt", ExtArgs["result"]["task"]>
  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
    events?: boolean | Task$eventsArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type TaskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      session: Prisma.$ChatSessionPayload<ExtArgs>
      events: Prisma.$TaskEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      status: string
      input: Prisma.JsonValue
      reply: string | null
      error: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks and returns the data updated in the database.
     * @param {TaskUpdateManyAndReturnArgs} args - Arguments to update many Tasks.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends ChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatSessionDefaultArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    events<T extends Task$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Task$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly sessionId: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'String'>
    readonly input: FieldRef<"Task", 'Json'>
    readonly reply: FieldRef<"Task", 'String'>
    readonly error: FieldRef<"Task", 'String'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly updatedAt: FieldRef<"Task", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
  }

  /**
   * Task updateManyAndReturn
   */
  export type TaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to delete.
     */
    limit?: number
  }

  /**
   * Task.events
   */
  export type Task$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    where?: TaskEventWhereInput
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    cursor?: TaskEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskEventScalarFieldEnum | TaskEventScalarFieldEnum[]
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model TaskEvent
   */

  export type AggregateTaskEvent = {
    _count: TaskEventCountAggregateOutputType | null
    _avg: TaskEventAvgAggregateOutputType | null
    _sum: TaskEventSumAggregateOutputType | null
    _min: TaskEventMinAggregateOutputType | null
    _max: TaskEventMaxAggregateOutputType | null
  }

  export type TaskEventAvgAggregateOutputType = {
    id: number | null
  }

  export type TaskEventSumAggregateOutputType = {
    id: number | null
  }

  export type TaskEventMinAggregateOutputType = {
    id: number | null
    taskId: string | null
    type: string | null
    createdAt: Date | null
  }

  export type TaskEventMaxAggregateOutputType = {
    id: number | null
    taskId: string | null
    type: string | null
    createdAt: Date | null
  }

  export type TaskEventCountAggregateOutputType = {
    id: number
    taskId: number
    type: number
    data: number
    createdAt: number
    _all: number
  }


  export type TaskEventAvgAggregateInputType = {
    id?: true
  }

  export type TaskEventSumAggregateInputType = {
    id?: true
  }

  export type TaskEventMinAggregateInputType = {
    id?: true
    taskId?: true
    type?: true
    createdAt?: true
  }

  export type TaskEventMaxAggregateInputType = {
    id?: true
    taskId?: true
    type?: true
    createdAt?: true
  }

  export type TaskEventCountAggregateInputType = {
    id?: true
    taskId?: true
    type?: true
    data?: true
    createdAt?: true
    _all?: true
  }

  export type TaskEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskEvent to aggregate.
     */
    where?: TaskEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEvents to fetch.
     */
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskEvents
    **/
    _count?: true | TaskEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskEventMaxAggregateInputType
  }

  export type GetTaskEventAggregateType<T extends TaskEventAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskEvent[P]>
      : GetScalarType<T[P], AggregateTaskEvent[P]>
  }




  export type TaskEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskEventWhereInput
    orderBy?: TaskEventOrderByWithAggregationInput | TaskEventOrderByWithAggregationInput[]
    by: TaskEventScalarFieldEnum[] | TaskEventScalarFieldEnum
    having?: TaskEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskEventCountAggregateInputType | true
    _avg?: TaskEventAvgAggregateInputType
    _sum?: TaskEventSumAggregateInputType
    _min?: TaskEventMinAggregateInputType
    _max?: TaskEventMaxAggregateInputType
  }

  export type TaskEventGroupByOutputType = {
    id: number
    taskId: string
    type: string
    data: JsonValue
    createdAt: Date
    _count: TaskEventCountAggregateOutputType | null
    _avg: TaskEventAvgAggregateOutputType | null
    _sum: TaskEventSumAggregateOutputType | null
    _min: TaskEventMinAggregateOutputType | null
    _max: TaskEventMaxAggregateOutputType | null
  }

  type GetTaskEventGroupByPayload<T extends TaskEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskEventGroupByOutputType[P]>
            : GetScalarType<T[P], TaskEventGroupByOutputType[P]>
        }
      >
    >


  export type TaskEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    type?: boolean
    data?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskEvent"]>

  export type TaskEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    type?: boolean
    data?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskEvent"]>

  export type TaskEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    taskId?: boolean
    type?: boolean
    data?: boolean
    createdAt?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskEvent"]>

  export type TaskEventSelectScalar = {
    id?: boolean
    taskId?: boolean
    type?: boolean
    data?: boolean
    createdAt?: boolean
  }

  export type TaskEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "taskId" | "type" | "data" | "createdAt", ExtArgs["result"]["taskEvent"]>
  export type TaskEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }
  export type TaskEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }
  export type TaskEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }

  export type $TaskEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskEvent"
    objects: {
      task: Prisma.$TaskPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      taskId: string
      type: string
      data: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["taskEvent"]>
    composites: {}
  }

  type TaskEventGetPayload<S extends boolean | null | undefined | TaskEventDefaultArgs> = $Result.GetResult<Prisma.$TaskEventPayload, S>

  type TaskEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskEventCountAggregateInputType | true
    }

  export interface TaskEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskEvent'], meta: { name: 'TaskEvent' } }
    /**
     * Find zero or one TaskEvent that matches the filter.
     * @param {TaskEventFindUniqueArgs} args - Arguments to find a TaskEvent
     * @example
     * // Get one TaskEvent
     * const taskEvent = await prisma.taskEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskEventFindUniqueArgs>(args: SelectSubset<T, TaskEventFindUniqueArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TaskEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskEventFindUniqueOrThrowArgs} args - Arguments to find a TaskEvent
     * @example
     * // Get one TaskEvent
     * const taskEvent = await prisma.taskEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskEventFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventFindFirstArgs} args - Arguments to find a TaskEvent
     * @example
     * // Get one TaskEvent
     * const taskEvent = await prisma.taskEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskEventFindFirstArgs>(args?: SelectSubset<T, TaskEventFindFirstArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventFindFirstOrThrowArgs} args - Arguments to find a TaskEvent
     * @example
     * // Get one TaskEvent
     * const taskEvent = await prisma.taskEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskEventFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TaskEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskEvents
     * const taskEvents = await prisma.taskEvent.findMany()
     * 
     * // Get first 10 TaskEvents
     * const taskEvents = await prisma.taskEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskEventWithIdOnly = await prisma.taskEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskEventFindManyArgs>(args?: SelectSubset<T, TaskEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TaskEvent.
     * @param {TaskEventCreateArgs} args - Arguments to create a TaskEvent.
     * @example
     * // Create one TaskEvent
     * const TaskEvent = await prisma.taskEvent.create({
     *   data: {
     *     // ... data to create a TaskEvent
     *   }
     * })
     * 
     */
    create<T extends TaskEventCreateArgs>(args: SelectSubset<T, TaskEventCreateArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TaskEvents.
     * @param {TaskEventCreateManyArgs} args - Arguments to create many TaskEvents.
     * @example
     * // Create many TaskEvents
     * const taskEvent = await prisma.taskEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskEventCreateManyArgs>(args?: SelectSubset<T, TaskEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskEvents and returns the data saved in the database.
     * @param {TaskEventCreateManyAndReturnArgs} args - Arguments to create many TaskEvents.
     * @example
     * // Create many TaskEvents
     * const taskEvent = await prisma.taskEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskEvents and only return the `id`
     * const taskEventWithIdOnly = await prisma.taskEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskEventCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TaskEvent.
     * @param {TaskEventDeleteArgs} args - Arguments to delete one TaskEvent.
     * @example
     * // Delete one TaskEvent
     * const TaskEvent = await prisma.taskEvent.delete({
     *   where: {
     *     // ... filter to delete one TaskEvent
     *   }
     * })
     * 
     */
    delete<T extends TaskEventDeleteArgs>(args: SelectSubset<T, TaskEventDeleteArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TaskEvent.
     * @param {TaskEventUpdateArgs} args - Arguments to update one TaskEvent.
     * @example
     * // Update one TaskEvent
     * const taskEvent = await prisma.taskEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskEventUpdateArgs>(args: SelectSubset<T, TaskEventUpdateArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TaskEvents.
     * @param {TaskEventDeleteManyArgs} args - Arguments to filter TaskEvents to delete.
     * @example
     * // Delete a few TaskEvents
     * const { count } = await prisma.taskEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskEventDeleteManyArgs>(args?: SelectSubset<T, TaskEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskEvents
     * const taskEvent = await prisma.taskEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskEventUpdateManyArgs>(args: SelectSubset<T, TaskEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskEvents and returns the data updated in the database.
     * @param {TaskEventUpdateManyAndReturnArgs} args - Arguments to update many TaskEvents.
     * @example
     * // Update many TaskEvents
     * const taskEvent = await prisma.taskEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TaskEvents and only return the `id`
     * const taskEventWithIdOnly = await prisma.taskEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskEventUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TaskEvent.
     * @param {TaskEventUpsertArgs} args - Arguments to update or create a TaskEvent.
     * @example
     * // Update or create a TaskEvent
     * const taskEvent = await prisma.taskEvent.upsert({
     *   create: {
     *     // ... data to create a TaskEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskEvent we want to update
     *   }
     * })
     */
    upsert<T extends TaskEventUpsertArgs>(args: SelectSubset<T, TaskEventUpsertArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TaskEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventCountArgs} args - Arguments to filter TaskEvents to count.
     * @example
     * // Count the number of TaskEvents
     * const count = await prisma.taskEvent.count({
     *   where: {
     *     // ... the filter for the TaskEvents we want to count
     *   }
     * })
    **/
    count<T extends TaskEventCountArgs>(
      args?: Subset<T, TaskEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskEventAggregateArgs>(args: Subset<T, TaskEventAggregateArgs>): Prisma.PrismaPromise<GetTaskEventAggregateType<T>>

    /**
     * Group by TaskEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskEventGroupByArgs['orderBy'] }
        : { orderBy?: TaskEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskEvent model
   */
  readonly fields: TaskEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends TaskDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskDefaultArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskEvent model
   */
  interface TaskEventFieldRefs {
    readonly id: FieldRef<"TaskEvent", 'Int'>
    readonly taskId: FieldRef<"TaskEvent", 'String'>
    readonly type: FieldRef<"TaskEvent", 'String'>
    readonly data: FieldRef<"TaskEvent", 'Json'>
    readonly createdAt: FieldRef<"TaskEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaskEvent findUnique
   */
  export type TaskEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvent to fetch.
     */
    where: TaskEventWhereUniqueInput
  }

  /**
   * TaskEvent findUniqueOrThrow
   */
  export type TaskEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvent to fetch.
     */
    where: TaskEventWhereUniqueInput
  }

  /**
   * TaskEvent findFirst
   */
  export type TaskEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvent to fetch.
     */
    where?: TaskEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEvents to fetch.
     */
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskEvents.
     */
    cursor?: TaskEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskEvents.
     */
    distinct?: TaskEventScalarFieldEnum | TaskEventScalarFieldEnum[]
  }

  /**
   * TaskEvent findFirstOrThrow
   */
  export type TaskEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvent to fetch.
     */
    where?: TaskEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEvents to fetch.
     */
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskEvents.
     */
    cursor?: TaskEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskEvents.
     */
    distinct?: TaskEventScalarFieldEnum | TaskEventScalarFieldEnum[]
  }

  /**
   * TaskEvent findMany
   */
  export type TaskEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvents to fetch.
     */
    where?: TaskEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEvents to fetch.
     */
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskEvents.
     */
    cursor?: TaskEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEvents.
     */
    skip?: number
    distinct?: TaskEventScalarFieldEnum | TaskEventScalarFieldEnum[]
  }

  /**
   * TaskEvent create
   */
  export type TaskEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskEvent.
     */
    data: XOR<TaskEventCreateInput, TaskEventUncheckedCreateInput>
  }

  /**
   * TaskEvent createMany
   */
  export type TaskEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskEvents.
     */
    data: TaskEventCreateManyInput | TaskEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskEvent createManyAndReturn
   */
  export type TaskEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * The data used to create many TaskEvents.
     */
    data: TaskEventCreateManyInput | TaskEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskEvent update
   */
  export type TaskEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskEvent.
     */
    data: XOR<TaskEventUpdateInput, TaskEventUncheckedUpdateInput>
    /**
     * Choose, which TaskEvent to update.
     */
    where: TaskEventWhereUniqueInput
  }

  /**
   * TaskEvent updateMany
   */
  export type TaskEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskEvents.
     */
    data: XOR<TaskEventUpdateManyMutationInput, TaskEventUncheckedUpdateManyInput>
    /**
     * Filter which TaskEvents to update
     */
    where?: TaskEventWhereInput
    /**
     * Limit how many TaskEvents to update.
     */
    limit?: number
  }

  /**
   * TaskEvent updateManyAndReturn
   */
  export type TaskEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * The data used to update TaskEvents.
     */
    data: XOR<TaskEventUpdateManyMutationInput, TaskEventUncheckedUpdateManyInput>
    /**
     * Filter which TaskEvents to update
     */
    where?: TaskEventWhereInput
    /**
     * Limit how many TaskEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskEvent upsert
   */
  export type TaskEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskEvent to update in case it exists.
     */
    where: TaskEventWhereUniqueInput
    /**
     * In case the TaskEvent found by the `where` argument doesn't exist, create a new TaskEvent with this data.
     */
    create: XOR<TaskEventCreateInput, TaskEventUncheckedCreateInput>
    /**
     * In case the TaskEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskEventUpdateInput, TaskEventUncheckedUpdateInput>
  }

  /**
   * TaskEvent delete
   */
  export type TaskEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter which TaskEvent to delete.
     */
    where: TaskEventWhereUniqueInput
  }

  /**
   * TaskEvent deleteMany
   */
  export type TaskEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskEvents to delete
     */
    where?: TaskEventWhereInput
    /**
     * Limit how many TaskEvents to delete.
     */
    limit?: number
  }

  /**
   * TaskEvent without action
   */
  export type TaskEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskEvent
     */
    omit?: TaskEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
  }


  /**
   * Model Api
   */

  export type AggregateApi = {
    _count: ApiCountAggregateOutputType | null
    _avg: ApiAvgAggregateOutputType | null
    _sum: ApiSumAggregateOutputType | null
    _min: ApiMinAggregateOutputType | null
    _max: ApiMaxAggregateOutputType | null
  }

  export type ApiAvgAggregateOutputType = {
    productionVersion: number | null
  }

  export type ApiSumAggregateOutputType = {
    productionVersion: number | null
  }

  export type ApiMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    enabled: boolean | null
    productionVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ApiMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    enabled: boolean | null
    productionVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ApiCountAggregateOutputType = {
    id: number
    name: number
    description: number
    enabled: number
    productionVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ApiAvgAggregateInputType = {
    productionVersion?: true
  }

  export type ApiSumAggregateInputType = {
    productionVersion?: true
  }

  export type ApiMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    enabled?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ApiMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    enabled?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ApiCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    enabled?: true
    productionVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ApiAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Api to aggregate.
     */
    where?: ApiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Apis to fetch.
     */
    orderBy?: ApiOrderByWithRelationInput | ApiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Apis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Apis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Apis
    **/
    _count?: true | ApiCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApiAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApiSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiMaxAggregateInputType
  }

  export type GetApiAggregateType<T extends ApiAggregateArgs> = {
        [P in keyof T & keyof AggregateApi]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApi[P]>
      : GetScalarType<T[P], AggregateApi[P]>
  }




  export type ApiGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiWhereInput
    orderBy?: ApiOrderByWithAggregationInput | ApiOrderByWithAggregationInput[]
    by: ApiScalarFieldEnum[] | ApiScalarFieldEnum
    having?: ApiScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiCountAggregateInputType | true
    _avg?: ApiAvgAggregateInputType
    _sum?: ApiSumAggregateInputType
    _min?: ApiMinAggregateInputType
    _max?: ApiMaxAggregateInputType
  }

  export type ApiGroupByOutputType = {
    id: string
    name: string
    description: string
    enabled: boolean
    productionVersion: number
    createdAt: Date
    updatedAt: Date
    _count: ApiCountAggregateOutputType | null
    _avg: ApiAvgAggregateOutputType | null
    _sum: ApiSumAggregateOutputType | null
    _min: ApiMinAggregateOutputType | null
    _max: ApiMaxAggregateOutputType | null
  }

  type GetApiGroupByPayload<T extends ApiGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiGroupByOutputType[P]>
            : GetScalarType<T[P], ApiGroupByOutputType[P]>
        }
      >
    >


  export type ApiSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    enabled?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    versions?: boolean | Api$versionsArgs<ExtArgs>
    _count?: boolean | ApiCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["api"]>

  export type ApiSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    enabled?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["api"]>

  export type ApiSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    enabled?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["api"]>

  export type ApiSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    enabled?: boolean
    productionVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ApiOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "enabled" | "productionVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["api"]>
  export type ApiInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | Api$versionsArgs<ExtArgs>
    _count?: boolean | ApiCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ApiIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ApiIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ApiPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Api"
    objects: {
      versions: Prisma.$ApiVersionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      enabled: boolean
      productionVersion: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["api"]>
    composites: {}
  }

  type ApiGetPayload<S extends boolean | null | undefined | ApiDefaultArgs> = $Result.GetResult<Prisma.$ApiPayload, S>

  type ApiCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiCountAggregateInputType | true
    }

  export interface ApiDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Api'], meta: { name: 'Api' } }
    /**
     * Find zero or one Api that matches the filter.
     * @param {ApiFindUniqueArgs} args - Arguments to find a Api
     * @example
     * // Get one Api
     * const api = await prisma.api.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiFindUniqueArgs>(args: SelectSubset<T, ApiFindUniqueArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Api that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiFindUniqueOrThrowArgs} args - Arguments to find a Api
     * @example
     * // Get one Api
     * const api = await prisma.api.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Api that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiFindFirstArgs} args - Arguments to find a Api
     * @example
     * // Get one Api
     * const api = await prisma.api.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiFindFirstArgs>(args?: SelectSubset<T, ApiFindFirstArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Api that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiFindFirstOrThrowArgs} args - Arguments to find a Api
     * @example
     * // Get one Api
     * const api = await prisma.api.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Apis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Apis
     * const apis = await prisma.api.findMany()
     * 
     * // Get first 10 Apis
     * const apis = await prisma.api.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiWithIdOnly = await prisma.api.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiFindManyArgs>(args?: SelectSubset<T, ApiFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Api.
     * @param {ApiCreateArgs} args - Arguments to create a Api.
     * @example
     * // Create one Api
     * const Api = await prisma.api.create({
     *   data: {
     *     // ... data to create a Api
     *   }
     * })
     * 
     */
    create<T extends ApiCreateArgs>(args: SelectSubset<T, ApiCreateArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Apis.
     * @param {ApiCreateManyArgs} args - Arguments to create many Apis.
     * @example
     * // Create many Apis
     * const api = await prisma.api.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiCreateManyArgs>(args?: SelectSubset<T, ApiCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Apis and returns the data saved in the database.
     * @param {ApiCreateManyAndReturnArgs} args - Arguments to create many Apis.
     * @example
     * // Create many Apis
     * const api = await prisma.api.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Apis and only return the `id`
     * const apiWithIdOnly = await prisma.api.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Api.
     * @param {ApiDeleteArgs} args - Arguments to delete one Api.
     * @example
     * // Delete one Api
     * const Api = await prisma.api.delete({
     *   where: {
     *     // ... filter to delete one Api
     *   }
     * })
     * 
     */
    delete<T extends ApiDeleteArgs>(args: SelectSubset<T, ApiDeleteArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Api.
     * @param {ApiUpdateArgs} args - Arguments to update one Api.
     * @example
     * // Update one Api
     * const api = await prisma.api.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiUpdateArgs>(args: SelectSubset<T, ApiUpdateArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Apis.
     * @param {ApiDeleteManyArgs} args - Arguments to filter Apis to delete.
     * @example
     * // Delete a few Apis
     * const { count } = await prisma.api.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiDeleteManyArgs>(args?: SelectSubset<T, ApiDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Apis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Apis
     * const api = await prisma.api.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiUpdateManyArgs>(args: SelectSubset<T, ApiUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Apis and returns the data updated in the database.
     * @param {ApiUpdateManyAndReturnArgs} args - Arguments to update many Apis.
     * @example
     * // Update many Apis
     * const api = await prisma.api.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Apis and only return the `id`
     * const apiWithIdOnly = await prisma.api.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Api.
     * @param {ApiUpsertArgs} args - Arguments to update or create a Api.
     * @example
     * // Update or create a Api
     * const api = await prisma.api.upsert({
     *   create: {
     *     // ... data to create a Api
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Api we want to update
     *   }
     * })
     */
    upsert<T extends ApiUpsertArgs>(args: SelectSubset<T, ApiUpsertArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Apis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiCountArgs} args - Arguments to filter Apis to count.
     * @example
     * // Count the number of Apis
     * const count = await prisma.api.count({
     *   where: {
     *     // ... the filter for the Apis we want to count
     *   }
     * })
    **/
    count<T extends ApiCountArgs>(
      args?: Subset<T, ApiCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Api.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiAggregateArgs>(args: Subset<T, ApiAggregateArgs>): Prisma.PrismaPromise<GetApiAggregateType<T>>

    /**
     * Group by Api.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiGroupByArgs['orderBy'] }
        : { orderBy?: ApiGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Api model
   */
  readonly fields: ApiFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Api.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    versions<T extends Api$versionsArgs<ExtArgs> = {}>(args?: Subset<T, Api$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Api model
   */
  interface ApiFieldRefs {
    readonly id: FieldRef<"Api", 'String'>
    readonly name: FieldRef<"Api", 'String'>
    readonly description: FieldRef<"Api", 'String'>
    readonly enabled: FieldRef<"Api", 'Boolean'>
    readonly productionVersion: FieldRef<"Api", 'Int'>
    readonly createdAt: FieldRef<"Api", 'DateTime'>
    readonly updatedAt: FieldRef<"Api", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Api findUnique
   */
  export type ApiFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * Filter, which Api to fetch.
     */
    where: ApiWhereUniqueInput
  }

  /**
   * Api findUniqueOrThrow
   */
  export type ApiFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * Filter, which Api to fetch.
     */
    where: ApiWhereUniqueInput
  }

  /**
   * Api findFirst
   */
  export type ApiFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * Filter, which Api to fetch.
     */
    where?: ApiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Apis to fetch.
     */
    orderBy?: ApiOrderByWithRelationInput | ApiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Apis.
     */
    cursor?: ApiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Apis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Apis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Apis.
     */
    distinct?: ApiScalarFieldEnum | ApiScalarFieldEnum[]
  }

  /**
   * Api findFirstOrThrow
   */
  export type ApiFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * Filter, which Api to fetch.
     */
    where?: ApiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Apis to fetch.
     */
    orderBy?: ApiOrderByWithRelationInput | ApiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Apis.
     */
    cursor?: ApiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Apis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Apis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Apis.
     */
    distinct?: ApiScalarFieldEnum | ApiScalarFieldEnum[]
  }

  /**
   * Api findMany
   */
  export type ApiFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * Filter, which Apis to fetch.
     */
    where?: ApiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Apis to fetch.
     */
    orderBy?: ApiOrderByWithRelationInput | ApiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Apis.
     */
    cursor?: ApiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Apis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Apis.
     */
    skip?: number
    distinct?: ApiScalarFieldEnum | ApiScalarFieldEnum[]
  }

  /**
   * Api create
   */
  export type ApiCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * The data needed to create a Api.
     */
    data: XOR<ApiCreateInput, ApiUncheckedCreateInput>
  }

  /**
   * Api createMany
   */
  export type ApiCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Apis.
     */
    data: ApiCreateManyInput | ApiCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Api createManyAndReturn
   */
  export type ApiCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * The data used to create many Apis.
     */
    data: ApiCreateManyInput | ApiCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Api update
   */
  export type ApiUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * The data needed to update a Api.
     */
    data: XOR<ApiUpdateInput, ApiUncheckedUpdateInput>
    /**
     * Choose, which Api to update.
     */
    where: ApiWhereUniqueInput
  }

  /**
   * Api updateMany
   */
  export type ApiUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Apis.
     */
    data: XOR<ApiUpdateManyMutationInput, ApiUncheckedUpdateManyInput>
    /**
     * Filter which Apis to update
     */
    where?: ApiWhereInput
    /**
     * Limit how many Apis to update.
     */
    limit?: number
  }

  /**
   * Api updateManyAndReturn
   */
  export type ApiUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * The data used to update Apis.
     */
    data: XOR<ApiUpdateManyMutationInput, ApiUncheckedUpdateManyInput>
    /**
     * Filter which Apis to update
     */
    where?: ApiWhereInput
    /**
     * Limit how many Apis to update.
     */
    limit?: number
  }

  /**
   * Api upsert
   */
  export type ApiUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * The filter to search for the Api to update in case it exists.
     */
    where: ApiWhereUniqueInput
    /**
     * In case the Api found by the `where` argument doesn't exist, create a new Api with this data.
     */
    create: XOR<ApiCreateInput, ApiUncheckedCreateInput>
    /**
     * In case the Api was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiUpdateInput, ApiUncheckedUpdateInput>
  }

  /**
   * Api delete
   */
  export type ApiDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
    /**
     * Filter which Api to delete.
     */
    where: ApiWhereUniqueInput
  }

  /**
   * Api deleteMany
   */
  export type ApiDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Apis to delete
     */
    where?: ApiWhereInput
    /**
     * Limit how many Apis to delete.
     */
    limit?: number
  }

  /**
   * Api.versions
   */
  export type Api$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    where?: ApiVersionWhereInput
    orderBy?: ApiVersionOrderByWithRelationInput | ApiVersionOrderByWithRelationInput[]
    cursor?: ApiVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApiVersionScalarFieldEnum | ApiVersionScalarFieldEnum[]
  }

  /**
   * Api without action
   */
  export type ApiDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api
     */
    select?: ApiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Api
     */
    omit?: ApiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiInclude<ExtArgs> | null
  }


  /**
   * Model ApiVersion
   */

  export type AggregateApiVersion = {
    _count: ApiVersionCountAggregateOutputType | null
    _avg: ApiVersionAvgAggregateOutputType | null
    _sum: ApiVersionSumAggregateOutputType | null
    _min: ApiVersionMinAggregateOutputType | null
    _max: ApiVersionMaxAggregateOutputType | null
  }

  export type ApiVersionAvgAggregateOutputType = {
    version: number | null
  }

  export type ApiVersionSumAggregateOutputType = {
    version: number | null
  }

  export type ApiVersionMinAggregateOutputType = {
    id: string | null
    apiId: string | null
    version: number | null
    description: string | null
    createdAt: Date | null
  }

  export type ApiVersionMaxAggregateOutputType = {
    id: string | null
    apiId: string | null
    version: number | null
    description: string | null
    createdAt: Date | null
  }

  export type ApiVersionCountAggregateOutputType = {
    id: number
    apiId: number
    version: number
    description: number
    schema: number
    operations: number
    createdAt: number
    _all: number
  }


  export type ApiVersionAvgAggregateInputType = {
    version?: true
  }

  export type ApiVersionSumAggregateInputType = {
    version?: true
  }

  export type ApiVersionMinAggregateInputType = {
    id?: true
    apiId?: true
    version?: true
    description?: true
    createdAt?: true
  }

  export type ApiVersionMaxAggregateInputType = {
    id?: true
    apiId?: true
    version?: true
    description?: true
    createdAt?: true
  }

  export type ApiVersionCountAggregateInputType = {
    id?: true
    apiId?: true
    version?: true
    description?: true
    schema?: true
    operations?: true
    createdAt?: true
    _all?: true
  }

  export type ApiVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiVersion to aggregate.
     */
    where?: ApiVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiVersions to fetch.
     */
    orderBy?: ApiVersionOrderByWithRelationInput | ApiVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiVersions
    **/
    _count?: true | ApiVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApiVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApiVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiVersionMaxAggregateInputType
  }

  export type GetApiVersionAggregateType<T extends ApiVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateApiVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiVersion[P]>
      : GetScalarType<T[P], AggregateApiVersion[P]>
  }




  export type ApiVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiVersionWhereInput
    orderBy?: ApiVersionOrderByWithAggregationInput | ApiVersionOrderByWithAggregationInput[]
    by: ApiVersionScalarFieldEnum[] | ApiVersionScalarFieldEnum
    having?: ApiVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiVersionCountAggregateInputType | true
    _avg?: ApiVersionAvgAggregateInputType
    _sum?: ApiVersionSumAggregateInputType
    _min?: ApiVersionMinAggregateInputType
    _max?: ApiVersionMaxAggregateInputType
  }

  export type ApiVersionGroupByOutputType = {
    id: string
    apiId: string
    version: number
    description: string | null
    schema: JsonValue
    operations: JsonValue
    createdAt: Date
    _count: ApiVersionCountAggregateOutputType | null
    _avg: ApiVersionAvgAggregateOutputType | null
    _sum: ApiVersionSumAggregateOutputType | null
    _min: ApiVersionMinAggregateOutputType | null
    _max: ApiVersionMaxAggregateOutputType | null
  }

  type GetApiVersionGroupByPayload<T extends ApiVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiVersionGroupByOutputType[P]>
            : GetScalarType<T[P], ApiVersionGroupByOutputType[P]>
        }
      >
    >


  export type ApiVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiId?: boolean
    version?: boolean
    description?: boolean
    schema?: boolean
    operations?: boolean
    createdAt?: boolean
    api?: boolean | ApiDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiVersion"]>

  export type ApiVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiId?: boolean
    version?: boolean
    description?: boolean
    schema?: boolean
    operations?: boolean
    createdAt?: boolean
    api?: boolean | ApiDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiVersion"]>

  export type ApiVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    apiId?: boolean
    version?: boolean
    description?: boolean
    schema?: boolean
    operations?: boolean
    createdAt?: boolean
    api?: boolean | ApiDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["apiVersion"]>

  export type ApiVersionSelectScalar = {
    id?: boolean
    apiId?: boolean
    version?: boolean
    description?: boolean
    schema?: boolean
    operations?: boolean
    createdAt?: boolean
  }

  export type ApiVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "apiId" | "version" | "description" | "schema" | "operations" | "createdAt", ExtArgs["result"]["apiVersion"]>
  export type ApiVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    api?: boolean | ApiDefaultArgs<ExtArgs>
  }
  export type ApiVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    api?: boolean | ApiDefaultArgs<ExtArgs>
  }
  export type ApiVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    api?: boolean | ApiDefaultArgs<ExtArgs>
  }

  export type $ApiVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiVersion"
    objects: {
      api: Prisma.$ApiPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      apiId: string
      version: number
      description: string | null
      /**
       * 数据模型定义（表、字段、类型）
       */
      schema: Prisma.JsonValue
      /**
       * 操作定义数组（声明式 SQL + 参数定义）
       */
      operations: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["apiVersion"]>
    composites: {}
  }

  type ApiVersionGetPayload<S extends boolean | null | undefined | ApiVersionDefaultArgs> = $Result.GetResult<Prisma.$ApiVersionPayload, S>

  type ApiVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiVersionCountAggregateInputType | true
    }

  export interface ApiVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiVersion'], meta: { name: 'ApiVersion' } }
    /**
     * Find zero or one ApiVersion that matches the filter.
     * @param {ApiVersionFindUniqueArgs} args - Arguments to find a ApiVersion
     * @example
     * // Get one ApiVersion
     * const apiVersion = await prisma.apiVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiVersionFindUniqueArgs>(args: SelectSubset<T, ApiVersionFindUniqueArgs<ExtArgs>>): Prisma__ApiVersionClient<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiVersionFindUniqueOrThrowArgs} args - Arguments to find a ApiVersion
     * @example
     * // Get one ApiVersion
     * const apiVersion = await prisma.apiVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiVersionClient<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiVersionFindFirstArgs} args - Arguments to find a ApiVersion
     * @example
     * // Get one ApiVersion
     * const apiVersion = await prisma.apiVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiVersionFindFirstArgs>(args?: SelectSubset<T, ApiVersionFindFirstArgs<ExtArgs>>): Prisma__ApiVersionClient<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiVersionFindFirstOrThrowArgs} args - Arguments to find a ApiVersion
     * @example
     * // Get one ApiVersion
     * const apiVersion = await prisma.apiVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiVersionClient<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiVersions
     * const apiVersions = await prisma.apiVersion.findMany()
     * 
     * // Get first 10 ApiVersions
     * const apiVersions = await prisma.apiVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiVersionWithIdOnly = await prisma.apiVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiVersionFindManyArgs>(args?: SelectSubset<T, ApiVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiVersion.
     * @param {ApiVersionCreateArgs} args - Arguments to create a ApiVersion.
     * @example
     * // Create one ApiVersion
     * const ApiVersion = await prisma.apiVersion.create({
     *   data: {
     *     // ... data to create a ApiVersion
     *   }
     * })
     * 
     */
    create<T extends ApiVersionCreateArgs>(args: SelectSubset<T, ApiVersionCreateArgs<ExtArgs>>): Prisma__ApiVersionClient<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiVersions.
     * @param {ApiVersionCreateManyArgs} args - Arguments to create many ApiVersions.
     * @example
     * // Create many ApiVersions
     * const apiVersion = await prisma.apiVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiVersionCreateManyArgs>(args?: SelectSubset<T, ApiVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiVersions and returns the data saved in the database.
     * @param {ApiVersionCreateManyAndReturnArgs} args - Arguments to create many ApiVersions.
     * @example
     * // Create many ApiVersions
     * const apiVersion = await prisma.apiVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiVersions and only return the `id`
     * const apiVersionWithIdOnly = await prisma.apiVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiVersion.
     * @param {ApiVersionDeleteArgs} args - Arguments to delete one ApiVersion.
     * @example
     * // Delete one ApiVersion
     * const ApiVersion = await prisma.apiVersion.delete({
     *   where: {
     *     // ... filter to delete one ApiVersion
     *   }
     * })
     * 
     */
    delete<T extends ApiVersionDeleteArgs>(args: SelectSubset<T, ApiVersionDeleteArgs<ExtArgs>>): Prisma__ApiVersionClient<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiVersion.
     * @param {ApiVersionUpdateArgs} args - Arguments to update one ApiVersion.
     * @example
     * // Update one ApiVersion
     * const apiVersion = await prisma.apiVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiVersionUpdateArgs>(args: SelectSubset<T, ApiVersionUpdateArgs<ExtArgs>>): Prisma__ApiVersionClient<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiVersions.
     * @param {ApiVersionDeleteManyArgs} args - Arguments to filter ApiVersions to delete.
     * @example
     * // Delete a few ApiVersions
     * const { count } = await prisma.apiVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiVersionDeleteManyArgs>(args?: SelectSubset<T, ApiVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiVersions
     * const apiVersion = await prisma.apiVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiVersionUpdateManyArgs>(args: SelectSubset<T, ApiVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiVersions and returns the data updated in the database.
     * @param {ApiVersionUpdateManyAndReturnArgs} args - Arguments to update many ApiVersions.
     * @example
     * // Update many ApiVersions
     * const apiVersion = await prisma.apiVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiVersions and only return the `id`
     * const apiVersionWithIdOnly = await prisma.apiVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiVersion.
     * @param {ApiVersionUpsertArgs} args - Arguments to update or create a ApiVersion.
     * @example
     * // Update or create a ApiVersion
     * const apiVersion = await prisma.apiVersion.upsert({
     *   create: {
     *     // ... data to create a ApiVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiVersion we want to update
     *   }
     * })
     */
    upsert<T extends ApiVersionUpsertArgs>(args: SelectSubset<T, ApiVersionUpsertArgs<ExtArgs>>): Prisma__ApiVersionClient<$Result.GetResult<Prisma.$ApiVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiVersionCountArgs} args - Arguments to filter ApiVersions to count.
     * @example
     * // Count the number of ApiVersions
     * const count = await prisma.apiVersion.count({
     *   where: {
     *     // ... the filter for the ApiVersions we want to count
     *   }
     * })
    **/
    count<T extends ApiVersionCountArgs>(
      args?: Subset<T, ApiVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiVersionAggregateArgs>(args: Subset<T, ApiVersionAggregateArgs>): Prisma.PrismaPromise<GetApiVersionAggregateType<T>>

    /**
     * Group by ApiVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiVersionGroupByArgs['orderBy'] }
        : { orderBy?: ApiVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiVersion model
   */
  readonly fields: ApiVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    api<T extends ApiDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ApiDefaultArgs<ExtArgs>>): Prisma__ApiClient<$Result.GetResult<Prisma.$ApiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiVersion model
   */
  interface ApiVersionFieldRefs {
    readonly id: FieldRef<"ApiVersion", 'String'>
    readonly apiId: FieldRef<"ApiVersion", 'String'>
    readonly version: FieldRef<"ApiVersion", 'Int'>
    readonly description: FieldRef<"ApiVersion", 'String'>
    readonly schema: FieldRef<"ApiVersion", 'Json'>
    readonly operations: FieldRef<"ApiVersion", 'Json'>
    readonly createdAt: FieldRef<"ApiVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApiVersion findUnique
   */
  export type ApiVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * Filter, which ApiVersion to fetch.
     */
    where: ApiVersionWhereUniqueInput
  }

  /**
   * ApiVersion findUniqueOrThrow
   */
  export type ApiVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * Filter, which ApiVersion to fetch.
     */
    where: ApiVersionWhereUniqueInput
  }

  /**
   * ApiVersion findFirst
   */
  export type ApiVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * Filter, which ApiVersion to fetch.
     */
    where?: ApiVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiVersions to fetch.
     */
    orderBy?: ApiVersionOrderByWithRelationInput | ApiVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiVersions.
     */
    cursor?: ApiVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiVersions.
     */
    distinct?: ApiVersionScalarFieldEnum | ApiVersionScalarFieldEnum[]
  }

  /**
   * ApiVersion findFirstOrThrow
   */
  export type ApiVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * Filter, which ApiVersion to fetch.
     */
    where?: ApiVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiVersions to fetch.
     */
    orderBy?: ApiVersionOrderByWithRelationInput | ApiVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiVersions.
     */
    cursor?: ApiVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiVersions.
     */
    distinct?: ApiVersionScalarFieldEnum | ApiVersionScalarFieldEnum[]
  }

  /**
   * ApiVersion findMany
   */
  export type ApiVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * Filter, which ApiVersions to fetch.
     */
    where?: ApiVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiVersions to fetch.
     */
    orderBy?: ApiVersionOrderByWithRelationInput | ApiVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiVersions.
     */
    cursor?: ApiVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiVersions.
     */
    skip?: number
    distinct?: ApiVersionScalarFieldEnum | ApiVersionScalarFieldEnum[]
  }

  /**
   * ApiVersion create
   */
  export type ApiVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a ApiVersion.
     */
    data: XOR<ApiVersionCreateInput, ApiVersionUncheckedCreateInput>
  }

  /**
   * ApiVersion createMany
   */
  export type ApiVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiVersions.
     */
    data: ApiVersionCreateManyInput | ApiVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiVersion createManyAndReturn
   */
  export type ApiVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * The data used to create many ApiVersions.
     */
    data: ApiVersionCreateManyInput | ApiVersionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiVersion update
   */
  export type ApiVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a ApiVersion.
     */
    data: XOR<ApiVersionUpdateInput, ApiVersionUncheckedUpdateInput>
    /**
     * Choose, which ApiVersion to update.
     */
    where: ApiVersionWhereUniqueInput
  }

  /**
   * ApiVersion updateMany
   */
  export type ApiVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiVersions.
     */
    data: XOR<ApiVersionUpdateManyMutationInput, ApiVersionUncheckedUpdateManyInput>
    /**
     * Filter which ApiVersions to update
     */
    where?: ApiVersionWhereInput
    /**
     * Limit how many ApiVersions to update.
     */
    limit?: number
  }

  /**
   * ApiVersion updateManyAndReturn
   */
  export type ApiVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * The data used to update ApiVersions.
     */
    data: XOR<ApiVersionUpdateManyMutationInput, ApiVersionUncheckedUpdateManyInput>
    /**
     * Filter which ApiVersions to update
     */
    where?: ApiVersionWhereInput
    /**
     * Limit how many ApiVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ApiVersion upsert
   */
  export type ApiVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the ApiVersion to update in case it exists.
     */
    where: ApiVersionWhereUniqueInput
    /**
     * In case the ApiVersion found by the `where` argument doesn't exist, create a new ApiVersion with this data.
     */
    create: XOR<ApiVersionCreateInput, ApiVersionUncheckedCreateInput>
    /**
     * In case the ApiVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiVersionUpdateInput, ApiVersionUncheckedUpdateInput>
  }

  /**
   * ApiVersion delete
   */
  export type ApiVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
    /**
     * Filter which ApiVersion to delete.
     */
    where: ApiVersionWhereUniqueInput
  }

  /**
   * ApiVersion deleteMany
   */
  export type ApiVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiVersions to delete
     */
    where?: ApiVersionWhereInput
    /**
     * Limit how many ApiVersions to delete.
     */
    limit?: number
  }

  /**
   * ApiVersion without action
   */
  export type ApiVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiVersion
     */
    select?: ApiVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiVersion
     */
    omit?: ApiVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApiVersionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SkillScalarFieldEnum: {
    id: 'id',
    name: 'name',
    tags: 'tags',
    productionVersion: 'productionVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SkillScalarFieldEnum = (typeof SkillScalarFieldEnum)[keyof typeof SkillScalarFieldEnum]


  export const SkillVersionScalarFieldEnum: {
    id: 'id',
    skillId: 'skillId',
    version: 'version',
    description: 'description',
    content: 'content',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type SkillVersionScalarFieldEnum = (typeof SkillVersionScalarFieldEnum)[keyof typeof SkillVersionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ChatSessionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChatSessionScalarFieldEnum = (typeof ChatSessionScalarFieldEnum)[keyof typeof ChatSessionScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    role: 'role',
    content: 'content',
    images: 'images',
    toolCalls: 'toolCalls',
    toolCallId: 'toolCallId',
    hidden: 'hidden',
    createdAt: 'createdAt'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const KeyResourceScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    key: 'key',
    mediaType: 'mediaType',
    currentVersion: 'currentVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KeyResourceScalarFieldEnum = (typeof KeyResourceScalarFieldEnum)[keyof typeof KeyResourceScalarFieldEnum]


  export const KeyResourceVersionScalarFieldEnum: {
    id: 'id',
    keyResourceId: 'keyResourceId',
    version: 'version',
    title: 'title',
    url: 'url',
    data: 'data',
    prompt: 'prompt',
    refUrls: 'refUrls',
    createdAt: 'createdAt'
  };

  export type KeyResourceVersionScalarFieldEnum = (typeof KeyResourceVersionScalarFieldEnum)[keyof typeof KeyResourceVersionScalarFieldEnum]


  export const ImageGenerationScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    key: 'key',
    currentVersion: 'currentVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ImageGenerationScalarFieldEnum = (typeof ImageGenerationScalarFieldEnum)[keyof typeof ImageGenerationScalarFieldEnum]


  export const ImageGenerationVersionScalarFieldEnum: {
    id: 'id',
    imageGenId: 'imageGenId',
    version: 'version',
    prompt: 'prompt',
    imageUrl: 'imageUrl',
    refUrls: 'refUrls',
    createdAt: 'createdAt'
  };

  export type ImageGenerationVersionScalarFieldEnum = (typeof ImageGenerationVersionScalarFieldEnum)[keyof typeof ImageGenerationVersionScalarFieldEnum]


  export const McpServerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    enabled: 'enabled',
    config: 'config',
    productionVersion: 'productionVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type McpServerScalarFieldEnum = (typeof McpServerScalarFieldEnum)[keyof typeof McpServerScalarFieldEnum]


  export const McpServerVersionScalarFieldEnum: {
    id: 'id',
    mcpServerId: 'mcpServerId',
    version: 'version',
    description: 'description',
    code: 'code',
    createdAt: 'createdAt'
  };

  export type McpServerVersionScalarFieldEnum = (typeof McpServerVersionScalarFieldEnum)[keyof typeof McpServerVersionScalarFieldEnum]


  export const BizTableMappingScalarFieldEnum: {
    id: 'id',
    userName: 'userName',
    logicalName: 'logicalName',
    physicalName: 'physicalName',
    createdAt: 'createdAt'
  };

  export type BizTableMappingScalarFieldEnum = (typeof BizTableMappingScalarFieldEnum)[keyof typeof BizTableMappingScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    status: 'status',
    input: 'input',
    reply: 'reply',
    error: 'error',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const TaskEventScalarFieldEnum: {
    id: 'id',
    taskId: 'taskId',
    type: 'type',
    data: 'data',
    createdAt: 'createdAt'
  };

  export type TaskEventScalarFieldEnum = (typeof TaskEventScalarFieldEnum)[keyof typeof TaskEventScalarFieldEnum]


  export const ApiScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    enabled: 'enabled',
    productionVersion: 'productionVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ApiScalarFieldEnum = (typeof ApiScalarFieldEnum)[keyof typeof ApiScalarFieldEnum]


  export const ApiVersionScalarFieldEnum: {
    id: 'id',
    apiId: 'apiId',
    version: 'version',
    description: 'description',
    schema: 'schema',
    operations: 'operations',
    createdAt: 'createdAt'
  };

  export type ApiVersionScalarFieldEnum = (typeof ApiVersionScalarFieldEnum)[keyof typeof ApiVersionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type SkillWhereInput = {
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    id?: StringFilter<"Skill"> | string
    name?: StringFilter<"Skill"> | string
    tags?: StringNullableListFilter<"Skill">
    productionVersion?: IntFilter<"Skill"> | number
    createdAt?: DateTimeFilter<"Skill"> | Date | string
    updatedAt?: DateTimeFilter<"Skill"> | Date | string
    versions?: SkillVersionListRelationFilter
  }

  export type SkillOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    tags?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    versions?: SkillVersionOrderByRelationAggregateInput
  }

  export type SkillWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    tags?: StringNullableListFilter<"Skill">
    productionVersion?: IntFilter<"Skill"> | number
    createdAt?: DateTimeFilter<"Skill"> | Date | string
    updatedAt?: DateTimeFilter<"Skill"> | Date | string
    versions?: SkillVersionListRelationFilter
  }, "id" | "name">

  export type SkillOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    tags?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SkillCountOrderByAggregateInput
    _avg?: SkillAvgOrderByAggregateInput
    _max?: SkillMaxOrderByAggregateInput
    _min?: SkillMinOrderByAggregateInput
    _sum?: SkillSumOrderByAggregateInput
  }

  export type SkillScalarWhereWithAggregatesInput = {
    AND?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    OR?: SkillScalarWhereWithAggregatesInput[]
    NOT?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Skill"> | string
    name?: StringWithAggregatesFilter<"Skill"> | string
    tags?: StringNullableListFilter<"Skill">
    productionVersion?: IntWithAggregatesFilter<"Skill"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Skill"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Skill"> | Date | string
  }

  export type SkillVersionWhereInput = {
    AND?: SkillVersionWhereInput | SkillVersionWhereInput[]
    OR?: SkillVersionWhereInput[]
    NOT?: SkillVersionWhereInput | SkillVersionWhereInput[]
    id?: StringFilter<"SkillVersion"> | string
    skillId?: StringFilter<"SkillVersion"> | string
    version?: IntFilter<"SkillVersion"> | number
    description?: StringFilter<"SkillVersion"> | string
    content?: StringFilter<"SkillVersion"> | string
    metadata?: JsonNullableFilter<"SkillVersion">
    createdAt?: DateTimeFilter<"SkillVersion"> | Date | string
    skill?: XOR<SkillScalarRelationFilter, SkillWhereInput>
  }

  export type SkillVersionOrderByWithRelationInput = {
    id?: SortOrder
    skillId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    skill?: SkillOrderByWithRelationInput
  }

  export type SkillVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    skillId_version?: SkillVersionSkillIdVersionCompoundUniqueInput
    AND?: SkillVersionWhereInput | SkillVersionWhereInput[]
    OR?: SkillVersionWhereInput[]
    NOT?: SkillVersionWhereInput | SkillVersionWhereInput[]
    skillId?: StringFilter<"SkillVersion"> | string
    version?: IntFilter<"SkillVersion"> | number
    description?: StringFilter<"SkillVersion"> | string
    content?: StringFilter<"SkillVersion"> | string
    metadata?: JsonNullableFilter<"SkillVersion">
    createdAt?: DateTimeFilter<"SkillVersion"> | Date | string
    skill?: XOR<SkillScalarRelationFilter, SkillWhereInput>
  }, "id" | "skillId_version">

  export type SkillVersionOrderByWithAggregationInput = {
    id?: SortOrder
    skillId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SkillVersionCountOrderByAggregateInput
    _avg?: SkillVersionAvgOrderByAggregateInput
    _max?: SkillVersionMaxOrderByAggregateInput
    _min?: SkillVersionMinOrderByAggregateInput
    _sum?: SkillVersionSumOrderByAggregateInput
  }

  export type SkillVersionScalarWhereWithAggregatesInput = {
    AND?: SkillVersionScalarWhereWithAggregatesInput | SkillVersionScalarWhereWithAggregatesInput[]
    OR?: SkillVersionScalarWhereWithAggregatesInput[]
    NOT?: SkillVersionScalarWhereWithAggregatesInput | SkillVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SkillVersion"> | string
    skillId?: StringWithAggregatesFilter<"SkillVersion"> | string
    version?: IntWithAggregatesFilter<"SkillVersion"> | number
    description?: StringWithAggregatesFilter<"SkillVersion"> | string
    content?: StringWithAggregatesFilter<"SkillVersion"> | string
    metadata?: JsonNullableWithAggregatesFilter<"SkillVersion">
    createdAt?: DateTimeWithAggregatesFilter<"SkillVersion"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    sessions?: ChatSessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    sessions?: ChatSessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    sessions?: ChatSessionListRelationFilter
  }, "id" | "name">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
  }

  export type ChatSessionWhereInput = {
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    title?: StringNullableFilter<"ChatSession"> | string | null
    userId?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: ChatMessageListRelationFilter
    keyResources?: KeyResourceListRelationFilter
    tasks?: TaskListRelationFilter
    imageGenerations?: ImageGenerationListRelationFilter
  }

  export type ChatSessionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    messages?: ChatMessageOrderByRelationAggregateInput
    keyResources?: KeyResourceOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    imageGenerations?: ImageGenerationOrderByRelationAggregateInput
  }

  export type ChatSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    title?: StringNullableFilter<"ChatSession"> | string | null
    userId?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: ChatMessageListRelationFilter
    keyResources?: KeyResourceListRelationFilter
    tasks?: TaskListRelationFilter
    imageGenerations?: ImageGenerationListRelationFilter
  }, "id">

  export type ChatSessionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChatSessionCountOrderByAggregateInput
    _max?: ChatSessionMaxOrderByAggregateInput
    _min?: ChatSessionMinOrderByAggregateInput
  }

  export type ChatSessionScalarWhereWithAggregatesInput = {
    AND?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    OR?: ChatSessionScalarWhereWithAggregatesInput[]
    NOT?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatSession"> | string
    title?: StringNullableWithAggregatesFilter<"ChatSession"> | string | null
    userId?: StringWithAggregatesFilter<"ChatSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringNullableFilter<"ChatMessage"> | string | null
    images?: StringNullableListFilter<"ChatMessage">
    toolCalls?: JsonNullableFilter<"ChatMessage">
    toolCallId?: StringNullableFilter<"ChatMessage"> | string | null
    hidden?: BoolFilter<"ChatMessage"> | boolean
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrderInput | SortOrder
    images?: SortOrder
    toolCalls?: SortOrderInput | SortOrder
    toolCallId?: SortOrderInput | SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
    session?: ChatSessionOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringNullableFilter<"ChatMessage"> | string | null
    images?: StringNullableListFilter<"ChatMessage">
    toolCalls?: JsonNullableFilter<"ChatMessage">
    toolCallId?: StringNullableFilter<"ChatMessage"> | string | null
    hidden?: BoolFilter<"ChatMessage"> | boolean
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrderInput | SortOrder
    images?: SortOrder
    toolCalls?: SortOrderInput | SortOrder
    toolCallId?: SortOrderInput | SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    sessionId?: StringWithAggregatesFilter<"ChatMessage"> | string
    role?: StringWithAggregatesFilter<"ChatMessage"> | string
    content?: StringNullableWithAggregatesFilter<"ChatMessage"> | string | null
    images?: StringNullableListFilter<"ChatMessage">
    toolCalls?: JsonNullableWithAggregatesFilter<"ChatMessage">
    toolCallId?: StringNullableWithAggregatesFilter<"ChatMessage"> | string | null
    hidden?: BoolWithAggregatesFilter<"ChatMessage"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type KeyResourceWhereInput = {
    AND?: KeyResourceWhereInput | KeyResourceWhereInput[]
    OR?: KeyResourceWhereInput[]
    NOT?: KeyResourceWhereInput | KeyResourceWhereInput[]
    id?: StringFilter<"KeyResource"> | string
    sessionId?: StringFilter<"KeyResource"> | string
    key?: StringFilter<"KeyResource"> | string
    mediaType?: StringFilter<"KeyResource"> | string
    currentVersion?: IntFilter<"KeyResource"> | number
    createdAt?: DateTimeFilter<"KeyResource"> | Date | string
    updatedAt?: DateTimeFilter<"KeyResource"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
    versions?: KeyResourceVersionListRelationFilter
  }

  export type KeyResourceOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    mediaType?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    session?: ChatSessionOrderByWithRelationInput
    versions?: KeyResourceVersionOrderByRelationAggregateInput
  }

  export type KeyResourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId_key?: KeyResourceSessionIdKeyCompoundUniqueInput
    AND?: KeyResourceWhereInput | KeyResourceWhereInput[]
    OR?: KeyResourceWhereInput[]
    NOT?: KeyResourceWhereInput | KeyResourceWhereInput[]
    sessionId?: StringFilter<"KeyResource"> | string
    key?: StringFilter<"KeyResource"> | string
    mediaType?: StringFilter<"KeyResource"> | string
    currentVersion?: IntFilter<"KeyResource"> | number
    createdAt?: DateTimeFilter<"KeyResource"> | Date | string
    updatedAt?: DateTimeFilter<"KeyResource"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
    versions?: KeyResourceVersionListRelationFilter
  }, "id" | "sessionId_key">

  export type KeyResourceOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    mediaType?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KeyResourceCountOrderByAggregateInput
    _avg?: KeyResourceAvgOrderByAggregateInput
    _max?: KeyResourceMaxOrderByAggregateInput
    _min?: KeyResourceMinOrderByAggregateInput
    _sum?: KeyResourceSumOrderByAggregateInput
  }

  export type KeyResourceScalarWhereWithAggregatesInput = {
    AND?: KeyResourceScalarWhereWithAggregatesInput | KeyResourceScalarWhereWithAggregatesInput[]
    OR?: KeyResourceScalarWhereWithAggregatesInput[]
    NOT?: KeyResourceScalarWhereWithAggregatesInput | KeyResourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KeyResource"> | string
    sessionId?: StringWithAggregatesFilter<"KeyResource"> | string
    key?: StringWithAggregatesFilter<"KeyResource"> | string
    mediaType?: StringWithAggregatesFilter<"KeyResource"> | string
    currentVersion?: IntWithAggregatesFilter<"KeyResource"> | number
    createdAt?: DateTimeWithAggregatesFilter<"KeyResource"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KeyResource"> | Date | string
  }

  export type KeyResourceVersionWhereInput = {
    AND?: KeyResourceVersionWhereInput | KeyResourceVersionWhereInput[]
    OR?: KeyResourceVersionWhereInput[]
    NOT?: KeyResourceVersionWhereInput | KeyResourceVersionWhereInput[]
    id?: StringFilter<"KeyResourceVersion"> | string
    keyResourceId?: StringFilter<"KeyResourceVersion"> | string
    version?: IntFilter<"KeyResourceVersion"> | number
    title?: StringNullableFilter<"KeyResourceVersion"> | string | null
    url?: StringNullableFilter<"KeyResourceVersion"> | string | null
    data?: JsonNullableFilter<"KeyResourceVersion">
    prompt?: StringNullableFilter<"KeyResourceVersion"> | string | null
    refUrls?: StringNullableListFilter<"KeyResourceVersion">
    createdAt?: DateTimeFilter<"KeyResourceVersion"> | Date | string
    keyResource?: XOR<KeyResourceScalarRelationFilter, KeyResourceWhereInput>
  }

  export type KeyResourceVersionOrderByWithRelationInput = {
    id?: SortOrder
    keyResourceId?: SortOrder
    version?: SortOrder
    title?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    data?: SortOrderInput | SortOrder
    prompt?: SortOrderInput | SortOrder
    refUrls?: SortOrder
    createdAt?: SortOrder
    keyResource?: KeyResourceOrderByWithRelationInput
  }

  export type KeyResourceVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    keyResourceId_version?: KeyResourceVersionKeyResourceIdVersionCompoundUniqueInput
    AND?: KeyResourceVersionWhereInput | KeyResourceVersionWhereInput[]
    OR?: KeyResourceVersionWhereInput[]
    NOT?: KeyResourceVersionWhereInput | KeyResourceVersionWhereInput[]
    keyResourceId?: StringFilter<"KeyResourceVersion"> | string
    version?: IntFilter<"KeyResourceVersion"> | number
    title?: StringNullableFilter<"KeyResourceVersion"> | string | null
    url?: StringNullableFilter<"KeyResourceVersion"> | string | null
    data?: JsonNullableFilter<"KeyResourceVersion">
    prompt?: StringNullableFilter<"KeyResourceVersion"> | string | null
    refUrls?: StringNullableListFilter<"KeyResourceVersion">
    createdAt?: DateTimeFilter<"KeyResourceVersion"> | Date | string
    keyResource?: XOR<KeyResourceScalarRelationFilter, KeyResourceWhereInput>
  }, "id" | "keyResourceId_version">

  export type KeyResourceVersionOrderByWithAggregationInput = {
    id?: SortOrder
    keyResourceId?: SortOrder
    version?: SortOrder
    title?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    data?: SortOrderInput | SortOrder
    prompt?: SortOrderInput | SortOrder
    refUrls?: SortOrder
    createdAt?: SortOrder
    _count?: KeyResourceVersionCountOrderByAggregateInput
    _avg?: KeyResourceVersionAvgOrderByAggregateInput
    _max?: KeyResourceVersionMaxOrderByAggregateInput
    _min?: KeyResourceVersionMinOrderByAggregateInput
    _sum?: KeyResourceVersionSumOrderByAggregateInput
  }

  export type KeyResourceVersionScalarWhereWithAggregatesInput = {
    AND?: KeyResourceVersionScalarWhereWithAggregatesInput | KeyResourceVersionScalarWhereWithAggregatesInput[]
    OR?: KeyResourceVersionScalarWhereWithAggregatesInput[]
    NOT?: KeyResourceVersionScalarWhereWithAggregatesInput | KeyResourceVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KeyResourceVersion"> | string
    keyResourceId?: StringWithAggregatesFilter<"KeyResourceVersion"> | string
    version?: IntWithAggregatesFilter<"KeyResourceVersion"> | number
    title?: StringNullableWithAggregatesFilter<"KeyResourceVersion"> | string | null
    url?: StringNullableWithAggregatesFilter<"KeyResourceVersion"> | string | null
    data?: JsonNullableWithAggregatesFilter<"KeyResourceVersion">
    prompt?: StringNullableWithAggregatesFilter<"KeyResourceVersion"> | string | null
    refUrls?: StringNullableListFilter<"KeyResourceVersion">
    createdAt?: DateTimeWithAggregatesFilter<"KeyResourceVersion"> | Date | string
  }

  export type ImageGenerationWhereInput = {
    AND?: ImageGenerationWhereInput | ImageGenerationWhereInput[]
    OR?: ImageGenerationWhereInput[]
    NOT?: ImageGenerationWhereInput | ImageGenerationWhereInput[]
    id?: StringFilter<"ImageGeneration"> | string
    sessionId?: StringFilter<"ImageGeneration"> | string
    key?: StringFilter<"ImageGeneration"> | string
    currentVersion?: IntFilter<"ImageGeneration"> | number
    createdAt?: DateTimeFilter<"ImageGeneration"> | Date | string
    updatedAt?: DateTimeFilter<"ImageGeneration"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
    versions?: ImageGenerationVersionListRelationFilter
  }

  export type ImageGenerationOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    session?: ChatSessionOrderByWithRelationInput
    versions?: ImageGenerationVersionOrderByRelationAggregateInput
  }

  export type ImageGenerationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId_key?: ImageGenerationSessionIdKeyCompoundUniqueInput
    AND?: ImageGenerationWhereInput | ImageGenerationWhereInput[]
    OR?: ImageGenerationWhereInput[]
    NOT?: ImageGenerationWhereInput | ImageGenerationWhereInput[]
    sessionId?: StringFilter<"ImageGeneration"> | string
    key?: StringFilter<"ImageGeneration"> | string
    currentVersion?: IntFilter<"ImageGeneration"> | number
    createdAt?: DateTimeFilter<"ImageGeneration"> | Date | string
    updatedAt?: DateTimeFilter<"ImageGeneration"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
    versions?: ImageGenerationVersionListRelationFilter
  }, "id" | "sessionId_key">

  export type ImageGenerationOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ImageGenerationCountOrderByAggregateInput
    _avg?: ImageGenerationAvgOrderByAggregateInput
    _max?: ImageGenerationMaxOrderByAggregateInput
    _min?: ImageGenerationMinOrderByAggregateInput
    _sum?: ImageGenerationSumOrderByAggregateInput
  }

  export type ImageGenerationScalarWhereWithAggregatesInput = {
    AND?: ImageGenerationScalarWhereWithAggregatesInput | ImageGenerationScalarWhereWithAggregatesInput[]
    OR?: ImageGenerationScalarWhereWithAggregatesInput[]
    NOT?: ImageGenerationScalarWhereWithAggregatesInput | ImageGenerationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImageGeneration"> | string
    sessionId?: StringWithAggregatesFilter<"ImageGeneration"> | string
    key?: StringWithAggregatesFilter<"ImageGeneration"> | string
    currentVersion?: IntWithAggregatesFilter<"ImageGeneration"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ImageGeneration"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ImageGeneration"> | Date | string
  }

  export type ImageGenerationVersionWhereInput = {
    AND?: ImageGenerationVersionWhereInput | ImageGenerationVersionWhereInput[]
    OR?: ImageGenerationVersionWhereInput[]
    NOT?: ImageGenerationVersionWhereInput | ImageGenerationVersionWhereInput[]
    id?: StringFilter<"ImageGenerationVersion"> | string
    imageGenId?: StringFilter<"ImageGenerationVersion"> | string
    version?: IntFilter<"ImageGenerationVersion"> | number
    prompt?: StringFilter<"ImageGenerationVersion"> | string
    imageUrl?: StringNullableFilter<"ImageGenerationVersion"> | string | null
    refUrls?: StringNullableListFilter<"ImageGenerationVersion">
    createdAt?: DateTimeFilter<"ImageGenerationVersion"> | Date | string
    imageGen?: XOR<ImageGenerationScalarRelationFilter, ImageGenerationWhereInput>
  }

  export type ImageGenerationVersionOrderByWithRelationInput = {
    id?: SortOrder
    imageGenId?: SortOrder
    version?: SortOrder
    prompt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    refUrls?: SortOrder
    createdAt?: SortOrder
    imageGen?: ImageGenerationOrderByWithRelationInput
  }

  export type ImageGenerationVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    imageGenId_version?: ImageGenerationVersionImageGenIdVersionCompoundUniqueInput
    AND?: ImageGenerationVersionWhereInput | ImageGenerationVersionWhereInput[]
    OR?: ImageGenerationVersionWhereInput[]
    NOT?: ImageGenerationVersionWhereInput | ImageGenerationVersionWhereInput[]
    imageGenId?: StringFilter<"ImageGenerationVersion"> | string
    version?: IntFilter<"ImageGenerationVersion"> | number
    prompt?: StringFilter<"ImageGenerationVersion"> | string
    imageUrl?: StringNullableFilter<"ImageGenerationVersion"> | string | null
    refUrls?: StringNullableListFilter<"ImageGenerationVersion">
    createdAt?: DateTimeFilter<"ImageGenerationVersion"> | Date | string
    imageGen?: XOR<ImageGenerationScalarRelationFilter, ImageGenerationWhereInput>
  }, "id" | "imageGenId_version">

  export type ImageGenerationVersionOrderByWithAggregationInput = {
    id?: SortOrder
    imageGenId?: SortOrder
    version?: SortOrder
    prompt?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    refUrls?: SortOrder
    createdAt?: SortOrder
    _count?: ImageGenerationVersionCountOrderByAggregateInput
    _avg?: ImageGenerationVersionAvgOrderByAggregateInput
    _max?: ImageGenerationVersionMaxOrderByAggregateInput
    _min?: ImageGenerationVersionMinOrderByAggregateInput
    _sum?: ImageGenerationVersionSumOrderByAggregateInput
  }

  export type ImageGenerationVersionScalarWhereWithAggregatesInput = {
    AND?: ImageGenerationVersionScalarWhereWithAggregatesInput | ImageGenerationVersionScalarWhereWithAggregatesInput[]
    OR?: ImageGenerationVersionScalarWhereWithAggregatesInput[]
    NOT?: ImageGenerationVersionScalarWhereWithAggregatesInput | ImageGenerationVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImageGenerationVersion"> | string
    imageGenId?: StringWithAggregatesFilter<"ImageGenerationVersion"> | string
    version?: IntWithAggregatesFilter<"ImageGenerationVersion"> | number
    prompt?: StringWithAggregatesFilter<"ImageGenerationVersion"> | string
    imageUrl?: StringNullableWithAggregatesFilter<"ImageGenerationVersion"> | string | null
    refUrls?: StringNullableListFilter<"ImageGenerationVersion">
    createdAt?: DateTimeWithAggregatesFilter<"ImageGenerationVersion"> | Date | string
  }

  export type McpServerWhereInput = {
    AND?: McpServerWhereInput | McpServerWhereInput[]
    OR?: McpServerWhereInput[]
    NOT?: McpServerWhereInput | McpServerWhereInput[]
    id?: StringFilter<"McpServer"> | string
    name?: StringFilter<"McpServer"> | string
    enabled?: BoolFilter<"McpServer"> | boolean
    config?: JsonNullableFilter<"McpServer">
    productionVersion?: IntFilter<"McpServer"> | number
    createdAt?: DateTimeFilter<"McpServer"> | Date | string
    updatedAt?: DateTimeFilter<"McpServer"> | Date | string
    versions?: McpServerVersionListRelationFilter
  }

  export type McpServerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    enabled?: SortOrder
    config?: SortOrderInput | SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    versions?: McpServerVersionOrderByRelationAggregateInput
  }

  export type McpServerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: McpServerWhereInput | McpServerWhereInput[]
    OR?: McpServerWhereInput[]
    NOT?: McpServerWhereInput | McpServerWhereInput[]
    enabled?: BoolFilter<"McpServer"> | boolean
    config?: JsonNullableFilter<"McpServer">
    productionVersion?: IntFilter<"McpServer"> | number
    createdAt?: DateTimeFilter<"McpServer"> | Date | string
    updatedAt?: DateTimeFilter<"McpServer"> | Date | string
    versions?: McpServerVersionListRelationFilter
  }, "id" | "name">

  export type McpServerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    enabled?: SortOrder
    config?: SortOrderInput | SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: McpServerCountOrderByAggregateInput
    _avg?: McpServerAvgOrderByAggregateInput
    _max?: McpServerMaxOrderByAggregateInput
    _min?: McpServerMinOrderByAggregateInput
    _sum?: McpServerSumOrderByAggregateInput
  }

  export type McpServerScalarWhereWithAggregatesInput = {
    AND?: McpServerScalarWhereWithAggregatesInput | McpServerScalarWhereWithAggregatesInput[]
    OR?: McpServerScalarWhereWithAggregatesInput[]
    NOT?: McpServerScalarWhereWithAggregatesInput | McpServerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"McpServer"> | string
    name?: StringWithAggregatesFilter<"McpServer"> | string
    enabled?: BoolWithAggregatesFilter<"McpServer"> | boolean
    config?: JsonNullableWithAggregatesFilter<"McpServer">
    productionVersion?: IntWithAggregatesFilter<"McpServer"> | number
    createdAt?: DateTimeWithAggregatesFilter<"McpServer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"McpServer"> | Date | string
  }

  export type McpServerVersionWhereInput = {
    AND?: McpServerVersionWhereInput | McpServerVersionWhereInput[]
    OR?: McpServerVersionWhereInput[]
    NOT?: McpServerVersionWhereInput | McpServerVersionWhereInput[]
    id?: StringFilter<"McpServerVersion"> | string
    mcpServerId?: StringFilter<"McpServerVersion"> | string
    version?: IntFilter<"McpServerVersion"> | number
    description?: StringNullableFilter<"McpServerVersion"> | string | null
    code?: StringFilter<"McpServerVersion"> | string
    createdAt?: DateTimeFilter<"McpServerVersion"> | Date | string
    mcpServer?: XOR<McpServerScalarRelationFilter, McpServerWhereInput>
  }

  export type McpServerVersionOrderByWithRelationInput = {
    id?: SortOrder
    mcpServerId?: SortOrder
    version?: SortOrder
    description?: SortOrderInput | SortOrder
    code?: SortOrder
    createdAt?: SortOrder
    mcpServer?: McpServerOrderByWithRelationInput
  }

  export type McpServerVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    mcpServerId_version?: McpServerVersionMcpServerIdVersionCompoundUniqueInput
    AND?: McpServerVersionWhereInput | McpServerVersionWhereInput[]
    OR?: McpServerVersionWhereInput[]
    NOT?: McpServerVersionWhereInput | McpServerVersionWhereInput[]
    mcpServerId?: StringFilter<"McpServerVersion"> | string
    version?: IntFilter<"McpServerVersion"> | number
    description?: StringNullableFilter<"McpServerVersion"> | string | null
    code?: StringFilter<"McpServerVersion"> | string
    createdAt?: DateTimeFilter<"McpServerVersion"> | Date | string
    mcpServer?: XOR<McpServerScalarRelationFilter, McpServerWhereInput>
  }, "id" | "mcpServerId_version">

  export type McpServerVersionOrderByWithAggregationInput = {
    id?: SortOrder
    mcpServerId?: SortOrder
    version?: SortOrder
    description?: SortOrderInput | SortOrder
    code?: SortOrder
    createdAt?: SortOrder
    _count?: McpServerVersionCountOrderByAggregateInput
    _avg?: McpServerVersionAvgOrderByAggregateInput
    _max?: McpServerVersionMaxOrderByAggregateInput
    _min?: McpServerVersionMinOrderByAggregateInput
    _sum?: McpServerVersionSumOrderByAggregateInput
  }

  export type McpServerVersionScalarWhereWithAggregatesInput = {
    AND?: McpServerVersionScalarWhereWithAggregatesInput | McpServerVersionScalarWhereWithAggregatesInput[]
    OR?: McpServerVersionScalarWhereWithAggregatesInput[]
    NOT?: McpServerVersionScalarWhereWithAggregatesInput | McpServerVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"McpServerVersion"> | string
    mcpServerId?: StringWithAggregatesFilter<"McpServerVersion"> | string
    version?: IntWithAggregatesFilter<"McpServerVersion"> | number
    description?: StringNullableWithAggregatesFilter<"McpServerVersion"> | string | null
    code?: StringWithAggregatesFilter<"McpServerVersion"> | string
    createdAt?: DateTimeWithAggregatesFilter<"McpServerVersion"> | Date | string
  }

  export type BizTableMappingWhereInput = {
    AND?: BizTableMappingWhereInput | BizTableMappingWhereInput[]
    OR?: BizTableMappingWhereInput[]
    NOT?: BizTableMappingWhereInput | BizTableMappingWhereInput[]
    id?: StringFilter<"BizTableMapping"> | string
    userName?: StringFilter<"BizTableMapping"> | string
    logicalName?: StringFilter<"BizTableMapping"> | string
    physicalName?: StringFilter<"BizTableMapping"> | string
    createdAt?: DateTimeFilter<"BizTableMapping"> | Date | string
  }

  export type BizTableMappingOrderByWithRelationInput = {
    id?: SortOrder
    userName?: SortOrder
    logicalName?: SortOrder
    physicalName?: SortOrder
    createdAt?: SortOrder
  }

  export type BizTableMappingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    physicalName?: string
    userName_logicalName?: BizTableMappingUserNameLogicalNameCompoundUniqueInput
    AND?: BizTableMappingWhereInput | BizTableMappingWhereInput[]
    OR?: BizTableMappingWhereInput[]
    NOT?: BizTableMappingWhereInput | BizTableMappingWhereInput[]
    userName?: StringFilter<"BizTableMapping"> | string
    logicalName?: StringFilter<"BizTableMapping"> | string
    createdAt?: DateTimeFilter<"BizTableMapping"> | Date | string
  }, "id" | "physicalName" | "userName_logicalName">

  export type BizTableMappingOrderByWithAggregationInput = {
    id?: SortOrder
    userName?: SortOrder
    logicalName?: SortOrder
    physicalName?: SortOrder
    createdAt?: SortOrder
    _count?: BizTableMappingCountOrderByAggregateInput
    _max?: BizTableMappingMaxOrderByAggregateInput
    _min?: BizTableMappingMinOrderByAggregateInput
  }

  export type BizTableMappingScalarWhereWithAggregatesInput = {
    AND?: BizTableMappingScalarWhereWithAggregatesInput | BizTableMappingScalarWhereWithAggregatesInput[]
    OR?: BizTableMappingScalarWhereWithAggregatesInput[]
    NOT?: BizTableMappingScalarWhereWithAggregatesInput | BizTableMappingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BizTableMapping"> | string
    userName?: StringWithAggregatesFilter<"BizTableMapping"> | string
    logicalName?: StringWithAggregatesFilter<"BizTableMapping"> | string
    physicalName?: StringWithAggregatesFilter<"BizTableMapping"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BizTableMapping"> | Date | string
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    sessionId?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    input?: JsonFilter<"Task">
    reply?: StringNullableFilter<"Task"> | string | null
    error?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
    events?: TaskEventListRelationFilter
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    input?: SortOrder
    reply?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    session?: ChatSessionOrderByWithRelationInput
    events?: TaskEventOrderByRelationAggregateInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    sessionId?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    input?: JsonFilter<"Task">
    reply?: StringNullableFilter<"Task"> | string | null
    error?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
    events?: TaskEventListRelationFilter
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    input?: SortOrder
    reply?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    sessionId?: StringWithAggregatesFilter<"Task"> | string
    status?: StringWithAggregatesFilter<"Task"> | string
    input?: JsonWithAggregatesFilter<"Task">
    reply?: StringNullableWithAggregatesFilter<"Task"> | string | null
    error?: StringNullableWithAggregatesFilter<"Task"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
  }

  export type TaskEventWhereInput = {
    AND?: TaskEventWhereInput | TaskEventWhereInput[]
    OR?: TaskEventWhereInput[]
    NOT?: TaskEventWhereInput | TaskEventWhereInput[]
    id?: IntFilter<"TaskEvent"> | number
    taskId?: StringFilter<"TaskEvent"> | string
    type?: StringFilter<"TaskEvent"> | string
    data?: JsonFilter<"TaskEvent">
    createdAt?: DateTimeFilter<"TaskEvent"> | Date | string
    task?: XOR<TaskScalarRelationFilter, TaskWhereInput>
  }

  export type TaskEventOrderByWithRelationInput = {
    id?: SortOrder
    taskId?: SortOrder
    type?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    task?: TaskOrderByWithRelationInput
  }

  export type TaskEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TaskEventWhereInput | TaskEventWhereInput[]
    OR?: TaskEventWhereInput[]
    NOT?: TaskEventWhereInput | TaskEventWhereInput[]
    taskId?: StringFilter<"TaskEvent"> | string
    type?: StringFilter<"TaskEvent"> | string
    data?: JsonFilter<"TaskEvent">
    createdAt?: DateTimeFilter<"TaskEvent"> | Date | string
    task?: XOR<TaskScalarRelationFilter, TaskWhereInput>
  }, "id">

  export type TaskEventOrderByWithAggregationInput = {
    id?: SortOrder
    taskId?: SortOrder
    type?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    _count?: TaskEventCountOrderByAggregateInput
    _avg?: TaskEventAvgOrderByAggregateInput
    _max?: TaskEventMaxOrderByAggregateInput
    _min?: TaskEventMinOrderByAggregateInput
    _sum?: TaskEventSumOrderByAggregateInput
  }

  export type TaskEventScalarWhereWithAggregatesInput = {
    AND?: TaskEventScalarWhereWithAggregatesInput | TaskEventScalarWhereWithAggregatesInput[]
    OR?: TaskEventScalarWhereWithAggregatesInput[]
    NOT?: TaskEventScalarWhereWithAggregatesInput | TaskEventScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TaskEvent"> | number
    taskId?: StringWithAggregatesFilter<"TaskEvent"> | string
    type?: StringWithAggregatesFilter<"TaskEvent"> | string
    data?: JsonWithAggregatesFilter<"TaskEvent">
    createdAt?: DateTimeWithAggregatesFilter<"TaskEvent"> | Date | string
  }

  export type ApiWhereInput = {
    AND?: ApiWhereInput | ApiWhereInput[]
    OR?: ApiWhereInput[]
    NOT?: ApiWhereInput | ApiWhereInput[]
    id?: StringFilter<"Api"> | string
    name?: StringFilter<"Api"> | string
    description?: StringFilter<"Api"> | string
    enabled?: BoolFilter<"Api"> | boolean
    productionVersion?: IntFilter<"Api"> | number
    createdAt?: DateTimeFilter<"Api"> | Date | string
    updatedAt?: DateTimeFilter<"Api"> | Date | string
    versions?: ApiVersionListRelationFilter
  }

  export type ApiOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    versions?: ApiVersionOrderByRelationAggregateInput
  }

  export type ApiWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ApiWhereInput | ApiWhereInput[]
    OR?: ApiWhereInput[]
    NOT?: ApiWhereInput | ApiWhereInput[]
    description?: StringFilter<"Api"> | string
    enabled?: BoolFilter<"Api"> | boolean
    productionVersion?: IntFilter<"Api"> | number
    createdAt?: DateTimeFilter<"Api"> | Date | string
    updatedAt?: DateTimeFilter<"Api"> | Date | string
    versions?: ApiVersionListRelationFilter
  }, "id" | "name">

  export type ApiOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ApiCountOrderByAggregateInput
    _avg?: ApiAvgOrderByAggregateInput
    _max?: ApiMaxOrderByAggregateInput
    _min?: ApiMinOrderByAggregateInput
    _sum?: ApiSumOrderByAggregateInput
  }

  export type ApiScalarWhereWithAggregatesInput = {
    AND?: ApiScalarWhereWithAggregatesInput | ApiScalarWhereWithAggregatesInput[]
    OR?: ApiScalarWhereWithAggregatesInput[]
    NOT?: ApiScalarWhereWithAggregatesInput | ApiScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Api"> | string
    name?: StringWithAggregatesFilter<"Api"> | string
    description?: StringWithAggregatesFilter<"Api"> | string
    enabled?: BoolWithAggregatesFilter<"Api"> | boolean
    productionVersion?: IntWithAggregatesFilter<"Api"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Api"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Api"> | Date | string
  }

  export type ApiVersionWhereInput = {
    AND?: ApiVersionWhereInput | ApiVersionWhereInput[]
    OR?: ApiVersionWhereInput[]
    NOT?: ApiVersionWhereInput | ApiVersionWhereInput[]
    id?: StringFilter<"ApiVersion"> | string
    apiId?: StringFilter<"ApiVersion"> | string
    version?: IntFilter<"ApiVersion"> | number
    description?: StringNullableFilter<"ApiVersion"> | string | null
    schema?: JsonFilter<"ApiVersion">
    operations?: JsonFilter<"ApiVersion">
    createdAt?: DateTimeFilter<"ApiVersion"> | Date | string
    api?: XOR<ApiScalarRelationFilter, ApiWhereInput>
  }

  export type ApiVersionOrderByWithRelationInput = {
    id?: SortOrder
    apiId?: SortOrder
    version?: SortOrder
    description?: SortOrderInput | SortOrder
    schema?: SortOrder
    operations?: SortOrder
    createdAt?: SortOrder
    api?: ApiOrderByWithRelationInput
  }

  export type ApiVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    apiId_version?: ApiVersionApiIdVersionCompoundUniqueInput
    AND?: ApiVersionWhereInput | ApiVersionWhereInput[]
    OR?: ApiVersionWhereInput[]
    NOT?: ApiVersionWhereInput | ApiVersionWhereInput[]
    apiId?: StringFilter<"ApiVersion"> | string
    version?: IntFilter<"ApiVersion"> | number
    description?: StringNullableFilter<"ApiVersion"> | string | null
    schema?: JsonFilter<"ApiVersion">
    operations?: JsonFilter<"ApiVersion">
    createdAt?: DateTimeFilter<"ApiVersion"> | Date | string
    api?: XOR<ApiScalarRelationFilter, ApiWhereInput>
  }, "id" | "apiId_version">

  export type ApiVersionOrderByWithAggregationInput = {
    id?: SortOrder
    apiId?: SortOrder
    version?: SortOrder
    description?: SortOrderInput | SortOrder
    schema?: SortOrder
    operations?: SortOrder
    createdAt?: SortOrder
    _count?: ApiVersionCountOrderByAggregateInput
    _avg?: ApiVersionAvgOrderByAggregateInput
    _max?: ApiVersionMaxOrderByAggregateInput
    _min?: ApiVersionMinOrderByAggregateInput
    _sum?: ApiVersionSumOrderByAggregateInput
  }

  export type ApiVersionScalarWhereWithAggregatesInput = {
    AND?: ApiVersionScalarWhereWithAggregatesInput | ApiVersionScalarWhereWithAggregatesInput[]
    OR?: ApiVersionScalarWhereWithAggregatesInput[]
    NOT?: ApiVersionScalarWhereWithAggregatesInput | ApiVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ApiVersion"> | string
    apiId?: StringWithAggregatesFilter<"ApiVersion"> | string
    version?: IntWithAggregatesFilter<"ApiVersion"> | number
    description?: StringNullableWithAggregatesFilter<"ApiVersion"> | string | null
    schema?: JsonWithAggregatesFilter<"ApiVersion">
    operations?: JsonWithAggregatesFilter<"ApiVersion">
    createdAt?: DateTimeWithAggregatesFilter<"ApiVersion"> | Date | string
  }

  export type SkillCreateInput = {
    id?: string
    name: string
    tags?: SkillCreatetagsInput | string[]
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: SkillVersionCreateNestedManyWithoutSkillInput
  }

  export type SkillUncheckedCreateInput = {
    id?: string
    name: string
    tags?: SkillCreatetagsInput | string[]
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: SkillVersionUncheckedCreateNestedManyWithoutSkillInput
  }

  export type SkillUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tags?: SkillUpdatetagsInput | string[]
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: SkillVersionUpdateManyWithoutSkillNestedInput
  }

  export type SkillUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tags?: SkillUpdatetagsInput | string[]
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: SkillVersionUncheckedUpdateManyWithoutSkillNestedInput
  }

  export type SkillCreateManyInput = {
    id?: string
    name: string
    tags?: SkillCreatetagsInput | string[]
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tags?: SkillUpdatetagsInput | string[]
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tags?: SkillUpdatetagsInput | string[]
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillVersionCreateInput = {
    id?: string
    version: number
    description: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    skill: SkillCreateNestedOneWithoutVersionsInput
  }

  export type SkillVersionUncheckedCreateInput = {
    id?: string
    skillId: string
    version: number
    description: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SkillVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skill?: SkillUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type SkillVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillVersionCreateManyInput = {
    id?: string
    skillId: string
    version: number
    description: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SkillVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    skillId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    sessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    sessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ChatSessionCreateInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
    keyResources?: KeyResourceCreateNestedManyWithoutSessionInput
    tasks?: TaskCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateInput = {
    id?: string
    title?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
    keyResources?: KeyResourceUncheckedCreateNestedManyWithoutSessionInput
    tasks?: TaskUncheckedCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
    keyResources?: KeyResourceUpdateManyWithoutSessionNestedInput
    tasks?: TaskUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
    keyResources?: KeyResourceUncheckedUpdateManyWithoutSessionNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionCreateManyInput = {
    id?: string
    title?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    role: string
    content?: string | null
    images?: ChatMessageCreateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: string | null
    hidden?: boolean
    createdAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    sessionId: string
    role: string
    content?: string | null
    images?: ChatMessageCreateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: string | null
    hidden?: boolean
    createdAt?: Date | string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ChatMessageUpdateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ChatMessageUpdateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    sessionId: string
    role: string
    content?: string | null
    images?: ChatMessageCreateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: string | null
    hidden?: boolean
    createdAt?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ChatMessageUpdateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ChatMessageUpdateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceCreateInput = {
    id?: string
    key: string
    mediaType: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutKeyResourcesInput
    versions?: KeyResourceVersionCreateNestedManyWithoutKeyResourceInput
  }

  export type KeyResourceUncheckedCreateInput = {
    id?: string
    sessionId: string
    key: string
    mediaType: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: KeyResourceVersionUncheckedCreateNestedManyWithoutKeyResourceInput
  }

  export type KeyResourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutKeyResourcesNestedInput
    versions?: KeyResourceVersionUpdateManyWithoutKeyResourceNestedInput
  }

  export type KeyResourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: KeyResourceVersionUncheckedUpdateManyWithoutKeyResourceNestedInput
  }

  export type KeyResourceCreateManyInput = {
    id?: string
    sessionId: string
    key: string
    mediaType: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KeyResourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceVersionCreateInput = {
    id?: string
    version: number
    title?: string | null
    url?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: string | null
    refUrls?: KeyResourceVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
    keyResource: KeyResourceCreateNestedOneWithoutVersionsInput
  }

  export type KeyResourceVersionUncheckedCreateInput = {
    id?: string
    keyResourceId: string
    version: number
    title?: string | null
    url?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: string | null
    refUrls?: KeyResourceVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type KeyResourceVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: KeyResourceVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    keyResource?: KeyResourceUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type KeyResourceVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyResourceId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: KeyResourceVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceVersionCreateManyInput = {
    id?: string
    keyResourceId: string
    version: number
    title?: string | null
    url?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: string | null
    refUrls?: KeyResourceVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type KeyResourceVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: KeyResourceVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyResourceId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: KeyResourceVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationCreateInput = {
    id?: string
    key: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutImageGenerationsInput
    versions?: ImageGenerationVersionCreateNestedManyWithoutImageGenInput
  }

  export type ImageGenerationUncheckedCreateInput = {
    id?: string
    sessionId: string
    key: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: ImageGenerationVersionUncheckedCreateNestedManyWithoutImageGenInput
  }

  export type ImageGenerationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutImageGenerationsNestedInput
    versions?: ImageGenerationVersionUpdateManyWithoutImageGenNestedInput
  }

  export type ImageGenerationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: ImageGenerationVersionUncheckedUpdateManyWithoutImageGenNestedInput
  }

  export type ImageGenerationCreateManyInput = {
    id?: string
    sessionId: string
    key: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageGenerationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationVersionCreateInput = {
    id?: string
    version: number
    prompt: string
    imageUrl?: string | null
    refUrls?: ImageGenerationVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
    imageGen: ImageGenerationCreateNestedOneWithoutVersionsInput
  }

  export type ImageGenerationVersionUncheckedCreateInput = {
    id?: string
    imageGenId: string
    version: number
    prompt: string
    imageUrl?: string | null
    refUrls?: ImageGenerationVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type ImageGenerationVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: ImageGenerationVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    imageGen?: ImageGenerationUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type ImageGenerationVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageGenId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: ImageGenerationVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationVersionCreateManyInput = {
    id?: string
    imageGenId: string
    version: number
    prompt: string
    imageUrl?: string | null
    refUrls?: ImageGenerationVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type ImageGenerationVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: ImageGenerationVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageGenId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: ImageGenerationVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerCreateInput = {
    id?: string
    name: string
    enabled?: boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: McpServerVersionCreateNestedManyWithoutMcpServerInput
  }

  export type McpServerUncheckedCreateInput = {
    id?: string
    name: string
    enabled?: boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: McpServerVersionUncheckedCreateNestedManyWithoutMcpServerInput
  }

  export type McpServerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: McpServerVersionUpdateManyWithoutMcpServerNestedInput
  }

  export type McpServerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: McpServerVersionUncheckedUpdateManyWithoutMcpServerNestedInput
  }

  export type McpServerCreateManyInput = {
    id?: string
    name: string
    enabled?: boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type McpServerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerVersionCreateInput = {
    id?: string
    version: number
    description?: string | null
    code: string
    createdAt?: Date | string
    mcpServer: McpServerCreateNestedOneWithoutVersionsInput
  }

  export type McpServerVersionUncheckedCreateInput = {
    id?: string
    mcpServerId: string
    version: number
    description?: string | null
    code: string
    createdAt?: Date | string
  }

  export type McpServerVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mcpServer?: McpServerUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type McpServerVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mcpServerId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerVersionCreateManyInput = {
    id?: string
    mcpServerId: string
    version: number
    description?: string | null
    code: string
    createdAt?: Date | string
  }

  export type McpServerVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    mcpServerId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BizTableMappingCreateInput = {
    id?: string
    userName: string
    logicalName: string
    physicalName: string
    createdAt?: Date | string
  }

  export type BizTableMappingUncheckedCreateInput = {
    id?: string
    userName: string
    logicalName: string
    physicalName: string
    createdAt?: Date | string
  }

  export type BizTableMappingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    logicalName?: StringFieldUpdateOperationsInput | string
    physicalName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BizTableMappingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    logicalName?: StringFieldUpdateOperationsInput | string
    physicalName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BizTableMappingCreateManyInput = {
    id?: string
    userName: string
    logicalName: string
    physicalName: string
    createdAt?: Date | string
  }

  export type BizTableMappingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    logicalName?: StringFieldUpdateOperationsInput | string
    physicalName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BizTableMappingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userName?: StringFieldUpdateOperationsInput | string
    logicalName?: StringFieldUpdateOperationsInput | string
    physicalName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateInput = {
    id?: string
    status?: string
    input: JsonNullValueInput | InputJsonValue
    reply?: string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutTasksInput
    events?: TaskEventCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    sessionId: string
    status?: string
    input: JsonNullValueInput | InputJsonValue
    reply?: string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: TaskEventUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutTasksNestedInput
    events?: TaskEventUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: TaskEventUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskCreateManyInput = {
    id?: string
    sessionId: string
    status?: string
    input: JsonNullValueInput | InputJsonValue
    reply?: string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskEventCreateInput = {
    type: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    task: TaskCreateNestedOneWithoutEventsInput
  }

  export type TaskEventUncheckedCreateInput = {
    id?: number
    taskId: string
    type: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TaskEventUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneRequiredWithoutEventsNestedInput
  }

  export type TaskEventUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    taskId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskEventCreateManyInput = {
    id?: number
    taskId: string
    type: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TaskEventUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskEventUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    taskId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiCreateInput = {
    id?: string
    name: string
    description: string
    enabled?: boolean
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: ApiVersionCreateNestedManyWithoutApiInput
  }

  export type ApiUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    enabled?: boolean
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: ApiVersionUncheckedCreateNestedManyWithoutApiInput
  }

  export type ApiUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: ApiVersionUpdateManyWithoutApiNestedInput
  }

  export type ApiUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: ApiVersionUncheckedUpdateManyWithoutApiNestedInput
  }

  export type ApiCreateManyInput = {
    id?: string
    name: string
    description: string
    enabled?: boolean
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApiUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiVersionCreateInput = {
    id?: string
    version: number
    description?: string | null
    schema: JsonNullValueInput | InputJsonValue
    operations: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    api: ApiCreateNestedOneWithoutVersionsInput
  }

  export type ApiVersionUncheckedCreateInput = {
    id?: string
    apiId: string
    version: number
    description?: string | null
    schema: JsonNullValueInput | InputJsonValue
    operations: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ApiVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    schema?: JsonNullValueInput | InputJsonValue
    operations?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    api?: ApiUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type ApiVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    apiId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    schema?: JsonNullValueInput | InputJsonValue
    operations?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiVersionCreateManyInput = {
    id?: string
    apiId: string
    version: number
    description?: string | null
    schema: JsonNullValueInput | InputJsonValue
    operations: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ApiVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    schema?: JsonNullValueInput | InputJsonValue
    operations?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    apiId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    schema?: JsonNullValueInput | InputJsonValue
    operations?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SkillVersionListRelationFilter = {
    every?: SkillVersionWhereInput
    some?: SkillVersionWhereInput
    none?: SkillVersionWhereInput
  }

  export type SkillVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SkillCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    tags?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillAvgOrderByAggregateInput = {
    productionVersion?: SortOrder
  }

  export type SkillMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillSumOrderByAggregateInput = {
    productionVersion?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SkillScalarRelationFilter = {
    is?: SkillWhereInput
    isNot?: SkillWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SkillVersionSkillIdVersionCompoundUniqueInput = {
    skillId: string
    version: number
  }

  export type SkillVersionCountOrderByAggregateInput = {
    id?: SortOrder
    skillId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    content?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type SkillVersionAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type SkillVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    skillId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type SkillVersionMinOrderByAggregateInput = {
    id?: SortOrder
    skillId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type SkillVersionSumOrderByAggregateInput = {
    version?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ChatSessionListRelationFilter = {
    every?: ChatSessionWhereInput
    some?: ChatSessionWhereInput
    none?: ChatSessionWhereInput
  }

  export type ChatSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type KeyResourceListRelationFilter = {
    every?: KeyResourceWhereInput
    some?: KeyResourceWhereInput
    none?: KeyResourceWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type ImageGenerationListRelationFilter = {
    every?: ImageGenerationWhereInput
    some?: ImageGenerationWhereInput
    none?: ImageGenerationWhereInput
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KeyResourceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImageGenerationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ChatSessionScalarRelationFilter = {
    is?: ChatSessionWhereInput
    isNot?: ChatSessionWhereInput
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    images?: SortOrder
    toolCalls?: SortOrder
    toolCallId?: SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    toolCallId?: SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    toolCallId?: SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type KeyResourceVersionListRelationFilter = {
    every?: KeyResourceVersionWhereInput
    some?: KeyResourceVersionWhereInput
    none?: KeyResourceVersionWhereInput
  }

  export type KeyResourceVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KeyResourceSessionIdKeyCompoundUniqueInput = {
    sessionId: string
    key: string
  }

  export type KeyResourceCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    mediaType?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KeyResourceAvgOrderByAggregateInput = {
    currentVersion?: SortOrder
  }

  export type KeyResourceMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    mediaType?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KeyResourceMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    mediaType?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KeyResourceSumOrderByAggregateInput = {
    currentVersion?: SortOrder
  }

  export type KeyResourceScalarRelationFilter = {
    is?: KeyResourceWhereInput
    isNot?: KeyResourceWhereInput
  }

  export type KeyResourceVersionKeyResourceIdVersionCompoundUniqueInput = {
    keyResourceId: string
    version: number
  }

  export type KeyResourceVersionCountOrderByAggregateInput = {
    id?: SortOrder
    keyResourceId?: SortOrder
    version?: SortOrder
    title?: SortOrder
    url?: SortOrder
    data?: SortOrder
    prompt?: SortOrder
    refUrls?: SortOrder
    createdAt?: SortOrder
  }

  export type KeyResourceVersionAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type KeyResourceVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    keyResourceId?: SortOrder
    version?: SortOrder
    title?: SortOrder
    url?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
  }

  export type KeyResourceVersionMinOrderByAggregateInput = {
    id?: SortOrder
    keyResourceId?: SortOrder
    version?: SortOrder
    title?: SortOrder
    url?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
  }

  export type KeyResourceVersionSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type ImageGenerationVersionListRelationFilter = {
    every?: ImageGenerationVersionWhereInput
    some?: ImageGenerationVersionWhereInput
    none?: ImageGenerationVersionWhereInput
  }

  export type ImageGenerationVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImageGenerationSessionIdKeyCompoundUniqueInput = {
    sessionId: string
    key: string
  }

  export type ImageGenerationCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageGenerationAvgOrderByAggregateInput = {
    currentVersion?: SortOrder
  }

  export type ImageGenerationMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageGenerationMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    key?: SortOrder
    currentVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ImageGenerationSumOrderByAggregateInput = {
    currentVersion?: SortOrder
  }

  export type ImageGenerationScalarRelationFilter = {
    is?: ImageGenerationWhereInput
    isNot?: ImageGenerationWhereInput
  }

  export type ImageGenerationVersionImageGenIdVersionCompoundUniqueInput = {
    imageGenId: string
    version: number
  }

  export type ImageGenerationVersionCountOrderByAggregateInput = {
    id?: SortOrder
    imageGenId?: SortOrder
    version?: SortOrder
    prompt?: SortOrder
    imageUrl?: SortOrder
    refUrls?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageGenerationVersionAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type ImageGenerationVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    imageGenId?: SortOrder
    version?: SortOrder
    prompt?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageGenerationVersionMinOrderByAggregateInput = {
    id?: SortOrder
    imageGenId?: SortOrder
    version?: SortOrder
    prompt?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ImageGenerationVersionSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type McpServerVersionListRelationFilter = {
    every?: McpServerVersionWhereInput
    some?: McpServerVersionWhereInput
    none?: McpServerVersionWhereInput
  }

  export type McpServerVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type McpServerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    enabled?: SortOrder
    config?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type McpServerAvgOrderByAggregateInput = {
    productionVersion?: SortOrder
  }

  export type McpServerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    enabled?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type McpServerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    enabled?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type McpServerSumOrderByAggregateInput = {
    productionVersion?: SortOrder
  }

  export type McpServerScalarRelationFilter = {
    is?: McpServerWhereInput
    isNot?: McpServerWhereInput
  }

  export type McpServerVersionMcpServerIdVersionCompoundUniqueInput = {
    mcpServerId: string
    version: number
  }

  export type McpServerVersionCountOrderByAggregateInput = {
    id?: SortOrder
    mcpServerId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    code?: SortOrder
    createdAt?: SortOrder
  }

  export type McpServerVersionAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type McpServerVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    mcpServerId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    code?: SortOrder
    createdAt?: SortOrder
  }

  export type McpServerVersionMinOrderByAggregateInput = {
    id?: SortOrder
    mcpServerId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    code?: SortOrder
    createdAt?: SortOrder
  }

  export type McpServerVersionSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type BizTableMappingUserNameLogicalNameCompoundUniqueInput = {
    userName: string
    logicalName: string
  }

  export type BizTableMappingCountOrderByAggregateInput = {
    id?: SortOrder
    userName?: SortOrder
    logicalName?: SortOrder
    physicalName?: SortOrder
    createdAt?: SortOrder
  }

  export type BizTableMappingMaxOrderByAggregateInput = {
    id?: SortOrder
    userName?: SortOrder
    logicalName?: SortOrder
    physicalName?: SortOrder
    createdAt?: SortOrder
  }

  export type BizTableMappingMinOrderByAggregateInput = {
    id?: SortOrder
    userName?: SortOrder
    logicalName?: SortOrder
    physicalName?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TaskEventListRelationFilter = {
    every?: TaskEventWhereInput
    some?: TaskEventWhereInput
    none?: TaskEventWhereInput
  }

  export type TaskEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    input?: SortOrder
    reply?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    reply?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    status?: SortOrder
    reply?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type TaskScalarRelationFilter = {
    is?: TaskWhereInput
    isNot?: TaskWhereInput
  }

  export type TaskEventCountOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    type?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskEventAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TaskEventMaxOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskEventMinOrderByAggregateInput = {
    id?: SortOrder
    taskId?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type TaskEventSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ApiVersionListRelationFilter = {
    every?: ApiVersionWhereInput
    some?: ApiVersionWhereInput
    none?: ApiVersionWhereInput
  }

  export type ApiVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ApiCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApiAvgOrderByAggregateInput = {
    productionVersion?: SortOrder
  }

  export type ApiMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApiMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    productionVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApiSumOrderByAggregateInput = {
    productionVersion?: SortOrder
  }

  export type ApiScalarRelationFilter = {
    is?: ApiWhereInput
    isNot?: ApiWhereInput
  }

  export type ApiVersionApiIdVersionCompoundUniqueInput = {
    apiId: string
    version: number
  }

  export type ApiVersionCountOrderByAggregateInput = {
    id?: SortOrder
    apiId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    schema?: SortOrder
    operations?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiVersionAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type ApiVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    apiId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiVersionMinOrderByAggregateInput = {
    id?: SortOrder
    apiId?: SortOrder
    version?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiVersionSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type SkillCreatetagsInput = {
    set: string[]
  }

  export type SkillVersionCreateNestedManyWithoutSkillInput = {
    create?: XOR<SkillVersionCreateWithoutSkillInput, SkillVersionUncheckedCreateWithoutSkillInput> | SkillVersionCreateWithoutSkillInput[] | SkillVersionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: SkillVersionCreateOrConnectWithoutSkillInput | SkillVersionCreateOrConnectWithoutSkillInput[]
    createMany?: SkillVersionCreateManySkillInputEnvelope
    connect?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
  }

  export type SkillVersionUncheckedCreateNestedManyWithoutSkillInput = {
    create?: XOR<SkillVersionCreateWithoutSkillInput, SkillVersionUncheckedCreateWithoutSkillInput> | SkillVersionCreateWithoutSkillInput[] | SkillVersionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: SkillVersionCreateOrConnectWithoutSkillInput | SkillVersionCreateOrConnectWithoutSkillInput[]
    createMany?: SkillVersionCreateManySkillInputEnvelope
    connect?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type SkillUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SkillVersionUpdateManyWithoutSkillNestedInput = {
    create?: XOR<SkillVersionCreateWithoutSkillInput, SkillVersionUncheckedCreateWithoutSkillInput> | SkillVersionCreateWithoutSkillInput[] | SkillVersionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: SkillVersionCreateOrConnectWithoutSkillInput | SkillVersionCreateOrConnectWithoutSkillInput[]
    upsert?: SkillVersionUpsertWithWhereUniqueWithoutSkillInput | SkillVersionUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: SkillVersionCreateManySkillInputEnvelope
    set?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
    disconnect?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
    delete?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
    connect?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
    update?: SkillVersionUpdateWithWhereUniqueWithoutSkillInput | SkillVersionUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: SkillVersionUpdateManyWithWhereWithoutSkillInput | SkillVersionUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: SkillVersionScalarWhereInput | SkillVersionScalarWhereInput[]
  }

  export type SkillVersionUncheckedUpdateManyWithoutSkillNestedInput = {
    create?: XOR<SkillVersionCreateWithoutSkillInput, SkillVersionUncheckedCreateWithoutSkillInput> | SkillVersionCreateWithoutSkillInput[] | SkillVersionUncheckedCreateWithoutSkillInput[]
    connectOrCreate?: SkillVersionCreateOrConnectWithoutSkillInput | SkillVersionCreateOrConnectWithoutSkillInput[]
    upsert?: SkillVersionUpsertWithWhereUniqueWithoutSkillInput | SkillVersionUpsertWithWhereUniqueWithoutSkillInput[]
    createMany?: SkillVersionCreateManySkillInputEnvelope
    set?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
    disconnect?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
    delete?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
    connect?: SkillVersionWhereUniqueInput | SkillVersionWhereUniqueInput[]
    update?: SkillVersionUpdateWithWhereUniqueWithoutSkillInput | SkillVersionUpdateWithWhereUniqueWithoutSkillInput[]
    updateMany?: SkillVersionUpdateManyWithWhereWithoutSkillInput | SkillVersionUpdateManyWithWhereWithoutSkillInput[]
    deleteMany?: SkillVersionScalarWhereInput | SkillVersionScalarWhereInput[]
  }

  export type SkillCreateNestedOneWithoutVersionsInput = {
    create?: XOR<SkillCreateWithoutVersionsInput, SkillUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutVersionsInput
    connect?: SkillWhereUniqueInput
  }

  export type SkillUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<SkillCreateWithoutVersionsInput, SkillUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: SkillCreateOrConnectWithoutVersionsInput
    upsert?: SkillUpsertWithoutVersionsInput
    connect?: SkillWhereUniqueInput
    update?: XOR<XOR<SkillUpdateToOneWithWhereWithoutVersionsInput, SkillUpdateWithoutVersionsInput>, SkillUncheckedUpdateWithoutVersionsInput>
  }

  export type ChatSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type ChatSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type ChatSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type ChatMessageCreateNestedManyWithoutSessionInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type KeyResourceCreateNestedManyWithoutSessionInput = {
    create?: XOR<KeyResourceCreateWithoutSessionInput, KeyResourceUncheckedCreateWithoutSessionInput> | KeyResourceCreateWithoutSessionInput[] | KeyResourceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: KeyResourceCreateOrConnectWithoutSessionInput | KeyResourceCreateOrConnectWithoutSessionInput[]
    createMany?: KeyResourceCreateManySessionInputEnvelope
    connect?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutSessionInput = {
    create?: XOR<TaskCreateWithoutSessionInput, TaskUncheckedCreateWithoutSessionInput> | TaskCreateWithoutSessionInput[] | TaskUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutSessionInput | TaskCreateOrConnectWithoutSessionInput[]
    createMany?: TaskCreateManySessionInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type ImageGenerationCreateNestedManyWithoutSessionInput = {
    create?: XOR<ImageGenerationCreateWithoutSessionInput, ImageGenerationUncheckedCreateWithoutSessionInput> | ImageGenerationCreateWithoutSessionInput[] | ImageGenerationUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ImageGenerationCreateOrConnectWithoutSessionInput | ImageGenerationCreateOrConnectWithoutSessionInput[]
    createMany?: ImageGenerationCreateManySessionInputEnvelope
    connect?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type KeyResourceUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<KeyResourceCreateWithoutSessionInput, KeyResourceUncheckedCreateWithoutSessionInput> | KeyResourceCreateWithoutSessionInput[] | KeyResourceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: KeyResourceCreateOrConnectWithoutSessionInput | KeyResourceCreateOrConnectWithoutSessionInput[]
    createMany?: KeyResourceCreateManySessionInputEnvelope
    connect?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<TaskCreateWithoutSessionInput, TaskUncheckedCreateWithoutSessionInput> | TaskCreateWithoutSessionInput[] | TaskUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutSessionInput | TaskCreateOrConnectWithoutSessionInput[]
    createMany?: TaskCreateManySessionInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type ImageGenerationUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<ImageGenerationCreateWithoutSessionInput, ImageGenerationUncheckedCreateWithoutSessionInput> | ImageGenerationCreateWithoutSessionInput[] | ImageGenerationUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ImageGenerationCreateOrConnectWithoutSessionInput | ImageGenerationCreateOrConnectWithoutSessionInput[]
    createMany?: ImageGenerationCreateManySessionInputEnvelope
    connect?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type ChatMessageUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutSessionInput | ChatMessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutSessionInput | ChatMessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutSessionInput | ChatMessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type KeyResourceUpdateManyWithoutSessionNestedInput = {
    create?: XOR<KeyResourceCreateWithoutSessionInput, KeyResourceUncheckedCreateWithoutSessionInput> | KeyResourceCreateWithoutSessionInput[] | KeyResourceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: KeyResourceCreateOrConnectWithoutSessionInput | KeyResourceCreateOrConnectWithoutSessionInput[]
    upsert?: KeyResourceUpsertWithWhereUniqueWithoutSessionInput | KeyResourceUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: KeyResourceCreateManySessionInputEnvelope
    set?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
    disconnect?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
    delete?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
    connect?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
    update?: KeyResourceUpdateWithWhereUniqueWithoutSessionInput | KeyResourceUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: KeyResourceUpdateManyWithWhereWithoutSessionInput | KeyResourceUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: KeyResourceScalarWhereInput | KeyResourceScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutSessionNestedInput = {
    create?: XOR<TaskCreateWithoutSessionInput, TaskUncheckedCreateWithoutSessionInput> | TaskCreateWithoutSessionInput[] | TaskUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutSessionInput | TaskCreateOrConnectWithoutSessionInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutSessionInput | TaskUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: TaskCreateManySessionInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutSessionInput | TaskUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutSessionInput | TaskUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type ImageGenerationUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ImageGenerationCreateWithoutSessionInput, ImageGenerationUncheckedCreateWithoutSessionInput> | ImageGenerationCreateWithoutSessionInput[] | ImageGenerationUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ImageGenerationCreateOrConnectWithoutSessionInput | ImageGenerationCreateOrConnectWithoutSessionInput[]
    upsert?: ImageGenerationUpsertWithWhereUniqueWithoutSessionInput | ImageGenerationUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ImageGenerationCreateManySessionInputEnvelope
    set?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
    disconnect?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
    delete?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
    connect?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
    update?: ImageGenerationUpdateWithWhereUniqueWithoutSessionInput | ImageGenerationUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ImageGenerationUpdateManyWithWhereWithoutSessionInput | ImageGenerationUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ImageGenerationScalarWhereInput | ImageGenerationScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutSessionInput | ChatMessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutSessionInput | ChatMessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutSessionInput | ChatMessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type KeyResourceUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<KeyResourceCreateWithoutSessionInput, KeyResourceUncheckedCreateWithoutSessionInput> | KeyResourceCreateWithoutSessionInput[] | KeyResourceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: KeyResourceCreateOrConnectWithoutSessionInput | KeyResourceCreateOrConnectWithoutSessionInput[]
    upsert?: KeyResourceUpsertWithWhereUniqueWithoutSessionInput | KeyResourceUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: KeyResourceCreateManySessionInputEnvelope
    set?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
    disconnect?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
    delete?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
    connect?: KeyResourceWhereUniqueInput | KeyResourceWhereUniqueInput[]
    update?: KeyResourceUpdateWithWhereUniqueWithoutSessionInput | KeyResourceUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: KeyResourceUpdateManyWithWhereWithoutSessionInput | KeyResourceUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: KeyResourceScalarWhereInput | KeyResourceScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<TaskCreateWithoutSessionInput, TaskUncheckedCreateWithoutSessionInput> | TaskCreateWithoutSessionInput[] | TaskUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutSessionInput | TaskCreateOrConnectWithoutSessionInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutSessionInput | TaskUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: TaskCreateManySessionInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutSessionInput | TaskUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutSessionInput | TaskUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type ImageGenerationUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ImageGenerationCreateWithoutSessionInput, ImageGenerationUncheckedCreateWithoutSessionInput> | ImageGenerationCreateWithoutSessionInput[] | ImageGenerationUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ImageGenerationCreateOrConnectWithoutSessionInput | ImageGenerationCreateOrConnectWithoutSessionInput[]
    upsert?: ImageGenerationUpsertWithWhereUniqueWithoutSessionInput | ImageGenerationUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ImageGenerationCreateManySessionInputEnvelope
    set?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
    disconnect?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
    delete?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
    connect?: ImageGenerationWhereUniqueInput | ImageGenerationWhereUniqueInput[]
    update?: ImageGenerationUpdateWithWhereUniqueWithoutSessionInput | ImageGenerationUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ImageGenerationUpdateManyWithWhereWithoutSessionInput | ImageGenerationUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ImageGenerationScalarWhereInput | ImageGenerationScalarWhereInput[]
  }

  export type ChatMessageCreateimagesInput = {
    set: string[]
  }

  export type ChatSessionCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type ChatMessageUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ChatSessionUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    upsert?: ChatSessionUpsertWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutMessagesInput, ChatSessionUpdateWithoutMessagesInput>, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatSessionCreateNestedOneWithoutKeyResourcesInput = {
    create?: XOR<ChatSessionCreateWithoutKeyResourcesInput, ChatSessionUncheckedCreateWithoutKeyResourcesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutKeyResourcesInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type KeyResourceVersionCreateNestedManyWithoutKeyResourceInput = {
    create?: XOR<KeyResourceVersionCreateWithoutKeyResourceInput, KeyResourceVersionUncheckedCreateWithoutKeyResourceInput> | KeyResourceVersionCreateWithoutKeyResourceInput[] | KeyResourceVersionUncheckedCreateWithoutKeyResourceInput[]
    connectOrCreate?: KeyResourceVersionCreateOrConnectWithoutKeyResourceInput | KeyResourceVersionCreateOrConnectWithoutKeyResourceInput[]
    createMany?: KeyResourceVersionCreateManyKeyResourceInputEnvelope
    connect?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
  }

  export type KeyResourceVersionUncheckedCreateNestedManyWithoutKeyResourceInput = {
    create?: XOR<KeyResourceVersionCreateWithoutKeyResourceInput, KeyResourceVersionUncheckedCreateWithoutKeyResourceInput> | KeyResourceVersionCreateWithoutKeyResourceInput[] | KeyResourceVersionUncheckedCreateWithoutKeyResourceInput[]
    connectOrCreate?: KeyResourceVersionCreateOrConnectWithoutKeyResourceInput | KeyResourceVersionCreateOrConnectWithoutKeyResourceInput[]
    createMany?: KeyResourceVersionCreateManyKeyResourceInputEnvelope
    connect?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
  }

  export type ChatSessionUpdateOneRequiredWithoutKeyResourcesNestedInput = {
    create?: XOR<ChatSessionCreateWithoutKeyResourcesInput, ChatSessionUncheckedCreateWithoutKeyResourcesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutKeyResourcesInput
    upsert?: ChatSessionUpsertWithoutKeyResourcesInput
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutKeyResourcesInput, ChatSessionUpdateWithoutKeyResourcesInput>, ChatSessionUncheckedUpdateWithoutKeyResourcesInput>
  }

  export type KeyResourceVersionUpdateManyWithoutKeyResourceNestedInput = {
    create?: XOR<KeyResourceVersionCreateWithoutKeyResourceInput, KeyResourceVersionUncheckedCreateWithoutKeyResourceInput> | KeyResourceVersionCreateWithoutKeyResourceInput[] | KeyResourceVersionUncheckedCreateWithoutKeyResourceInput[]
    connectOrCreate?: KeyResourceVersionCreateOrConnectWithoutKeyResourceInput | KeyResourceVersionCreateOrConnectWithoutKeyResourceInput[]
    upsert?: KeyResourceVersionUpsertWithWhereUniqueWithoutKeyResourceInput | KeyResourceVersionUpsertWithWhereUniqueWithoutKeyResourceInput[]
    createMany?: KeyResourceVersionCreateManyKeyResourceInputEnvelope
    set?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
    disconnect?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
    delete?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
    connect?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
    update?: KeyResourceVersionUpdateWithWhereUniqueWithoutKeyResourceInput | KeyResourceVersionUpdateWithWhereUniqueWithoutKeyResourceInput[]
    updateMany?: KeyResourceVersionUpdateManyWithWhereWithoutKeyResourceInput | KeyResourceVersionUpdateManyWithWhereWithoutKeyResourceInput[]
    deleteMany?: KeyResourceVersionScalarWhereInput | KeyResourceVersionScalarWhereInput[]
  }

  export type KeyResourceVersionUncheckedUpdateManyWithoutKeyResourceNestedInput = {
    create?: XOR<KeyResourceVersionCreateWithoutKeyResourceInput, KeyResourceVersionUncheckedCreateWithoutKeyResourceInput> | KeyResourceVersionCreateWithoutKeyResourceInput[] | KeyResourceVersionUncheckedCreateWithoutKeyResourceInput[]
    connectOrCreate?: KeyResourceVersionCreateOrConnectWithoutKeyResourceInput | KeyResourceVersionCreateOrConnectWithoutKeyResourceInput[]
    upsert?: KeyResourceVersionUpsertWithWhereUniqueWithoutKeyResourceInput | KeyResourceVersionUpsertWithWhereUniqueWithoutKeyResourceInput[]
    createMany?: KeyResourceVersionCreateManyKeyResourceInputEnvelope
    set?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
    disconnect?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
    delete?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
    connect?: KeyResourceVersionWhereUniqueInput | KeyResourceVersionWhereUniqueInput[]
    update?: KeyResourceVersionUpdateWithWhereUniqueWithoutKeyResourceInput | KeyResourceVersionUpdateWithWhereUniqueWithoutKeyResourceInput[]
    updateMany?: KeyResourceVersionUpdateManyWithWhereWithoutKeyResourceInput | KeyResourceVersionUpdateManyWithWhereWithoutKeyResourceInput[]
    deleteMany?: KeyResourceVersionScalarWhereInput | KeyResourceVersionScalarWhereInput[]
  }

  export type KeyResourceVersionCreaterefUrlsInput = {
    set: string[]
  }

  export type KeyResourceCreateNestedOneWithoutVersionsInput = {
    create?: XOR<KeyResourceCreateWithoutVersionsInput, KeyResourceUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: KeyResourceCreateOrConnectWithoutVersionsInput
    connect?: KeyResourceWhereUniqueInput
  }

  export type KeyResourceVersionUpdaterefUrlsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type KeyResourceUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<KeyResourceCreateWithoutVersionsInput, KeyResourceUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: KeyResourceCreateOrConnectWithoutVersionsInput
    upsert?: KeyResourceUpsertWithoutVersionsInput
    connect?: KeyResourceWhereUniqueInput
    update?: XOR<XOR<KeyResourceUpdateToOneWithWhereWithoutVersionsInput, KeyResourceUpdateWithoutVersionsInput>, KeyResourceUncheckedUpdateWithoutVersionsInput>
  }

  export type ChatSessionCreateNestedOneWithoutImageGenerationsInput = {
    create?: XOR<ChatSessionCreateWithoutImageGenerationsInput, ChatSessionUncheckedCreateWithoutImageGenerationsInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutImageGenerationsInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type ImageGenerationVersionCreateNestedManyWithoutImageGenInput = {
    create?: XOR<ImageGenerationVersionCreateWithoutImageGenInput, ImageGenerationVersionUncheckedCreateWithoutImageGenInput> | ImageGenerationVersionCreateWithoutImageGenInput[] | ImageGenerationVersionUncheckedCreateWithoutImageGenInput[]
    connectOrCreate?: ImageGenerationVersionCreateOrConnectWithoutImageGenInput | ImageGenerationVersionCreateOrConnectWithoutImageGenInput[]
    createMany?: ImageGenerationVersionCreateManyImageGenInputEnvelope
    connect?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
  }

  export type ImageGenerationVersionUncheckedCreateNestedManyWithoutImageGenInput = {
    create?: XOR<ImageGenerationVersionCreateWithoutImageGenInput, ImageGenerationVersionUncheckedCreateWithoutImageGenInput> | ImageGenerationVersionCreateWithoutImageGenInput[] | ImageGenerationVersionUncheckedCreateWithoutImageGenInput[]
    connectOrCreate?: ImageGenerationVersionCreateOrConnectWithoutImageGenInput | ImageGenerationVersionCreateOrConnectWithoutImageGenInput[]
    createMany?: ImageGenerationVersionCreateManyImageGenInputEnvelope
    connect?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
  }

  export type ChatSessionUpdateOneRequiredWithoutImageGenerationsNestedInput = {
    create?: XOR<ChatSessionCreateWithoutImageGenerationsInput, ChatSessionUncheckedCreateWithoutImageGenerationsInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutImageGenerationsInput
    upsert?: ChatSessionUpsertWithoutImageGenerationsInput
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutImageGenerationsInput, ChatSessionUpdateWithoutImageGenerationsInput>, ChatSessionUncheckedUpdateWithoutImageGenerationsInput>
  }

  export type ImageGenerationVersionUpdateManyWithoutImageGenNestedInput = {
    create?: XOR<ImageGenerationVersionCreateWithoutImageGenInput, ImageGenerationVersionUncheckedCreateWithoutImageGenInput> | ImageGenerationVersionCreateWithoutImageGenInput[] | ImageGenerationVersionUncheckedCreateWithoutImageGenInput[]
    connectOrCreate?: ImageGenerationVersionCreateOrConnectWithoutImageGenInput | ImageGenerationVersionCreateOrConnectWithoutImageGenInput[]
    upsert?: ImageGenerationVersionUpsertWithWhereUniqueWithoutImageGenInput | ImageGenerationVersionUpsertWithWhereUniqueWithoutImageGenInput[]
    createMany?: ImageGenerationVersionCreateManyImageGenInputEnvelope
    set?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
    disconnect?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
    delete?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
    connect?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
    update?: ImageGenerationVersionUpdateWithWhereUniqueWithoutImageGenInput | ImageGenerationVersionUpdateWithWhereUniqueWithoutImageGenInput[]
    updateMany?: ImageGenerationVersionUpdateManyWithWhereWithoutImageGenInput | ImageGenerationVersionUpdateManyWithWhereWithoutImageGenInput[]
    deleteMany?: ImageGenerationVersionScalarWhereInput | ImageGenerationVersionScalarWhereInput[]
  }

  export type ImageGenerationVersionUncheckedUpdateManyWithoutImageGenNestedInput = {
    create?: XOR<ImageGenerationVersionCreateWithoutImageGenInput, ImageGenerationVersionUncheckedCreateWithoutImageGenInput> | ImageGenerationVersionCreateWithoutImageGenInput[] | ImageGenerationVersionUncheckedCreateWithoutImageGenInput[]
    connectOrCreate?: ImageGenerationVersionCreateOrConnectWithoutImageGenInput | ImageGenerationVersionCreateOrConnectWithoutImageGenInput[]
    upsert?: ImageGenerationVersionUpsertWithWhereUniqueWithoutImageGenInput | ImageGenerationVersionUpsertWithWhereUniqueWithoutImageGenInput[]
    createMany?: ImageGenerationVersionCreateManyImageGenInputEnvelope
    set?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
    disconnect?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
    delete?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
    connect?: ImageGenerationVersionWhereUniqueInput | ImageGenerationVersionWhereUniqueInput[]
    update?: ImageGenerationVersionUpdateWithWhereUniqueWithoutImageGenInput | ImageGenerationVersionUpdateWithWhereUniqueWithoutImageGenInput[]
    updateMany?: ImageGenerationVersionUpdateManyWithWhereWithoutImageGenInput | ImageGenerationVersionUpdateManyWithWhereWithoutImageGenInput[]
    deleteMany?: ImageGenerationVersionScalarWhereInput | ImageGenerationVersionScalarWhereInput[]
  }

  export type ImageGenerationVersionCreaterefUrlsInput = {
    set: string[]
  }

  export type ImageGenerationCreateNestedOneWithoutVersionsInput = {
    create?: XOR<ImageGenerationCreateWithoutVersionsInput, ImageGenerationUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ImageGenerationCreateOrConnectWithoutVersionsInput
    connect?: ImageGenerationWhereUniqueInput
  }

  export type ImageGenerationVersionUpdaterefUrlsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ImageGenerationUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<ImageGenerationCreateWithoutVersionsInput, ImageGenerationUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ImageGenerationCreateOrConnectWithoutVersionsInput
    upsert?: ImageGenerationUpsertWithoutVersionsInput
    connect?: ImageGenerationWhereUniqueInput
    update?: XOR<XOR<ImageGenerationUpdateToOneWithWhereWithoutVersionsInput, ImageGenerationUpdateWithoutVersionsInput>, ImageGenerationUncheckedUpdateWithoutVersionsInput>
  }

  export type McpServerVersionCreateNestedManyWithoutMcpServerInput = {
    create?: XOR<McpServerVersionCreateWithoutMcpServerInput, McpServerVersionUncheckedCreateWithoutMcpServerInput> | McpServerVersionCreateWithoutMcpServerInput[] | McpServerVersionUncheckedCreateWithoutMcpServerInput[]
    connectOrCreate?: McpServerVersionCreateOrConnectWithoutMcpServerInput | McpServerVersionCreateOrConnectWithoutMcpServerInput[]
    createMany?: McpServerVersionCreateManyMcpServerInputEnvelope
    connect?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
  }

  export type McpServerVersionUncheckedCreateNestedManyWithoutMcpServerInput = {
    create?: XOR<McpServerVersionCreateWithoutMcpServerInput, McpServerVersionUncheckedCreateWithoutMcpServerInput> | McpServerVersionCreateWithoutMcpServerInput[] | McpServerVersionUncheckedCreateWithoutMcpServerInput[]
    connectOrCreate?: McpServerVersionCreateOrConnectWithoutMcpServerInput | McpServerVersionCreateOrConnectWithoutMcpServerInput[]
    createMany?: McpServerVersionCreateManyMcpServerInputEnvelope
    connect?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
  }

  export type McpServerVersionUpdateManyWithoutMcpServerNestedInput = {
    create?: XOR<McpServerVersionCreateWithoutMcpServerInput, McpServerVersionUncheckedCreateWithoutMcpServerInput> | McpServerVersionCreateWithoutMcpServerInput[] | McpServerVersionUncheckedCreateWithoutMcpServerInput[]
    connectOrCreate?: McpServerVersionCreateOrConnectWithoutMcpServerInput | McpServerVersionCreateOrConnectWithoutMcpServerInput[]
    upsert?: McpServerVersionUpsertWithWhereUniqueWithoutMcpServerInput | McpServerVersionUpsertWithWhereUniqueWithoutMcpServerInput[]
    createMany?: McpServerVersionCreateManyMcpServerInputEnvelope
    set?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
    disconnect?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
    delete?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
    connect?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
    update?: McpServerVersionUpdateWithWhereUniqueWithoutMcpServerInput | McpServerVersionUpdateWithWhereUniqueWithoutMcpServerInput[]
    updateMany?: McpServerVersionUpdateManyWithWhereWithoutMcpServerInput | McpServerVersionUpdateManyWithWhereWithoutMcpServerInput[]
    deleteMany?: McpServerVersionScalarWhereInput | McpServerVersionScalarWhereInput[]
  }

  export type McpServerVersionUncheckedUpdateManyWithoutMcpServerNestedInput = {
    create?: XOR<McpServerVersionCreateWithoutMcpServerInput, McpServerVersionUncheckedCreateWithoutMcpServerInput> | McpServerVersionCreateWithoutMcpServerInput[] | McpServerVersionUncheckedCreateWithoutMcpServerInput[]
    connectOrCreate?: McpServerVersionCreateOrConnectWithoutMcpServerInput | McpServerVersionCreateOrConnectWithoutMcpServerInput[]
    upsert?: McpServerVersionUpsertWithWhereUniqueWithoutMcpServerInput | McpServerVersionUpsertWithWhereUniqueWithoutMcpServerInput[]
    createMany?: McpServerVersionCreateManyMcpServerInputEnvelope
    set?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
    disconnect?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
    delete?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
    connect?: McpServerVersionWhereUniqueInput | McpServerVersionWhereUniqueInput[]
    update?: McpServerVersionUpdateWithWhereUniqueWithoutMcpServerInput | McpServerVersionUpdateWithWhereUniqueWithoutMcpServerInput[]
    updateMany?: McpServerVersionUpdateManyWithWhereWithoutMcpServerInput | McpServerVersionUpdateManyWithWhereWithoutMcpServerInput[]
    deleteMany?: McpServerVersionScalarWhereInput | McpServerVersionScalarWhereInput[]
  }

  export type McpServerCreateNestedOneWithoutVersionsInput = {
    create?: XOR<McpServerCreateWithoutVersionsInput, McpServerUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: McpServerCreateOrConnectWithoutVersionsInput
    connect?: McpServerWhereUniqueInput
  }

  export type McpServerUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<McpServerCreateWithoutVersionsInput, McpServerUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: McpServerCreateOrConnectWithoutVersionsInput
    upsert?: McpServerUpsertWithoutVersionsInput
    connect?: McpServerWhereUniqueInput
    update?: XOR<XOR<McpServerUpdateToOneWithWhereWithoutVersionsInput, McpServerUpdateWithoutVersionsInput>, McpServerUncheckedUpdateWithoutVersionsInput>
  }

  export type ChatSessionCreateNestedOneWithoutTasksInput = {
    create?: XOR<ChatSessionCreateWithoutTasksInput, ChatSessionUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutTasksInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type TaskEventCreateNestedManyWithoutTaskInput = {
    create?: XOR<TaskEventCreateWithoutTaskInput, TaskEventUncheckedCreateWithoutTaskInput> | TaskEventCreateWithoutTaskInput[] | TaskEventUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskEventCreateOrConnectWithoutTaskInput | TaskEventCreateOrConnectWithoutTaskInput[]
    createMany?: TaskEventCreateManyTaskInputEnvelope
    connect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
  }

  export type TaskEventUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<TaskEventCreateWithoutTaskInput, TaskEventUncheckedCreateWithoutTaskInput> | TaskEventCreateWithoutTaskInput[] | TaskEventUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskEventCreateOrConnectWithoutTaskInput | TaskEventCreateOrConnectWithoutTaskInput[]
    createMany?: TaskEventCreateManyTaskInputEnvelope
    connect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
  }

  export type ChatSessionUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<ChatSessionCreateWithoutTasksInput, ChatSessionUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutTasksInput
    upsert?: ChatSessionUpsertWithoutTasksInput
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutTasksInput, ChatSessionUpdateWithoutTasksInput>, ChatSessionUncheckedUpdateWithoutTasksInput>
  }

  export type TaskEventUpdateManyWithoutTaskNestedInput = {
    create?: XOR<TaskEventCreateWithoutTaskInput, TaskEventUncheckedCreateWithoutTaskInput> | TaskEventCreateWithoutTaskInput[] | TaskEventUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskEventCreateOrConnectWithoutTaskInput | TaskEventCreateOrConnectWithoutTaskInput[]
    upsert?: TaskEventUpsertWithWhereUniqueWithoutTaskInput | TaskEventUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: TaskEventCreateManyTaskInputEnvelope
    set?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    disconnect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    delete?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    connect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    update?: TaskEventUpdateWithWhereUniqueWithoutTaskInput | TaskEventUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: TaskEventUpdateManyWithWhereWithoutTaskInput | TaskEventUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: TaskEventScalarWhereInput | TaskEventScalarWhereInput[]
  }

  export type TaskEventUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<TaskEventCreateWithoutTaskInput, TaskEventUncheckedCreateWithoutTaskInput> | TaskEventCreateWithoutTaskInput[] | TaskEventUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskEventCreateOrConnectWithoutTaskInput | TaskEventCreateOrConnectWithoutTaskInput[]
    upsert?: TaskEventUpsertWithWhereUniqueWithoutTaskInput | TaskEventUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: TaskEventCreateManyTaskInputEnvelope
    set?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    disconnect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    delete?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    connect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    update?: TaskEventUpdateWithWhereUniqueWithoutTaskInput | TaskEventUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: TaskEventUpdateManyWithWhereWithoutTaskInput | TaskEventUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: TaskEventScalarWhereInput | TaskEventScalarWhereInput[]
  }

  export type TaskCreateNestedOneWithoutEventsInput = {
    create?: XOR<TaskCreateWithoutEventsInput, TaskUncheckedCreateWithoutEventsInput>
    connectOrCreate?: TaskCreateOrConnectWithoutEventsInput
    connect?: TaskWhereUniqueInput
  }

  export type TaskUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<TaskCreateWithoutEventsInput, TaskUncheckedCreateWithoutEventsInput>
    connectOrCreate?: TaskCreateOrConnectWithoutEventsInput
    upsert?: TaskUpsertWithoutEventsInput
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutEventsInput, TaskUpdateWithoutEventsInput>, TaskUncheckedUpdateWithoutEventsInput>
  }

  export type ApiVersionCreateNestedManyWithoutApiInput = {
    create?: XOR<ApiVersionCreateWithoutApiInput, ApiVersionUncheckedCreateWithoutApiInput> | ApiVersionCreateWithoutApiInput[] | ApiVersionUncheckedCreateWithoutApiInput[]
    connectOrCreate?: ApiVersionCreateOrConnectWithoutApiInput | ApiVersionCreateOrConnectWithoutApiInput[]
    createMany?: ApiVersionCreateManyApiInputEnvelope
    connect?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
  }

  export type ApiVersionUncheckedCreateNestedManyWithoutApiInput = {
    create?: XOR<ApiVersionCreateWithoutApiInput, ApiVersionUncheckedCreateWithoutApiInput> | ApiVersionCreateWithoutApiInput[] | ApiVersionUncheckedCreateWithoutApiInput[]
    connectOrCreate?: ApiVersionCreateOrConnectWithoutApiInput | ApiVersionCreateOrConnectWithoutApiInput[]
    createMany?: ApiVersionCreateManyApiInputEnvelope
    connect?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
  }

  export type ApiVersionUpdateManyWithoutApiNestedInput = {
    create?: XOR<ApiVersionCreateWithoutApiInput, ApiVersionUncheckedCreateWithoutApiInput> | ApiVersionCreateWithoutApiInput[] | ApiVersionUncheckedCreateWithoutApiInput[]
    connectOrCreate?: ApiVersionCreateOrConnectWithoutApiInput | ApiVersionCreateOrConnectWithoutApiInput[]
    upsert?: ApiVersionUpsertWithWhereUniqueWithoutApiInput | ApiVersionUpsertWithWhereUniqueWithoutApiInput[]
    createMany?: ApiVersionCreateManyApiInputEnvelope
    set?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
    disconnect?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
    delete?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
    connect?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
    update?: ApiVersionUpdateWithWhereUniqueWithoutApiInput | ApiVersionUpdateWithWhereUniqueWithoutApiInput[]
    updateMany?: ApiVersionUpdateManyWithWhereWithoutApiInput | ApiVersionUpdateManyWithWhereWithoutApiInput[]
    deleteMany?: ApiVersionScalarWhereInput | ApiVersionScalarWhereInput[]
  }

  export type ApiVersionUncheckedUpdateManyWithoutApiNestedInput = {
    create?: XOR<ApiVersionCreateWithoutApiInput, ApiVersionUncheckedCreateWithoutApiInput> | ApiVersionCreateWithoutApiInput[] | ApiVersionUncheckedCreateWithoutApiInput[]
    connectOrCreate?: ApiVersionCreateOrConnectWithoutApiInput | ApiVersionCreateOrConnectWithoutApiInput[]
    upsert?: ApiVersionUpsertWithWhereUniqueWithoutApiInput | ApiVersionUpsertWithWhereUniqueWithoutApiInput[]
    createMany?: ApiVersionCreateManyApiInputEnvelope
    set?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
    disconnect?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
    delete?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
    connect?: ApiVersionWhereUniqueInput | ApiVersionWhereUniqueInput[]
    update?: ApiVersionUpdateWithWhereUniqueWithoutApiInput | ApiVersionUpdateWithWhereUniqueWithoutApiInput[]
    updateMany?: ApiVersionUpdateManyWithWhereWithoutApiInput | ApiVersionUpdateManyWithWhereWithoutApiInput[]
    deleteMany?: ApiVersionScalarWhereInput | ApiVersionScalarWhereInput[]
  }

  export type ApiCreateNestedOneWithoutVersionsInput = {
    create?: XOR<ApiCreateWithoutVersionsInput, ApiUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ApiCreateOrConnectWithoutVersionsInput
    connect?: ApiWhereUniqueInput
  }

  export type ApiUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<ApiCreateWithoutVersionsInput, ApiUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ApiCreateOrConnectWithoutVersionsInput
    upsert?: ApiUpsertWithoutVersionsInput
    connect?: ApiWhereUniqueInput
    update?: XOR<XOR<ApiUpdateToOneWithWhereWithoutVersionsInput, ApiUpdateWithoutVersionsInput>, ApiUncheckedUpdateWithoutVersionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SkillVersionCreateWithoutSkillInput = {
    id?: string
    version: number
    description: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SkillVersionUncheckedCreateWithoutSkillInput = {
    id?: string
    version: number
    description: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SkillVersionCreateOrConnectWithoutSkillInput = {
    where: SkillVersionWhereUniqueInput
    create: XOR<SkillVersionCreateWithoutSkillInput, SkillVersionUncheckedCreateWithoutSkillInput>
  }

  export type SkillVersionCreateManySkillInputEnvelope = {
    data: SkillVersionCreateManySkillInput | SkillVersionCreateManySkillInput[]
    skipDuplicates?: boolean
  }

  export type SkillVersionUpsertWithWhereUniqueWithoutSkillInput = {
    where: SkillVersionWhereUniqueInput
    update: XOR<SkillVersionUpdateWithoutSkillInput, SkillVersionUncheckedUpdateWithoutSkillInput>
    create: XOR<SkillVersionCreateWithoutSkillInput, SkillVersionUncheckedCreateWithoutSkillInput>
  }

  export type SkillVersionUpdateWithWhereUniqueWithoutSkillInput = {
    where: SkillVersionWhereUniqueInput
    data: XOR<SkillVersionUpdateWithoutSkillInput, SkillVersionUncheckedUpdateWithoutSkillInput>
  }

  export type SkillVersionUpdateManyWithWhereWithoutSkillInput = {
    where: SkillVersionScalarWhereInput
    data: XOR<SkillVersionUpdateManyMutationInput, SkillVersionUncheckedUpdateManyWithoutSkillInput>
  }

  export type SkillVersionScalarWhereInput = {
    AND?: SkillVersionScalarWhereInput | SkillVersionScalarWhereInput[]
    OR?: SkillVersionScalarWhereInput[]
    NOT?: SkillVersionScalarWhereInput | SkillVersionScalarWhereInput[]
    id?: StringFilter<"SkillVersion"> | string
    skillId?: StringFilter<"SkillVersion"> | string
    version?: IntFilter<"SkillVersion"> | number
    description?: StringFilter<"SkillVersion"> | string
    content?: StringFilter<"SkillVersion"> | string
    metadata?: JsonNullableFilter<"SkillVersion">
    createdAt?: DateTimeFilter<"SkillVersion"> | Date | string
  }

  export type SkillCreateWithoutVersionsInput = {
    id?: string
    name: string
    tags?: SkillCreatetagsInput | string[]
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillUncheckedCreateWithoutVersionsInput = {
    id?: string
    name: string
    tags?: SkillCreatetagsInput | string[]
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillCreateOrConnectWithoutVersionsInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutVersionsInput, SkillUncheckedCreateWithoutVersionsInput>
  }

  export type SkillUpsertWithoutVersionsInput = {
    update: XOR<SkillUpdateWithoutVersionsInput, SkillUncheckedUpdateWithoutVersionsInput>
    create: XOR<SkillCreateWithoutVersionsInput, SkillUncheckedCreateWithoutVersionsInput>
    where?: SkillWhereInput
  }

  export type SkillUpdateToOneWithWhereWithoutVersionsInput = {
    where?: SkillWhereInput
    data: XOR<SkillUpdateWithoutVersionsInput, SkillUncheckedUpdateWithoutVersionsInput>
  }

  export type SkillUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tags?: SkillUpdatetagsInput | string[]
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tags?: SkillUpdatetagsInput | string[]
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionCreateWithoutUserInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
    keyResources?: KeyResourceCreateNestedManyWithoutSessionInput
    tasks?: TaskCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
    keyResources?: KeyResourceUncheckedCreateNestedManyWithoutSessionInput
    tasks?: TaskUncheckedCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionCreateManyUserInputEnvelope = {
    data: ChatSessionCreateManyUserInput | ChatSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    update: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    data: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
  }

  export type ChatSessionUpdateManyWithWhereWithoutUserInput = {
    where: ChatSessionScalarWhereInput
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatSessionScalarWhereInput = {
    AND?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    OR?: ChatSessionScalarWhereInput[]
    NOT?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    title?: StringNullableFilter<"ChatSession"> | string | null
    userId?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name: string
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name: string
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type ChatMessageCreateWithoutSessionInput = {
    id?: string
    role: string
    content?: string | null
    images?: ChatMessageCreateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: string | null
    hidden?: boolean
    createdAt?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutSessionInput = {
    id?: string
    role: string
    content?: string | null
    images?: ChatMessageCreateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: string | null
    hidden?: boolean
    createdAt?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput>
  }

  export type ChatMessageCreateManySessionInputEnvelope = {
    data: ChatMessageCreateManySessionInput | ChatMessageCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type KeyResourceCreateWithoutSessionInput = {
    id?: string
    key: string
    mediaType: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: KeyResourceVersionCreateNestedManyWithoutKeyResourceInput
  }

  export type KeyResourceUncheckedCreateWithoutSessionInput = {
    id?: string
    key: string
    mediaType: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: KeyResourceVersionUncheckedCreateNestedManyWithoutKeyResourceInput
  }

  export type KeyResourceCreateOrConnectWithoutSessionInput = {
    where: KeyResourceWhereUniqueInput
    create: XOR<KeyResourceCreateWithoutSessionInput, KeyResourceUncheckedCreateWithoutSessionInput>
  }

  export type KeyResourceCreateManySessionInputEnvelope = {
    data: KeyResourceCreateManySessionInput | KeyResourceCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutSessionInput = {
    id?: string
    status?: string
    input: JsonNullValueInput | InputJsonValue
    reply?: string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: TaskEventCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutSessionInput = {
    id?: string
    status?: string
    input: JsonNullValueInput | InputJsonValue
    reply?: string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: TaskEventUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutSessionInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutSessionInput, TaskUncheckedCreateWithoutSessionInput>
  }

  export type TaskCreateManySessionInputEnvelope = {
    data: TaskCreateManySessionInput | TaskCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type ImageGenerationCreateWithoutSessionInput = {
    id?: string
    key: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: ImageGenerationVersionCreateNestedManyWithoutImageGenInput
  }

  export type ImageGenerationUncheckedCreateWithoutSessionInput = {
    id?: string
    key: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: ImageGenerationVersionUncheckedCreateNestedManyWithoutImageGenInput
  }

  export type ImageGenerationCreateOrConnectWithoutSessionInput = {
    where: ImageGenerationWhereUniqueInput
    create: XOR<ImageGenerationCreateWithoutSessionInput, ImageGenerationUncheckedCreateWithoutSessionInput>
  }

  export type ImageGenerationCreateManySessionInputEnvelope = {
    data: ImageGenerationCreateManySessionInput | ImageGenerationCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutSessionInput, ChatMessageUncheckedUpdateWithoutSessionInput>
    create: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutSessionInput, ChatMessageUncheckedUpdateWithoutSessionInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutSessionInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutSessionInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringNullableFilter<"ChatMessage"> | string | null
    images?: StringNullableListFilter<"ChatMessage">
    toolCalls?: JsonNullableFilter<"ChatMessage">
    toolCallId?: StringNullableFilter<"ChatMessage"> | string | null
    hidden?: BoolFilter<"ChatMessage"> | boolean
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type KeyResourceUpsertWithWhereUniqueWithoutSessionInput = {
    where: KeyResourceWhereUniqueInput
    update: XOR<KeyResourceUpdateWithoutSessionInput, KeyResourceUncheckedUpdateWithoutSessionInput>
    create: XOR<KeyResourceCreateWithoutSessionInput, KeyResourceUncheckedCreateWithoutSessionInput>
  }

  export type KeyResourceUpdateWithWhereUniqueWithoutSessionInput = {
    where: KeyResourceWhereUniqueInput
    data: XOR<KeyResourceUpdateWithoutSessionInput, KeyResourceUncheckedUpdateWithoutSessionInput>
  }

  export type KeyResourceUpdateManyWithWhereWithoutSessionInput = {
    where: KeyResourceScalarWhereInput
    data: XOR<KeyResourceUpdateManyMutationInput, KeyResourceUncheckedUpdateManyWithoutSessionInput>
  }

  export type KeyResourceScalarWhereInput = {
    AND?: KeyResourceScalarWhereInput | KeyResourceScalarWhereInput[]
    OR?: KeyResourceScalarWhereInput[]
    NOT?: KeyResourceScalarWhereInput | KeyResourceScalarWhereInput[]
    id?: StringFilter<"KeyResource"> | string
    sessionId?: StringFilter<"KeyResource"> | string
    key?: StringFilter<"KeyResource"> | string
    mediaType?: StringFilter<"KeyResource"> | string
    currentVersion?: IntFilter<"KeyResource"> | number
    createdAt?: DateTimeFilter<"KeyResource"> | Date | string
    updatedAt?: DateTimeFilter<"KeyResource"> | Date | string
  }

  export type TaskUpsertWithWhereUniqueWithoutSessionInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutSessionInput, TaskUncheckedUpdateWithoutSessionInput>
    create: XOR<TaskCreateWithoutSessionInput, TaskUncheckedCreateWithoutSessionInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutSessionInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutSessionInput, TaskUncheckedUpdateWithoutSessionInput>
  }

  export type TaskUpdateManyWithWhereWithoutSessionInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutSessionInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    sessionId?: StringFilter<"Task"> | string
    status?: StringFilter<"Task"> | string
    input?: JsonFilter<"Task">
    reply?: StringNullableFilter<"Task"> | string | null
    error?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
  }

  export type ImageGenerationUpsertWithWhereUniqueWithoutSessionInput = {
    where: ImageGenerationWhereUniqueInput
    update: XOR<ImageGenerationUpdateWithoutSessionInput, ImageGenerationUncheckedUpdateWithoutSessionInput>
    create: XOR<ImageGenerationCreateWithoutSessionInput, ImageGenerationUncheckedCreateWithoutSessionInput>
  }

  export type ImageGenerationUpdateWithWhereUniqueWithoutSessionInput = {
    where: ImageGenerationWhereUniqueInput
    data: XOR<ImageGenerationUpdateWithoutSessionInput, ImageGenerationUncheckedUpdateWithoutSessionInput>
  }

  export type ImageGenerationUpdateManyWithWhereWithoutSessionInput = {
    where: ImageGenerationScalarWhereInput
    data: XOR<ImageGenerationUpdateManyMutationInput, ImageGenerationUncheckedUpdateManyWithoutSessionInput>
  }

  export type ImageGenerationScalarWhereInput = {
    AND?: ImageGenerationScalarWhereInput | ImageGenerationScalarWhereInput[]
    OR?: ImageGenerationScalarWhereInput[]
    NOT?: ImageGenerationScalarWhereInput | ImageGenerationScalarWhereInput[]
    id?: StringFilter<"ImageGeneration"> | string
    sessionId?: StringFilter<"ImageGeneration"> | string
    key?: StringFilter<"ImageGeneration"> | string
    currentVersion?: IntFilter<"ImageGeneration"> | number
    createdAt?: DateTimeFilter<"ImageGeneration"> | Date | string
    updatedAt?: DateTimeFilter<"ImageGeneration"> | Date | string
  }

  export type ChatSessionCreateWithoutMessagesInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    keyResources?: KeyResourceCreateNestedManyWithoutSessionInput
    tasks?: TaskCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutMessagesInput = {
    id?: string
    title?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    keyResources?: KeyResourceUncheckedCreateNestedManyWithoutSessionInput
    tasks?: TaskUncheckedCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutMessagesInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
  }

  export type ChatSessionUpsertWithoutMessagesInput = {
    update: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatSessionUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    keyResources?: KeyResourceUpdateManyWithoutSessionNestedInput
    tasks?: TaskUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    keyResources?: KeyResourceUncheckedUpdateManyWithoutSessionNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionCreateWithoutKeyResourcesInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
    tasks?: TaskCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutKeyResourcesInput = {
    id?: string
    title?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
    tasks?: TaskUncheckedCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutKeyResourcesInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutKeyResourcesInput, ChatSessionUncheckedCreateWithoutKeyResourcesInput>
  }

  export type KeyResourceVersionCreateWithoutKeyResourceInput = {
    id?: string
    version: number
    title?: string | null
    url?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: string | null
    refUrls?: KeyResourceVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type KeyResourceVersionUncheckedCreateWithoutKeyResourceInput = {
    id?: string
    version: number
    title?: string | null
    url?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: string | null
    refUrls?: KeyResourceVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type KeyResourceVersionCreateOrConnectWithoutKeyResourceInput = {
    where: KeyResourceVersionWhereUniqueInput
    create: XOR<KeyResourceVersionCreateWithoutKeyResourceInput, KeyResourceVersionUncheckedCreateWithoutKeyResourceInput>
  }

  export type KeyResourceVersionCreateManyKeyResourceInputEnvelope = {
    data: KeyResourceVersionCreateManyKeyResourceInput | KeyResourceVersionCreateManyKeyResourceInput[]
    skipDuplicates?: boolean
  }

  export type ChatSessionUpsertWithoutKeyResourcesInput = {
    update: XOR<ChatSessionUpdateWithoutKeyResourcesInput, ChatSessionUncheckedUpdateWithoutKeyResourcesInput>
    create: XOR<ChatSessionCreateWithoutKeyResourcesInput, ChatSessionUncheckedCreateWithoutKeyResourcesInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutKeyResourcesInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutKeyResourcesInput, ChatSessionUncheckedUpdateWithoutKeyResourcesInput>
  }

  export type ChatSessionUpdateWithoutKeyResourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
    tasks?: TaskUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutKeyResourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type KeyResourceVersionUpsertWithWhereUniqueWithoutKeyResourceInput = {
    where: KeyResourceVersionWhereUniqueInput
    update: XOR<KeyResourceVersionUpdateWithoutKeyResourceInput, KeyResourceVersionUncheckedUpdateWithoutKeyResourceInput>
    create: XOR<KeyResourceVersionCreateWithoutKeyResourceInput, KeyResourceVersionUncheckedCreateWithoutKeyResourceInput>
  }

  export type KeyResourceVersionUpdateWithWhereUniqueWithoutKeyResourceInput = {
    where: KeyResourceVersionWhereUniqueInput
    data: XOR<KeyResourceVersionUpdateWithoutKeyResourceInput, KeyResourceVersionUncheckedUpdateWithoutKeyResourceInput>
  }

  export type KeyResourceVersionUpdateManyWithWhereWithoutKeyResourceInput = {
    where: KeyResourceVersionScalarWhereInput
    data: XOR<KeyResourceVersionUpdateManyMutationInput, KeyResourceVersionUncheckedUpdateManyWithoutKeyResourceInput>
  }

  export type KeyResourceVersionScalarWhereInput = {
    AND?: KeyResourceVersionScalarWhereInput | KeyResourceVersionScalarWhereInput[]
    OR?: KeyResourceVersionScalarWhereInput[]
    NOT?: KeyResourceVersionScalarWhereInput | KeyResourceVersionScalarWhereInput[]
    id?: StringFilter<"KeyResourceVersion"> | string
    keyResourceId?: StringFilter<"KeyResourceVersion"> | string
    version?: IntFilter<"KeyResourceVersion"> | number
    title?: StringNullableFilter<"KeyResourceVersion"> | string | null
    url?: StringNullableFilter<"KeyResourceVersion"> | string | null
    data?: JsonNullableFilter<"KeyResourceVersion">
    prompt?: StringNullableFilter<"KeyResourceVersion"> | string | null
    refUrls?: StringNullableListFilter<"KeyResourceVersion">
    createdAt?: DateTimeFilter<"KeyResourceVersion"> | Date | string
  }

  export type KeyResourceCreateWithoutVersionsInput = {
    id?: string
    key: string
    mediaType: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutKeyResourcesInput
  }

  export type KeyResourceUncheckedCreateWithoutVersionsInput = {
    id?: string
    sessionId: string
    key: string
    mediaType: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KeyResourceCreateOrConnectWithoutVersionsInput = {
    where: KeyResourceWhereUniqueInput
    create: XOR<KeyResourceCreateWithoutVersionsInput, KeyResourceUncheckedCreateWithoutVersionsInput>
  }

  export type KeyResourceUpsertWithoutVersionsInput = {
    update: XOR<KeyResourceUpdateWithoutVersionsInput, KeyResourceUncheckedUpdateWithoutVersionsInput>
    create: XOR<KeyResourceCreateWithoutVersionsInput, KeyResourceUncheckedCreateWithoutVersionsInput>
    where?: KeyResourceWhereInput
  }

  export type KeyResourceUpdateToOneWithWhereWithoutVersionsInput = {
    where?: KeyResourceWhereInput
    data: XOR<KeyResourceUpdateWithoutVersionsInput, KeyResourceUncheckedUpdateWithoutVersionsInput>
  }

  export type KeyResourceUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutKeyResourcesNestedInput
  }

  export type KeyResourceUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionCreateWithoutImageGenerationsInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
    keyResources?: KeyResourceCreateNestedManyWithoutSessionInput
    tasks?: TaskCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutImageGenerationsInput = {
    id?: string
    title?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
    keyResources?: KeyResourceUncheckedCreateNestedManyWithoutSessionInput
    tasks?: TaskUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutImageGenerationsInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutImageGenerationsInput, ChatSessionUncheckedCreateWithoutImageGenerationsInput>
  }

  export type ImageGenerationVersionCreateWithoutImageGenInput = {
    id?: string
    version: number
    prompt: string
    imageUrl?: string | null
    refUrls?: ImageGenerationVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type ImageGenerationVersionUncheckedCreateWithoutImageGenInput = {
    id?: string
    version: number
    prompt: string
    imageUrl?: string | null
    refUrls?: ImageGenerationVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type ImageGenerationVersionCreateOrConnectWithoutImageGenInput = {
    where: ImageGenerationVersionWhereUniqueInput
    create: XOR<ImageGenerationVersionCreateWithoutImageGenInput, ImageGenerationVersionUncheckedCreateWithoutImageGenInput>
  }

  export type ImageGenerationVersionCreateManyImageGenInputEnvelope = {
    data: ImageGenerationVersionCreateManyImageGenInput | ImageGenerationVersionCreateManyImageGenInput[]
    skipDuplicates?: boolean
  }

  export type ChatSessionUpsertWithoutImageGenerationsInput = {
    update: XOR<ChatSessionUpdateWithoutImageGenerationsInput, ChatSessionUncheckedUpdateWithoutImageGenerationsInput>
    create: XOR<ChatSessionCreateWithoutImageGenerationsInput, ChatSessionUncheckedCreateWithoutImageGenerationsInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutImageGenerationsInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutImageGenerationsInput, ChatSessionUncheckedUpdateWithoutImageGenerationsInput>
  }

  export type ChatSessionUpdateWithoutImageGenerationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
    keyResources?: KeyResourceUpdateManyWithoutSessionNestedInput
    tasks?: TaskUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutImageGenerationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
    keyResources?: KeyResourceUncheckedUpdateManyWithoutSessionNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ImageGenerationVersionUpsertWithWhereUniqueWithoutImageGenInput = {
    where: ImageGenerationVersionWhereUniqueInput
    update: XOR<ImageGenerationVersionUpdateWithoutImageGenInput, ImageGenerationVersionUncheckedUpdateWithoutImageGenInput>
    create: XOR<ImageGenerationVersionCreateWithoutImageGenInput, ImageGenerationVersionUncheckedCreateWithoutImageGenInput>
  }

  export type ImageGenerationVersionUpdateWithWhereUniqueWithoutImageGenInput = {
    where: ImageGenerationVersionWhereUniqueInput
    data: XOR<ImageGenerationVersionUpdateWithoutImageGenInput, ImageGenerationVersionUncheckedUpdateWithoutImageGenInput>
  }

  export type ImageGenerationVersionUpdateManyWithWhereWithoutImageGenInput = {
    where: ImageGenerationVersionScalarWhereInput
    data: XOR<ImageGenerationVersionUpdateManyMutationInput, ImageGenerationVersionUncheckedUpdateManyWithoutImageGenInput>
  }

  export type ImageGenerationVersionScalarWhereInput = {
    AND?: ImageGenerationVersionScalarWhereInput | ImageGenerationVersionScalarWhereInput[]
    OR?: ImageGenerationVersionScalarWhereInput[]
    NOT?: ImageGenerationVersionScalarWhereInput | ImageGenerationVersionScalarWhereInput[]
    id?: StringFilter<"ImageGenerationVersion"> | string
    imageGenId?: StringFilter<"ImageGenerationVersion"> | string
    version?: IntFilter<"ImageGenerationVersion"> | number
    prompt?: StringFilter<"ImageGenerationVersion"> | string
    imageUrl?: StringNullableFilter<"ImageGenerationVersion"> | string | null
    refUrls?: StringNullableListFilter<"ImageGenerationVersion">
    createdAt?: DateTimeFilter<"ImageGenerationVersion"> | Date | string
  }

  export type ImageGenerationCreateWithoutVersionsInput = {
    id?: string
    key: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutImageGenerationsInput
  }

  export type ImageGenerationUncheckedCreateWithoutVersionsInput = {
    id?: string
    sessionId: string
    key: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageGenerationCreateOrConnectWithoutVersionsInput = {
    where: ImageGenerationWhereUniqueInput
    create: XOR<ImageGenerationCreateWithoutVersionsInput, ImageGenerationUncheckedCreateWithoutVersionsInput>
  }

  export type ImageGenerationUpsertWithoutVersionsInput = {
    update: XOR<ImageGenerationUpdateWithoutVersionsInput, ImageGenerationUncheckedUpdateWithoutVersionsInput>
    create: XOR<ImageGenerationCreateWithoutVersionsInput, ImageGenerationUncheckedCreateWithoutVersionsInput>
    where?: ImageGenerationWhereInput
  }

  export type ImageGenerationUpdateToOneWithWhereWithoutVersionsInput = {
    where?: ImageGenerationWhereInput
    data: XOR<ImageGenerationUpdateWithoutVersionsInput, ImageGenerationUncheckedUpdateWithoutVersionsInput>
  }

  export type ImageGenerationUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutImageGenerationsNestedInput
  }

  export type ImageGenerationUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerVersionCreateWithoutMcpServerInput = {
    id?: string
    version: number
    description?: string | null
    code: string
    createdAt?: Date | string
  }

  export type McpServerVersionUncheckedCreateWithoutMcpServerInput = {
    id?: string
    version: number
    description?: string | null
    code: string
    createdAt?: Date | string
  }

  export type McpServerVersionCreateOrConnectWithoutMcpServerInput = {
    where: McpServerVersionWhereUniqueInput
    create: XOR<McpServerVersionCreateWithoutMcpServerInput, McpServerVersionUncheckedCreateWithoutMcpServerInput>
  }

  export type McpServerVersionCreateManyMcpServerInputEnvelope = {
    data: McpServerVersionCreateManyMcpServerInput | McpServerVersionCreateManyMcpServerInput[]
    skipDuplicates?: boolean
  }

  export type McpServerVersionUpsertWithWhereUniqueWithoutMcpServerInput = {
    where: McpServerVersionWhereUniqueInput
    update: XOR<McpServerVersionUpdateWithoutMcpServerInput, McpServerVersionUncheckedUpdateWithoutMcpServerInput>
    create: XOR<McpServerVersionCreateWithoutMcpServerInput, McpServerVersionUncheckedCreateWithoutMcpServerInput>
  }

  export type McpServerVersionUpdateWithWhereUniqueWithoutMcpServerInput = {
    where: McpServerVersionWhereUniqueInput
    data: XOR<McpServerVersionUpdateWithoutMcpServerInput, McpServerVersionUncheckedUpdateWithoutMcpServerInput>
  }

  export type McpServerVersionUpdateManyWithWhereWithoutMcpServerInput = {
    where: McpServerVersionScalarWhereInput
    data: XOR<McpServerVersionUpdateManyMutationInput, McpServerVersionUncheckedUpdateManyWithoutMcpServerInput>
  }

  export type McpServerVersionScalarWhereInput = {
    AND?: McpServerVersionScalarWhereInput | McpServerVersionScalarWhereInput[]
    OR?: McpServerVersionScalarWhereInput[]
    NOT?: McpServerVersionScalarWhereInput | McpServerVersionScalarWhereInput[]
    id?: StringFilter<"McpServerVersion"> | string
    mcpServerId?: StringFilter<"McpServerVersion"> | string
    version?: IntFilter<"McpServerVersion"> | number
    description?: StringNullableFilter<"McpServerVersion"> | string | null
    code?: StringFilter<"McpServerVersion"> | string
    createdAt?: DateTimeFilter<"McpServerVersion"> | Date | string
  }

  export type McpServerCreateWithoutVersionsInput = {
    id?: string
    name: string
    enabled?: boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type McpServerUncheckedCreateWithoutVersionsInput = {
    id?: string
    name: string
    enabled?: boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type McpServerCreateOrConnectWithoutVersionsInput = {
    where: McpServerWhereUniqueInput
    create: XOR<McpServerCreateWithoutVersionsInput, McpServerUncheckedCreateWithoutVersionsInput>
  }

  export type McpServerUpsertWithoutVersionsInput = {
    update: XOR<McpServerUpdateWithoutVersionsInput, McpServerUncheckedUpdateWithoutVersionsInput>
    create: XOR<McpServerCreateWithoutVersionsInput, McpServerUncheckedCreateWithoutVersionsInput>
    where?: McpServerWhereInput
  }

  export type McpServerUpdateToOneWithWhereWithoutVersionsInput = {
    where?: McpServerWhereInput
    data: XOR<McpServerUpdateWithoutVersionsInput, McpServerUncheckedUpdateWithoutVersionsInput>
  }

  export type McpServerUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    config?: NullableJsonNullValueInput | InputJsonValue
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionCreateWithoutTasksInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
    keyResources?: KeyResourceCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutTasksInput = {
    id?: string
    title?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
    keyResources?: KeyResourceUncheckedCreateNestedManyWithoutSessionInput
    imageGenerations?: ImageGenerationUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutTasksInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutTasksInput, ChatSessionUncheckedCreateWithoutTasksInput>
  }

  export type TaskEventCreateWithoutTaskInput = {
    type: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TaskEventUncheckedCreateWithoutTaskInput = {
    id?: number
    type: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TaskEventCreateOrConnectWithoutTaskInput = {
    where: TaskEventWhereUniqueInput
    create: XOR<TaskEventCreateWithoutTaskInput, TaskEventUncheckedCreateWithoutTaskInput>
  }

  export type TaskEventCreateManyTaskInputEnvelope = {
    data: TaskEventCreateManyTaskInput | TaskEventCreateManyTaskInput[]
    skipDuplicates?: boolean
  }

  export type ChatSessionUpsertWithoutTasksInput = {
    update: XOR<ChatSessionUpdateWithoutTasksInput, ChatSessionUncheckedUpdateWithoutTasksInput>
    create: XOR<ChatSessionCreateWithoutTasksInput, ChatSessionUncheckedCreateWithoutTasksInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutTasksInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutTasksInput, ChatSessionUncheckedUpdateWithoutTasksInput>
  }

  export type ChatSessionUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
    keyResources?: KeyResourceUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
    keyResources?: KeyResourceUncheckedUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type TaskEventUpsertWithWhereUniqueWithoutTaskInput = {
    where: TaskEventWhereUniqueInput
    update: XOR<TaskEventUpdateWithoutTaskInput, TaskEventUncheckedUpdateWithoutTaskInput>
    create: XOR<TaskEventCreateWithoutTaskInput, TaskEventUncheckedCreateWithoutTaskInput>
  }

  export type TaskEventUpdateWithWhereUniqueWithoutTaskInput = {
    where: TaskEventWhereUniqueInput
    data: XOR<TaskEventUpdateWithoutTaskInput, TaskEventUncheckedUpdateWithoutTaskInput>
  }

  export type TaskEventUpdateManyWithWhereWithoutTaskInput = {
    where: TaskEventScalarWhereInput
    data: XOR<TaskEventUpdateManyMutationInput, TaskEventUncheckedUpdateManyWithoutTaskInput>
  }

  export type TaskEventScalarWhereInput = {
    AND?: TaskEventScalarWhereInput | TaskEventScalarWhereInput[]
    OR?: TaskEventScalarWhereInput[]
    NOT?: TaskEventScalarWhereInput | TaskEventScalarWhereInput[]
    id?: IntFilter<"TaskEvent"> | number
    taskId?: StringFilter<"TaskEvent"> | string
    type?: StringFilter<"TaskEvent"> | string
    data?: JsonFilter<"TaskEvent">
    createdAt?: DateTimeFilter<"TaskEvent"> | Date | string
  }

  export type TaskCreateWithoutEventsInput = {
    id?: string
    status?: string
    input: JsonNullValueInput | InputJsonValue
    reply?: string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutEventsInput = {
    id?: string
    sessionId: string
    status?: string
    input: JsonNullValueInput | InputJsonValue
    reply?: string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutEventsInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutEventsInput, TaskUncheckedCreateWithoutEventsInput>
  }

  export type TaskUpsertWithoutEventsInput = {
    update: XOR<TaskUpdateWithoutEventsInput, TaskUncheckedUpdateWithoutEventsInput>
    create: XOR<TaskCreateWithoutEventsInput, TaskUncheckedCreateWithoutEventsInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutEventsInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutEventsInput, TaskUncheckedUpdateWithoutEventsInput>
  }

  export type TaskUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiVersionCreateWithoutApiInput = {
    id?: string
    version: number
    description?: string | null
    schema: JsonNullValueInput | InputJsonValue
    operations: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ApiVersionUncheckedCreateWithoutApiInput = {
    id?: string
    version: number
    description?: string | null
    schema: JsonNullValueInput | InputJsonValue
    operations: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ApiVersionCreateOrConnectWithoutApiInput = {
    where: ApiVersionWhereUniqueInput
    create: XOR<ApiVersionCreateWithoutApiInput, ApiVersionUncheckedCreateWithoutApiInput>
  }

  export type ApiVersionCreateManyApiInputEnvelope = {
    data: ApiVersionCreateManyApiInput | ApiVersionCreateManyApiInput[]
    skipDuplicates?: boolean
  }

  export type ApiVersionUpsertWithWhereUniqueWithoutApiInput = {
    where: ApiVersionWhereUniqueInput
    update: XOR<ApiVersionUpdateWithoutApiInput, ApiVersionUncheckedUpdateWithoutApiInput>
    create: XOR<ApiVersionCreateWithoutApiInput, ApiVersionUncheckedCreateWithoutApiInput>
  }

  export type ApiVersionUpdateWithWhereUniqueWithoutApiInput = {
    where: ApiVersionWhereUniqueInput
    data: XOR<ApiVersionUpdateWithoutApiInput, ApiVersionUncheckedUpdateWithoutApiInput>
  }

  export type ApiVersionUpdateManyWithWhereWithoutApiInput = {
    where: ApiVersionScalarWhereInput
    data: XOR<ApiVersionUpdateManyMutationInput, ApiVersionUncheckedUpdateManyWithoutApiInput>
  }

  export type ApiVersionScalarWhereInput = {
    AND?: ApiVersionScalarWhereInput | ApiVersionScalarWhereInput[]
    OR?: ApiVersionScalarWhereInput[]
    NOT?: ApiVersionScalarWhereInput | ApiVersionScalarWhereInput[]
    id?: StringFilter<"ApiVersion"> | string
    apiId?: StringFilter<"ApiVersion"> | string
    version?: IntFilter<"ApiVersion"> | number
    description?: StringNullableFilter<"ApiVersion"> | string | null
    schema?: JsonFilter<"ApiVersion">
    operations?: JsonFilter<"ApiVersion">
    createdAt?: DateTimeFilter<"ApiVersion"> | Date | string
  }

  export type ApiCreateWithoutVersionsInput = {
    id?: string
    name: string
    description: string
    enabled?: boolean
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApiUncheckedCreateWithoutVersionsInput = {
    id?: string
    name: string
    description: string
    enabled?: boolean
    productionVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApiCreateOrConnectWithoutVersionsInput = {
    where: ApiWhereUniqueInput
    create: XOR<ApiCreateWithoutVersionsInput, ApiUncheckedCreateWithoutVersionsInput>
  }

  export type ApiUpsertWithoutVersionsInput = {
    update: XOR<ApiUpdateWithoutVersionsInput, ApiUncheckedUpdateWithoutVersionsInput>
    create: XOR<ApiCreateWithoutVersionsInput, ApiUncheckedCreateWithoutVersionsInput>
    where?: ApiWhereInput
  }

  export type ApiUpdateToOneWithWhereWithoutVersionsInput = {
    where?: ApiWhereInput
    data: XOR<ApiUpdateWithoutVersionsInput, ApiUncheckedUpdateWithoutVersionsInput>
  }

  export type ApiUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    productionVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillVersionCreateManySkillInput = {
    id?: string
    version: number
    description: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SkillVersionUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillVersionUncheckedUpdateWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillVersionUncheckedUpdateManyWithoutSkillInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionCreateManyUserInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
    keyResources?: KeyResourceUpdateManyWithoutSessionNestedInput
    tasks?: TaskUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
    keyResources?: KeyResourceUncheckedUpdateManyWithoutSessionNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutSessionNestedInput
    imageGenerations?: ImageGenerationUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManySessionInput = {
    id?: string
    role: string
    content?: string | null
    images?: ChatMessageCreateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: string | null
    hidden?: boolean
    createdAt?: Date | string
  }

  export type KeyResourceCreateManySessionInput = {
    id?: string
    key: string
    mediaType: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManySessionInput = {
    id?: string
    status?: string
    input: JsonNullValueInput | InputJsonValue
    reply?: string | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ImageGenerationCreateManySessionInput = {
    id?: string
    key: string
    currentVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatMessageUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ChatMessageUpdateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ChatMessageUpdateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ChatMessageUpdateimagesInput | string[]
    toolCalls?: NullableJsonNullValueInput | InputJsonValue
    toolCallId?: NullableStringFieldUpdateOperationsInput | string | null
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: KeyResourceVersionUpdateManyWithoutKeyResourceNestedInput
  }

  export type KeyResourceUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: KeyResourceVersionUncheckedUpdateManyWithoutKeyResourceNestedInput
  }

  export type KeyResourceUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    mediaType?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: TaskEventUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: TaskEventUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    input?: JsonNullValueInput | InputJsonValue
    reply?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: ImageGenerationVersionUpdateManyWithoutImageGenNestedInput
  }

  export type ImageGenerationUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: ImageGenerationVersionUncheckedUpdateManyWithoutImageGenNestedInput
  }

  export type ImageGenerationUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    currentVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceVersionCreateManyKeyResourceInput = {
    id?: string
    version: number
    title?: string | null
    url?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: string | null
    refUrls?: KeyResourceVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type KeyResourceVersionUpdateWithoutKeyResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: KeyResourceVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceVersionUncheckedUpdateWithoutKeyResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: KeyResourceVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeyResourceVersionUncheckedUpdateManyWithoutKeyResourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    prompt?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: KeyResourceVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationVersionCreateManyImageGenInput = {
    id?: string
    version: number
    prompt: string
    imageUrl?: string | null
    refUrls?: ImageGenerationVersionCreaterefUrlsInput | string[]
    createdAt?: Date | string
  }

  export type ImageGenerationVersionUpdateWithoutImageGenInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: ImageGenerationVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationVersionUncheckedUpdateWithoutImageGenInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: ImageGenerationVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImageGenerationVersionUncheckedUpdateManyWithoutImageGenInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    prompt?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    refUrls?: ImageGenerationVersionUpdaterefUrlsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerVersionCreateManyMcpServerInput = {
    id?: string
    version: number
    description?: string | null
    code: string
    createdAt?: Date | string
  }

  export type McpServerVersionUpdateWithoutMcpServerInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerVersionUncheckedUpdateWithoutMcpServerInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpServerVersionUncheckedUpdateManyWithoutMcpServerInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskEventCreateManyTaskInput = {
    id?: number
    type: string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TaskEventUpdateWithoutTaskInput = {
    type?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskEventUncheckedUpdateWithoutTaskInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskEventUncheckedUpdateManyWithoutTaskInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiVersionCreateManyApiInput = {
    id?: string
    version: number
    description?: string | null
    schema: JsonNullValueInput | InputJsonValue
    operations: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ApiVersionUpdateWithoutApiInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    schema?: JsonNullValueInput | InputJsonValue
    operations?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiVersionUncheckedUpdateWithoutApiInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    schema?: JsonNullValueInput | InputJsonValue
    operations?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiVersionUncheckedUpdateManyWithoutApiInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    schema?: JsonNullValueInput | InputJsonValue
    operations?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}