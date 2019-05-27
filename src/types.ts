// Generated in 2019-05-28T01:32:02+02:00

export interface CreateEventInput {
  name: string;
}

export interface CancelEventInput {
  id: string;
}

export interface SignUpInput {
  email: string;

  password: string;

  name: string;
}

export interface SignInInput {
  email: string;

  password: string;
}

export enum EventStatus {
  Scheduled = "SCHEDULED",
  Canceled = "CANCELED"
}

export enum EventAttendanceRole {
  Owner = "OWNER",
  Guest = "GUEST"
}

export enum EventAttendanceStatus {
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
  events: Event[];

  event: Event;

  user: User;
}

export interface Event {
  id: string;

  name: string;

  status: EventStatus;

  createdAt: DateTime;

  attendees: EventAttendance[];
}

export interface EventAttendance {
  id: string;

  user: User;

  role: EventAttendanceRole;

  status: EventAttendanceStatus;
}

export interface User {
  id: string;

  email: string;

  name: string;
}

export interface Mutation {
  createEvent: Event;

  cancelEvent: Event;

  applyForEvent: EventAttendance;

  cancelEventAttendance: EventAttendance;

  signUp: SignUpPayload;

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

export interface EventQueryArgs {
  id: string;
}
export interface CreateEventMutationArgs {
  input: CreateEventInput;
}
export interface CancelEventMutationArgs {
  input: CancelEventInput;
}
export interface ApplyForEventMutationArgs {
  eventId: string;
}
export interface CancelEventAttendanceMutationArgs {
  eventId: string;
}
export interface SignUpMutationArgs {
  input: SignUpInput;
}
export interface SignInMutationArgs {
  input: SignInInput;
}

import { GraphQLResolveInfo, GraphQLScalarTypeConfig } from "graphql";

import { BookifyContext } from "./createContextFunction";

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
    events?: EventsResolver<Event[], TypeParent, Context>;

    event?: EventResolver<Event, TypeParent, Context>;

    user?: UserResolver<User, TypeParent, Context>;
  }

  export type EventsResolver<
    R = Event[],
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type EventResolver<
    R = Event,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, EventArgs>;
  export interface EventArgs {
    id: string;
  }

  export type UserResolver<
    R = User,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace EventResolvers {
  export interface Resolvers<Context = BookifyContext, TypeParent = Event> {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;

    status?: StatusResolver<EventStatus, TypeParent, Context>;

    createdAt?: CreatedAtResolver<DateTime, TypeParent, Context>;

    attendees?: AttendeesResolver<EventAttendance[], TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Event,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = Event,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = EventStatus,
    Parent = Event,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type CreatedAtResolver<
    R = DateTime,
    Parent = Event,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type AttendeesResolver<
    R = EventAttendance[],
    Parent = Event,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace EventAttendanceResolvers {
  export interface Resolvers<
    Context = BookifyContext,
    TypeParent = EventAttendance
  > {
    id?: IdResolver<string, TypeParent, Context>;

    user?: UserResolver<User, TypeParent, Context>;

    role?: RoleResolver<EventAttendanceRole, TypeParent, Context>;

    status?: StatusResolver<EventAttendanceStatus, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = EventAttendance,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type UserResolver<
    R = User,
    Parent = EventAttendance,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type RoleResolver<
    R = EventAttendanceRole,
    Parent = EventAttendance,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = EventAttendanceStatus,
    Parent = EventAttendance,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = BookifyContext, TypeParent = User> {
    id?: IdResolver<string, TypeParent, Context>;

    email?: EmailResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;
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
  export type NameResolver<
    R = string,
    Parent = User,
    Context = BookifyContext
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = BookifyContext, TypeParent = {}> {
    createEvent?: CreateEventResolver<Event, TypeParent, Context>;

    cancelEvent?: CancelEventResolver<Event, TypeParent, Context>;

    applyForEvent?: ApplyForEventResolver<EventAttendance, TypeParent, Context>;

    cancelEventAttendance?: CancelEventAttendanceResolver<
      EventAttendance,
      TypeParent,
      Context
    >;

    signUp?: SignUpResolver<SignUpPayload, TypeParent, Context>;

    signIn?: SignInResolver<SignInPayload, TypeParent, Context>;
  }

  export type CreateEventResolver<
    R = Event,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, CreateEventArgs>;
  export interface CreateEventArgs {
    input: CreateEventInput;
  }

  export type CancelEventResolver<
    R = Event,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, CancelEventArgs>;
  export interface CancelEventArgs {
    input: CancelEventInput;
  }

  export type ApplyForEventResolver<
    R = EventAttendance,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, ApplyForEventArgs>;
  export interface ApplyForEventArgs {
    eventId: string;
  }

  export type CancelEventAttendanceResolver<
    R = EventAttendance,
    Parent = {},
    Context = BookifyContext
  > = Resolver<R, Parent, Context, CancelEventAttendanceArgs>;
  export interface CancelEventAttendanceArgs {
    eventId: string;
  }

  export type SignUpResolver<
    R = SignUpPayload,
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
