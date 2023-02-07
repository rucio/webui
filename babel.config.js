// module.exports = {
//   presets: [
//     ['next/babel', {
//       'babel-plugin-transform-typescript-metadata':
//         'babel-plugin-transform-typescript-metadata',
//       '@babel/plugin-proposal-decorators': { legacy: true }
//     }
//     ]
//   ],
//   plugins: [
//     'babel-plugin-transform-typescript-metadata',
//     ['@babel/plugin-proposal-decorators', { legacy: true }]
//   ]
// };

module.exports = {
  presets: ['next/babel'],
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
}


