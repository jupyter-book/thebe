import $ from "jquery";

// events - module loading happens exactly once
export const events = $({});

export const trigger = function () {
  events.trigger.apply(events, arguments);
};
export const on = function () {
  events.on.apply(events, arguments);
};
export const one = function () {
  events.one.apply(events, arguments);
};
export const off = function () {
  events.off.apply(events, arguments);
};
