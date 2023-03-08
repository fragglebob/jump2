declare module '*.glsl' {
    var _: string;
    export default _;
}


declare module "lz77" {
    export interface LZ77 {
        compress(source: string): string;
        decompress(source: string): string;
    }

    var _: LZ77;
    
    export default _;
}