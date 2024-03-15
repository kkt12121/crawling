// module.exports = (sequelize, DataTypes) => (
//     sequelize.define('inflearn', {
//         title: {
//             type: DataTypes.STRING
//         },
//         writer: {
//             type: DataTypes.STRING
//         },
//         createDate: {
//             type: DataTypes.STRING
//         },
//         updateDate: {
//             type: DataTypes.STRING
//         },
//         views: {
//             type: DataTypes.STRING
//         },
//         contents: {
//             type: DataTypes.TEXT('medium')
//         },    
//     }, {
//         timestamps: false,
//         paranoid: false,
//         // DB 한글 입력 //////////////////////
//         charset: 'utf8',
//         collate: 'utf8_general_ci',
//     })
// );