var Shader = require('./Shader');

/**
 * @class
 * @memberof PIXI
 * @extends Shader
 * @param shaderManager {ShaderManager} The webgl shader manager this shader works for.
 */
function PatternShader(shaderManager)
{
    Shader.call(this,
        shaderManager,
        // vertex shader
        [
            'attribute vec2 aVertexPosition;',
            'attribute vec4 aColor;',


            'uniform mat3 translationMatrix;',
            'uniform mat3 projectionMatrix;',

            'uniform float alpha;',
            'uniform float flipY;',
            'uniform vec3 tint;',

            'varying vec4 vColor;',
            'varying vec2 vPosition;',

            'void main(void){',
            '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
            //'   vColor = vec4(gl_Position.x, gl_Position.x, gl_Position.x, 1.);',
            '   vPosition = gl_Position.xy;',
            '}'
        ].join('\n'),
        // fragment shader
        [
            'precision mediump float;',

            'varying vec4 vColor;',
            'varying vec2 vPosition;',
            'uniform vec2 tileSize;',
            'uniform sampler2D tileTexture;',

            'void main(void){',
            '   gl_FragColor = texture2D(tileTexture, vec2(mod(gl_FragCoord.x, tileSize.x) / tileSize.x, 1. - mod(gl_FragCoord.y, tileSize.y) / tileSize.y));',
            //'   gl_FragColor = vec4(gl_FragCoord.x / 1000., gl_FragCoord.x / 1000., gl_FragCoord.x / 1000., 1.);',
            //'float val = tileSize.x == 0. ? 0. : 1.;',
            //'gl_FragColor = vec4(val, val, val, 1.);',
            //'gl_FragColor = vec4(tileSize.x / 100., tileSize.x / 100., tileSize.x / 100., 1.);',
            '}'
        ].join('\n'),
        // custom uniforms
        {
            tint:   { type: '3f', value: [0, 0, 0] },
            alpha:  { type: '1f', value: 0 },
            translationMatrix: { type: 'mat3', value: new Float32Array(9) },
            projectionMatrix: { type: 'mat3', value: new Float32Array(9) },
            tileTexture: { type: 'sampler2D', value: null },
            tileSize: {type: '2f', value: [0, 0]},
        },
        // custom attributes
        {
            aVertexPosition:0,
            aColor:0
        }
    );
}

PatternShader.prototype = Object.create(Shader.prototype);
PatternShader.prototype.constructor = PatternShader;
module.exports = PatternShader;
