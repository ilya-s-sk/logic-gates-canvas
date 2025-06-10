import { initApp } from "./app";

function start() {
  requestAnimationFrame(() => initApp());
}

start();