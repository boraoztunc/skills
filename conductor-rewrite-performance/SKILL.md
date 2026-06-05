---
name: conductor-rewrite-performance
description: "Use when building or optimizing a local-first desktop app with React, dealing with excessive re-renders during navigation, slow chat/list UIs with streaming content, or profiling a Tauri app without native Chrome DevTools access."
---

## When to use this skill

- You're building a local-first desktop application with React and experiencing performance bottlenecks
- Navigation or route changes trigger cascading re-renders across multiple mounted components
- You have a chat interface or long list that streams content and re-renders become sluggish
- You're using Tauri and need to profile React performance but can't access Chrome DevTools
- Multiple heavy views are mounted simultaneously (sidebar, nav, chat, terminal, editor) and all re-render on state changes
- You need to manage multiple heavyweight child processes without exhausting system memory

## Core principles

1. **Local-first eliminates an entire category of performance problems.** When SQLite is your source of truth and the UI never waits on the network, the bottleneck moves up into the rendering layer—every unnecessary re-render becomes the slowest thing users feel.

2. **Unstable references cascade re-renders through the entire component tree.** When router hooks return fresh objects on every render, every component reading them re-renders even when values haven't changed, and those re-renders propagate to all children.

3. **Virtualization plus memoization is the only way to make streaming lists fast.** Render only what's on screen (15 messages instead of 500), and ensure only the actively changing item re-renders while the rest stay memoized.

4. **The fastest operation is the one the user never waits on.** Move expensive synchronous work (like git checkpoints) off the critical path so the first token arrives immediately.

## Tactics

### Shim the Tauri bridge to profile in Chrome

When you can't use Safari's Web Inspector to debug React performance in a Tauri webview, create a development shim that lets the same client run in Chrome with full DevTools access.

```typescript
// Conductor's UI reaches the Rust core through Tauri's invoke() bridge.
// In a real browser there's no Tauri runtime: __TAURI_INTERNALS__ is
// undefined and every invoke() throws. So in dev we shim that single
// entry point and boot the exact same client in Chrome, where the
// Chrome profiler AND the React DevTools profiler both work.

import { invoke as tauriInvoke } from "@tauri-apps/api/core";

export function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  // Packaged app: use the native bridge.
  if ("__TAURI_INTERNALS__" in window) return tauriInvoke<T>(cmd, args);

  // Dev in Chrome: stand in for the Rust backend. Proxy to a dev server
  // running the real commands, or return canned data for the surface
  // you're profiling.
  return fetch(`/__backend__/${cmd}`, {
    method: "POST",
    body: JSON.stringify(args ?? {}),
  }).then((r) => r.json());
}
```

