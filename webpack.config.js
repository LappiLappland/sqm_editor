import { fileURLToPath } from "url";
import path, { dirname } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import npmPackage from './package.json' assert { type: 'json' };
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const webpackConfig = (env, argv) => {
  const isDev = argv.mode !== "production";

  console.log('!!!!', npmPackage.homepage);

  const publicUrlRegex = /.+:\/\/.+(\/.*)\/?/;
  const publicUrlFind = npmPackage.homepage.match(publicUrlRegex);
  const publicUrl = publicUrlFind[1] ?? '/';

  return {
    mode: isDev ? "development" : "production",
    devtool: "inline-source-map",
    entry: path.join(__dirname, "src", "index.tsx"),
    output: {
      filename: isDev
        ? 'static/js/bundle.js'
        : 'static/js/[name].[contenthash:8].js',
      chunkFilename: isDev
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: !isDev ? npmPackage.homepage ?? '/' : publicUrl,
      clean: true,
      path: path.join(__dirname, "build"),
      pathinfo: isDev,
    },
    devServer: {
      hot: true,
      static: {
        directory: path.join(__dirname, "build"),
      },
      compress: true,
      port: 8080,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      extensionAlias: {
        ".js": [".js", "ts"],
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.join(__dirname, "public", "index.html"),
      }),
      new MiniCssExtractPlugin({
        filename: isDev
        ? 'static/css/style.css'
        : 'static/css/[name].[contenthash:8].css',
        chunkFilename: isDev
        ? "static/css/[name].[contenthash:8].chunk.css"
        : "static/css/[name].chunk.css",
      }),
      new CopyPlugin({
        patterns: [
          { 
            from: "public",
            globOptions: {
              ignore: ["**/index.html"]
            }
          },
        ],
      }),
      isDev && new ReactRefreshPlugin(),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              sync: true,
            },
          },
        },
        {
          test: /\.s[ac]ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
  };
};

export default webpackConfig;
