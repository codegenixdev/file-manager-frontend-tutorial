function convertByteToMegabyte(size: number) {
  return `${((size ?? 0) / 1000000).toFixed(2)} MB`;
}

export { convertByteToMegabyte };
