// module.exports = (sequelize, DataTypes) => (
//     sequelize.define('openAPI_case', {
//         title: {
//             type: DataTypes.TEXT
//         },
//         court: {
//             type: DataTypes.STRING
//         },
//         type: {
//             type: DataTypes.STRING
//         },
//         judgment: {
//             type: DataTypes.STRING
//         },
//         date: {
//             type: DataTypes.DATEONLY
//         },
//         summary: {
//             type: DataTypes.TEXT('medium')
//         },
//         content: {
//             type: DataTypes.TEXT('medium')
//         }        
//     }, {
//         timestamps: false,
//         paranoid: false,
//         // DB 한글 입력 //////////////////////
//         charset: 'utf8',
//         collate: 'utf8_general_ci',
//     })
// );