**Steps:**
1. Identify the single bridge function your UI uses to talk to the native layer (e.g., Tauri's `invoke()`)
2. Check for the presence of the native runtime object (`__TAURI_INTERNALS__`)
3. In production, call through to the real bridge
4. In development, proxy to a local server or return mock data
5. Boot the client in Chrome and use React DevTools Profiler to identify bottlenecks

### Replace react-router with TanStack Router for stable references

When navigation produces fresh param/search references that cascade re-renders, switch to a router that provides structural sharing and stable references.

**Before with react-router:**

```tsx
// Before with react-router

import { useSearchParams } from "react-router-dom";

function WorkspaceView() {
  const [searchParams] = useSearchParams();

  // useSearchParams() returns a NEW URLSearchParams every render,
  // and this parsed object is a new reference every render too.
  const filters = {
    agent: searchParams.get("agent"),
    status: searchParams.get("status"),
  };

  useEffect(() => {
    refetchAgents(filters);
  }, [filters]); // new object each render → fires on EVERY render

  return <AgentList filters={filters} />; // child re-renders every time
}
```

**After with TanStack Router:**

```tsx
// After with tanstack router

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace")({
  // parse + validate search once, fully typed
  validateSearch: (s): { agent?: string; status?: string } => ({
    agent: s.agent as string | undefined,
    status: s.status as string | undefined,
  }),
});

function WorkspaceView() {
  // structural sharing: SAME reference unless agent/status actually change
  const filters = Route.useSearch();

  useEffect(() => {
    refetchAgents(filters);
  }, [filters]); // fires only when a value really changes

  return <AgentList filters={filters} />; // no re-render!
}
```

**Steps:**
1. Define routes with `createFileRoute` and add a `validateSearch` function that parses and types search params
2. Replace `useSearchParams()` with `Route.useSearch()` to get a stable reference
3. Remove manual `useMemo` wrappers around parsed params—structural sharing handles it
4. Verify with React DevTools Profiler that only components with actual changes re-render on navigation

### Virtualize + memoize streaming chat lists

When a chat UI with hundreds of messages re-renders on every token, combine virtualization (render only visible items) with memoization (skip unchanged items).

**Before:**

```tsx
// Before: the simple approach where each message/token rerenders everything

function Chat({ messages }) {
  return (
    <div>
      {messages.map((m) => (
        <Message key={m.id} message={m} /> // all N re-render on each token
      ))}
    </div>
  );
}
```

**After:**

```tsx
// After: virtualize the list + memoize each row

const Message = React.memo(function Message({ message }) {
  return <MarkdownContent text={message.content} />; 
});

function Chat({ messages }) {
  // VirtuosoMessageList is a component from Virtuoso
  return (
    <VirtuosoMessageList
      data={messages}
      itemContent={(_, m) => <Message message={m} />}
    />
  );
}
```

**Steps:**
1. Wrap each message component in `React.memo` so it only re-renders when its props change
2. Replace the `.map()` loop with `react-virtuoso`'s `VirtuosoMessageList` (or `Virtuoso` for general lists)
3. Pass the full message array as `data` and render each item via `itemContent`
4. Let Virtuoso handle scroll anchoring, bottom-stick during streaming, and dynamic height measurement
5. Verify that only the streaming message re-renders while the rest stay memoized

### Move expensive synchronous work off the critical path

When a blocking operation (like a git checkpoint) sits between user input and the first response token, move it to the background.

**Pattern:**
- **Before:** User hits enter → synchronous `git add -A` → send prompt → first token arrives
- **After:** User hits enter → send prompt immediately → first token arrives → checkpoint runs in background

**Steps:**
1. Identify synchronous operations on the critical path (e.g., file snapshots, database writes)
2. Fire them asynchronously after the user-facing action completes
3. Ensure the background task still completes before the next checkpoint is needed
4. If resumption depends on the checkpoint, pass a `--resume <uuid>` flag so the session can restart from disk

### Manage memory for multiple heavyweight child processes

When your app spawns multiple long-lived processes (e.g., agent sessions), shut down idle ones and resume on demand.

**Steps:**
1. Track the last activity timestamp for each child process
2. After a threshold of inactivity (e.g., 5 minutes), kill the process and reclaim memory
3. Persist session state to disk with a unique identifier (e.g., `--resume <uuid>`)
4. When the user returns to that workspace, spawn a new process with the resume flag
5. Verify in Activity Monitor / Task Manager that idle workspaces don't hold memory

## Anti-patterns

❌ **Don't wrap every unstable reference in `useMemo` manually**—fix the root cause by switching to a library that provides stable references (like TanStack Router's structural sharing).

❌ **Don't render all list items and rely on CSS `overflow: scroll`**—virtualize so only visible items exist in the DOM.

❌ **Don't block the UI thread with synchronous git operations or file I/O on the critical path**—move them to background tasks.

❌ **Don't let heavyweight child processes accumulate indefinitely**—implement idle shutdown and resume-on-demand.

❌ **Don't skip profiling because your webview doesn't support Chrome DevTools**—shim the native bridge and run the same client in Chrome for development.

❌ **Don't assume local-first means fast by default**—once network latency is gone, rendering bottlenecks become the new constraint.

## Source

[The Conductor Rewrite: What They Changed to Make It Fast](https://performance.dev/the-conductor-rewrite)
