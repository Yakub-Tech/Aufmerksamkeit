export function assetUrl(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}
