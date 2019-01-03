// Generated in 2019-01-03T22:31:26+05:00

export interface CreateMeetupInput {
  name: string;
}

export interface CancelMeetupInput {
  id: string;
}

export interface SignUpInput {
  email: string;

  password: string;
}

export interface SignInInput {
  email: string;

  password: string;
}

export enum MeetupStatus {
  Scheduled = "SCHEDULED",
  Canceled = "CANCELED"
}

export enum MeetupRole {
  Owner = "OWNER",
  Guest = "GUEST"
}

export enum MeetupAttendanceStatus {
  Confirmed = "CONFIRMED",
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

  meetup: Meetup;

  user: User;
}

export interface Meetup {
  id: string;

  name: string;

  status: MeetupStatus;

  created_at: DateTime;

  attendees: MeetupAttendance[];
}

export interface MeetupAttendance {
  user: User;

  role: MeetupRole;

  status: MeetupAttendanceStatus;
}

export interface User {
  id: string;

  email: string;
}

export interface Mutation {
  createMeetup: Meetup;

  cancelMeetup: Meetup;

  applyForMeetup: MeetupAttendance;

  cancelMeetupAttendance: MeetupAttendance;

  signUp?: SignUpPayload | null;

  signIn: SignInPayload;
}

export interface SignUpPayload {
  user: User;

  token: string;
}

export interface SignInPayload {
  user: User;

  token: string;
}

// ====================================================
// Arguments
// ====================================================

export interface MeetupQueryArgs {
  id: string;
}
export interface CreateMeetupMutationArgs {
  input: CreateMeetupInput;
}
export interface CancelMeetupMutationArgs {
  input: CancelMeetupInput;
}
export interface ApplyForMeetupMutationArgs {
  meetupId: string;
}
export interface CancelMeetupAttendanceMutationArgs {
  meetupId: string;
}
export interface SignUpMutationArgs {
  input: SignUpInput;
}
export interface SignInMutationArgs {
  input: SignInInput;
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

    meetup?: MeetupResolver<Meetup, TypeParent, Context>;

    user?: UserResolver<User, TypeParent, Context>;
  }

  export type MeetupsResolver<
    R = Meetup[],
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type MeetupResolver<
    R = Meetup,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, MeetupArgs>;
  export interface MeetupArgs {
    id: string;
  }

  export type UserResolver<
    R = User,
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

    attendees?: AttendeesResolver<MeetupAttendance[], TypeParent, Context>;
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
  export type AttendeesResolver<
    R = MeetupAttendance[],
    Parent = Meetup,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace MeetupAttendanceResolvers {
  export interface Resolvers<
    Context = BookifyContext,
    TypeParent = MeetupAttendance
  > {
    user?: UserResolver<User, TypeParent, Context>;

    role?: RoleResolver<MeetupRole, TypeParent, Context>;

    status?: StatusResolver<MeetupAttendanceStatus, TypeParent, Context>;
  }

  export type UserResolver<
    R = User,
    Parent = MeetupAttendance,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type RoleResolver<
    R = MeetupRole,
    Parent = MeetupAttendance,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = MeetupAttendanceStatus,
    Parent = MeetupAttendance,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = BookifyContext, TypeParent = User> {
    id?: IdResolver<string, TypeParent, Context>;

    email?: EmailResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = User,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type EmailResolver<
    R = string,
    Parent = User,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = BookifyContext, TypeParent = {}> {
    createMeetup?: CreateMeetupResolver<Meetup, TypeParent, Context>;

    cancelMeetup?: CancelMeetupResolver<Meetup, TypeParent, Context>;

    applyForMeetup?: ApplyForMeetupResolver<
      MeetupAttendance,
      TypeParent,
      Context
    >;

    cancelMeetupAttendance?: CancelMeetupAttendanceResolver<
      MeetupAttendance,
      TypeParent,
      Context
    >;

    signUp?: SignUpResolver<SignUpPayload | null, TypeParent, Context>;

    signIn?: SignInResolver<SignInPayload, TypeParent, Context>;
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

  export type ApplyForMeetupResolver<
    R = MeetupAttendance,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, ApplyForMeetupArgs>;
  export interface ApplyForMeetupArgs {
    meetupId: string;
  }

  export type CancelMeetupAttendanceResolver<
    R = MeetupAttendance,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, CancelMeetupAttendanceArgs>;
  export interface CancelMeetupAttendanceArgs {
    meetupId: string;
  }

  export type SignUpResolver<
    R = SignUpPayload | null,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, SignUpArgs>;
  export interface SignUpArgs {
    input: SignUpInput;
  }

  export type SignInResolver<
    R = SignInPayload,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, SignInArgs>;
  export interface SignInArgs {
    input: SignInInput;
  }
}

export namespace SignUpPayloadResolvers {
  export interface Resolvers<
    Context = BookifyContext,
    TypeParent = SignUpPayload
  > {
    user?: UserResolver<User, TypeParent, Context>;

    token?: TokenResolver<string, TypeParent, Context>;
  }

  export type UserResolver<
    R = User,
    Parent = SignUpPayload,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type TokenResolver<
    R = string,
    Parent = SignUpPayload,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace SignInPayloadResolvers {
  export interface Resolvers<
    Context = BookifyContext,
    TypeParent = SignInPayload
  > {
    user?: UserResolver<User, TypeParent, Context>;

    token?: TokenResolver<string, TypeParent, Context>;
  }

  export type UserResolver<
    R = User,
    Parent = SignInPayload,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type TokenResolver<
    R = string,
    Parent = SignInPayload,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
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
