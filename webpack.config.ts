import path from 'path';
import { fileURLToPath } from 'url';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Configuration as DevServerConfig } from 'webpack-dev-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Env = Record<string, string | boolean>;
type Config = Configuration & { devServer?: DevServerConfig };

const getConfig = (env: Env = {}): Config => {
  console.log(env)
  const isProduction = env.production === true;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, './src/main.ts'),
    devtool: isProduction ? false : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_module/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, './dist'),
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
        inject: 'body',
      }),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, './public'),
      },
      port: 3007,
      open: true,
    }
  }
};

export default getConfig;