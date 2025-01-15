export const adjustSize = (width: number, height: number, maxDimension: number) => {

    if (height === 0 || width === 0) return { height: 0, width: 0 };
    const aspect = width / height;

    if (aspect > 1) return { width: maxDimension, height: maxDimension / aspect };

    return { height: maxDimension, width: maxDimension * aspect };

}