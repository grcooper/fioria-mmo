/**
 * This file is what we import to access all of the protobufs
 * in Javascript
 */


/**
 * Import the library
 * Without this, because the .proto are part of the plugin
 * compilation they don't actually get the bundle to include
 * the library
 */
import protobufjs from 'protobufjs/light';

/**
 * Import each of our protobuffers
 * This gets protobufjs-brunch to compile and include each
 * of them in the bundle. They get added to the "root", so
 * we just need to import it
 */
export { Player } from  "./player.proto";
export { ActionsAttack } from  "./actions/attack.proto";
export { ActionsMove } from  "./actions/move.proto";

/**
 * Set the root to a window global, this is generally how
 * we can conveinently access this
 */
window.Messages = protobufjs.roots["default"].nested;

/**
 * Also export the root
 */
export default protobufjs.roots["default"].nested;
