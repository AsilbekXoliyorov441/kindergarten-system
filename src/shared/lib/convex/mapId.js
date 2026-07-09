/** Convex documents carry `_id`/`_creationTime`; the rest of the app expects a plain `id`
 * field (it predates the Convex migration), so every store hook maps through this. */
export function mapId({ _id, ...rest }) {
  delete rest._creationTime
  return { id: _id, ...rest }
}
