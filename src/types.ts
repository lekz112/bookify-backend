// Generated in 2018-12-21T12:20:26+07:00

export interface CreateMeetupInput {
  name: string;
}

export interface CancelMeetupInput {
  id: string;
}

export enum MeetupStatus {
  Scheduled = "SCHEDULED",
  Canceled = "CANCELED"
}

export type DateTime = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  meetups: Meetup[];
}

export interface Meetup {
  id: string;

  name: string;

  status: MeetupStatus;

  created_at: DateTime;
}

export interface Mutation {
  createMeetup: Meetup;

  cancelMeetup: Meetup;
}

// ====================================================
// Arguments
// ====================================================

export interface CreateMeetupMutationArgs {
  input: CreateMeetupInput;
}
export interface CancelMeetupMutationArgs {
  input: CancelMeetupInput;
}

import { GraphQLResolveInfo, GraphQLScalarTypeConfig } from "graphql";

import { BookifyContext } from "./index";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

type Maybe<T> = T | null | undefined;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = BookifyContext, TypeParent = {}> {
    meetups?: MeetupsResolver<Meetup[], TypeParent, Context>;
  }

  export type MeetupsResolver<
    R = Meetup[],
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace MeetupResolvers {
  export interface Resolvers<Context = BookifyContext, TypeParent = Meetup> {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;

    status?: StatusResolver<MeetupStatus, TypeParent, Context>;

    created_at?: CreatedAtResolver<DateTime, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Meetup,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = Meetup,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = MeetupStatus,
    Parent = Meetup,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type CreatedAtResolver<
    R = DateTime,
    Parent = Meetup,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = BookifyContext, TypeParent = {}> {
    createMeetup?: CreateMeetupResolver<Meetup, TypeParent, Context>;

    cancelMeetup?: CancelMeetupResolver<Meetup, TypeParent, Context>;
  }

  export type CreateMeetupResolver<
    R = Meetup,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, CreateMeetupArgs>;
  export interface CreateMeetupArgs {
    input: CreateMeetupInput;
  }

  export type CancelMeetupResolver<
    R = Meetup,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, CancelMeetupArgs>;
  export interface CancelMeetupArgs {
    input: CancelMeetupInput;
  }
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  BookifyContext
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  BookifyContext
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  BookifyContext
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string | null;
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<DateTime, any> {
  name: "DateTime";
}
