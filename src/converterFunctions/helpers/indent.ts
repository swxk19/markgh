export default (str: string) => str.replaceAll(/(?<=^|\n)/g, '  ')
