/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bogcha_attendance from "../bogcha/attendance.js";
import type * as bogcha_auth from "../bogcha/auth.js";
import type * as bogcha_authActions from "../bogcha/authActions.js";
import type * as bogcha_children from "../bogcha/children.js";
import type * as bogcha_childrenActions from "../bogcha/childrenActions.js";
import type * as bogcha_groups from "../bogcha/groups.js";
import type * as bogcha_lib_authz from "../bogcha/lib/authz.js";
import type * as bogcha_lib_scoping from "../bogcha/lib/scoping.js";
import type * as bogcha_messages from "../bogcha/messages.js";
import type * as bogcha_parents from "../bogcha/parents.js";
import type * as bogcha_parentsActions from "../bogcha/parentsActions.js";
import type * as bogcha_settings from "../bogcha/settings.js";
import type * as bogcha_staff from "../bogcha/staff.js";
import type * as bogcha_staffActions from "../bogcha/staffActions.js";
import type * as bogcha_threads from "../bogcha/threads.js";
import type * as lib_authz from "../lib/authz.js";
import type * as lib_passwords from "../lib/passwords.js";
import type * as lib_scoping from "../lib/scoping.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "bogcha/attendance": typeof bogcha_attendance;
  "bogcha/auth": typeof bogcha_auth;
  "bogcha/authActions": typeof bogcha_authActions;
  "bogcha/children": typeof bogcha_children;
  "bogcha/childrenActions": typeof bogcha_childrenActions;
  "bogcha/groups": typeof bogcha_groups;
  "bogcha/lib/authz": typeof bogcha_lib_authz;
  "bogcha/lib/scoping": typeof bogcha_lib_scoping;
  "bogcha/messages": typeof bogcha_messages;
  "bogcha/parents": typeof bogcha_parents;
  "bogcha/parentsActions": typeof bogcha_parentsActions;
  "bogcha/settings": typeof bogcha_settings;
  "bogcha/staff": typeof bogcha_staff;
  "bogcha/staffActions": typeof bogcha_staffActions;
  "bogcha/threads": typeof bogcha_threads;
  "lib/authz": typeof lib_authz;
  "lib/passwords": typeof lib_passwords;
  "lib/scoping": typeof lib_scoping;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
