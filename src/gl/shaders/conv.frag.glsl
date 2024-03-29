#version 300 es

precision mediump float;

uniform sampler2D u_texture;

in vec2 v_vUv;
in vec2 v_scaledImageIncrement;

out vec4 outColor;

float kernel[25] = float[](
    0.001109881604329387,
    0.002277329186428999,
    0.004389666898480905,  
    0.00794865988767476,
    0.013521125941838638,
    0.021606697733267614,
    0.032435494968494315,
    0.04574137946027258,
    0.0605974823522027,
    0.07541478526731735,
    0.0881688165699329,
    0.09683450107728371,
    0.09990835810495222,
    0.09683450107728371,
    0.0881688165699329,
    0.07541478526731735,
    0.0605974823522027,
    0.04574137946027258,
    0.032435494968494315,
    0.021606697733267614,
    0.013521125941838638,
    0.00794865988767476,
    0.004389666898480905,
    0.002277329186428999,
    0.001109881604329387
);

void main()
{
    

    vec2 imageCoord = v_vUv;
    vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );

    for( int i = 0; i < 25; i++ )
    {
        sum += texture( u_texture, imageCoord ) * kernel[ i ];
        imageCoord += v_scaledImageIncrement;
    }

    outColor = sum;
}