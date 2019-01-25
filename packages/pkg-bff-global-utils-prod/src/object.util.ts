export const isPlainObject = (obj) => {
	return Object.prototype.toString.call(obj) === '[object Object]';
};