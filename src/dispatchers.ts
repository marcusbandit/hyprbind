export interface DispatcherOption {
  /** Unique identifier for the dispatcher */
  id: string;
  /** Human-friendly description shown in the UI */
  description: string;
  /** Allowed parameter names for this dispatcher */
  allowedParams: string[];
}

/**
 * List of all valid dispatchers. If a bind uses an id not in this list, it will be considered invalid.
 */
export const DISPATCHER_OPTIONS: DispatcherOption[] = [
  {
    id: "exec",
    description: "executes a shell command",
    allowedParams: ["command"]
  },
  {
    id: "execr",
    description: "executes a raw shell command (does not support rules)",
    allowedParams: ["command"]
  },
  {
    id: "pass",
    description: "passes the key (with mods) to a specified window",
    allowedParams: ["window"]
  },
  {
    id: "sendshortcut",
    description: "sends specified keys (with mods) to an optionally specified window",
    allowedParams: ["mod", "key", "window"]
  },
  {
    id: "sendkeystate",
    description: "send a key with specific state (down/repeat/up) to a specified window",
    allowedParams: ["mod", "key", "state", "window"]
  },
  {
    id: "killactive",
    description: "closes (not kills) the active window",
    allowedParams: []
  },
  {
    id: "forcekillactive",
    description: "kills the active window",
    allowedParams: []
  },
  {
    id: "closewindow",
    description: "closes a specified window",
    allowedParams: ["window"]
  },
  {
    id: "killwindow",
    description: "kills a specified window",
    allowedParams: ["window"]
  },
  {
    id: "signal",
    description: "sends a signal to the active window",
    allowedParams: ["signal"]
  },
  {
    id: "signalwindow",
    description: "sends a signal to a specified window",
    allowedParams: ["window", "signal"]
  },
  {
    id: "workspace",
    description: "changes the workspace",
    allowedParams: ["workspace"]
  },
  {
    id: "movetoworkspace",
    description: "moves the focused window to a workspace",
    allowedParams: ["workspace", "window"]
  },
  {
    id: "movetoworkspacesilent",
    description: "moves the focused window to a workspace without switching",
    allowedParams: ["workspace", "window"]
  },
  {
    id: "togglefloating",
    description: "toggles the current window's floating state",
    allowedParams: ["window"]
  },
  {
    id: "setfloating",
    description: "sets the current window's floating state to true",
    allowedParams: ["window"]
  },
  {
    id: "settiled",
    description: "sets the current window's floating state to false",
    allowedParams: ["window"]
  },
  {
    id: "fullscreen",
    description: "toggles the focused window's fullscreen mode",
    allowedParams: ["mode"]
  },
  {
    id: "fullscreenstate",
    description: "sets the focused window's fullscreen mode and the one sent to the client",
    allowedParams: ["internal", "client"]
  },
  {
    id: "dpms",
    description: "sets all monitors' DPMS status",
    allowedParams: ["status", "monitor"]
  },
  {
    id: "pin",
    description: "pins a window to all workspaces (floating only)",
    allowedParams: ["window"]
  },
  {
    id: "movefocus",
    description: "moves the focus in a direction",
    allowedParams: ["direction"]
  },
  {
    id: "movewindow",
    description: "moves the active window in a direction or to a monitor",
    allowedParams: ["direction", "monitor", "silent"]
  },
  {
    id: "swapwindow",
    description: "swaps the active window with another window in the given direction",
    allowedParams: ["direction"]
  },
  {
    id: "centerwindow",
    description: "centers the active window (floats only)",
    allowedParams: ["mode"]
  },
  {
    id: "resizeactive",
    description: "resizes the active window",
    allowedParams: ["params"]
  },
  {
    id: "moveactive",
    description: "moves the active window",
    allowedParams: ["params"]
  },
  {
    id: "resizewindowpixel",
    description: "resizes a selected window by pixel values",
    allowedParams: ["params", "window"]
  },
  {
    id: "movewindowpixel",
    description: "moves a selected window by pixel values",
    allowedParams: ["params", "window"]
  },
  {
    id: "cyclenext",
    description: "cycles focus to the next or previous window",
    allowedParams: ["mode"]
  },
  {
    id: "swapnext",
    description: "swaps the focused window with the next or previous window",
    allowedParams: ["mode"]
  },
  {
    id: "tagwindow",
    description: "applies a tag to the current or matching window",
    allowedParams: ["tag", "window"]
  },
  {
    id: "focuswindow",
    description: "focuses the first window matching",
    allowedParams: ["window"]
  },
  {
    id: "focusmonitor",
    description: "focuses a specified monitor",
    allowedParams: ["monitor"]
  },
  {
    id: "splitratio",
    description: "changes the split ratio",
    allowedParams: ["ratio"]
  },
  {
    id: "movecursortocorner",
    description: "moves the cursor to the corner of the active window",
    allowedParams: ["direction", "cornerIndex"]
  },
  {
    id: "movecursor",
    description: "moves the cursor to a specified position",
    allowedParams: ["x", "y"]
  },
  {
    id: "renameworkspace",
    description: "renames a workspace",
    allowedParams: ["id", "name"]
  },
  {
    id: "exit",
    description: "exits the compositor with no questions asked",
    allowedParams: []
  },
  {
    id: "forcerendererreload",
    description: "forces the renderer to reload all resources and outputs",
    allowedParams: []
  },
  {
    id: "movecurrentworkspacetomonitor",
    description: "moves the active workspace to a monitor",
    allowedParams: ["monitor"]
  },
  {
    id: "focusworkspaceoncurrentmonitor",
    description: "focuses a workspace on the current monitor",
    allowedParams: ["workspace"]
  },
  {
    id: "moveworkspacetomonitor",
    description: "moves a workspace to a monitor",
    allowedParams: ["workspace", "monitor"]
  },
  {
    id: "swapactiveworkspaces",
    description: "swaps active workspaces between two monitors",
    allowedParams: ["mon1", "mon2"]
  },
  {
    id: "bringactivetotop",
    description: "brings the current window to the top of the stack (deprecated)",
    allowedParams: []
  },
  {
    id: "alterzorder",
    description: "modifies the window stack order of the active or specified window",
    allowedParams: ["zheight", "window"]
  },
  {
    id: "togglespecialworkspace",
    description: "toggles a special workspace on/off",
    allowedParams: ["name"]
  },
  {
    id: "focusurgentorlast",
    description: "focuses the urgent window or the last window",
    allowedParams: []
  },
  {
    id: "togglegroup",
    description: "toggles the active window into a group",
    allowedParams: []
  },
  {
    id: "changegroupactive",
    description: "switches to the next window in a group",
    allowedParams: ["direction"]
  },
  {
    id: "focuscurrentorlast",
    description: "switches focus between current and previously focused window",
    allowedParams: []
  },
  {
    id: "lockgroups",
    description: "locks or unlocks all groups",
    allowedParams: ["action"]
  },
  {
    id: "lockactivegroup",
    description: "locks or unlocks the focused group",
    allowedParams: ["action"]
  },
  {
    id: "moveintogroup",
    description: "moves the active window into a group in a direction",
    allowedParams: ["direction"]
  },
  {
    id: "moveoutofgroup",
    description: "moves the active window out of a group",
    allowedParams: ["window"]
  },
  {
    id: "movewindoworgroup",
    description: "behaves like moveintogroup or moveoutofgroup based on context",
    allowedParams: ["direction"]
  },
  {
    id: "movegroupwindow",
    description: "swaps the active window with next or previous in a group",
    allowedParams: ["direction"]
  },
  {
    id: "denywindowfromgroup",
    description: "prohibits the active window from being inserted into a group",
    allowedParams: ["action"]
  },
  {
    id: "setignoregrouplock",
    description: "temporarily enables or disables group lock binds",
    allowedParams: ["action"]
  },
  {
    id: "global",
    description: "executes a global shortcut via the GlobalShortcuts portal",
    allowedParams: ["name"]
  },
  {
    id: "submap",
    description: "changes the current mapping group",
    allowedParams: ["group"]
  },
  {
    id: "event",
    description: "emits a custom event to socket2",
    allowedParams: ["data"]
  },
  {
    id: "setprop",
    description: "sets a window property",
    allowedParams: ["window", "property", "value"]
  },
  {
    id: "toggleswallow",
    description: "toggles window swallowing (swallow/unswallow)",
    allowedParams: []
  }
]; 