import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import ReactLoadableSSRAddon from 'react-loadable-ssr-addon';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import PurgecssPlugin from 'purgecss-webpack-plugin';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BUILD_DIR = path.resolve( __dirname, "public" );
import WorkboxPlugin from 'workbox-webpack-plugin';
//import config from "./src/config/index"

const PATHS = {
    src: path.join(__dirname, 'src')
}

let plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            NODE_APP: JSON.stringify(process.env.NODE_APP)
        }
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new ReactLoadableSSRAddon({
        filename: 'assets-manifest.json',
        integrity: true,
        integrityAlgorithms: ['sha256', 'sha384', 'sha512'],
        integrityPropertyName: 'integrity',
    }),
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[name].css"
    }),
    new PurgecssPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new WorkboxPlugin.InjectManifest({ 
        swSrc: './src/client/sw.js',
        swDest: '../sw.js',
        precacheManifestFilename: 'wb-manifest.[manifestHash].js',
        include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.jpg$/, /\.gif$/],
        exclude:[/^dist\/web\.css$/, /^dist\/mobile\.css$/, /^dist\/web\.js$/, /^dist\/mobile\.js$/, /^server\.js$/]
    })

    // new workboxPlugin.GenerateSW({
    //     swDest: '../sw.js',
    //     clientsClaim: true,
    //     navigationPreload: true,
    //     runtimeCaching: [
    //         {
    //             urlPattern: /images/,
    //             handler: 'CacheFirst',
    //             options:{
    //                 cacheName: 'image-cache',
    //             }
    //         },
    //         {
    //             urlPattern: /fonts/,    
    //             handler: 'CacheFirst',
    //             options:{
    //                 cacheName: 'fonts-cache',
    //             }
    //         },
    //         {
    //             urlPattern: new RegExp('/(http|https):\/\/(data|(.*?)/'),
    //             handler: 'StaleWhileRevalidate',
    //             options: {
    //                 cacheableResponse: {
    //                     statuses: [0, 200]
    //                 },
    //                 cacheName: 'api-cache',
    //                 expiration: {
    //                     maxEntries: 5,
    //                     maxAgeSeconds: 24 * 60 * 60,
    //                 }
    //             }
    //         },
    //         {
    //             urlPattern: /.*/,
    //             handler: 'NetworkFirst'
    //         }
    //     ]
    // })
]

if(process.env.NODE_ENV == 'analyze'){
    plugins.push(new BundleAnalyzerPlugin());
}
module.exports = {
    context: path.resolve( __dirname, "src" ),
    mode: 'development',
    entry: {
        app: ['./client/index.js'],
        styles: './scss/styles.less',
        vendor: [
            // '@babel/polyfill',
            'react-loadable',
            'regenerator-runtime',
            'react',
            'react-dom',
            'redux',
            'react-redux',
            'react-router',
            'react-router-dom',
            'react-helmet'
        ]
    },
    devtool: 'inline-source-map',
    output: {
        path: BUILD_DIR+'/dist',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath:'/dist/'
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js', '.jsx', '.json', '.svg']
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components|public\/)/,
            use: {
                loader: 'babel-loader'
            },
        }, {
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                        importLoaders: 2,
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: false,
                        plugins: function () {
                            return [
                                require('autoprefixer'),
                            ];
                        }
                    }
                }
            ]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            exclude: /node_modules/,
            loader: 'file-loader?name=fonts/[name].[ext]&limit=1024',
        }, {
            test: /\.(jpg|jpeg|gif|png|svg)$/i,
            exclude: /node_modules/,
            loader: 'file-loader?name=images/[name].[ext]&limit=1024',
        },{
            test: /\.less$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'styles.css'
                }
            },{
                loader: 'less-loader',
                options: { javascriptEnabled: true }// compiles Less to CSS
            }]
        }],
    },
    optimization: {
        nodeEnv: 'development',
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    minChunks: 2,
                },
                default: {
                    minChunks: 2,
                    reuseExistingChunk: true,
                },
                /*styles: {
                    test: /\.s?css$/,
                    name: 'styles',
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true,
                }*/
            },
        }
    },
    plugins
};
