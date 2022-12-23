import * as path from "path";
import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

const devServer: DevServerConfiguration = {
  static: {
    directory: path.join(__dirname, "public"),
  },
  compress: true,
  port: 9000,
  // 自动打开浏览器
  open: true,
  // 支持 HTTPS
  https: false,
  // history 路由
  historyApiFallback: true,
  // 热更新
  hot: true,
};

const config: Configuration = {
  // 默认路径
  devServer: devServer,
  entry: "./src/index",
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    // 打包产物的存放路径，目录不存在时会进行自动创建该目录
    path: path.resolve(__dirname, "./build"),
    // publicPath: "http://cdn.newrank.cn/demo/",
    clean: true,
  },
  module: {
    rules: [
      {
        // 匹配对应后缀的文件
        test: /\.(js|jsx|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                // 配置 react
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
          {
            loader: "css-loader",
            options: { modules: true },
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
              name: "static/media/[name].[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 模板 html
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
  ],
};

export default config;
