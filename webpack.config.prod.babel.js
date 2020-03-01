import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import ReactLoadableSSRAddon from 'react-loadable-ssr-addon';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import TerserPlugin from 'terser-webpack-plugin';
import PurgecssPlugin from 'purgecss-webpack-plugin';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BUILD_DIR = path.resolve( __dirname, "public" );
import WorkboxPlugin from 'workbox-webpack-plugin';

const PATHS = {
    src: path.join(__dirname, 'src')
}

module.exports = {
    context: path.resolve( __dirname, "src" ),
    mode: 'production',
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
    devtool: 'source-map',
    output: {
        path: BUILD_DIR+'/dist',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].js',
        publicPath:'/dist/'
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js', '.jsx', '.json']
    },
    stats: {
        colors: false,
        hash: true,
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        children: true,
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
                        importLoaders: 1,
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
        nodeEnv: 'c',
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    minChunks: 2,
                },
                default: false,
                /*styles: {
                    test: /\.s?css$/,
                    name: 'styles',
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true,
                }*/
            },
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                    extractComments: 'all',
                    cache: true,
                    parallel: true,
                },
            })
        ],
        runtimeChunk: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
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
            //filename: "[name].css",
            chunkFilename: "[name].[chunkhash].css"
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.LoaderOptionsPlugin( { minimize: true, debug: false } ),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new WorkboxPlugin.InjectManifest({ 
            swSrc: './src/client/sw.js',
            swDest: '../sw.js',
            precacheManifestFilename: 'wb-manifest.[manifestHash].js',
            include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.jpg$/, /\.gif$/],
            exclude:[/^dist\/web\.css$/, /^dist\/mobile\.css$/, /^dist\/web\.js$/, /^dist\/mobile\.js$/, /^server\.js$/],
        })

        // new BundleAnalyzerPlugin()
    ]
};