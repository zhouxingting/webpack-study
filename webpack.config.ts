import * as path from "path";
import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import WebpackBundleAnalyzer from "webpack-bundle-analyzer";

const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin;

const smp = new SpeedMeasurePlugin({});

const config: webpack.Configuration = {
  // 默认路径
  entry: "./src/index",
  mode: "production",
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    // 打包产物的存放路径，目录不存在时会进行自动创建该目录
    path: path.resolve(__dirname, "./build"),
    // publicPath: "http://cdn.newrank.cn/demo/",
    clean: true,
  },
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
  },
  module: {
    rules: [
      {
        // 匹配对应后缀的文件
        test: /\.(js|jsx|tsx)$/,
        use: [
          "thread-loader",
          {
            loader: "babel-loader",
            options: {
              presets:
                // 高版本 ES 语法转换为低版本 ES 语法
                [
                  [
                    "@babel/preset-env",
                    {
                      useBuiltIns: "entry",
                      corejs: 3,
                    },
                  ], // 配置 react
                  [
                    "@babel/preset-react",
                    // 配置使用 jsx 不需要引入 react（编译预设）
                    { runtime: "automatic" },
                  ],
                  // 配置 ts
                  "@babel/preset-typescript",
                ],
            },
          },
        ],
      },
      // 解析css文件
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // 解析less文件
      {
        test: /\.less$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { modules: true, importLoaders: 1 },
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // 将css 转换为大多数浏览器可以理解的内容，内置 autoprefixer
                    "postcss-preset-env",
                  ],
                ],
              },
            },
          },
          "less-loader",
        ],
      },
      // 解析图片资源
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        // asset 是 webpack 自带的资源模块
        type: "asset/resource",
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: [
          {
            loader: require.resolve("@svgr/webpack"),
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                  "prefixIds",
                ],
              },
              titleProp: true,
              ref: true,
            },
          },
          {
            loader: require.resolve("file-loader"),
            options: {
              name: "static/[name].[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    // 自定义压缩方式
    splitChunks: {
      // 对（同步 异步 all）代码进行代码分割
      chunks: "all",
    },
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify("!!!!"),
    }),
    new HtmlWebpackPlugin({
      // 模板 html
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new BundleAnalyzerPlugin(),
  ],
};

// const webpackConfig = smp.wrap(config as any);

export default config;
